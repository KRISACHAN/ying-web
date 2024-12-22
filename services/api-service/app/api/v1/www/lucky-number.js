import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import {
    drawLuckyNumberValidatorMiddleware,
    luckyNumberKeyValidatorMiddleware,
} from '@middlewares/validators/lucky-number';
import { sequelize } from '@services/db';
import { LUCKY_NUMBER_STATUS } from '@utils/constants';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import { eq } from 'lodash';

import router from './router';

router.post(
    '/lucky-number/draw',
    drawLuckyNumberValidatorMiddleware,
    async ctx => {
        const { key, username } = ctx.request.body;

        if (!key || !username) {
            throw BAD_REQUEST('活动 key 和用户信息是必需的');
        }

        const transaction = await sequelize.transaction();

        try {
            const activity = await ActivityDao.search({ key });
            if (!activity) {
                throw BAD_REQUEST('活动不存在');
            }

            if (!eq(activity.status, LUCKY_NUMBER_STATUS.ONGOING)) {
                throw BAD_REQUEST(
                    eq(activity.status, LUCKY_NUMBER_STATUS.NOT_STARTED)
                        ? '活动尚未开始'
                        : '活动已结束',
                );
            }

            const existingParticipation =
                await UserParticipationDao.findParticipation({
                    activity_id: activity.id,
                    username,
                });

            if (existingParticipation) {
                throw BAD_REQUEST('用户已参与过此活动，请勿重复抽取');
            }

            if (activity.participant_limit > 0) {
                const summary = await UserParticipationDao.getActivitySummary(
                    activity.id,
                );
                if (
                    summary.statistics.total_participants >=
                    activity.participant_limit
                ) {
                    throw BAD_REQUEST('活动参与人数已达上限');
                }
            }

            const numberEntry = await NumberPoolDao.findAvailableNumber(
                activity.id,
            );
            if (!numberEntry) {
                throw BAD_REQUEST('号码池已空');
            }

            await UserParticipationDao.createUserParticipation(
                {
                    activity_id: activity.id,
                    username: username,
                    drawn_number: numberEntry.drawn_number,
                },
                transaction,
            );

            await transaction.commit();

            ctx.response.status = httpStatus.OK;
            ctx.body = {
                drawn_number: numberEntry.drawn_number,
                message: '抽取成功',
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
);

router.get(
    '/lucky-number/query/:key',
    luckyNumberKeyValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        const { page_num = 1, page_size = 10 } = ctx.query;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        if (!eq(activity.status, LUCKY_NUMBER_STATUS.ONGOING)) {
            throw BAD_REQUEST('活动未开始或已结束');
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

router.get(
    '/lucky-number/info/:key',
    luckyNumberKeyValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        if (!eq(activity.status, LUCKY_NUMBER_STATUS.ONGOING)) {
            throw BAD_REQUEST('活动未开始或已结束');
        }

        const count = await NumberPoolDao.getCount(activity.id);

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            id: activity.id,
            activity_key: activity.key,
            name: activity.name,
            description: activity.description,
            participant_limit: activity.participant_limit,
            status: activity.status,
            count,
        };
    },
);

export default router;
