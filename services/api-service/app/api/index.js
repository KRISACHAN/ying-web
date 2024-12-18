import healthRouter from './health';
import adminRouter from './v1/admin/router';
import wwwRouter from './v1/www/router';

export default app => {
    app.use(healthRouter.routes());
    app.use(healthRouter.allowedMethods());

    app.use(adminRouter.routes());
    app.use(adminRouter.allowedMethods());

    app.use(wwwRouter.routes());
    app.use(wwwRouter.allowedMethods());
};
