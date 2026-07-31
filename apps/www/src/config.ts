const buildConfig = () => {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Ying Web';
    const copyright = process.env.NEXT_PUBLIC_SITE_COPYRIGHT || 'Kris';
    const defaultTitle =
        process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE ||
        'Kris Chen - AI Application Engineer';
    const defaultDescription =
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        'AI Application Engineer with 10 years of software engineering experience across JavaScript full-stack development, application architecture, and AI products.';

    return {
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        site: {
            name: siteName,
            copyright,
            metadata: {
                title: {
                    absolute: defaultTitle,
                    default: defaultTitle,
                    template: `%s - ${defaultTitle}`,
                },
                description: defaultDescription,
            },
        },
        ogImageSecret:
            process.env.OG_IMAGE_SECRET ||
            'secret_used_for_signing_and_verifying_the_og_image_url',
    };
};

export const config = buildConfig();
