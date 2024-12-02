import Head from 'next/head';

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/images/icon.svg" />
                <link rel="shortcut icon" href="/images/icon.svg" />
                <link rel="apple-touch-icon" href="/images/icon.svg" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;
