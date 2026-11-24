import ExcelJS from 'exceljs';
import { describe, expect, it } from 'vitest';

import { parseNumberData } from '../app/services/lucky-number/number-data-parser';

const csv = (content, options = {}) =>
    parseNumberData(Buffer.from(content), { extension: '.csv', ...options });

describe('lucky number import parsing', () => {
    it('keeps CSV text and reports duplicate normalized numbers by physical row', async () => {
        const result = await csv(
            '\uFEFF\r\n号码, 券码 ,备注,领取位置\r\n040,0001,"你好, ""A""\r\n第二行",\r\n40,0002,重复,B\r\n',
        );
        expect(result.headers).toEqual(['号码', '券码', '备注', '领取位置']);
        expect(result.rows).toEqual([
            {
                row: 3,
                number: 40,
                values: ['0001', '你好, "A"\r\n第二行', ''],
            },
        ]);
        expect(result.errors).toEqual([
            {
                sheet: 'CSV',
                row: 5,
                column: '号码',
                reason: '号码重复',
            },
        ]);
    });

    it('allows selecting the number column and rejects invalid rows or empty data', async () => {
        const selection = await csv('券码,中奖号码\n0001,40');
        expect(selection.numberColumn).toBeUndefined();
        expect(selection.headers).toEqual(['券码', '中奖号码']);
        const result = await csv(
            '券码,中奖号码\n0001,40\nA,4.1\nB,2147483648\nC,\nD',
            {
                numberColumn: '中奖号码',
            },
        );
        expect(result.rows).toEqual([{ row: 2, number: 40, values: ['0001'] }]);
        expect(result.errors.map(({ row }) => row)).toEqual([3, 4, 5, 6]);
        expect((await csv('号码, 券码 ,券码,\n40,1,2,3')).errors).toHaveLength(
            2,
        );
        expect((await csv('号码,券码\n')).errors).toHaveLength(1);
    });

    it('bounds rows and cells and rejects malformed UTF-8 or CSV quotes', async () => {
        expect(
            (await csv('号码,券码\n' + '1,1\n'.repeat(10001))).overLimit,
        ).toBe(true);
        const oversized = await csv('号码,券码\n1,' + 'A'.repeat(2001));
        expect(oversized.overLimit).toBe(true);
        expect(oversized.errors[0]).toMatchObject({ row: 2, column: '券码' });
        expect((await csv('号码,券码\n1,"never closed')).errors[0].row).toBe(2);
        const invalidUtf8 = await parseNumberData(Buffer.from([255]), {
            extension: '.csv',
        });
        expect(invalidUtf8.errors).toHaveLength(1);
    });

    it('requires a workbook sheet selection and converts dates, booleans and blanks to text', async () => {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('礼品');
        sheet.addRow(['drawn_number', '券码', '时间', '有效', '备注']);
        sheet.addRow([40, '0001', new Date('2026-11-23T11:02:40Z'), false]);
        const other = workbook.addWorksheet('公式');
        other.addRow(['号码', '金额']);
        other.addRow([40, { formula: '1+1', result: 2 }]);
        const file = await workbook.xlsx.writeBuffer();
        expect(await parseNumberData(file, { extension: '.xlsx' })).toEqual({
            sheets: ['礼品', '公式'],
            errors: [],
        });
        const parsed = await parseNumberData(file, {
            extension: '.xlsx',
            sheet: '礼品',
        });
        expect(parsed.rows).toEqual([
            {
                row: 2,
                number: 40,
                values: ['0001', '2026-11-23T11:02:40.000Z', 'false', ''],
            },
        ]);
        const formulas = await parseNumberData(file, {
            extension: '.xlsx',
            sheet: '公式',
        });
        expect(formulas.errors).toEqual([
            {
                sheet: '公式',
                row: 2,
                column: '金额',
                reason: '请先将 Excel 公式粘贴为值',
            },
        ]);
    });
});
