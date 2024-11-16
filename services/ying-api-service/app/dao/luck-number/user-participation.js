import { UserParticipationModel } from '@models/luck-number/user-participation';

export class UserParticipationDao {
    static async createUserParticipation(participationData) {
        return await UserParticipationModel.create(participationData);
    }

    static async findParticipation(activityId, userName, ipAddress) {
        return await UserParticipationModel.findOne({
            where: {
                activity_id: activityId,
                user_name: userName,
                ip_address: ipAddress,
            },
        });
    }
}
