import { authService } from '@services/auth.service';
import { ERROR_NAMES } from '@utils/constants';
import { FORBIDDEN, UNAUTHORIZED } from '@utils/http-errors';
import jwt from 'jsonwebtoken';
import { eq } from 'lodash';
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

    // Use AuthService to verify token and get permission info
    const authResult = await authService.verifyToken(parsedToken);

    ctx.admin = {
        admin: authResult.admin,
        roles: authResult.roles,
        permissions: authResult.permissions,
    };

    ctx.auth = {
        uid,
        scopes,
    };

    await next();
};

export const adminLoginMiddleware = async (ctx, next) => {
    const { email, password } = ctx.request.body;

    // Use AuthService to handle login
    const loginResult = await authService.login(email, password);

    ctx.loginData = loginResult;

    await next();
};
