import { BAD_REQUEST } from '@utils/http-errors';
import log from '@utils/log';
import Validator from 'async-validator';
import to from 'await-to-js';
import { cloneDeepWith, eq, isString } from 'lodash';
import xss from 'xss';

const sanitizeValue = value => {
    if (!isString(value)) return value;

    // https://github.com/leizongmin/js-xss
    let sanitized = xss(value, {
        whiteList: {},
        stripIgnoreTag: true,
        stripIgnoreTagBody: ['script'],
    });

    sanitized = sanitized.replace(/['";\\]/g, '');

    const sqlKeywords =
        /\b(select|insert|update|delete|drop|union|exec|execute|declare|create)\b/gi;
    sanitized = sanitized.replace(sqlKeywords, '');

    return sanitized.trim();
};

/**
 * Return a Koa middleware function based on the provided validation rules array.
 * @param {Object[]} rules - The validation rules array.
 * @param {string} [source='body'] - The source of the parameters, can be 'body', 'query', or 'params'.
 * @returns {function} A Koa middleware function.
 * @example
 * const rules = {
 *   name: { type: 'string', required: true },
 *   age: { type: 'number', required: true }
 * };
 * router.post('/user', createValidator(rules), async ctx => {
 *   // ctx.validate contains sanitized and validated data
 * });
 */
export const createValidator = (rules, source = 'body') => {
    const validator = new Validator(rules);

    const validatorMiddleware = async (ctx, next) => {
        const sourceData = eq(source, 'query')
            ? ctx.query
            : ctx.request[source];
        const sanitizedData = cloneDeepWith(sourceData, value => {
            if (isString(value)) {
                return sanitizeValue(value);
            }
        });

        const [error, value] = await to(
            validator.validate(sanitizedData, {
                abortEarly: false,
            }),
        );

        if (error && Array.isArray(error.errors)) {
            log.error(error.errors.map(e => e.message).join(','));
            throw BAD_REQUEST(error.errors.map(e => e.message).join(','));
        }

        log.info('Validated data:', value);
        ctx.validate = value;
        await next();
    };

    return validatorMiddleware;
};
