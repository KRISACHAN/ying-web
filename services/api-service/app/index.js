import cors from '@koa/cors';
import cacheMiddleware from '@middlewares/cache';
import catchErrorMiddleware from '@middlewares/exception';
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
    }),
);
app.use(catchErrorMiddleware);
app.use(cacheMiddleware);
app.use(
    bodyParser({
        strict: false,
        multipart: true,
    }),
);
initRatelimit(app);
initLogger(app);
initLoadRouters(app);

app.listen(process.env.PORT, () => {
    log.verbose('        App running at:');
    log.verbose(`        - Local: http://localhost:${process.env.PORT}`);
    log.verbose(`        - Netword: ${getIP()}:${process.env.PORT}`);
});

export default app;
