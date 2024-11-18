import httpStatus from 'http-status';
import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { BAD_REQUEST } from '@utils/http-errors';
import {
    createEventMiddleware,
    watchEventMiddleware,
} from '@app/middlewares/admin/event';
import router from './router';
import log from '@utils/log';

router.post('/lucky-number/create', createEventMiddleware, async ctx => {
    const { key, numbers } = ctx.request.body;
    if (!key || !Array.isArray(numbers)) {
        throw BAD_REQUEST('活动 key 和号码池数据是必需的');
    }

    const activity = await ActivityDao.create({ key });
    const numberPoolEntries = numbers.map(number => ({
        activity_id: activity.id,
        number,
    }));
    await NumberPoolDao.createNumberPoolEntries(numberPoolEntries);

    ctx.response.status = httpStatus.CREATED;
    ctx.body = {
        message: '活动创建成功',
    };
});

router.get('/lucky-number/query/:key', watchEventMiddleware, async ctx => {
    const { key } = ctx.params;

    const activity = await ActivityDao.search({ key });
    if (!activity) {
        throw BAD_REQUEST('活动不存在');
    }

    const numberPool = await NumberPoolDao.findNumbersWithUserByActivity(
        activity.id,
    );

    ctx.response.status = httpStatus.OK;
    ctx.body = {
        activityKey: activity.key,
        numbers: numberPool.map(entry => ({
            number: entry.number,
            is_drawn: entry.is_drawn,
            drawn_by: entry.lucky_number_user_participation
                ? entry.lucky_number_user_participation.user_name
                : null,
        })),
    };
});

router.delete('/lucky-number/delete/:key', watchEventMiddleware, async ctx => {
    const { key } = ctx.params;
    await ActivityDao.delete({ key });
    ctx.response.status = httpStatus.OK;
    ctx.body = {
        message: '活动删除成功',
    };
});

router.get('/lucky-number/list', watchEventMiddleware, async ctx => {
    const { page_num = 1, page_size = 10 } = ctx.query;

    const result = await ActivityDao.query({
        page_num: parseInt(page_num, 10),
        page_size: parseInt(page_size, 10),
    });
    ctx.response.status = httpStatus.OK;
    log.debug(result);
    ctx.set('x-pagination', JSON.stringify(result.page));
    ctx.body = result.data;
});

export default router;
