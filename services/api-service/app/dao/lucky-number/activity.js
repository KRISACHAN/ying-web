import { ActivityModel } from '@models/lucky-number/activity';
import {
    PRECONDITION_FAILED,
    NOT_FOUND,
    INTERNAL_SERVER_ERROR,
} from '@utils/http-errors';
import { genPaginationRequest } from '@utils/helpers';

export class ActivityDao {
    static async create({ key, name, description }, transaction) {
        const existedActivity = await ActivityModel.findOne({
            where: { key, deleted_at: null },
        });

        if (existedActivity) {
            throw PRECONDITION_FAILED('活动已存在');
        }

        const activity = new ActivityModel({ key, name, description });
        const savedActivity = await activity.save({ transaction });

        if (!savedActivity) {
            throw INTERNAL_SERVER_ERROR('创建活动失败');
        }

        return savedActivity;
    }

    static async search({ key }) {
        const whereQuery = {
            deleted_at: null,
        };
        if (key) {
            whereQuery.key = key;
        }
        const activity = await ActivityModel.findOne({
            where: whereQuery,
        });

        if (!activity) {
            throw NOT_FOUND('活动不存在');
        }

        return activity;
    }

    static async delete({ key }) {
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
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        const pagination = genPaginationRequest(pageNum, pageSize);
        const result = await ActivityModel.findAndCountAll({
            where: { deleted_at: null },
            limit: pagination.limit,
            offset: pagination.offset,
            order: [['id', 'DESC']],
        });

        if (!result) {
            throw INTERNAL_SERVER_ERROR('查询活动列表失败');
        }

        return {
            page: {
                count: pageNum,
                size: pageSize,
                total: result.length,
            },
            data: result.rows,
        };
    }
}
