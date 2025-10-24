import { AdminModel, PermissionsModel, RoleModel } from '@models/admin/index';
import log from '@utils/log';
import { flatten, pick } from 'lodash';

/**
 * 一次性获取管理员的所有权限信息（优化 N+1 查询）
 * @param {number} adminId - 管理员ID
 * @returns {Object} 包含管理员信息、角色和权限的对象
 */
export async function fetchAdminPermissions(adminId) {
    try {
        // Use association query to fetch all data in one go
        const admin = await AdminModel.findOne({
            where: { id: adminId },
            include: [
                {
                    model: RoleModel,
                    as: 'Roles',
                    include: [
                        {
                            model: PermissionsModel,
                            as: 'Permissions',
                        },
                    ],
                },
            ],
        });

        if (!admin) {
            return null;
        }

        // Extract all permissions (deduplicate)
        const allPermissions = flatten(
            admin.Roles.map(role => role.Permissions),
        );
        const uniquePermissions = allPermissions.filter(
            (permission, index, self) =>
                index === self.findIndex(p => p.id === permission.id),
        );

        // Format return data
        return {
            admin: pick(admin, ['id', 'username', 'email']),
            roles: admin.Roles.map(role =>
                pick(role, ['id', 'name', 'description']),
            ),
            permissions: uniquePermissions.map(permission =>
                pick(permission, ['id', 'name', 'description']),
            ),
            permissionNames: uniquePermissions.map(
                permission => permission.name,
            ),
        };
    } catch (error) {
        log.error('获取管理员权限失败:', error);
        throw error;
    }
}

/**
 * 检查管理员是否拥有指定权限
 * @param {number} adminId - 管理员ID
 * @param {string} requiredPermission - 需要的权限名称
 * @returns {boolean} 是否拥有权限
 */
export async function checkAdminPermission(adminId, requiredPermission) {
    try {
        const adminData = await fetchAdminPermissions(adminId);
        if (!adminData) {
            return false;
        }

        return (
            adminData.permissionNames.includes(requiredPermission) ||
            adminData.permissionNames.includes('all_accesses')
        );
    } catch (error) {
        log.error('检查管理员权限失败:', error);
        return false;
    }
}
