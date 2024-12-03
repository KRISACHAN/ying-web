import { UserParticipationModel } from '@models/lucky-number/user-participation';
import { ERROR_NAMES } from '@utils/constants';
import { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } from '@utils/http-errors';
import log from '@utils/log';

export class UserParticipationDao {
    static async createUserParticipation(
        { activity_id, user_name, drawn_number },
        transaction,
    ) {
        try {
            const existingParticipation = await UserParticipationModel.findOne({
                where: {
                    activity_id,
                    user_name,
                    deleted_at: null,
                },
            });

            if (existingParticipation) {
                throw PRECONDITION_FAILED('用户已经参与过该活动');
            }

            const res = await UserParticipationModel.create(
                {
                    activity_id,
                    user_name,
                    drawn_number,
                },
                {
                    transaction,
                },
            );
            return res;
        } catch (error) {
            log.error(error);
            if (error.name === ERROR_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR) {
                throw PRECONDITION_FAILED('用户已经参与过该活动');
            }
            throw INTERNAL_SERVER_ERROR('创建用户参与记录失败');
        }
    }

    static async findParticipation({
        activity_id,
        id,
        drawn_number,
        user_name,
    }) {
        try {
            const where = {
                deleted_at: null,
            };
            if (activity_id) where.activity_id = activity_id;
            if (user_name) where.user_name = user_name;
            if (drawn_number) where.drawn_number = drawn_number;
            if (id) where.id = id;

            const res = await UserParticipationModel.scope('df').findOne({
                where,
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }

    static async findAllParticipations(activityId) {
        try {
            const res = await UserParticipationModel.scope('df').findAll({
                where: {
                    activity_id: activityId,
                    drawn,
                    deleted_at: null,
                },
                order: [['drawn_number', 'ASC']],
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }

    static async deleteParticipation(id, transaction) {
        try {
            await UserParticipationModel.destroy({
                where: { id, deleted_at: null },
                transaction,
            });
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('删除用户参与记录失败');
        }
    }

    static async getActivitySummary(activityId) {
        const participations = await UserParticipationModel.findAll({
            where: {
                activity_id: activityId,
                deleted_at: null,
            },
            order: [['created_at', 'DESC']],
        });

        return {
            statistics: {
                total_participants: participations.length,
            },
            participations: participations.map(p => ({
                drawn_number: p.drawn_number,
                user_name: p.user_name,
                drawn_at: p.created_at,
            })),
        };
    }
}
