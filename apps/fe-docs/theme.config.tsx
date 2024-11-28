
import { DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
    logo: <span>@ying-web</span>,
    project: {
        link: 'https://github.com/KRISACHAN/ying-web',
    },
    docsRepositoryBase:
        'https://github.com/KRISACHAN/ying-web/tree/main/apps/docs',
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
