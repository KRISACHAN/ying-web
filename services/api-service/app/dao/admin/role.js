import { RoleModel } from '@models/admin/role';
import {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    PRECONDITION_FAILED,
} from '@utils/http-errors';
import log from '@utils/log';

export class RoleDao {
    static async create({ name, description }) {
        try {
            const existedRole = await RoleModel.findOne({
                where: { name, deleted_at: null },
            });

            if (existedRole) {
                throw PRECONDITION_FAILED('角色已存在');
            }

            const role = new RoleModel({ name, description });
            const savedRole = await role.save();

            if (!savedRole) {
                INTERNAL_SERVER_ERROR('创建角色失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async search(id) {
        try {
            const role = await RoleModel.scope('df').findOne({
                where: { id, deleted_at: null },
            });

            if (!role) {
                throw NOT_FOUND('角色不存在');
            }

            return role;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async update(id, { name, description }) {
        try {
            const role = await RoleModel.findOne({
                where: { id, deleted_at: null },
            });

            if (!role) {
                throw NOT_FOUND('角色不存在');
            }

            if (name) {
                role.name = name;
            }

            if (description) {
                role.description = description;
            }

            const updatedRole = await role.save();

            if (!updatedRole) {
                INTERNAL_SERVER_ERROR('更新角色失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async delete(id) {
        try {
            const role = await RoleModel.findOne({
                where: { id, deleted_at: null },
            });

            if (!role) {
                throw NOT_FOUND('角色不存在');
            }

            const deletedRole = await role.destroy();

            if (!deletedRole) {
                INTERNAL_SERVER_ERROR('删除角色失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        try {
            const result = await RoleModel.scope('df').findAndCountAll({
                where: { deleted_at: null },
                offset: (pageNum - 1) * pageSize,
                limit: pageSize,
                order: [['id', 'DESC']],
            });

            if (!result) {
                INTERNAL_SERVER_ERROR('查询角色列表失败');
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
