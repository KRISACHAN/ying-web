import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

export default createMiddleware({
    // A list of all locales that are supported
    locales,

    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: 'en',

    // Paths that should not be internationalized
    localePrefix: 'as-needed',
});

export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
