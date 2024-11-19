import jwt from 'jsonwebtoken';
import parseBearerToken from 'parse-bearer-token';
import { FORBIDDEN, UNAUTHORIZED } from '@utils/http-errors';
import { permissionMap } from '@utils/constants';

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

export const createEventMiddleware = eventHandler(permissionMap.CREATE_EVENT);

export const editEventMiddleware = eventHandler(permissionMap.EDIT_EVENT);

export const watchEventMiddleware = eventHandler(permissionMap.WATCH_EVENT);
