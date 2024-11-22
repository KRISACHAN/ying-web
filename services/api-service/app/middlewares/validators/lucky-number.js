import { createValidator } from '@utils/validator';

export const createLuckyNumberValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    name: [{ type: 'string', required: true, message: '活动名称是必需的' }],
    description: [
        { type: 'string', required: true, message: '活动描述是必需的' },
    ],
    numbers: [{ type: 'array', required: true, message: '号码池数据是必需的' }],
});

export const queryLuckyNumberValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    },
    'params',
);

export const deleteLuckyNumberValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    },
    'params',
);

export const cancelParticipatedLuckyNumberValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
        drawn_number: [
            { type: 'number', required: true, message: '号码是必需的' },
        ],
        user_name: [
            { type: 'string', required: true, message: '用户名是必需的' },
        ],
    },
);