import { UserParticipationModel } from '@models/luck-number/user-participation';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';

export class UserParticipationDao {
    static async createUserParticipation(participationData) {
        try {
            const res = await UserParticipationModel.create(participationData);
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('创建用户参与记录失败');
        }
    }

    static async findParticipation(activityId, userName, ipAddress) {
        try {
            const res = await UserParticipationModel.findOne({
                where: {
                    activity_id: activityId,
                    user_name: userName,
                    ip_address: ipAddress,
                },
            });
            return res;
        } catch {
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }
}
