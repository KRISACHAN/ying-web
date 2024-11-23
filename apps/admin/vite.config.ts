import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}

export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: [
                'Android >= 6',
                'iOS >= 10',
                'Chrome >= 60',
                'Safari >= 10',
                'Edge >= 16',
                'defaults',
            ],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
    ],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    resolve: {
        alias: {
            '@': pathResolve('./src'),
            '@ying-web/tools': pathResolve('../../packages/tools/src'),
        },
    },
    build: {
        rollupOptions: {
            external: [
                '@ying-web/tools',
                'axios',
                'lucide-react',
                'styled-components',
                '@emotion/react',
                '@emotion/styled',
            ],
            output: {
                entryFileNames: '[name]-[hash].js',
                chunkFileNames: '[name]-[hash].js',
                assetFileNames: '[name]-[hash].[ext]',
                // @TODO: Make it more elegant
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                },
            },
        },
    },
});
