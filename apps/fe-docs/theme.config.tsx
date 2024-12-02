import Image from 'next/image';
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
    logo: (
        <>
            <Image
                src="/images/icon.png"
                alt="@ying-web"
                width={24}
                height={24}
            />
            <span style={{ marginLeft: '8px' }}>ying-web</span>
        </>
    ),
    project: {
        link: 'https://github.com/KRISACHAN/ying-web',
    },
    docsRepositoryBase:
        'https://github.com/KRISACHAN/ying-web/tree/prod/apps/fe-docs',
    useNextSeoProps() {
        return {
            titleTemplate: '%s – @ying-web',
        };
    },
    primaryHue: 210,
    navigation: {
        prev: true,
        next: true,
    },
    sidebar: {
        defaultMenuCollapseLevel: 1,
        toggleButton: true,
    },
    toc: {
        float: true,
        title: 'On This Page',
    },
    editLink: {
        text: 'Edit this page on GitHub',
    },
    footer: {
        text: `MIT ${new Date().getFullYear()} @ying-web.`,
    },
};

export default config;
