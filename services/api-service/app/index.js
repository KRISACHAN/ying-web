import cors from '@koa/cors';
import auditLogMiddleware from '@middlewares/audit-log';
import cacheMiddleware from '@middlewares/cache';
import catchErrorMiddleware from '@middlewares/exception';
import performanceMiddleware, {
    dbQueryCounterMiddleware,
} from '@middlewares/performance';
import securityHeadersMiddleware from '@middlewares/security-headers';
import { getIP } from '@utils/helpers';
import { initLoadRouters, initLogger, initRatelimit } from '@utils/init';
import log from '@utils/log';
import Koa from 'koa';
import bodyParser from 'koa-body';

import './env';

const app = new Koa();

app.proxy = true;

app.use(
    cors({
        // x-pagination is used to return pagination information
        exposeHeaders: ['x-pagination'],
        origin: ctx => {
            const requestOrigin = ctx.request.header.origin;

            if (process.env.APP_ENV === 'dev') {
                return '*';
            }

            if (
                requestOrigin &&
                requestOrigin.match(
                    /^https:\/\/([a-zA-Z0-9-]+\.)?krissarea\.com$/,
                )
            ) {
                return requestOrigin;
            }

            return false;
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
        maxAge: 86400,
    }),
);
app.use(catchErrorMiddleware);
app.use(cacheMiddleware);
app.use(dbQueryCounterMiddleware);
app.use(performanceMiddleware);
app.use(securityHeadersMiddleware);
app.use(auditLogMiddleware);
const parseBody = bodyParser({
    strict: false,
    multipart: true,
    formLimit: '10mb',
    jsonLimit: '10mb',
    textLimit: '10mb',
});
app.use((ctx, next) => {
    const numberDataImport =
        ctx.method === 'POST' &&
        /^\/v1\/admin\/lucky-number\/[^/]+\/number-data\/import\/(preview|commit)\/?$/i.test(
            ctx.path,
        );
    const numberDataEdit =
        ctx.method === 'PUT' &&
        /^\/v1\/admin\/lucky-number\/[^/]+\/participations\/[^/]+\/number-data\/?$/i.test(
            ctx.path,
        );
    if (numberDataImport || numberDataEdit) return next();
    return parseBody(ctx, next);
});

initRatelimit(app);
initLogger(app);
initLoadRouters(app);

app.listen(process.env.PORT, () => {
    log.verbose('        App running at:');
    log.verbose(`        - Local: http://localhost:${process.env.PORT}`);
    log.verbose(`        - Network: ${getIP()}:${process.env.PORT}`);
});

export default app;
