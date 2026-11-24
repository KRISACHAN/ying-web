import { basename, extname, join, resolve } from 'node:path';
import { Worker } from 'node:worker_threads';

import {
    REQUEST_ENTITY_TOO_LARGE,
    REQUEST_TIMEOUT,
    TOO_MANY_REQUESTS,
    UNPROCESSABLE_ENTITY,
} from '@utils/http-errors';
import Busboy from 'busboy';

import { MAX_CELL_LENGTH, MAX_FILE_BYTES } from './number-data-limits';

const MAX_REQUEST_BYTES = MAX_FILE_BYTES + 64 * 1024;
const UPLOAD_TIMEOUT_MS = 30000;
const PARSE_TIMEOUT_MS = 12000;
const MAX_CONCURRENT_IMPORTS = 2;
let activeImports = 0;

const tooLarge = () => REQUEST_ENTITY_TOO_LARGE('文件不能超过 5 MiB');
const invalidUpload = () =>
    UNPROCESSABLE_ENTITY('请上传一个 .xlsx 或 UTF-8 .csv 文件');
const optionNames = new Set(['sheet', 'number_column', 'mode']);

export async function limitNumberDataImports(ctx, next) {
    if (activeImports >= MAX_CONCURRENT_IMPORTS) {
        ctx.set('Retry-After', '5');
        throw TOO_MANY_REQUESTS('导入请求过多，请稍后重试');
    }
    activeImports++;
    try {
        await next();
    } finally {
        activeImports--;
    }
}

async function readUpload(ctx) {
    if (!ctx.is('multipart/form-data')) throw invalidUpload();
    if (Number(ctx.get('content-length')) > MAX_REQUEST_BYTES) throw tooLarge();

    let parser;
    try {
        parser = Busboy({
            headers: ctx.req.headers,
            limits: {
                files: 1,
                fields: 3,
                parts: 5,
                fileSize: MAX_FILE_BYTES + 1,
                fieldSize: 8192,
            },
        });
    } catch {
        throw invalidUpload();
    }

    return new Promise((resolveUpload, reject) => {
        const request = ctx.req;
        const chunks = [];
        const fields = Object.create(null);
        let extension;
        let error;
        let totalBytes = 0;
        let settled = false;

        const stop = failure => {
            if (settled) return;
            if (!ctx.headerSent) ctx.set('Connection', 'close');
            request.unpipe(parser);
            parser.destroy();
            request.resume();
            finish(failure);
        };

        const countBytes = chunk => {
            totalBytes += chunk.length;
            if (totalBytes > MAX_REQUEST_BYTES) stop(tooLarge());
        };
        const abort = () => stop(invalidUpload());
        const timer = setTimeout(
            () => stop(REQUEST_TIMEOUT('文件上传超时，请重试')),
            UPLOAD_TIMEOUT_MS,
        );

        function finish(failure) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            request.off('data', countBytes);
            request.off('aborted', abort);
            request.off('error', abort);
            if (failure) reject(failure);
            else
                resolveUpload({
                    fields,
                    extension,
                    buffer: Buffer.concat(chunks),
                });
        }

        parser.on('file', (name, stream, file) => {
            extension = extname(file.filename ?? '').toLowerCase();
            if (name !== 'file' || !['.xlsx', '.csv'].includes(extension)) {
                error = invalidUpload();
            }
            stream.on('data', chunk => {
                if (!error) chunks.push(chunk);
            });
            stream.on('limit', () => {
                error = tooLarge();
            });
            stream.on('error', () => {});
        });
        parser.on('field', (name, value, info) => {
            if (
                !optionNames.has(name) ||
                Object.hasOwn(fields, name) ||
                info.valueTruncated
            ) {
                error ??= UNPROCESSABLE_ENTITY('上传参数无效');
            } else {
                fields[name] = value;
            }
        });
        for (const event of ['filesLimit', 'fieldsLimit', 'partsLimit']) {
            parser.on(event, () => {
                error ??= invalidUpload();
            });
        }
        parser.on('error', abort);
        parser.on('close', () =>
            finish(error ?? (!extension ? invalidUpload() : null)),
        );
        request.on('aborted', abort);
        request.on('error', abort);
        request.on('data', countBytes);
        request.pipe(parser);
    });
}

export async function readNumberDataUpload(ctx) {
    const { fields, extension, buffer } = await readUpload(ctx);
    if (buffer.length > MAX_FILE_BYTES) throw tooLarge();

    const options = {
        extension,
        sheet: fields.sheet,
        numberColumn: fields.number_column,
        mode: fields.mode ?? 'add',
    };
    if (
        !['add', 'update'].includes(options.mode) ||
        options.sheet?.length > 31 ||
        options.numberColumn?.length > MAX_CELL_LENGTH
    ) {
        throw UNPROCESSABLE_ENTITY('工作表、号码列或导入模式无效');
    }

    return { buffer, options };
}

export function parseNumberDataUpload({ buffer, options }) {
    return new Promise((resolveParse, reject) => {
        const isSource = basename(resolve(__dirname, '../..')) === 'app';
        const worker = new Worker(join(__dirname, 'number-data-worker.js'), {
            workerData: { buffer, options },
            execArgv: isSource
                ? ['-r', require.resolve('@babel/register')]
                : [],
            resourceLimits: { maxOldGenerationSizeMb: 512 },
        });
        let settled = false;
        const finish = async (error, result) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            await worker.terminate();
            if (error) reject(error);
            else resolveParse(result);
        };
        const timer = setTimeout(
            () =>
                finish(
                    REQUEST_ENTITY_TOO_LARGE('表格解析超时，请缩减表格后重试'),
                ),
            PARSE_TIMEOUT_MS,
        );
        const failed = () =>
            finish(UNPROCESSABLE_ENTITY('表格解析失败，请检查文件后重试'));
        worker.once('message', result => finish(null, result));
        worker.once('error', failed);
        worker.once('exit', failed);
    });
}
