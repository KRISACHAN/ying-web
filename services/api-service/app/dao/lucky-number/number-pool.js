import { NumberPoolModel } from '@models/lucky-number/number-pool';
import { UserParticipationModel } from '@models/lucky-number/user-participation';
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
                    is_drawn: false,
                    deleted_at: null,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询可用幸运号码失败');
        }
    }

    static async markNumberAsDrawn(numberEntry, user_name, transaction) {
        try {
            numberEntry.is_drawn = true;
            numberEntry.user_name = user_name;
            const res = await numberEntry.save({
                transaction,
                where: { deleted_at: null },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('获取幸运号码失败');
        }
    }

    static async unmarkNumberAsDrawn(drawn_number, transaction) {
        try {
            const numberEntry = await NumberPoolModel.findOne({
                where: { drawn_number, deleted_at: null },
            });
            if (numberEntry) {
                numberEntry.is_drawn = false;
                numberEntry.user_name = null;
                await numberEntry.save({
                    transaction,
                    where: { deleted_at: null },
                });
            }
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('取消标记号码失败');
        }
    }

    static async findNumbersByActivity(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findAll({
                where: { activity_id: activityId, deleted_at: null },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询幸运号码失败');
        }
    }

    static async findNumbersWithUserByActivity(activityId) {
        try {
            const res = await NumberPoolModel.scope('df').findAll({
                where: { activity_id: activityId, deleted_at: null },
                include: [
                    {
                        model: UserParticipationModel,
                        as: 'lucky_number_user_participation',
                        required: false,
                    },
                ],
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询幸运号码失败');
        }
    }
}
