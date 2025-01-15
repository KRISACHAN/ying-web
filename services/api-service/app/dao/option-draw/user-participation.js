import { UserParticipationModel } from '@models/option-draw/user-participation';
import { ERROR_NAMES } from '@utils/constants';
import { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } from '@utils/http-errors';
import log from '@utils/log';
import { eq } from 'lodash';
import { Op } from 'sequelize';

export class UserParticipationDao {
    static async create({ activity_id, username, drawn_option }, transaction) {
        try {
            const existingParticipation = await UserParticipationModel.findOne({
                where: {
                    activity_id,
                    username,
                },
            });

            if (existingParticipation) {
                throw PRECONDITION_FAILED('用户已参与该活动');
            }

            const res = await UserParticipationModel.create(
                {
                    activity_id,
                    username,
                    drawn_option,
                },
                {
                    transaction,
                },
            );
            return res;
        } catch (error) {
            log.error(error);
            if (eq(error.name, ERROR_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR)) {
                throw PRECONDITION_FAILED('用户已参与该活动');
            }
            throw error;
        }
    }

    static async search({ activity_id, id, drawn_option, username }) {
        try {
            const where = {};
            if (activity_id) {
                where.activity_id = activity_id;
            }
            if (username) {
                where.username = username;
            }
            if (drawn_option) {
                where.drawn_option = drawn_option;
            }
            if (id) {
                where.id = id;
            }

            const res = await UserParticipationModel.scope('df').findOne({
                where,
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }

    static async delete(id, transaction) {
        try {
            const res = await UserParticipationModel.destroy({
                where: { id },
                transaction,
            });
            return res;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('删除用户参与记录失败');
        }
    }

    static async getCount(activityId) {
        try {
            const count = await UserParticipationModel.count({
                where: {
                    activity_id: activityId,
                },
            });
            return count;
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('获取用户参与记录数量失败');
        }
    }

    static async query({
        page_num = 1,
        page_size = 10,
        activity_id,
        username,
        drawn_option,
        order = 'DESC',
    }) {
        try {
            const whereQuery = {};
            if (activity_id) {
                whereQuery.activity_id = activity_id;
            }
            if (username) {
                whereQuery.username = {
                    [Op.like]: `%${username}%`,
                };
            }
            if (drawn_option) {
                whereQuery.drawn_option = {
                    [Op.like]: `%${drawn_option}%`,
                };
            }

            const result = await UserParticipationModel.findAndCountAll({
                attributes: [
                    'id',
                    'activity_id',
                    'username',
                    'drawn_option',
                    'created_at',
                ],
                where: whereQuery,
                offset: (page_num - 1) * page_size,
                limit: page_size,
                order: [['id', order]],
            });
            return {
                data: result.rows,
                pagination: {
                    count: page_num,
                    size: page_size,
                    total: result.count,
                },
            };
        } catch (error) {
            log.error(error);
            throw INTERNAL_SERVER_ERROR('查询用户参与记录失败');
        }
    }
}