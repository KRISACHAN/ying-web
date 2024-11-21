import { UserParticipationModel } from '@models/lucky-number/user-participation';
import { INTERNAL_SERVER_ERROR } from '@utils/http-errors';
import log from '@utils/log';

export class UserParticipationDao {
    static async createUserParticipation(
        { activity_id, user_name, drawn_number },
        transaction,
    ) {
        try {
            const where = {
                deleted_at: null,
            };
            if (activity_id) {
                where.activity_id = activity_id;
            }
            if (user_name) {
                where.user_name = user_name;
            }
            if (drawn_number) {
                where.drawn_number = drawn_number;
            }

            const res = await UserParticipationModel.create(where, {
                transaction,
            });
            return res;
        } catch (error) {
            log.error(error);
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
            if (activity_id) {
                where.activity_id = activity_id;
            }
            if (user_name) {
                where.user_name = user_name;
            }
            if (drawn_number) {
                where.drawn_number = drawn_number;
            }
            if (id) {
                where.id = id;
            }

            log.info(where);

            const res = await UserParticipationModel.findOne({
                where,
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
                where: { id },
                transaction,
            });
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('删除用户参与记录失败');
        }
    }
}
