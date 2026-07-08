import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Kris Chen - Senior Frontend Engineer with 10 Years Experience',
    description:
        'Senior Frontend Engineer with 10 years of experience in web development, specializing in Vue, React, Node.js, and large-scale application architecture',
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
