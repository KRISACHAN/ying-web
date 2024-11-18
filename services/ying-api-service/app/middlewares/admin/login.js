import { pick } from 'lodash';
import { AdminDao } from '@dao/admin/admin';
import { RoleDao } from '@dao/admin/role';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { RolePermissionsDao } from '@dao/admin/role-permissions';
import { PermissionsDao } from '@dao/admin/permissions';
import { generateAccessToken, generateRefreshToken } from '@utils/helpers';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from '@utils/http-errors';

const adminLogin = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    const admin = await AdminDao.verify({ email, password });
    if (!admin) {
        throw UNAUTHORIZED('账号不存在或密码错误');
    }

    const uid = admin.id;

    const adminRoles = await AdminRoleDao.queryByAdmin(uid);
    if (!adminRoles || adminRoles.length === 0) {
        throw INTERNAL_SERVER_ERROR('获取管理员角色失败');
    }

    const roles = await Promise.all(
        adminRoles.map(role => RoleDao.search(role.role_id)),
    );
    const roleIds = roles.map(role => role.id);

    const rolePermissions = await Promise.all(
        roleIds.map(roleId => RolePermissionsDao.queryByRole(roleId)),
    );
    const permissionIds = rolePermissions.flat().map(rp => rp.permission_id);

    const permissions = await Promise.all(
        permissionIds.map(permissionId => PermissionsDao.search(permissionId)),
    );
    const permissionNames = permissions.map(permission => permission.name);

    const accessToken = generateAccessToken(admin.id, permissionNames);
    const refreshToken = generateRefreshToken(admin.id, permissionNames);

    ctx.loginData = {
        access_token: accessToken,
        refresh_token: refreshToken,
        admin_info: {
            admin: pick(admin, ['id', 'username', 'email']),
            roles: roles.map(role => pick(role, ['id', 'name', 'description'])),
            permissions: permissions.map(permission =>
                pick(permission, ['id', 'name', 'description']),
            ),
        },
    };

    await next();
};

export default adminLogin;
