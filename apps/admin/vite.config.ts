import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

function pathResolve(dir: string) {
    return path.resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        legacy({
            targets: ['Android >= 4.4', 'iOS >= 9', 'ie >= 11', 'Chrome>=30'],
            modernPolyfills: true,
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
});
