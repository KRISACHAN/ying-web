import { resolve } from 'path';
import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: [
            'src/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.{test,spec}.{ts,tsx}',
        ],
        exclude: [...configDefaults.exclude, 'dist/**'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'tests/'],
        },
    },
    resolve: {
        alias: {
            '@': resolve(process.cwd(), './src'),
        },
    },
});
