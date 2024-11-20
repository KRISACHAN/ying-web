import Router from 'koa-router';

const router = new Router({
    prefix: '',
});

router.all('/health', async ctx => {
    ctx.body = 'hello world';
});

export default router;
