'use client';
import { useTranslations } from 'next-intl';

interface Props {
    locale: string;
}

export default function Header({ locale }: Props) {
    const t = useTranslations('');
    return (
        <header className="bg-card p-4">
            <div className="container mx-auto">
                <h1>Header - Locale: {locale}</h1>
            </div>
        </header>
    );
}
