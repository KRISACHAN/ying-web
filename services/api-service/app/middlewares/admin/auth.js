import jwt from 'jsonwebtoken';
import parseBearerToken from 'parse-bearer-token';
import { pick } from 'lodash';
import { AdminDao } from '@dao/admin/admin';
import { RoleDao } from '@dao/admin/role';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { RolePermissionsDao } from '@dao/admin/role-permissions';
import { PermissionsDao } from '@dao/admin/permissions';
import {
    FORBIDDEN,
    NOT_FOUND,
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR,
} from '@utils/http-errors';

const adminAuth = async (ctx, next) => {
    const parsedToken = parseBearerToken(ctx.request);
    if (!parsedToken) {
        throw UNAUTHORIZED('未登录，请先登录');
    }

    let uid;
    let scopes;
    try {
        const tokenData = jwt.verify(
            parsedToken,
            process.env.JWT_ACCESS_SECRET_KEY,
        );
        uid = tokenData.uid;
        scopes = tokenData.scopes;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw UNAUTHORIZED('token已过期，请重新登录');
        }
        throw FORBIDDEN(error.message || '权限不足');
    }

    const admin = await AdminDao.search({ id: uid });
    if (!admin || !admin.status) {
        throw NOT_FOUND('管理员不存在');
    }

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

    const hasPermission = permissions.some(permission =>
        scopes.includes(permission.id),
    );
    if (!hasPermission) {
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

export default adminAuth;
