import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5175,
    },
    plugins: [
        react({
            jsxRuntime: 'automatic',
        }),
    ],
    resolve: {
        alias: {
            '@': pathResolve('./src'),
        },
    },
    build: {
        minify: 'esbuild',
        sourcemap: false,
        assetsDir: 'assets',
    },
});
