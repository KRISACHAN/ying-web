import log from '@utils/log';
import createError from 'http-errors';
import httpStatus from 'http-status';
import { eq } from 'lodash';

export const errorType = Object.freeze({
    default: 'default',
    http: 'http',
});

const catchError = async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        const isDev = !eq(process.env.APP_ENV, 'prod');
        const isHttpError = createError.isHttpError(error);

        log.error({
            type: errorType.http,
            name: error.name,
            stack: error.stack,
            message: error.message,
            url: ctx.url,
            path: ctx.path,
            query: ctx.query,
            params: ctx.params,
            method: ctx.method,
        });

        if (!isDev && !isHttpError) {
            ctx.response.status = httpStatus.INTERNAL_SERVER_ERROR;
            ctx.body = {
                message: '未知错误',
            };
            return;
        }

        ctx.status =
            error.statusCode ||
            error.status ||
            httpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = {
            message: error.message,
        };
    }
};

export default catchError;
