import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/configs/*.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    clean: true,
    treeshake: true,
    outDir: 'dist',
});
