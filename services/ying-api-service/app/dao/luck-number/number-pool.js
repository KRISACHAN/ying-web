import { sequelize } from '@utils/db';
import { NumberPoolModel } from '@models/luck-number/number-pool';
import { UserParticipationModel } from '@models/luck-number/user-participation';

export class NumberPoolDao {
    static async createNumberPoolEntries(entries) {
        return await NumberPoolModel.bulkCreate(entries);
    }

    static async findAvailableNumber(activityId) {
        return await NumberPoolModel.findOne({
            where: { activity_id: activityId, is_drawn: false },
            order: sequelize.random(),
        });
    }

    static async markNumberAsDrawn(numberEntry) {
        numberEntry.is_drawn = true;
        return await numberEntry.save();
    }

    static async findNumbersByActivity(activityId) {
        return await NumberPoolModel.findAll({
            where: { activity_id: activityId },
        });
    }

    // Add this method to find numbers with user participation by activity ID
    static async findNumbersWithUserByActivity(activityId) {
        return await NumberPoolModel.findAll({
            where: { activity_id: activityId },
            include: [
                {
                    model: UserParticipationModel,
                    as: 'user_participation', // Ensure the alias matches the association
                    attributes: ['user_name'],
                    required: false,
                    where: { activity_id: activityId },
                },
            ],
        });
    }
}
