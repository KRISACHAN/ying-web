import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberDataDao } from '@dao/lucky-number/number-data';
import { UserParticipationModel } from '@models/lucky-number/user-participation';
import { sequelize } from '@services/db';
import {
    CONFLICT,
    NOT_FOUND,
    REQUEST_ENTITY_TOO_LARGE,
    UNPROCESSABLE_ENTITY,
} from '@utils/http-errors';
import { Transaction } from 'sequelize';

import { MAX_CELL_LENGTH, MAX_ERRORS } from './number-data-limits';
import { parseNumberDataUpload } from './number-data-upload';

const snapshot = {
    isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
};
const invalidData = (errors, { sheets, headers }) =>
    Object.assign(UNPROCESSABLE_ENTITY('表格校验未通过，请修正后重试'), {
        errors,
        sheets,
        headers,
    });

function resolveColumns(schema, parsed) {
    const labels = parsed.headers.filter(
        label => label !== parsed.numberColumn,
    );
    if (!schema)
        return labels.map((label, index) => ({ id: `c_${index + 1}`, label }));

    const columns = schema.columns_json;
    const storedLabels = new Set(columns.map(column => column.label));
    const incomingLabels = new Set(labels);
    const missing = columns.filter(column => !incomingLabels.has(column.label));
    const extra = labels.filter(label => !storedLabels.has(label));
    if (missing.length || extra.length) {
        const difference = [
            ...missing.map(({ label }) => ({
                column: label,
                reason: '缺少已保存的资料列',
            })),
            ...extra.map(column => ({
                column,
                reason: '新增或重命名的资料列需要先迁移',
            })),
        ];
        throw invalidData(
            difference.slice(0, MAX_ERRORS).map(error => ({
                ...error,
                sheet: parsed.sheet,
                row: parsed.headerRow,
            })),
            parsed,
        );
    }
    return columns;
}

async function checkPool(activityId, parsed, transaction) {
    const numbers = await NumberDataDao.getPoolNumbers(
        activityId,
        parsed.rows.map(row => row.number),
        transaction,
    );
    const errors = [];
    for (const { row, number } of parsed.rows) {
        if (numbers.has(number)) continue;
        errors.push({
            sheet: parsed.sheet,
            row,
            column: parsed.numberColumn,
            reason: '号码不在当前活动的号码池中',
        });
        if (errors.length === MAX_ERRORS) break;
    }
    if (errors.length) throw invalidData(errors, parsed);
}

function sameValues(columns, before, after) {
    return columns.every(({ id }) => before[id] === after[id]);
}

async function evaluateImport(
    activityId,
    schema,
    parsed,
    mode,
    transaction,
    uid,
) {
    const columns = resolveColumns(schema, parsed);
    await checkPool(activityId, parsed, transaction);

    const labelIds = new Map(columns.map(({ label, id }) => [label, id]));
    const ids = parsed.headers
        .filter(label => label !== parsed.numberColumn)
        .map(label => labelIds.get(label));
    const counts = { added: 0, existing: 0, unchanged: 0 };
    const changes = [];
    const samples = [];
    for (let offset = 0; offset < parsed.rows.length; offset += 128) {
        const batch = parsed.rows.slice(offset, offset + 128);
        const existing = schema
            ? await NumberDataDao.getRows(
                  activityId,
                  batch.map(row => row.number),
                  transaction,
              )
            : [];
        const byNumber = new Map(existing.map(row => [row.drawn_number, row]));

        for (const { row, number, values: input } of batch) {
            const values = Object.fromEntries(
                ids.map((id, index) => [id, input[index]]),
            );
            const current = byNumber.get(number);
            const status = !current
                ? 'added'
                : sameValues(columns, current.values_json, values)
                  ? 'unchanged'
                  : 'existing';
            counts[status]++;
            if (uid === undefined && samples.length < 8) {
                samples.push({ row, drawn_number: number, values, status });
            }
            if (
                uid !== undefined &&
                (status === 'added' ||
                    (status === 'existing' && mode === 'update'))
            ) {
                changes.push({
                    activity_id: activityId,
                    drawn_number: number,
                    values_json: values,
                    version: (current?.version ?? 0) + 1,
                    updated_by: uid,
                });
            }
        }
    }
    return { columns, counts, samples, changes };
}

async function parseUpload(upload) {
    const parsed = await parseNumberDataUpload(upload);
    if (parsed.overLimit) {
        throw Object.assign(REQUEST_ENTITY_TOO_LARGE(parsed.errors[0].reason), {
            errors: parsed.errors,
        });
    }
    if (parsed.errors.length) throw invalidData(parsed.errors, parsed);
    return parsed;
}

export async function previewNumberData(key, upload) {
    const parsed = await parseUpload(upload);
    return sequelize.transaction(snapshot, async transaction => {
        const activity = await ActivityDao.search({ key }, { transaction });
        const { sheets, sheet, headers, numberColumn } = parsed;
        const selection = {
            sheets,
            sheet,
            headers,
            number_column: numberColumn,
        };
        if (numberColumn === undefined) return selection;

        const schema = await NumberDataDao.getSchema(activity.id, transaction);
        const { columns, counts, samples } = await evaluateImport(
            activity.id,
            schema,
            parsed,
            upload.options.mode,
            transaction,
        );

        return { ...selection, columns, counts, samples };
    });
}

export async function commitNumberData(key, upload, uid) {
    const parsed = await parseUpload(upload);
    if (parsed.numberColumn === undefined) {
        const selectingSheet = parsed.sheets.length > 1 && !parsed.sheet;
        throw Object.assign(
            UNPROCESSABLE_ENTITY(
                selectingSheet ? '请选择要导入的工作表' : '请选择号码列',
            ),
            { sheets: parsed.sheets, headers: parsed.headers },
        );
    }

    return sequelize.transaction(async transaction => {
        const activity = await ActivityDao.search(
            { key },
            {
                transaction,
                lock: transaction.LOCK.UPDATE,
            },
        );
        const schema = await NumberDataDao.getSchema(activity.id, transaction);

        const { columns, counts, changes } = await evaluateImport(
            activity.id,
            schema,
            parsed,
            upload.options.mode,
            transaction,
            uid,
        );
        if (!schema)
            await NumberDataDao.createSchema(activity.id, columns, transaction);
        await NumberDataDao.saveRows(changes, transaction);
        if (schema) await NumberDataDao.advanceRevision(schema, transaction);
        return { counts, written: changes.length };
    });
}

async function getParticipationData(key, id, transaction, editing = false) {
    const lock = editing ? transaction.LOCK.UPDATE : undefined;
    const activity = await ActivityDao.search({ key }, { transaction, lock });
    const participation = await UserParticipationModel.findOne({
        attributes: ['drawn_number', 'username'],
        where: { activity_id: activity.id, id },
        transaction,
        lock,
        logging: false,
    });
    if (!participation) throw NOT_FOUND('参与记录不存在或已取消');

    const { drawn_number, username } = participation;
    const [row] = await NumberDataDao.getRows(
        activity.id,
        [drawn_number],
        transaction,
    );
    if (!row) throw NOT_FOUND('该号码的资料尚未导入');
    const schema = await NumberDataDao.getSchema(activity.id, transaction);
    return { drawn_number, username, schema, row };
}

export function readParticipationData(key, id) {
    return sequelize.transaction(snapshot, async transaction => {
        const { drawn_number, username, schema, row } =
            await getParticipationData(key, id, transaction);
        return {
            drawn_number,
            username,
            columns: schema.columns_json,
            values: row.values_json,
            version: row.version,
        };
    });
}

export function updateParticipationData(key, id, uid, payload) {
    const { version, values } = payload ?? {};
    if (
        !Number.isInteger(version) ||
        version < 1 ||
        !values ||
        typeof values !== 'object' ||
        Array.isArray(values)
    ) {
        throw UNPROCESSABLE_ENTITY('资料版本或字段值格式无效');
    }
    return sequelize.transaction(async transaction => {
        const { schema, row } = await getParticipationData(
            key,
            id,
            transaction,
            true,
        );
        if (row.version !== version) {
            throw CONFLICT('资料已被修改，请重新载入后核对草稿');
        }

        const allowed = new Set(schema.columns_json.map(column => column.id));
        for (const [field, value] of Object.entries(values)) {
            if (
                !allowed.has(field) ||
                typeof value !== 'string' ||
                value.length > MAX_CELL_LENGTH
            ) {
                throw UNPROCESSABLE_ENTITY(
                    '资料只能包含已定义的文本字段，每项最多 2,000 个字符',
                );
            }
        }
        const nextValues = { ...row.values_json, ...values };
        if (sameValues(schema.columns_json, row.values_json, nextValues))
            return { version };
        const nextVersion = version + 1;
        await NumberDataDao.saveRows(
            [
                {
                    activity_id: row.activity_id,
                    drawn_number: row.drawn_number,
                    values_json: nextValues,
                    version: nextVersion,
                    updated_by: uid,
                },
            ],
            transaction,
        );
        await NumberDataDao.advanceRevision(schema, transaction);
        return { version: nextVersion };
    });
}
