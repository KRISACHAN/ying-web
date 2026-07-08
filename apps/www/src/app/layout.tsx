import '@/styles/globals.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans_SC } from 'next/font/google';

// Font configurations
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-inter',
});

const notoSansSC = Noto_Sans_SC({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
    variable: '--font-noto-sans-sc',
});

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
        <html lang="en" className={`${inter.variable} ${notoSansSC.variable}`}>
            <head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
