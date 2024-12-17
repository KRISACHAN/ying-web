import { resolve } from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

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
