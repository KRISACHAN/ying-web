import js from '@eslint/js';
import type { Linter } from 'eslint';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const baseConfig: Linter.FlatConfig = {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
        'dist/**',
        'node_modules/**',
        'pnpm-lock.yaml',
        '.turbo/**',
        'public/**',
        '.env*.development',
        '.env*.production',
        '.env',
        '.gitignore',
        '.prettierignore',
        '.prettierrc',
        '.eslintignore',
        '.eslintrc',
    ],
    plugins: {
        'simple-import-sort': simpleImportSort,
        import: importPlugin,
    },
    rules: {
        ...js.configs.recommended.rules,
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    ['^node:'],
                    ['^@?\\w'],
                    ['^@/'],
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                    ['^.+\\.?(css|less)$'],
                    ['^\\u0000'],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',
    },
};
