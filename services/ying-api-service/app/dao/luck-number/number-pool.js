import { sequelize } from '@utils/db';
import { NumberPoolModel } from '@models/luck-number/number-pool';
import { UserParticipationModel } from '@models/luck-number/user-participation';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';

export class NumberPoolDao {
    static async createNumberPoolEntries(entries) {
        try {
            const res = await NumberPoolModel.bulkCreate(entries);
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('创建抽奖池失败');
        }
    }

    static async findAvailableNumber(activityId) {
        try {
            const res = await NumberPoolModel.findOne({
                where: { activity_id: activityId, is_drawn: false },
                order: sequelize.random(),
            });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('查询可用抽奖号码失败');
        }
    }

    static async markNumberAsDrawn(numberEntry) {
        try {
            numberEntry.is_drawn = true;
            const res = await numberEntry.save();
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('标记抽奖号码为已抽奖失败');
        }
    }

    static async findNumbersByActivity(activityId) {
        try {
            const res = await NumberPoolModel.findAll({
                where: { activity_id: activityId },
            });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('查询抽奖号码失败');
        }
    }

    static async findNumbersWithUserByActivity(activityId) {
        try {
            const res = await NumberPoolModel.findAll({
                where: { activity_id: activityId },
                include: [
                    {
                        model: UserParticipationModel,
                        as: 'user_participation',
                        attributes: ['user_name'],
                        required: false,
                        where: { activity_id: activityId },
                    },
                ],
            });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('查询抽奖号码失败');
        }
    }
}
