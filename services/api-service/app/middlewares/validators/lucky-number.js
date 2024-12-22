import { createValidator } from '@utils/validator';

export const createLuckyNumberValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    name: [{ type: 'string', required: true, message: '活动名称是必需的' }],
    description: [
        { type: 'string', required: true, message: '活动描述是必需的' },
    ],
    numbers: [{ type: 'array', required: true, message: '号码池数据是必需的' }],
    participant_limit: [
        { type: 'number', required: true, message: '参与者限制是必需的' },
    ],
});

export const luckyNumberKeyValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    },
    'params',
);

export const queryLuckyNumberValidatorMiddleware = createValidator(
    {
        page_num: [
            {
                type: 'string',
                message: '请输入正确的页码',
                pattern: /^\d+$/,
            },
        ],
        page_size: [
            {
                type: 'string',
                message: '请输入正确的页大小',
                pattern: /^\d+$/,
            },
        ],
    },
    'query',
);

export const cancelParticipatedLuckyNumberValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
        username: [
            { type: 'string', required: true, message: '用户名是必需的' },
        ],
    },
);

export const drawLuckyNumberValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    username: [{ type: 'string', required: true, message: '用户名是必需的' }],
});
