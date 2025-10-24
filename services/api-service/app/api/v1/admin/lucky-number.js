import {
    createEventMiddleware,
    editEventMiddleware,
    watchEventMiddleware,
} from '@middlewares/auths/permission';
import {
    cancelParticipatedLuckyNumberValidatorMiddleware,
    createLuckyNumberValidatorMiddleware,
    luckyNumberKeyValidatorMiddleware,
    queryLuckyNumberValidatorMiddleware,
} from '@middlewares/validators/lucky-number';
import { luckyNumberActivityService } from '@services/lucky-number/activity.service';
import { ERROR_NAMES } from '@utils/constants';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import { eq } from 'lodash';

import router from './router';

router.post(
    '/lucky-number/create',
    createEventMiddleware,
    createLuckyNumberValidatorMiddleware,
    async ctx => {
        const {
            key,
            name,
            description,
            numbers,
            participant_limit = 0,
        } = ctx.request.body;

        try {
            const activity = await luckyNumberActivityService.createActivity({
                key,
                name,
                description,
                numbers,
                participantLimit: participant_limit,
            });

            ctx.response.status = httpStatus.CREATED;
            ctx.body = {
                message: '活动创建成功',
                activity_key: activity.key,
            };
        } catch (error) {
            if (eq(error.name, ERROR_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR)) {
                throw BAD_REQUEST(`活动标识 "${key}" 已被使用，请更换其他标识`);
            }
            throw error;
        }
    },
);

router.get(
    '/lucky-number/query/:key',
    watchEventMiddleware,
    luckyNumberKeyValidatorMiddleware,
    queryLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        const { page_num = 1, page_size = 10 } = ctx.query;

        const result =
            await luckyNumberActivityService.getActivityParticipations(key, {
                pageNum: parseInt(page_num, 10),
                pageSize: parseInt(page_size, 10),
            });

        ctx.response.status = httpStatus.OK;
        ctx.set('x-pagination', JSON.stringify(result.pagination));
        ctx.body = result.data;
    },
);

router.get('/lucky-number/info/:key', async ctx => {
    const { key } = ctx.params;

    const activityInfo = await luckyNumberActivityService.getActivityInfo(key);

    ctx.response.status = httpStatus.OK;
    ctx.body = activityInfo;
});

router.delete(
    '/lucky-number/delete/:key',
    editEventMiddleware,
    luckyNumberKeyValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        await luckyNumberActivityService.deleteActivity(key);
        ctx.response.status = httpStatus.OK;
        ctx.body = {
            message: '活动删除成功',
        };
    },
);

router.put(
    '/lucky-number/cancel-participation',
    editEventMiddleware,
    cancelParticipatedLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key, username } = ctx.request.body;

        const result = await luckyNumberActivityService.cancelParticipation(
            key,
            username,
        );

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            message: '参与记录已取消',
            username: result.username,
            drawn_number: result.drawn_number,
        };
    },
);

router.get('/lucky-number/list', watchEventMiddleware, async ctx => {
    const { page_num = 1, page_size = 10 } = ctx.query;

    const result = await luckyNumberActivityService.getActivityList(
        {
            pageNum: parseInt(page_num, 10),
            pageSize: parseInt(page_size, 10),
        },
        ctx,
    );

    ctx.response.status = httpStatus.OK;
    ctx.set('x-pagination', JSON.stringify(result.pagination));
    ctx.body = result.data;
});

router.put('/lucky-number/update-status', editEventMiddleware, async ctx => {
    const { key, status } = ctx.request.body;

    const activity = await luckyNumberActivityService.updateActivityStatus(
        key,
        status,
    );

    ctx.response.status = httpStatus.OK;
    ctx.body = {
        message: '活动状态更新成功',
        activity_key: key,
        new_status: activity.status,
    };
});

export default router;
