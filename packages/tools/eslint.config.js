import { tsWebConfig } from '@ying-web/eslint-config';

export default [
    ...tsWebConfig,
    {
        ignores: ['node_modules/**', 'dist/**', 'pnpm-lock.yaml', '.turbo/**'],
    },
];
