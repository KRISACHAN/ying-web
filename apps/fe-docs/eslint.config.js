import { nextConfig } from '@ying-web/eslint-config';

export default [
    ...nextConfig,
    {
        languageOptions: {
            parserOptions: {
                project: './tsconfig.eslint.json',
            },
        },
        ignores: [
            'node_modules/**',
            'dist/**',
            'pnpm-lock.yaml',
            '.turbo/**',
            'public/**',
            'coverage/**',
            'build/**',
            '.next/**',
        ],
    },
];
