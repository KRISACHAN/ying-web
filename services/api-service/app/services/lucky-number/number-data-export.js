import { Readable } from 'node:stream';

import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberDataDao } from '@dao/lucky-number/number-data';
import { UserParticipationModel } from '@models/lucky-number/user-participation';
import { sequelize } from '@services/db';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';
import { Op, Transaction } from 'sequelize';

const PAGE_SIZE = 128;
const fixedHeaders = ['号码', '抽取人', '抽取时间'];
const dateFormat = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
});

function csvLine(cells) {
    return (
        cells
            .map(cell => {
                let value = String(cell ?? '');
                if (
                    typeof cell === 'string' &&
                    (/^[\t\r\n]/.test(value) ||
                        /^[\s\p{Cc}]*[=+\-@＝＋－＠]/u.test(value))
                ) {
                    value = `'${value}`;
                }
                return /[",\r\n]/.test(value)
                    ? `"${value.replace(/"/g, '""')}"`
                    : value;
            })
            .join(',') + '\r\n'
    );
}

function exportHeaders(columns) {
    const reserved = new Set([
        ...fixedHeaders,
        ...columns.map(column => column.label),
    ]);
    return fixedHeaders.concat(
        columns.map(({ label }) => {
            if (!fixedHeaders.includes(label)) return label;

            const base = `资料 · ${label}`;
            let header = base;
            let suffix = 2;
            while (reserved.has(header)) header = `${base} (${suffix++})`;
            reserved.add(header);
            return header;
        }),
    );
}

export async function exportNumberData(key, uid) {
    const transaction = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
        readOnly: true,
        logging: false,
    });
    const rollback = async () => {
        if (!transaction.finished) await transaction.rollback();
    };

    try {
        const activity = await ActivityDao.search({ key }, { transaction });
        const fetchPage = beforeId =>
            UserParticipationModel.findAll({
                attributes: ['id', 'drawn_number', 'username', 'created_at'],
                where: {
                    activity_id: activity.id,
                    drawn_number: { [Op.ne]: null },
                    ...(beforeId === undefined
                        ? {}
                        : { id: { [Op.lt]: beforeId } }),
                },
                order: [['id', 'DESC']],
                limit: PAGE_SIZE,
                raw: true,
                logging: false,
                transaction,
            });
        const firstPage = await fetchPage();
        if (!firstPage.length) {
            await transaction.commit();
            return null;
        }
        const schema = await NumberDataDao.getSchema(activity.id, transaction);
        const columns = schema?.columns_json ?? [];

        async function* exportPages() {
            try {
                yield '\uFEFF' + csvLine(exportHeaders(columns));
                let page = firstPage;
                while (page.length) {
                    const numbers = [
                        ...new Set(page.map(record => record.drawn_number)),
                    ];
                    const rows = columns.length
                        ? await NumberDataDao.getRows(
                              activity.id,
                              numbers,
                              transaction,
                          )
                        : [];
                    const byNumber = new Map(
                        rows.map(row => [row.drawn_number, row.values_json]),
                    );
                    for (const record of page) {
                        const values = byNumber.get(record.drawn_number);
                        yield csvLine([
                            record.drawn_number,
                            record.username,
                            dateFormat.format(record.created_at),
                            ...columns.map(({ id }) => values?.[id] ?? ''),
                        ]);
                    }
                    if (page.length < PAGE_SIZE) break;
                    page = await fetchPage(page[page.length - 1].id);
                }
                await transaction.commit();
            } catch (error) {
                log.warn({
                    action: 'lucky-number-data-export',
                    uid,
                    key,
                    error: error.name,
                });
                throw INTERNAL_SERVER_ERROR('导出号码资料失败');
            } finally {
                await rollback();
            }
        }

        const stream = Readable.from(exportPages(), { objectMode: false });
        // A disconnected response can destroy the stream before the generator starts.
        stream.once('close', () =>
            rollback().catch(() => {
                log.error({
                    action: 'lucky-number-data-export-rollback',
                    uid,
                    key,
                });
            }),
        );
        return stream;
    } catch (error) {
        await rollback();
        throw error;
    }
}
