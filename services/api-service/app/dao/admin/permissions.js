import { PermissionsModel } from '@models/admin/permissions';
import {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
} from '@utils/http-errors';
import log from '@utils/log';

export class PermissionsDao {
    static async create({ name, description }) {
        try {
            const existedPermission = await PermissionsModel.findOne({
                where: { name },
            });

            if (existedPermission) {
                throw PRECONDITION_FAILED('权限已存在');
            }

            const permission = new PermissionsModel({ name, description });
            const savedPermission = await permission.save();

            if (!savedPermission) {
                INTERNAL_SERVER_ERROR('创建权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async search({ id, name }) {
        try {
            const whereQuery = {};
            if (name) {
                whereQuery.name = name;
            }
            if (id) {
                whereQuery.id = id;
            }
            const permission = await PermissionsModel.scope('df').findOne({
                where: whereQuery,
            });

            if (!permission) {
                throw NOT_FOUND('权限不存在');
            }

            return permission;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async update(id, { name, description }) {
        try {
            const permission = await PermissionsModel.findOne({
                where: { id },
            });

            if (!permission) {
                throw NOT_FOUND('权限不存在');
            }

            if (name) {
                permission.name = name;
            }

            if (description) {
                permission.description = description;
            }

            const updatedPermission = await permission.save();

            if (!updatedPermission) {
                INTERNAL_SERVER_ERROR('更新权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const permission = await PermissionsModel.findOne({
                where: { id },
            });

            if (!permission) {
                throw NOT_FOUND('权限不存在');
            }

            const deletedPermission = await permission.destroy();

            if (!deletedPermission) {
                INTERNAL_SERVER_ERROR('删除权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        try {
            const result = await PermissionsModel.scope('df').findAndCountAll({
                where: {},
                offset: (pageNum - 1) * pageSize,
                limit: pageSize,
                order: [['id', 'DESC']],
            });

            if (!result) {
                INTERNAL_SERVER_ERROR('查询权限列表失败');
            }

            return {
                pagination: {
                    count: pageNum,
                    size: pageSize,
                    total: result.count,
                },
                data: result.rows,
            };
        } catch (error) {
            log.error(error);
            throw error;
        }
    }
}
