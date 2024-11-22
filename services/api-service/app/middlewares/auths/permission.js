import { permissionMap } from '@utils/constants';
import { FORBIDDEN, UNAUTHORIZED } from '@utils/http-errors';
import jwt from 'jsonwebtoken';
import parseBearerToken from 'parse-bearer-token';

const eventHandler = permission => async (ctx, next) => {
    const parsedToken = parseBearerToken(ctx.request);
    if (!parsedToken) {
        throw UNAUTHORIZED('未登录，请先登录');
    }

    let scopes;
    try {
        const tokenData = jwt.verify(
            parsedToken,
            process.env.JWT_ACCESS_SECRET_KEY,
        );
        scopes = tokenData.scopes;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw UNAUTHORIZED('token已过期，请重新登录');
        }
        throw FORBIDDEN(error.message || '权限不足');
    }

    if (
        !scopes.includes(permission) &&
        !scopes.includes(permissionMap.ALL_ACCESSES)
    ) {
        throw FORBIDDEN('权限不足');
    }

    await next();
};

export const allAccessesMiddleware = eventHandler(permissionMap.ALL_ACCESSES);
export const ossUploadMiddleware = eventHandler(permissionMap.OSS_UPLOAD);
export const createAdminMiddleware = eventHandler(permissionMap.CREATE_ADMIN);
export const editAdminMiddleware = eventHandler(permissionMap.EDIT_ADMIN);
export const deleteAdminMiddleware = eventHandler(permissionMap.DELETE_ADMIN);
export const watchAdminMiddleware = eventHandler(permissionMap.WATCH_ADMIN);
export const createRoleMiddleware = eventHandler(permissionMap.CREATE_ROLE);
export const editRoleMiddleware = eventHandler(permissionMap.EDIT_ROLE);
export const deleteRoleMiddleware = eventHandler(permissionMap.DELETE_ROLE);
export const watchRoleMiddleware = eventHandler(permissionMap.WATCH_ROLE);
export const createPermissionMiddleware = eventHandler(
    permissionMap.CREATE_PERMISSION,
);
export const editPermissionMiddleware = eventHandler(
    permissionMap.EDIT_PERMISSION,
);
export const deletePermissionMiddleware = eventHandler(
    permissionMap.DELETE_PERMISSION,
);
export const watchPermissionMiddleware = eventHandler(
    permissionMap.WATCH_PERMISSION,
);
export const createEventMiddleware = eventHandler(permissionMap.CREATE_EVENT);
export const editEventMiddleware = eventHandler(permissionMap.EDIT_EVENT);
export const deleteEventMiddleware = eventHandler(permissionMap.DELETE_EVENT);
export const watchEventMiddleware = eventHandler(permissionMap.WATCH_EVENT);
