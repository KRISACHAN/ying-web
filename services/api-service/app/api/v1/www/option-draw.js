import { ActivityDao } from '@dao/option-draw/activity';
import { OptionPoolDao } from '@dao/option-draw/option-pool';
import { UserParticipationDao } from '@dao/option-draw/user-participation';
import {
    drawOptionValidatorMiddleware,
    optionDrawKeyValidatorMiddleware,
    queryParticipationValidatorMiddleware,
} from '@middlewares/validators/option-draw';
import { sequelize } from '@services/db';
import { OPTION_DRAW_STATUS } from '@utils/constants';
import { BAD_REQUEST } from '@utils/http-errors';
import httpStatus from 'http-status';
import { eq } from 'lodash';

import router from './router';

router.post('/option-draw/draw', drawOptionValidatorMiddleware, async ctx => {
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

        if (!eq(activity.status, OPTION_DRAW_STATUS.ONGOING)) {
            throw BAD_REQUEST(
                eq(activity.status, OPTION_DRAW_STATUS.NOT_STARTED)
                    ? '活动尚未开始'
                    : '活动已结束',
            );
        }

        const existingParticipation = await UserParticipationDao.search({
            activity_id: activity.id,
            username,
        });

        if (existingParticipation && !activity.allow_duplicate_options) {
            throw BAD_REQUEST('用户已参与过此活动，请勿重复抽取');
        }

        if (activity.participant_limit > 0) {
            const count = await UserParticipationDao.getCount(activity.id);
            if (count >= activity.participant_limit) {
                throw BAD_REQUEST('活动参与人数已达上限');
            }
        }

        const option = await OptionPoolDao.search(activity.id);
        if (!option) {
            throw BAD_REQUEST('选项已抽完');
        }

        const participation = await UserParticipationDao.create(
            {
                activity_id: activity.id,
                username,
                drawn_option: option.drawn_option,
            },
            transaction,
        );

        await transaction.commit();

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            activity_id: activity.id,
            activity_key: activity.key,
            drawn_option: option.drawn_option,
            username: participation.username,
            message: '抽选成功',
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
});

router.get(
    '/option-draw/query/:key',
    optionDrawKeyValidatorMiddleware,
    queryParticipationValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;
        const { page_num = 1, page_size = 10 } = ctx.query;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        if (!eq(activity.status, OPTION_DRAW_STATUS.ONGOING)) {
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
    '/option-draw/info/:key',
    optionDrawKeyValidatorMiddleware,
    async ctx => {
        const { key } = ctx.params;

        const activity = await ActivityDao.search({ key });
        if (!activity) {
            throw BAD_REQUEST('活动不存在');
        }

        if (!eq(activity.status, OPTION_DRAW_STATUS.ONGOING)) {
            throw BAD_REQUEST('活动未开始或已结束');
        }

        const options = await OptionPoolDao.getOptionsByActivityId(activity.id);
        const count = await UserParticipationDao.getCount(activity.id);

        ctx.response.status = httpStatus.OK;
        ctx.body = {
            id: activity.id,
            activity_key: activity.key,
            name: activity.name,
            description: activity.description,
            participant_limit: activity.participant_limit,
            allow_duplicate_options: activity.allow_duplicate_options,
            status: activity.status,
            options,
            count,
        };
    },
);

export default router;
