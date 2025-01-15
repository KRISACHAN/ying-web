import { PoolModel } from '@models/option-draw/pool';
import { sequelize } from '@services/db';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';

export class OptionPoolDao {
    static async create(options, transaction) {
        try {
            const res = await PoolModel.bulkCreate(options, {
                transaction,
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('创建选项池失败');
        }
    }

    static async search(activityId) {
        try {
            const res = await PoolModel.scope('df').findOne({
                order: sequelize.random(),
                where: {
                    activity_id: activityId,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询可用选项失败');
        }
    }

    static async getCount(activityId) {
        try {
            const res = await PoolModel.count({
                where: {
                    activity_id: activityId,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('获取选项数量失败');
        }
    }

    static async getOptionsByActivityId(activityId) {
        try {
            const res = await PoolModel.scope('df').findAll({
                where: {
                    activity_id: activityId,
                },
                order: [['id', 'ASC']],
                attributes: ['id', 'drawn_option'],
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('获取选项列表失败');
        }
    }
}
