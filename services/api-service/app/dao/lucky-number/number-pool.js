import { NumberPoolModel } from '@models/lucky-number/number-pool';
import { sequelize } from '@services/db';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';

export class NumberPoolDao {
    static async createNumberPoolEntries(entries, transaction) {
        try {
            const res = await NumberPoolModel.bulkCreate(entries, {
                transaction,
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('创建幸运号码池失败');
        }
    }

    static async findAvailableNumber(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findOne({
                order: sequelize.random(),
                where: {
                    activity_id: activityId,
                    deleted_at: null,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询可用幸运号码失败');
        }
    }

    static async findUndrawnNumbers(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findAll({
                where: {
                    activity_id: activityId,
                    is_drawn: false,
                    deleted_at: null,
                },
                order: [['drawn_number', 'ASC']],
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询未抽取号码失败');
        }
    }

    static async findNumbersByActivity(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findAll({
                where: {
                    activity_id: activityId,
                    deleted_at: null,
                },
                order: [['drawn_number', 'ASC']],
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询幸运号码失败');
        }
    }
}
