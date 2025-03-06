import { defaultLocale } from '@/lib/i18n';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: "Jinwen Chen's resume",
    description:
        "Ying Web, A 8-year experience FE developer, Jinwen Chen's resume",
};

export default function RootPage() {
    redirect(`/${defaultLocale}`);
}
