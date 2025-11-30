import { ActivityModel } from '@models/lucky-number/activity';
import { genPaginationRequest } from '@utils/helpers';
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from '@utils/http-errors';
import log from '@utils/log';

export class ActivityDao {
    static async create(
        { key, name, description, participant_limit = 0 },
        transaction = null,
    ) {
        try {
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
            const whereQuery = {};
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

    static async delete({ key }, transaction = null) {
        try {
            const activity = await ActivityModel.findOne({
                where: { key },
            });

            if (!activity) {
                throw NOT_FOUND('活动不存在');
            }

            const deletedActivity = await activity.destroy({ transaction });

            if (!deletedActivity) {
                throw INTERNAL_SERVER_ERROR('删除活动失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ page_num = 1, page_size = 10 }, ctx = null) {
        try {
            // Try to get total count from cache (if ctx.cache is available)
            let total = null;
            const cacheKey = `lucky-number:list:count`;

            if (ctx && ctx.cache) {
                total = await ctx.cache.get(cacheKey);
            }

            if (!total) {
                total = await ActivityModel.scope('df').count();
                // Cache total count for 5 minutes
                if (ctx && ctx.cache) {
                    await ctx.cache.set(cacheKey, total, 300);
                }
            }

            const pagination = genPaginationRequest(page_num, page_size);
            const result = await ActivityModel.scope('df').findAll({
                limit: pagination.limit,
                offset: pagination.offset,
                order: [['id', 'DESC']],
            });

            if (!result) {
                throw INTERNAL_SERVER_ERROR('查询活动列表失败');
            }

            return {
                pagination: {
                    count: page_num,
                    size: page_size,
                    total: total,
                },
                data: result,
            };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async updateStatus({ key, status }, transaction = null) {
        try {
            const activity = await ActivityModel.findOne({
                where: { key },
            });

            if (!activity) {
                throw NOT_FOUND('活动不存在');
            }

            activity.status = status;
            await activity.save({ transaction });

            return activity;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
