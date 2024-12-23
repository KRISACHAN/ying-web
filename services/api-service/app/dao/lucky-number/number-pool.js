import { NumberPoolModel } from '@models/lucky-number/number-pool';
import { sequelize } from '@services/db';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';

export class NumberPoolDao {
    static async create(entries, transaction) {
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

    static async search(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findOne({
                order: sequelize.random(),
                where: {
                    activity_id: activityId,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询可用幸运号码失败');
        }
    }

    static async getCount(activityId) {
        const res = await NumberPoolModel.count({
            where: {
                activity_id: activityId,
            },
        });
        return res;
    }
}
