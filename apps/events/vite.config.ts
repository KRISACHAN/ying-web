import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}

export default defineConfig({
    plugins: [
        react({
            jsxRuntime: 'automatic',
        }),
        legacy({
            targets: [
                'Android >= 6',
                'iOS >= 10',
                'Chrome >= 60',
                'Safari >= 10',
                'Firefox >= 60',
                'Edge >= 16',
            ],
            modernPolyfills: true,
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
    ],
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: '@root-entry-name: default;',
            },
        },
    },
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@emotion/react',
            '@emotion/styled',
        ],
        exclude: ['lucide-react'],
    },
    resolve: {
        alias: {
            '@': pathResolve('./src'),
            '@ying-web/tools': pathResolve('../../packages/tools/src'),
        },
    },
    build: {
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'mui-vendor': [
                        '@mui/material',
                        '@mui/icons-material',
                        '@emotion/react',
                        '@emotion/styled',
                    ],
                    'utils-vendor': [
                        'axios',
                        'lucide-react',
                        'react-confetti',
                        'react-helmet-async',
                        'usehooks-ts',
                    ],
                },
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
        sourcemap: false,
        assetsDir: 'assets',
    },
});
