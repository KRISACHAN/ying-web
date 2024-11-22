import { createValidator } from '@utils/validator';

const rules = {
    password: [
        {
            type: 'string',
            required: true,
            message: '请输入密码',
        },
    ],
    email: [
        { type: 'email', required: true, message: '请输入正确的电子邮箱地址' },
    ],
};

export const loginValidatorMiddleware = createValidator(rules);
