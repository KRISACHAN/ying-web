import { BAD_REQUEST } from '@utils/http-errors';
import log from '@utils/log';
import Validator from 'async-validator';
import to from 'await-to-js';
import { cloneDeepWith } from 'lodash';
import xss from 'xss';

// Security sanitization function
const sanitizeValue = value => {
    if (typeof value !== 'string') return value;

    // 1. Remove XSS using lightweight xss library
    let sanitized = xss(value, {
        whiteList: {}, // No tags allowed
        stripIgnoreTag: true, // Strip tags not in whitelist
        stripIgnoreTagBody: ['script'], // Strip script contents
    });

    // 2. Filter SQL injection related characters
    sanitized = sanitized.replace(/['";\\]/g, '');

    // 3. Filter common SQL keywords
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
        // Use lodash's cloneDeepWith for deep cloning and transformation
        const sanitizedData = cloneDeepWith(ctx.request[source], value => {
            if (typeof value === 'string') {
                return sanitizeValue(value);
            }
        });

        const [error, value] = await to(
            validator.validate(sanitizedData, {
                abortEarly: false,
            }),
        );

        if (error) {
            log.error(error.errors.map(e => e.message).join(','));
            throw BAD_REQUEST(error.errors.map(e => e.message).join(','));
        }

        log.info('Validated data:', value);
        ctx.validate = value;
        await next();
    };

    return validatorMiddleware;
};
