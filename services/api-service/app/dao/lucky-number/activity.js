import { ActivityModel } from '@models/lucky-number/activity';
import { genPaginationRequest } from '@utils/helpers';
import {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
} from '@utils/http-errors';
import log from '@utils/log';

export class ActivityDao {
    static async create(
        { key, name, description, participant_limit = 0 },
        transaction,
    ) {
        try {
            const existedActivity = await ActivityModel.findOne({
                where: { key, deleted_at: null },
            });

            if (existedActivity) {
                throw PRECONDITION_FAILED('活动已存在');
            }

            const activity = new ActivityModel({
                key,
                name,
                description,
                participant_limit,
            });
            const savedActivity = await activity.save({ transaction });

            if (!savedActivity) {
                throw INTERNAL_SERVER_ERROR('创建活动失败');
            }

            return savedActivity;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async search({ key }) {
        try {
            const whereQuery = {
                deleted_at: null,
            };
            if (key) {
                whereQuery.key = key;
            }
            const activity = await ActivityModel.scope('df').findOne({
                where: whereQuery,
            });

            if (!activity) {
                throw NOT_FOUND('活动不存在');
            }

            return activity;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete({ key }) {
        try {
            const activity = await ActivityModel.findOne({
                where: { key, deleted_at: null },
            });

            if (!activity) {
                throw NOT_FOUND('活动不存在');
            }

            const deletedActivity = await activity.destroy();

            if (!deletedActivity) {
                throw INTERNAL_SERVER_ERROR('删除活动失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        try {
            const pagination = genPaginationRequest(pageNum, pageSize);
            const result = await ActivityModel.scope('df').findAndCountAll({
                where: { deleted_at: null },
                limit: pagination.limit,
                offset: pagination.offset,
                order: [['id', 'DESC']],
            });

            if (!result) {
                throw INTERNAL_SERVER_ERROR('查询活动列表失败');
            }

            return {
                pagination: {
                    count: pageNum,
                    size: pageSize,
                    total: result.length,
                },
                data: result.rows,
            };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async updateStatus({ key, status }) {
        try {
            const activity = await ActivityModel.findOne({
                where: { key, deleted_at: null },
            });

            if (!activity) {
                throw NOT_FOUND('活动不存在');
            }

            activity.status = status;
            await activity.save();

            return activity;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
