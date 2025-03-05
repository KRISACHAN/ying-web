import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Rubik, Space_Grotesk } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import React from 'react';
import Header from './components/Header';
import { ThemeProvider } from './components/ThemeProvider';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--inter',
});
const rubik = Rubik({
    subsets: ['arabic'],
    variable: '--rubik',
});
const space_grotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space-grotesk',
});

export async function generateMetadata({ params }: { params: { locale: string } }) {
    return {
        title: 'Kris Chen - Frontend Engineer',
        description: 'Personal website and resume of Kris Chen, Frontend Engineer with 8 years of experience',
        alternates: {
            canonical: 'https://www.krissarea.com',
            languages: {
                'en': '/en',
                'zh': '/zh',
            },
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    const { locale } = await params;

    // Use getMessages instead of useMessages for async components
    const messages = await getMessages();

    return (
        <html
            lang={locale}
            dir={'ltr'}
            className={`${space_grotesk.variable} ${rubik.variable} scroll-smooth`}
            suppressHydrationWarning
        >
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <NextTopLoader
                            initialPosition={0.08}
                            crawlSpeed={200}
                            height={3}
                            crawl={true}
                            easing="ease"
                            speed={200}
                            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
                            color="var(--primary)"
                            showSpinner={false}
                        />
                        <Header locale={locale} />
                        <main className="mx-auto max-w-screen-2xl">
                            {children}
                        </main>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
