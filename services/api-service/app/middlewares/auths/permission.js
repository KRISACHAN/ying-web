import { ADMIN_PERMISSIONS, ERROR_NAMES } from '@utils/constants';
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
            process.env.ADMIN_ACCESS_SECRET_KEY,
        );
        scopes = tokenData.scopes;
    } catch (error) {
        if (error.name === ERROR_NAMES.TOKEN_EXPIRED_ERROR) {
            throw UNAUTHORIZED('token已过期，请重新登录');
        }
        throw FORBIDDEN(error.message || '权限不足');
    }

    if (
        !scopes.includes(permission) &&
        !scopes.includes(ADMIN_PERMISSIONS.ALL_ACCESSES)
    ) {
        throw FORBIDDEN('权限不足');
    }

    await next();
};

export const allAccessesMiddleware = eventHandler(
    ADMIN_PERMISSIONS.ALL_ACCESSES,
);
export const ossUploadMiddleware = eventHandler(ADMIN_PERMISSIONS.OSS_UPLOAD);
export const createAdminMiddleware = eventHandler(
    ADMIN_PERMISSIONS.CREATE_ADMIN,
);
export const editAdminMiddleware = eventHandler(ADMIN_PERMISSIONS.EDIT_ADMIN);
export const deleteAdminMiddleware = eventHandler(
    ADMIN_PERMISSIONS.DELETE_ADMIN,
);
export const watchAdminMiddleware = eventHandler(ADMIN_PERMISSIONS.WATCH_ADMIN);
export const createRoleMiddleware = eventHandler(ADMIN_PERMISSIONS.CREATE_ROLE);
export const editRoleMiddleware = eventHandler(ADMIN_PERMISSIONS.EDIT_ROLE);
export const deleteRoleMiddleware = eventHandler(ADMIN_PERMISSIONS.DELETE_ROLE);
export const watchRoleMiddleware = eventHandler(ADMIN_PERMISSIONS.WATCH_ROLE);
export const createPermissionMiddleware = eventHandler(
    ADMIN_PERMISSIONS.CREATE_PERMISSION,
);
export const editPermissionMiddleware = eventHandler(
    ADMIN_PERMISSIONS.EDIT_PERMISSION,
);
export const deletePermissionMiddleware = eventHandler(
    ADMIN_PERMISSIONS.DELETE_PERMISSION,
);
export const watchPermissionMiddleware = eventHandler(
    ADMIN_PERMISSIONS.WATCH_PERMISSION,
);
export const createEventMiddleware = eventHandler(
    ADMIN_PERMISSIONS.CREATE_EVENT,
);
export const editEventMiddleware = eventHandler(ADMIN_PERMISSIONS.EDIT_EVENT);
export const deleteEventMiddleware = eventHandler(
    ADMIN_PERMISSIONS.DELETE_EVENT,
);
export const watchEventMiddleware = eventHandler(ADMIN_PERMISSIONS.WATCH_EVENT);
