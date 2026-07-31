import { defaultLocale } from '@/lib/i18n';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: "Kris Chen's Resume - AI Application Engineer",
    description:
        'Kris Chen, AI Application Engineer with 10 years of software engineering experience across JavaScript full-stack development, application architecture, and AI products',
};

export default function RootPage() {
    redirect(`/${defaultLocale}`);
}
