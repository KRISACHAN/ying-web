import { AdminDao } from '@dao/admin/admin';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { PermissionsDao } from '@dao/admin/permissions';
import { RoleDao } from '@dao/admin/role';
import { RolePermissionsDao } from '@dao/admin/role-permissions';
import { ERROR_NAMES } from '@utils/constants';
import { generateAccessToken, generateRefreshToken } from '@utils/helpers';
import {
    FORBIDDEN,
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    UNAUTHORIZED,
} from '@utils/http-errors';
import jwt from 'jsonwebtoken';
import { eq, pick } from 'lodash';
import parseBearerToken from 'parse-bearer-token';

export const adminAuthMiddleware = async (ctx, next) => {
    const parsedToken = parseBearerToken(ctx.request);
    if (!parsedToken) {
        throw UNAUTHORIZED('未登录，请先登录');
    }

    let uid;
    let scopes;
    try {
        const tokenData = jwt.verify(
            parsedToken,
            process.env.ADMIN_ACCESS_SECRET_KEY,
        );
        uid = tokenData.uid;
        scopes = tokenData.scopes;
    } catch (error) {
        if (eq(error.name, ERROR_NAMES.TOKEN_EXPIRED_ERROR)) {
            throw UNAUTHORIZED('token 已过期，请重新登录');
        }
        throw FORBIDDEN(error.message || '权限不足');
    }

    const admin = await AdminDao.search({ id: uid });

    if (!admin || !admin.status) {
        throw NOT_FOUND('管理员不存在');
    }

    const adminRoles = await AdminRoleDao.queryByAdmin(uid);
    if (!adminRoles || !Array.isArray(adminRoles) || eq(adminRoles.length, 0)) {
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

    if (!permissionNames.length) {
        throw FORBIDDEN('没有访问权限');
    }

    ctx.admin = {
        admin: pick(admin, ['id', 'username', 'email']),
        roles: roles.map(role => pick(role, ['id', 'name', 'description'])),
        permissions: permissions.map(permission =>
            pick(permission, ['id', 'name', 'description']),
        ),
    };

    ctx.auth = {
        uid,
        scopes,
    };

    await next();
};

export const adminLoginMiddleware = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    const admin = await AdminDao.verify({ email, password });
    if (!admin) {
        throw UNAUTHORIZED('账号不存在或密码错误');
    }

    const uid = admin.id;

    const adminRoles = await AdminRoleDao.queryByAdmin(uid);
    if (!adminRoles || !Array.isArray(adminRoles) || eq(adminRoles.length, 0)) {
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
