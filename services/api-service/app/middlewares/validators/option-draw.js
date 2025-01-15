import { createValidator } from '@utils/validator';

export const createOptionDrawValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    name: [{ type: 'string', required: true, message: '活动名称是必需的' }],
    description: [
        { type: 'string', required: true, message: '活动描述是必需的' },
    ],
    options: [{ type: 'array', required: true, message: '选项池数据是必需的' }],
    participant_limit: [
        { type: 'number', required: true, message: '参与者限制是必需的' },
    ],
    allow_duplicate_options: [
        {
            type: 'boolean',
            required: true,
            message: '是否允许重复中奖是必需的',
        },
    ],
});

export const optionDrawKeyValidatorMiddleware = createValidator(
    {
        key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    },
    'params',
);

export const queryOptionDrawValidatorMiddleware = createValidator(
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
        username: [
            {
                type: 'string',
                message: '用户名格式不正确',
            },
        ],
        activity_id: [
            {
                type: 'string',
                message: '活动ID格式不正确',
                pattern: /^\d+$/,
            },
        ],
    },
    'query',
);

export const updateOptionDrawStatusValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    status: [
        {
            type: 'enum',
            required: true,
            enum: ['not_started', 'ongoing', 'ended'],
            message: '活动状态不正确',
        },
    ],
});

export const drawOptionValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    username: [{ type: 'string', required: true, message: '用户名是必需的' }],
});

export const queryParticipationValidatorMiddleware = createValidator(
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
        activity_id: [
            {
                type: 'string',
                message: '活动ID格式不正确',
                pattern: /^\d+$/,
            },
        ],
        username: [
            {
                type: 'string',
                message: '用户名格式不正确',
            },
        ],
        drawn_option_id: [
            {
                type: 'string',
                message: '选项 ID 格式不正确',
                pattern: /^\d+$/,
            },
        ],
    },
    'query',
);

export const cancelParticipationValidatorMiddleware = createValidator({
    key: [{ type: 'string', required: true, message: '活动标识是必需的' }],
    username: [{ type: 'string', required: true, message: '用户名是必需的' }],
});
