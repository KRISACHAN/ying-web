import { ActivityDao } from '@dao/lucky-number/activity';
import { NumberPoolDao } from '@dao/lucky-number/number-pool';
import { UserParticipationDao } from '@dao/lucky-number/user-participation';
import { sequelize } from '@services/db';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import Router from 'koa-router';

const router = new Router({
    prefix: '/api/v1/lucky-number',
});

router.post('/draw', async ctx => {
    const { key, user_name } = ctx.request.body;

    if (!key || !user_name) {
        throw BAD_REQUEST('活动 key 和用户信息是必需的');
    }

    const transaction = await sequelize.transaction();
    const activity = await ActivityDao.search({ key });
    if (!activity) {
        throw BAD_REQUEST('活动不存在');
    }

    const existingParticipation = await UserParticipationDao.findParticipation({
        activity_id: activity.id,
        user_name,
    });

    if (existingParticipation) {
        throw BAD_REQUEST('用户已参与过此活动，请勿重复抽取');
    }

    const numberEntry = await NumberPoolDao.findAvailableNumber(activity.id);
    if (!numberEntry) {
        throw BAD_REQUEST('号码池已空');
    }

    await NumberPoolDao.markNumberAsDrawn(numberEntry, user_name, transaction);

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
    ctx.body = { drawn_number: numberEntry.drawn_number };
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
        activity_key: activity.key,
        name: activity.name,
        description: activity.description,
        numbers: numberPool.map(entry => ({
            drawn_number: entry.drawn_number,
            is_drawn: entry.is_drawn,
            user_name: entry.lucky_number_user_participation
                ? entry.lucky_number_user_participation.user_name
                : null,
        })),
    };
});

export default router;
