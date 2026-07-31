import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kris Chen - AI Application Engineer with 10 Years Experience',
    description:
        'AI Application Engineer with 10 years of software engineering experience across JavaScript full-stack development, application architecture, and AI products',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
