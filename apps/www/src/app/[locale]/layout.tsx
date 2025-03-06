import { getDictionary, isValidLocale } from '@/lib/i18n';
import { Locale } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define the params type
type Params = Promise<{ locale: string }>;

// Generate metadata for the page
export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    // Validate the locale
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        return {};
    }

    const dictionary = await getDictionary(locale as Locale);

    return {
        title: dictionary.meta.title,
        description: dictionary.meta.description,
    };
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Params;
}) {
    // Validate locale, return 404 if invalid
    const { locale } = await params;

    if (!isValidLocale(locale)) {
        notFound();
    }

    return <div lang={locale as Locale}>{children}</div>;
}
