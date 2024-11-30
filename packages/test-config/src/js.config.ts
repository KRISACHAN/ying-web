import { defineConfig, configDefaults } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.{test,spec}.{js,mjs,cjs}'],
        exclude: [...configDefaults.exclude, 'dist/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/'],
        },
        testTimeout: 20000,
    },
    resolve: {
        alias: {
            '@': resolve(process.cwd(), './app'),
        },
    },
});
