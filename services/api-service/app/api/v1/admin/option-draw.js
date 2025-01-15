import { ActivityDao } from '@dao/option-draw/activity';
import { OptionPoolDao } from '@dao/option-draw/option-pool';
import { UserParticipationDao } from '@dao/option-draw/user-participation';
import {
    createEventMiddleware,
    editEventMiddleware,
    watchEventMiddleware,
} from '@middlewares/auths/permission';
import {
    cancelParticipationValidatorMiddleware,
    createOptionDrawValidatorMiddleware,
    optionDrawKeyValidatorMiddleware,
    queryOptionDrawValidatorMiddleware,
} from '@middlewares/validators/option-draw';
import { sequelize } from '@services/db';
import { ERROR_NAMES, OPTION_DRAW_STATUS } from '@utils/constants';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import { eq } from 'lodash';

import router from './router';

router.post(
    '/option-draw/create',
    createEventMiddleware,
    createOptionDrawValidatorMiddleware,
    async ctx => {
        const {
            key,
            name,
            description,
            options,
            participant_limit = 0,
            allow_duplicate_options = false,
        } = ctx.request.body;

        const transaction = await sequelize.transaction();
        try {
            const activity = await ActivityDao.create(
                {
                    key,
                    name,
                    description,
                    participant_limit,
                    allow_duplicate_options,
                    status: OPTION_DRAW_STATUS.NOT_STARTED,
                },
                transaction,
            );

            const optionEntries = options.map(option => ({
                activity_id: activity.id,
                drawn_option: option,
            }));
            await OptionPoolDao.create(optionEntries, transaction);

            await transaction.commit();

            ctx.response.status = httpStatus.CREATED;
            ctx.body = {
                message: '活动创建成功',
                activity_key: activity.key,
            };
        } catch (error) {
            await transaction.rollback();
            if (eq(error.name, ERROR_NAMES.SEQUELIZE_UNIQUE_CONSTRAINT_ERROR)) {
                throw BAD_REQUEST(`活动标识 "${key}" 已被使用，请更换其他标识`);
            }
            throw error;
        }
    },
);

router.get(
    '/option-draw/query/:key',
    watchEventMiddleware,
    optionDrawKeyValidatorMiddleware,
    queryOptionDrawValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        const { page_num = 1, page_size = 10 } = ctx.query;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const result = await UserParticipationDao.query({
            page_num: parseInt(page_num, 10),
            page_size: parseInt(page_size, 10),
            activity_id: activity.id,
        });

        ctx.response.status = httpStatus.OK;
        ctx.set('x-pagination', JSON.stringify(result.pagination));
        ctx.body = result.data;
    },
);

router.get('/option-draw/info/:key', async ctx => {
    const { key } = ctx.params;

    const activity = await ActivityDao.search({ key });
    if (!activity) {
        throw BAD_REQUEST('活动不存在');
    }

    const count = await OptionPoolDao.getCount(activity.id);
    const options = await OptionPoolDao.getOptionsByActivityId(activity.id);

    ctx.response.status = httpStatus.OK;
    ctx.body = {
        id: activity.id,
        activity_key: activity.key,
        name: activity.name,
        description: activity.description,
        participant_limit: activity.participant_limit,
        allow_duplicate_options: activity.allow_duplicate_options,
        status: activity.status,
        count,
        options: options.map(option => option.drawn_option),
    };
});

router.delete(
    '/option-draw/delete/:key',
    editEventMiddleware,
    optionDrawKeyValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        await ActivityDao.delete({ key });
        ctx.response.status = httpStatus.OK;
        ctx.body = {
            message: '活动删除成功',
        };
    },
);

router.put(
    '/option-draw/cancel-participation',
    editEventMiddleware,
    cancelParticipationValidatorMiddleware,
    async ctx => {
        const { key, username } = ctx.request.body;

        const transaction = await sequelize.transaction();

        try {
            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            const participation = await UserParticipationDao.search({
                activity_id: activity.id,
                username,
            });

            if (!participation) {
                throw BAD_REQUEST('未找到参与记录');
            }

            const drawnOption = participation.drawn_option;

            await UserParticipationDao.delete(participation.id, transaction);

            await transaction.commit();

            ctx.response.status = httpStatus.OK;
            ctx.body = {
                message: '参与记录已取消',
                username: username,
                drawn_option: drawnOption,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
);

router.get('/option-draw/list', watchEventMiddleware, async ctx => {
    const { page_num = 1, page_size = 10 } = ctx.query;

    const result = await ActivityDao.query({
        page_num: parseInt(page_num, 10),
        page_size: parseInt(page_size, 10),
    });

    ctx.response.status = httpStatus.OK;
    ctx.set('x-pagination', JSON.stringify(result.pagination));
    ctx.body = result.data;
});

router.put('/option-draw/update-status', editEventMiddleware, async ctx => {
    const { key, status } = ctx.request.body;

    if (
        ![
            OPTION_DRAW_STATUS.NOT_STARTED,
            OPTION_DRAW_STATUS.ONGOING,
            OPTION_DRAW_STATUS.ENDED,
        ].includes(status)
    ) {
        throw BAD_REQUEST('无效的活动状态');
    }

    const activity = await ActivityDao.updateStatus({ key, status });

    ctx.response.status = httpStatus.OK;
    ctx.body = {
        message: '活动状态更新成功',
        activity_key: key,
        new_status: activity.status,
    };
});

export default router;
