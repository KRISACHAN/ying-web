import Router from 'koa-router';
import { get } from 'lodash';
import { ossService } from '@services/oss';
import { resolve } from '@utils/resolve';
import { getRandomInt } from '@utils/helpers';

const router = new Router({
    prefix: '/api/v1/promises',
});

// @TODO: 完善接口健壮性
router.get('/', async ctx => {
    const res = await ossService.fetchList({
        prefix: `${process.env.OSS_STORE_KEY}/promises/`,
        delimiter: '/',
    });
    ctx.body = resolve.json(res);
});

// @TODO: 完善接口健壮性
router.get('/:id(\\d+)', async ctx => {
    const prefix = `static/promises/${ctx.params.id}_`;
    const objRes = await ossService.fetchList({
        prefix,
        delimiter: '/',
    });
    const name = `${prefix}${objRes[0].name}`;
    const res = await ossService.getContent(name);
    const content = get(res, 'content', '');
    const data = JSON.parse(content.toString())
        .filter(item => !!item)
        .map(item => item.trim());
    ctx.body = resolve.json(data);
});

// @TODO: 完善接口健壮性
router.get('/result', async ctx => {
    const prefix = 'static/promises/';
    const dataGroup = await ossService.fetchList({
        prefix,
        delimiter: '/',
    });
    const groupIndex = getRandomInt(0, (dataGroup || []).length - 1);
    const currentItem = dataGroup[groupIndex];
    const name = `${prefix}${currentItem.name}`;
    const res = await ossService.getContent(name);
    const content = get(res, 'content', '');
    const data = JSON.parse(content.toString())
        .filter(item => !!item)
        .map(item => item.trim());
    const dataIndex = getRandomInt(0, (data || []).length - 1);
    ctx.body = resolve.json(data[dataIndex]);
});

export default router;
