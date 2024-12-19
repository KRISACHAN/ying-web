import { createValidator } from '@utils/validator';

export const createPromiseCategoryValidator = createValidator({
    name: [
        { type: 'string', message: '分类名称是必须的' },
        { type: 'string', min: 1, max: 20, message: '分类名称长度为 1-20' },
    ],
    description: [
        { type: 'string', message: '分类描述是必须的' },
        { type: 'string', min: 1, max: 100, message: '分类描述长度为 1-100' },
    ],
    is_published: [
        { type: 'boolean', required: true, message: '是否发布是必需的' },
    ],
});

export const getPromiseCategoryListValidator = createValidator(
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
        name: [
            { type: 'string', message: '请输入正确的分类名称' },
            { type: 'string', min: 1, max: 20, message: '分类名称长度为 1-20' },
        ],
        description: [
            { type: 'string', message: '请输入正确的分类描述' },
            {
                type: 'string',
                min: 1,
                max: 100,
                message: '分类描述长度为 1-100',
            },
        ],
        is_published: [
            {
                type: 'string',
                message: '请输入正确的发布状态',
                pattern: /^(true|false)$/,
            },
        ],
        order: [
            {
                type: 'string',
                message: '请输入正确的排序方式',
                pattern: /^(ASC|DESC)$/i,
            },
        ],
    },
    'query',
);

export const getPromiseCategoryDetailValidator = createValidator(
    {
        id: [
            {
                type: 'string',
                pattern: /^\d+$/,
                required: true,
                message: '分类 ID 是必需的',
            },
        ],
    },
    'params',
);

export const updatePromiseCategoryValidator = createValidator({
    name: [
        { type: 'string', message: '请输入正确的分类名称' },
        { type: 'string', min: 1, max: 20, message: '分类名称长度为 1-20' },
    ],
    description: [
        { type: 'string', message: '请输入正确的分类描述' },
        { type: 'string', min: 1, max: 100, message: '分类描述长度为 1-100' },
    ],
    is_published: [{ type: 'boolean', message: '请选择是否发布' }],
});

export const createPromiseValidator = createValidator({
    category_id: [
        { type: 'number', required: true, message: '分类 ID 是必需的' },
    ],
    chapter: [
        { type: 'string', required: true, message: '章节是必需的' },
        { type: 'string', min: 1, max: 20, message: '章节长度为 1-20' },
    ],
    text: [
        { type: 'string', required: true, message: '内容是必需的' },
        { type: 'string', min: 1, max: 255, message: '内容长度为 1-255' },
    ],
    description: [
        { type: 'string', message: '描述是必需的' },
        { type: 'string', min: 1, max: 510, message: '描述长度为 1-510' },
    ],
    resource_url: [
        {
            type: 'string',
            message: '来源URL是必需的',
            pattern: /^https?:\/\//,
        },
    ],
    is_published: [{ type: 'boolean', message: '是否发布是必需的' }],
});

export const getPromiseListValidator = createValidator(
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
        category_id: [
            {
                type: 'string',
                message: '请输入正确的分类ID',
                pattern: /^\d+$/,
            },
        ],
        category_name: [
            { type: 'string', message: '请输入正确的分类名称' },
            { type: 'string', min: 1, max: 20, message: '分类名称长度为 1-20' },
        ],
        chapter: [
            { type: 'string', message: '请输入正确的章节' },
            { type: 'string', min: 1, max: 20, message: '章节长度为 1-20' },
        ],
        text: [
            { type: 'string', message: '请输入正确的经文内容' },
            {
                type: 'string',
                min: 1,
                max: 255,
                message: '经文内容长度为 1-255',
            },
        ],
        description: [
            { type: 'string', message: '请输入正确的描述' },
            { type: 'string', min: 1, max: 510, message: '描述长度为 1-510' },
        ],
        is_published: [
            {
                type: 'string',
                message: '请输入正确的发布状态',
                pattern: /^(true|false)$/,
            },
        ],
        order: [
            {
                type: 'string',
                message: '请输入正确的排序方式',
                pattern: /^(ASC|DESC)$/i,
            },
        ],
    },
    'query',
);

export const getPromiseDetailValidator = createValidator(
    {
        id: [
            {
                type: 'string',
                required: true,
                message: 'ID 是必需的',
                pattern: /^\d+$/,
            },
        ],
        is_published: [
            {
                type: 'string',
                message: '请输入正确的发布状态',
                pattern: /^(true|false)$/,
            },
        ],
    },
    'params',
);

export const updatePromiseValidator = createValidator(
    {
        id: [
            {
                type: 'string',
                required: true,
                message: 'ID 是必需的',
                pattern: /^\d+$/,
            },
        ],
    },
    'params',
);
