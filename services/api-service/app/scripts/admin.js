import { AdminModel } from '@models/admin/admin';
import { PermissionsModel } from '@models/admin/permissions';
import { RoleModel } from '@models/admin/role';
import { AdminRoleModel } from '@models/admin/admin-role';
import { RolePermissionsModel } from '@models/admin/role-permissions';
import log from '@utils/log';

const createAdmin = async () => {
    try {
        const admin = await AdminModel.create({
            username: process.env.INITED_ADMIN_USERNAME,
            password: process.env.INITED_ADMIN_PASSWORD,
            email: process.env.INITED_ADMIN_EMAIL,
            status: true,
        });

        const permissions = [
            'all_accesses',
            'oss_upload',
            'create_admin',
            'edit_admin',
            'delete_admin',
            'watch_admin',
            'create_role',
            'edit_role',
            'delete_role',
            'watch_role',
            'create_permission',
            'edit_permission',
            'delete_permission',
            'watch_permission',
            'create_event',
            'edit_event',
            'delete_event',
            'watch_event',
        ];

        const permissionRecords = await Promise.all(
            permissions.map(name => PermissionsModel.create({ name })),
        );

        const roles = ['admin', 'member'];
        const roleRecords = await Promise.all(
            roles.map(name => RoleModel.create({ name })),
        );

        await AdminRoleModel.create({
            admin_id: admin.id,
            role_id: roleRecords.find(role => role.name === 'admin').id,
        });

        const adminRoleId = roleRecords.find(role => role.name === 'admin').id;
        const allAccessPermissionId = permissionRecords.find(
            perm => perm.name === 'all_accesses',
        ).id;

        await RolePermissionsModel.create({
            role_id: adminRoleId,
            permission_id: allAccessPermissionId,
        });

        log.verbose(
            '         Admin, roles, and permissions initialized successfully.',
        );
    } catch (error) {
        log.error('         Error initializing admin data:', error);
    }
};

export default {
    createAdmin,
};
