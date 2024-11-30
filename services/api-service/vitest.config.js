import { defineConfig } from 'vitest/config';
import jsConfig from '@ying-web/test-config/js.config';

export default defineConfig({
    ...jsConfig,
    test: {
        ...jsConfig.test,
        environment: 'node',
        globals: true,
        alias: {
            '@api': '/app/api',
            '@middlewares': '/app/middlewares',
            '@utils': '/app/utils',
            '@constants': '/app/constants',
            '@dao': '/app/dao',
            '@models': '/app/models',
            '@services': '/app/services',
        },
    },
});
