import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="icon" href="/images/icon.svg" />
                <link rel="shortcut icon" href="/images/icon.svg" />
                <link rel="apple-touch-icon" href="/images/icon.svg" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
