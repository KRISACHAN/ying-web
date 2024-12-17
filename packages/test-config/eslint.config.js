import { tsNodeConfig } from '@ying-web/eslint-config';

export default [
    ...tsNodeConfig,
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'pnpm-lock.yaml',
            '.turbo/**',
        ],
    },
];
