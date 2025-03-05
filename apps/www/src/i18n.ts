import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Only support Chinese and English
export const locales = ['zh', 'en'];
export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
