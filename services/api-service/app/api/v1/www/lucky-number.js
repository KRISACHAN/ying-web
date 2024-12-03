import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import { sequelize } from '@services/db';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';

import router from './router';

router.post('/lucky-number/draw', async ctx => {
    const { key, user_name } = ctx.request.body;

    if (!key || !user_name) {
        throw BAD_REQUEST('活动 key 和用户信息是必需的');
    }

    const transaction = await sequelize.transaction();

    try {
        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        const existingParticipation =
            await UserParticipationDao.findParticipation({
                activity_id: activity.id,
                user_name,
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
                user_name: user_name,
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
});

router.get('/lucky-number/query/:key', async ctx => {
    const { key } = ctx.params;

    const activity = await ActivityDao.search({ key });
    if (!activity) {
        throw BAD_REQUEST('活动不存在');
    }

    if (activity.status !== 'ongoing') {
        throw BAD_REQUEST('活动未开始或已结束');
    }

    const summary = await UserParticipationDao.getActivitySummary(activity.id);

    ctx.response.status = httpStatus.OK;
    ctx.body = {
        activity_key: activity.key,
        name: activity.name,
        description: activity.description,
        participant_limit: activity.participant_limit,
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
            user_name: p.user_name,
            drawn_at: p.drawn_at,
        })),
    };
});

export default router;
