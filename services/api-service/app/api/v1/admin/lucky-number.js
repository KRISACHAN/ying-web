import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import {
    createEventMiddleware,
    editEventMiddleware,
    watchEventMiddleware,
} from '@middlewares/auths/permission';
import {
    cancelParticipatedLuckyNumberValidatorMiddleware,
    createLuckyNumberValidatorMiddleware,
    deleteLuckyNumberValidatorMiddleware,
    queryLuckyNumberValidatorMiddleware,
} from '@middlewares/validators/lucky-number';
import { sequelize } from '@services/db';
import { ERROR_NAMES, LUCKY_NUMBER_STATUS } from '@utils/constants';
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

        const transaction = await sequelize.transaction();
        try {
            const activity = await ActivityDao.create(
                {
                    key,
                    name,
                    description,
                    participant_limit,
                    status: LUCKY_NUMBER_STATUS.NOT_STARTED,
                },
                transaction,
            );
            const numberPoolEntries = numbers.map(number => ({
                activity_id: activity.id,
                drawn_number: number,
            }));
            await NumberPoolDao.createNumberPoolEntries(
                numberPoolEntries,
                transaction,
            );

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
    '/lucky-number/query/:key',
    watchEventMiddleware,
    queryLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const summary = await UserParticipationDao.getActivitySummary(
            activity.id,
        );

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            id: activity.id,
            activity_key: activity.key,
            name: activity.name,
            description: activity.description,
            participant_limit: activity.participant_limit,
            status: activity.status,
            participations: summary.participations,
            statistics: {
                ...summary.statistics,
                remaining_slots:
                    activity.participant_limit > 0
                        ? activity.participant_limit -
                          summary.statistics.total_participants
                        : null,
            },
            numbers: summary.participations.map(p => ({
                drawn_number: p.drawn_number,
                username: p.username,
                drawn_at: p.drawn_at,
            })),
        };
    },
);

router.delete(
    '/lucky-number/delete/:key',
    editEventMiddleware,
    deleteLuckyNumberValidatorMiddleware,
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
    '/lucky-number/cancel-participation',
    editEventMiddleware,
    cancelParticipatedLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key, username } = ctx.request.body;

        const transaction = await sequelize.transaction();

        try {
            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            const participation = await UserParticipationDao.findParticipation({
                activity_id: activity.id,
                username,
            });

            if (!participation) {
                throw BAD_REQUEST('未找到参与记录');
            }

            const drawnNumber = participation.drawn_number;

            await UserParticipationDao.deleteParticipation(
                participation.id,
                transaction,
            );

            await transaction.commit();

            ctx.response.status = httpStatus.OK;
            ctx.body = {
                message: '参与记录已取消',
                username: username,
                drawn_number: drawnNumber,
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
);

router.get('/lucky-number/list', watchEventMiddleware, async ctx => {
    const { page_num = 1, page_size = 10 } = ctx.query;

    const result = await ActivityDao.query({
        page_num: parseInt(page_num, 10),
        page_size: parseInt(page_size, 10),
    });

    ctx.response.status = httpStatus.OK;
    ctx.set('x-pagination', JSON.stringify(result.page));
    ctx.body = result.data;
});

router.put('/lucky-number/update-status', editEventMiddleware, async ctx => {
    const { key, status } = ctx.request.body;

    if (
        ![
            LUCKY_NUMBER_STATUS.NOT_STARTED,
            LUCKY_NUMBER_STATUS.ONGOING,
            LUCKY_NUMBER_STATUS.ENDED,
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
