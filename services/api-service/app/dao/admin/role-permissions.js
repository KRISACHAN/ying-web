import { RolePermissionsModel } from '@models/admin/role-permissions';
import { INTERNAL_SERVER_ERROR, PRECONDITION_FAILED } from '@utils/http-errors';
import log from '@utils/log';

export class RolePermissionsDao {
    static async create({ roleId, permissionId }) {
        try {
            const whereQuery = {};
            if (roleId) {
                whereQuery.role_id = roleId;
            }
            if (permissionId) {
                whereQuery.permission_id = permissionId;
            }
            const existedRolePermission = await RolePermissionsModel.findOne({
                where: whereQuery,
            });
            if (existedRolePermission) {
                throw PRECONDITION_FAILED('角色权限关联已存在');
            }
            const rolePermission = new RolePermissionsModel({
                role_id: roleId,
                permission_id: permissionId,
            });
            const result = await rolePermission.save();

            if (!result) {
                throw INTERNAL_SERVER_ERROR('角色权限创建失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async updateBoundPermission({ roleId, permissionId }) {
        try {
            const rolePermission = await RolePermissionsModel.findOne({
                where: { role_id: roleId },
            });
            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('角色权限不存在');
            }

            if (permissionId) {
                rolePermission.permission_id = permissionId;
            }

            const updatedRolePermission = await rolePermission.save();

            if (!updatedRolePermission) {
                throw INTERNAL_SERVER_ERROR('更新角色权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async updateBoundRole({ roleId, permissionId }) {
        try {
            const rolePermission = await RolePermissionsModel.findOne({
                permission_id: permissionId,
            });
            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('权限所属的角色不存在');
            }

            if (roleId) {
                rolePermission.role_id = roleId;
            }

            const updatedRolePermission = await rolePermission.save();

            if (!updatedRolePermission) {
                throw INTERNAL_SERVER_ERROR('更新角色权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async queryByRole(roleId) {
        try {
            const rolePermission = await RolePermissionsModel.scope(
                'df',
            ).findAll({
                where: { role_id: roleId },
            });

            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('获取角色权限失败');
            }

            return rolePermission;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async queryByPermission(permissionId) {
        try {
            const rolePermission = await RolePermissionsModel.scope(
                'df',
            ).findAll({
                permission_id: permissionId,
            });

            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('获取角色权限失败');
            }

            return rolePermission;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async deleteByRole(roleId) {
        try {
            const rolePermission = await RolePermissionsModel.deleteMany({
                where: { role_id: roleId },
            });

            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('删除角色权限失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async deleteByPermission(permissionId) {
        try {
            const rolePermission = await RolePermissionsModel.deleteMany({
                permission_id: permissionId,
            });

            if (!rolePermission) {
                throw INTERNAL_SERVER_ERROR('删除权限关联失败');
            }

            return true;
        } catch (error) {
            log.error(error);
            throw error;
        }
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        try {
            const result = await RolePermissionsModel.scope(
                'df',
            ).findAndCountAll({
                where: {},
                offset: (pageNum - 1) * pageSize,
                limit: pageSize,
                order: [['id', 'DESC']],
            });

            if (!result) {
                throw INTERNAL_SERVER_ERROR('查询角色权限列表失败');
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
