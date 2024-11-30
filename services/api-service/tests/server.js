import request from 'supertest';
import Koa from 'koa';
import healthRouter from '../app/api/health.js';

export const createTestServer = () => {
    const app = new Koa();
    app.use(healthRouter.routes());
    return request.agent(app.callback());
}
