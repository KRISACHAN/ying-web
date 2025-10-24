import { mkdirPath } from '@utils/helpers';
import log from '@utils/log';
import dayjs from 'dayjs';
import logger from 'koa-logger';
import ratelimit from 'koa-ratelimit';
import Router from 'koa-router';
import path from 'path';
import requireDirectory from 'require-directory';

export const initLoadRouters = app => {
    const apiDirectory = path.join(__dirname, '../api');
    requireDirectory(module, apiDirectory, {
        visit: obj => {
            if (obj.default instanceof Router) {
                app.use(obj.default.routes());
            }
        },
    });
};

export const initRatelimit = app => {
    // Rate limiter middleware for koa.
    // https://github.com/koajs/ratelimit

    const db = new Map();

    // Basic rate limiting configuration
    const baseRateLimit = ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: 'Sometimes You Just Have to Slow Down.',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 100,
        disableHeader: false,
    });

    // Login endpoint rate limiting (stricter)
    const loginRateLimit = ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: '登录尝试过于频繁，请稍后再试',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 5, // 5次/分钟
        disableHeader: false,
    });

    // Query endpoint rate limiting (more lenient)
    const queryRateLimit = ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: '查询请求过于频繁，请稍后再试',
        id: ctx => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 200, // 200次/分钟
        disableHeader: false,
    });

    // Apply different rate limiting strategies based on path
    app.use(async (ctx, next) => {
        const path = ctx.path;

        // Login-related endpoints use strict rate limiting
        if (path.includes('/login') || path.includes('/auth')) {
            return await loginRateLimit(ctx, next);
        }

        // Query endpoints use lenient rate limiting
        if (
            ctx.method === 'GET' &&
            (path.includes('/query') ||
                path.includes('/list') ||
                path.includes('/info'))
        ) {
            return await queryRateLimit(ctx, next);
        }

        // Other endpoints use basic rate limiting
        return await baseRateLimit(ctx, next);
    });
};

export const initLogger = app => {
    mkdirPath('logs');
    app.use(
        logger((_, args) => {
            const [, method, url, status, time, length] = args;
            const date = dayjs().format('YYYY-MM-DD HH:mm:ss');
            const fileContent = `${method} ${url}${status ? ` ${status}` : ''}${
                time ? ` ${time}` : ''
            }${length ? ` ${length}` : ''} ${date}`;
            log.verbose(fileContent);
        }),
    );
};
