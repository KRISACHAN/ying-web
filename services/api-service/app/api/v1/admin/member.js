import { AdminDao } from '@dao/admin/admin';
import { AdminRoleDao } from '@dao/admin/admin-role';
import { RoleDao } from '@dao/admin/role';
import { RolePermissionsDao } from '@dao/admin/role-permissions';
import {
    adminAuthMiddleware,
    adminLoginMiddleware,
} from '@middlewares/auths/admin';
import { loginValidatorMiddleware } from '@middlewares/validators/admin';
import { hasManageUsersPermission } from '@utils/constants';
import { generateAccessToken, verifyRefreshToken } from '@utils/helpers';
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '@utils/http-errors';
import httpStatus from 'http-status';
import { pick } from 'lodash';

import router from './router';

router.post('/refresh-token', async ctx => {
    const { refreshToken } = ctx.request.body;
    if (!refreshToken) {
        throw UNAUTHORIZED('Refresh Token 不存在');
    }

    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw UNAUTHORIZED(error.message);
    }

    const newAccessToken = generateAccessToken(decoded.uid, decoded.scopes);
    ctx.body = { access_token: newAccessToken };
});

router.post(
    '/login',
    loginValidatorMiddleware,
    adminLoginMiddleware,
    async ctx => {
        ctx.response.status = httpStatus.OK;
        ctx.body = ctx.loginData;
    },
);

router.delete('/:id', adminAuthMiddleware, async ctx => {
    const { permissions } = ctx.admin;

    if (!hasManageUsersPermission(permissions)) {
        throw FORBIDDEN('无权限删除管理员');
    }

    const { id } = ctx.params;
    if (!id) {
        throw BAD_REQUEST('未找到相关管理员');
    }

    const deleted = await AdminDao.delete(id);

    if (!deleted) {
        throw UNAUTHORIZED('删除管理员失败');
    }

    ctx.response.status = httpStatus.NO_CONTENT;
});

router.put('/:id', adminAuthMiddleware, async ctx => {
    const { id } = ctx.params;
    const { email, password, username } = ctx.request.body;
    const { permissions } = ctx.admin;

    if (!hasManageUsersPermission(permissions)) {
        throw FORBIDDEN('无权限修改管理员信息');
    }

    const success = await AdminDao.update(id, {
        email,
        password,
        username,
    });

    if (!success) {
        throw UNAUTHORIZED('更新管理员信息失败');
    }
    ctx.response.status = httpStatus.OK;
    ctx.body = {
        message: '管理员信息更新成功',
    };
});

router.get('/', adminAuthMiddleware, async ctx => {
    const { permissions } = ctx.admin;

    if (!hasManageUsersPermission(permissions)) {
        throw FORBIDDEN('无权限查询管理员列表');
    }

    const { pageNum, pageSize } = ctx.query;
    const result = await AdminDao.query({
        pageNum: parseInt(pageNum, 10) || 1,
        pageSize: parseInt(pageSize, 10) || 10,
    });

    ctx.response.status = httpStatus.OK;
    ctx.set('x-pagination', JSON.stringify(result.pagination));
    ctx.body = result.data;
});

router.get('/:id', adminAuthMiddleware, async ctx => {
    const { id } = ctx.params;
    const currentAdminId = ctx.admin.admin.id;
    const { permissions } = ctx.admin;

    if (!hasManageUsersPermission(permissions) && currentAdminId !== id) {
        throw FORBIDDEN('无权限查看管理员信息');
    }

    const adminInfo = await AdminDao.search({ id });

    const adminRole = await AdminRoleDao.queryByAdmin(id);

    const roleInfo = await RoleDao.search(adminRole.role_id);

    const rolePermissions = await RolePermissionsDao.queryByRole(
        adminRole.role_id,
    );

    const responseData = {
        adminInfo: pick(adminInfo, ['id', 'username', 'email']),
        roleInfo: pick(roleInfo, ['id', 'name', 'description']),
        rolePermissions: rolePermissions.map(permission =>
            pick(permission, ['id', 'name', 'description']),
        ),
    };

    ctx.response.status = httpStatus.OK;
    ctx.body = responseData;
});

export default router;
