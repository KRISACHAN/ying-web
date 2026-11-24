import {
    NumberDataRowModel,
    NumberDataSchemaModel,
} from '@models/lucky-number/number-data';
import { NumberPoolModel } from '@models/lucky-number/number-pool';

function* writeBatches(rows) {
    const statementBudget = 1024 * 1024;
    let batch = [];
    let bytes = 0;
    for (const row of rows) {
        // SQL string escaping can double JSON bytes. Reserve room for the other values.
        const rowBytes =
            2 * Buffer.byteLength(JSON.stringify(row.values_json)) + 256;
        if (
            batch.length >= 250 ||
            (batch.length && bytes + rowBytes > statementBudget)
        ) {
            yield batch;
            batch = [];
            bytes = 0;
        }
        batch.push(row);
        bytes += rowBytes;
    }
    if (batch.length) yield batch;
}

export class NumberDataDao {
    static getSchema(activityId, transaction) {
        return NumberDataSchemaModel.findByPk(activityId, {
            transaction,
            logging: false,
        });
    }

    static createSchema(activityId, columns, transaction) {
        return NumberDataSchemaModel.create(
            { activity_id: activityId, columns_json: columns, revision: 1 },
            { transaction, logging: false },
        );
    }

    static advanceRevision(schema, transaction) {
        return schema.increment('revision', { transaction, logging: false });
    }

    static async getRows(activityId, numbers, transaction, attributes) {
        if (!numbers.length) return [];

        return NumberDataRowModel.findAll({
            attributes,
            where: { activity_id: activityId, drawn_number: numbers },
            transaction,
            logging: false,
            raw: true,
        });
    }

    static async getPoolNumbers(activityId, numbers, transaction) {
        const rows = await NumberPoolModel.findAll({
            attributes: ['drawn_number'],
            where: { activity_id: activityId, drawn_number: numbers },
            transaction,
            logging: false,
            raw: true,
        });
        return new Set(rows.map(row => row.drawn_number));
    }

    static async saveRows(rows, transaction) {
        for (const batch of writeBatches(rows)) {
            await NumberDataRowModel.bulkCreate(batch, {
                updateOnDuplicate: [
                    'values_json',
                    'version',
                    'updated_by',
                    'updated_at',
                ],
                transaction,
                logging: false,
            });
        }
    }
}
