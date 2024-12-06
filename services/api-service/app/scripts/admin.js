import { AdminModel } from '@models/admin/admin';
import { AdminRoleModel } from '@models/admin/admin-role';
import { PermissionsModel } from '@models/admin/permissions';
import { RoleModel } from '@models/admin/role';
import { RolePermissionsModel } from '@models/admin/role-permissions';
import { ADMIN_MEMBER_ROLES, ADMIN_PERMISSIONS } from '@utils/constants';
import log from '@utils/log';
import { eq } from 'lodash';

const createAdmin = async () => {
    try {
        const admin = await AdminModel.create({
            username: process.env.INITED_ADMIN_USERNAME,
            password: process.env.INITED_ADMIN_PASSWORD,
            email: process.env.INITED_ADMIN_EMAIL,
            status: true,
        });

        const permissions = Object.values(ADMIN_PERMISSIONS);

        const permissionRecords =
            (await Promise.all(
                permissions.map(name => PermissionsModel.create({ name })),
            )) ?? [];

        const roles = Object.values(ADMIN_MEMBER_ROLES);
        const roleRecords =
            (await Promise.all(
                roles.map(name => RoleModel.create({ name })),
            )) ?? [];

        await AdminRoleModel.create({
            admin_id: admin.id,
            role_id: roleRecords.find(role =>
                eq(role.name, ADMIN_MEMBER_ROLES.ADMIN),
            )?.id,
        });

        const adminRoleId = roleRecords.find(role =>
            eq(role.name, ADMIN_MEMBER_ROLES.ADMIN),
        )?.id;
        const allAccessPermissionId = permissionRecords.find(perm =>
            eq(perm.name, ADMIN_PERMISSIONS.ALL_ACCESSES),
        )?.id;

        await RolePermissionsModel.create({
            role_id: adminRoleId,
            permission_id: allAccessPermissionId,
        });

        log.verbose(
            '         Admin, role, permissions, admin-role and role-permissions initialized successfully.',
        );
    } catch (error) {
        log.error('         Error initializing admin data:', error);
    }
};

export default {
    createAdmin,
};
