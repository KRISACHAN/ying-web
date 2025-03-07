import type { Dictionary, Locale } from '@/types';
import 'server-only';

// Define the available locales
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'zh'];

// Utility function to check if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
    return locales.includes(locale as Locale);
}

// Import dictionaries
import enDictionary from '@/locales/en.json';
import zhDictionary from '@/locales/zh.json';

// Dictionary cache to avoid reloading the same dictionary
const dictionaries: Record<Locale, Dictionary> = {
    en: enDictionary as Dictionary,
    zh: zhDictionary as Dictionary,
};

// Function to get dictionary based on locale
export async function getDictionary(locale: Locale): Promise<Dictionary> {
    return dictionaries[locale];
}

// Helper to get value from nested dictionary
export function getTranslation(
    dict: Dictionary,
    path: string,
    fallback: string = '',
): string {
    try {
        const keys = path.split('.');
        let value: any = dict;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key as keyof typeof value];
            } else {
                return fallback;
            }
        }

        return typeof value === 'string' ? value : fallback;
    } catch (error) {
        console.error(`Translation error for path: ${path}`, error);
        return fallback;
    }
}
