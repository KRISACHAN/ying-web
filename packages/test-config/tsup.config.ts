import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts', 'src/js.config.ts', 'src/ts.config.ts'],
    format: ['esm', 'cjs'],
    dts: false, // We'll use tsc for type declarations
    clean: true,
    sourcemap: true,
    outExtension({ format }) {
        return {
            js: format === 'cjs' ? '.cjs' : '.js'
        };
    },
    treeshake: true,
    external: ['vitest', '@vitest/coverage-v8', 'jsdom'],
});
