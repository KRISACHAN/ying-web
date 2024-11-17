import { RolePermissionsModel } from '@models/admin/role-permissions';
import { PRECONDITION_FAILED, INTERNAL_SERVER_ERROR } from '@utils/http-errors';

export class RolePermissionsDao {
    static async create({ roleId, permissionId }) {
        const whereQuery = {
            deleted_at: null,
        };
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
    }

    static async updateByRole({ roleId, permissionId }) {
        const rolePermission = await RolePermissionsModel.findOne({
            where: { role_id: roleId, deleted_at: null },
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
    }

    static async updateByPermission({ roleId, permissionId }) {
        const rolePermission = await RolePermissionsModel.findOne({
            permission_id: permissionId,
            deleted_at: null,
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
    }

    static async queryByRole(roleId) {
        const rolePermission = await RolePermissionsModel.findAll({
            where: { role_id: roleId, deleted_at: null },
        });

        if (!rolePermission) {
            throw INTERNAL_SERVER_ERROR('获取角色权限失败');
        }

        return rolePermission;
    }

    static async queryByPermission(permissionId) {
        const rolePermission = await RolePermissionsModel.findAll({
            permission_id: permissionId,
            deleted_at: null,
        });

        if (!rolePermission) {
            throw INTERNAL_SERVER_ERROR('获取角色权限失败');
        }

        return rolePermission;
    }

    static async deleteByRole(roleId) {
        const rolePermission = await RolePermissionsModel.deleteMany({
            where: { role_id: roleId, deleted_at: null },
        });

        if (!rolePermission) {
            throw INTERNAL_SERVER_ERROR('删除角色权限失败');
        }

        return true;
    }

    static async deleteByPermission(permissionId) {
        const rolePermission = await RolePermissionsModel.deleteMany({
            permission_id: permissionId,
            deleted_at: null,
        });

        if (!rolePermission) {
            throw INTERNAL_SERVER_ERROR('删除权限关联失败');
        }

        return true;
    }

    static async query({ pageNum = 1, pageSize = 10 }) {
        const result = await RolePermissionsModel.findAndCountAll({
            where: { deleted_at: null },
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            order: [['id', 'DESC']],
        });

        if (!result) {
            throw INTERNAL_SERVER_ERROR('查询角色权限列表失败');
        }

        return {
            page: {
                count: pageNum,
                size: pageSize,
                total: result.count,
            },
            data: result.rows,
        };
    }
}
