import { defaultLocale } from '@/lib/i18n';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: "Kris Chen's Resume - Senior Frontend Engineer",
    description:
        'Kris Chen, Senior Frontend Engineer with 10 years of experience in web development, specializing in Vue, React, Node.js, and large-scale application architecture',
};

export default function RootPage() {
    redirect(`/${defaultLocale}`);
}
