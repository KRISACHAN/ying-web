import { pick } from 'lodash';
import { AdminDao } from '@dao/admin/admin';
import { RoleDao } from '@dao/admin/role';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { RolePermissionsDao } from '@dao/admin/role-permissions';
import { PermissionsDao } from '@dao/admin/permissions';
import { generateAccessToken, generateRefreshToken } from '@utils/helpers';
import { UNAUTHORIZED, INTERNAL_SERVER_ERROR } from '@utils/http-errors';

// 登录中间件
const login = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    // 验证账号密码是否正确
    const admin = await AdminDao.verify({ email, password });
    if (!admin) {
        throw UNAUTHORIZED('账号不存在或密码错误');
    }

    const uid = admin.id;

    // 根据 admin 的 id 获取 admin_role 信息
    const adminRoles = await AdminRoleDao.queryByAdmin(uid);
    if (!adminRoles || adminRoles.length === 0) {
        throw INTERNAL_SERVER_ERROR('获取管理员角色失败');
    }

    // 获取角色信息
    const roles = await Promise.all(
        adminRoles.map(role => RoleDao.search(role.role_id)),
    );
    const roleIds = roles.map(role => role.id);

    // 根据角色的 id 获取所有角色权限信息
    const rolePermissions = await Promise.all(
        roleIds.map(roleId => RolePermissionsDao.queryByRole(roleId)),
    );
    const permissionIds = rolePermissions.flat().map(rp => rp.permission_id);

    // 根据所有权限的 id 获取权限信息
    const permissions = await Promise.all(
        permissionIds.map(permissionId => PermissionsDao.search(permissionId)),
    );

    // 生成 Token
    const accessToken = generateAccessToken(admin.id, permissionIds);
    const refreshToken = generateRefreshToken(admin.id, permissionIds);

    ctx.loginData = {
        accessToken,
        refreshToken,
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

export default login;
