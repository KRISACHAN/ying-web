import Router from 'koa-router';
import httpStatus from 'http-status';
import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import { BAD_REQUEST } from '@utils/http-errors';
import { sequelize } from '@services/db';

const router = new Router({
    prefix: '/api/v1/lucky-number',
});

router.post('/draw', async ctx => {
    const { key, userName } = ctx.request.body;

    if (!key || !userName) {
        throw BAD_REQUEST('活动 key 和用户信息是必需的');
    }

    const transaction = await sequelize.transaction();
    const activity = await ActivityDao.search({ key });
    if (!activity) {
        throw BAD_REQUEST('活动不存在');
    }

    const existingParticipation = await UserParticipationDao.findParticipation(
        activity.id,
        userName,
    );

    if (existingParticipation) {
        throw BAD_REQUEST('用户已参与过此活动');
    }

    const numberEntry = await NumberPoolDao.findAvailableNumber(activity.id, {
        transaction,
    });
    if (!numberEntry) {
        throw BAD_REQUEST('号码池已空');
    }

    await NumberPoolDao.markNumberAsDrawn(numberEntry, { transaction });

    await UserParticipationDao.createUserParticipation(
        {
            activity_id: activity.id,
            user_name: userName,
            drawn_number: numberEntry.number,
        },
        { transaction },
    );

    await transaction.commit();

    ctx.response.status = httpStatus.OK;
    ctx.body = { drawnNumber: numberEntry.number };
});

router.get('/query/:key', async ctx => {
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

export default router;
