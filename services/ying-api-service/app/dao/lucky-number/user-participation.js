import { UserParticipationModel } from '@models/lucky-number/user-participation';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';

export class UserParticipationDao {
    static async createUserParticipation(participationData) {
        try {
            const res = await UserParticipationModel.create(participationData);
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('创建用户参与记录失败');
        }
    }

    static async findParticipation(activityId, userName) {
        try {
            const res = await UserParticipationModel.findOne({
                where: {
                    activity_id: activityId,
                    user_name: userName,
                },
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }
}
