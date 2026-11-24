import { promisify } from 'node:util';

import { parse } from 'csv-parse/sync';
import ExcelJS from 'exceljs';
import yauzl from 'yauzl';

import {
    MAX_CELL_LENGTH,
    MAX_COLUMNS,
    MAX_ERRORS,
    MAX_ROWS,
} from './number-data-limits';

const MAX_UNZIPPED_BYTES = 64 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 512;
const openZip = promisify(yauzl.fromBuffer);

class SizeLimitError extends Error {
    constructor(message, row, column) {
        super(message);
        this.lines = row;
        this.column = column;
    }
}

async function validateZip(buffer) {
    const zip = await openZip(buffer, {
        lazyEntries: true,
        validateEntrySizes: true,
    });
    try {
        if (zip.entryCount > MAX_ZIP_ENTRIES) {
            throw new SizeLimitError('Excel 压缩包内文件过多');
        }

        const files = new Set();
        let declaredBytes = 0;
        let actualBytes = 0;
        // Verify both the ZIP directory and the actual decompressed size of each entry.
        const openEntry = promisify(zip.openReadStream.bind(zip));
        for await (const entry of zip.eachEntry()) {
            if (files.has(entry.fileName))
                throw new Error('Duplicate ZIP entry');
            files.add(entry.fileName);
            declaredBytes += entry.uncompressedSize;
            if (declaredBytes > MAX_UNZIPPED_BYTES) {
                throw new SizeLimitError('Excel 解压后超过 64 MiB');
            }
            if (entry.fileName.endsWith('/') && entry.uncompressedSize === 0) {
                continue;
            }
            const stream = await openEntry(entry);
            for await (const chunk of stream) {
                actualBytes += chunk.length;
                if (actualBytes > MAX_UNZIPPED_BYTES) {
                    throw new SizeLimitError('Excel 解压后超过 64 MiB');
                }
            }
        }
    } finally {
        zip.close();
    }
}

const FORMULA = Symbol('formula');
const UNSUPPORTED = Symbol('unsupported');
const isBlank = value => typeof value === 'string' && value.trim() === '';

function excelText(cell) {
    const { value } = cell;
    if (value === null || value === undefined) return '';
    if (cell.type === ExcelJS.ValueType.Formula) return FORMULA;
    if (value instanceof Date) {
        return Number.isFinite(+value) ? value.toISOString() : UNSUPPORTED;
    }
    if (['string', 'number', 'boolean'].includes(typeof value)) {
        return String(value);
    }
    if (value.richText || typeof value.text === 'string') return cell.text;
    return UNSUPPORTED;
}

function* excelRecords(sheet) {
    for (let number = 1; number <= sheet.rowCount; number++) {
        const row = sheet.findRow(number);
        if (!row?.hasValues) continue;
        const cells = [];
        row.eachCell((cell, column) => {
            const value = excelText(cell);
            if (column > MAX_COLUMNS && !isBlank(value)) {
                throw new SizeLimitError(
                    '导入表最多支持 50 个资料列',
                    number,
                    column,
                );
            }
            if (column <= MAX_COLUMNS && value !== '')
                cells[column - 1] = value;
        });
        yield { row: number, cells: Array.from(cells, cell => cell ?? '') };
    }
}

function csvRecords(buffer) {
    const input = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    const records = [];
    let nextLine = 1;
    try {
        parse(input, {
            bom: true,
            relax_column_count: true,
            max_record_size: 512 * 1024,
            raw: true,
            on_record: ({ record, raw }) => {
                const row = nextLine;
                // Physical lines include quoted newlines and count CRLF as one break.
                nextLine += raw.match(/\r\n|\r|\n/g)?.length ?? 0;
                if (record.every(isBlank)) return null;
                if (records.length > MAX_ROWS) {
                    throw new SizeLimitError(
                        '导入表最多支持 10,000 行资料',
                        row,
                    );
                }
                records.push({ row, cells: record });
                return null;
            },
        });
    } catch (error) {
        if (!(error instanceof SizeLimitError)) error.lines = nextLine;
        throw error;
    }
    return records;
}

function parseNumber(value) {
    if (typeof value !== 'string' || !/^[+-]?\d+$/.test(value.trim())) {
        return null;
    }
    const number = Number(value.trim());
    return number >= -2147483648 && number <= 2147483647 ? number : null;
}

function readRecords(records, { sheet, numberColumn, excel, sheets }) {
    const errors = [];
    const addError = (row, column, reason) => {
        if (errors.length < MAX_ERRORS)
            errors.push({ sheet, row, column, reason });
    };

    let headers;
    let headerRow;
    let numberIndex;
    let dataCount = 0;
    const rows = [];
    const seen = new Set();

    for (const { row, cells } of records) {
        if (cells.every(isBlank)) continue;
        if (cells.length > MAX_COLUMNS) {
            throw new SizeLimitError(
                '导入表最多支持 50 个资料列',
                row,
                MAX_COLUMNS + 1,
            );
        }
        const tooLong = cells.findIndex(
            cell => typeof cell === 'string' && cell.length > MAX_CELL_LENGTH,
        );
        if (tooLong >= 0) {
            throw new SizeLimitError(
                '单元格最多支持 2,000 个字符',
                row,
                headers?.[tooLong] ?? tooLong + 1,
            );
        }

        if (!headers) {
            headerRow = row;
            headers = cells.map(cell =>
                typeof cell === 'string' ? cell.trim() : '',
            );
            const labels = new Set();
            headers.forEach((label, index) => {
                const column = `第 ${index + 1} 列`;
                if (cells[index] === FORMULA) {
                    addError(row, column, '请先将 Excel 公式粘贴为值');
                } else if (!label) {
                    addError(row, column, '表头必须是非空文本');
                } else if (labels.has(label)) {
                    addError(row, column, '表头重复');
                }
                labels.add(label);
            });
            const defaultColumn = ['号码', 'drawn_number'].find(label =>
                labels.has(label),
            );
            numberIndex = headers.indexOf(numberColumn ?? defaultColumn);
            if (numberColumn !== undefined && numberIndex < 0) {
                addError(row, '号码列', '表格中找不到所选的号码列');
            }
            if (errors.length) break;
            continue;
        }

        if (++dataCount > MAX_ROWS) {
            throw new SizeLimitError('导入表最多支持 10,000 行资料', row);
        }
        if (
            cells.length > headers.length ||
            (!excel && cells.length !== headers.length)
        ) {
            addError(row, null, '列数与表头不一致');
            continue;
        }
        let invalid = false;
        cells.forEach((cell, index) => {
            if (cell === FORMULA || cell === UNSUPPORTED) {
                addError(
                    row,
                    headers[index],
                    cell === FORMULA
                        ? '请先将 Excel 公式粘贴为值'
                        : 'Excel 单元格无法转换为文本',
                );
                invalid = true;
            }
        });
        if (numberIndex < 0 || invalid) continue;

        const number = parseNumber(cells[numberIndex]);
        const column = headers[numberIndex];
        if (number === null) {
            addError(row, column, '号码必须是 MySQL INT 范围内的十进制整数');
        } else if (seen.has(number)) {
            addError(row, column, '号码重复');
        } else {
            seen.add(number);
            rows.push({
                row,
                number,
                values: headers.flatMap((_, index) =>
                    index === numberIndex ? [] : [cells[index] ?? ''],
                ),
            });
        }
    }

    if (!headers || (!dataCount && !errors.length)) {
        addError(headerRow ?? 1, null, '表格没有可导入的资料行');
    }
    return {
        sheets,
        sheet,
        headerRow,
        headers: headers ?? [],
        numberColumn: numberIndex >= 0 ? headers[numberIndex] : undefined,
        rows,
        errors,
    };
}

export async function parseNumberData(
    input,
    { extension, sheet, numberColumn },
) {
    const buffer = Buffer.from(
        input.buffer,
        input.byteOffset,
        input.byteLength,
    );
    let sheets = [];
    try {
        if (extension === '.csv') {
            if (sheet !== undefined)
                return {
                    errors: [{ sheet, reason: 'CSV 文件无需指定工作表' }],
                };
            return readRecords(csvRecords(buffer), {
                numberColumn,
                sheets,
                sheet: 'CSV',
            });
        }

        await validateZip(buffer);
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer, {
            ignoreNodes: [
                'mergeCells',
                'drawing',
                'conditionalFormatting',
                'dataValidations',
            ],
        });
        sheets = workbook.worksheets.map(worksheet => worksheet.name);
        if (sheet === undefined && sheets.length > 1)
            return { sheets, errors: [] };
        const worksheet = workbook.getWorksheet(sheet ?? sheets[0] ?? '');
        if (!worksheet)
            return {
                sheets,
                errors: [{ sheet, reason: 'Excel 中找不到所选的工作表' }],
            };
        return readRecords(excelRecords(worksheet), {
            sheet: worksheet.name,
            numberColumn,
            excel: true,
            sheets,
        });
    } catch (error) {
        const overLimit =
            error instanceof SizeLimitError ||
            error.code === 'CSV_MAX_RECORD_SIZE';
        return {
            sheets,
            overLimit,
            errors: [
                {
                    sheet: extension === '.csv' ? 'CSV' : (sheet ?? sheets[0]),
                    row: error.lines,
                    column:
                        typeof error.column === 'number'
                            ? `第 ${error instanceof SizeLimitError ? error.column : error.column + 1} 列`
                            : error instanceof SizeLimitError
                              ? error.column
                              : undefined,
                    reason:
                        error instanceof SizeLimitError
                            ? error.message
                            : overLimit
                              ? 'CSV 记录过长'
                              : extension === '.csv'
                                ? 'CSV 格式无效，请检查引号并使用 UTF-8 编码'
                                : '无法读取 Excel 文件，请检查文件格式',
                },
            ],
        };
    }
}
