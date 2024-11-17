import Validator from 'async-validator';
import to from 'await-to-js';
import { BAD_REQUEST } from '@utils/http-errors';

// example:
// const rules = {
//     username: [
//         {
//             type: 'string',
//             required: true,
//             message: '请输入昵称',
//         },
//         {
//             type: 'string',
//             message: '昵称长度必须在 2 ~ 16 个字符之间',
//             min: 2,
//             max: 16,
//         },
//     ],
//     password2: [
//         {
//             type: 'string',
//             required: true,
//             message: '请输入密码',
//         },
//         {
//             type: 'string',
//             message:
//                 '请输入正确格式的密码，长度必须在 8 ~ 16 个字符之间，至少一个大写字母，一个小写字母，一个数字和一个特殊字符',
//             pattern:
//                 /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/,
//         },
//     ],
//     email: [
//         { type: 'email', required: true, message: '请输入正确的电子邮箱地址' },
//     ],
// };
// const registerValidatorMiddleware = createValidator(rules);
// router.post('/register', registerValidatorMiddleware, async ctx => {});

/**
 * Return a Koa middleware function based on the provided validation rules array.
 * @param {Object[]} rules - The validation rules array.
 * @param {string} [source='body'] - The source of the parameters, can be 'body', 'query', or 'params'.
 * @returns {function} A Koa middleware function.
 */
export const createValidator = (rules, source = 'body') => {
    const validator = new Validator(rules);

    const validatorMiddleware = async (ctx, next) => {
        const [error, value] = await to(
            validator.validate(ctx.request[source], {
                abortEarly: false,
            }),
        );
        if (error) {
            throw BAD_REQUEST(error.errors.map(e => e.message).join(','));
        }
        ctx.validate = value;
        await next();
    };

    return validatorMiddleware;
};
