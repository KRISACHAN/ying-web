import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import importPlugin from 'eslint-plugin-import';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    ignores: [
        'dist',
        'node_modules',
        'pnpm-lock.yaml',
        '.turbo',
        'public',
        '.env*.development',
        '.env*.production',
        '.env',
        '.gitignore',
        '.prettierignore',
        '.prettierrc',
        '.eslintignore',
        '.eslintrc',
        '.next/**/*',
        'next-env.d.ts',
        'out/**/*',
    ],
    languageOptions: {
        ecmaVersion: 2020,
        globals: {
            ...globals.browser,
            ...globals.node,
            JSX: true,
        },
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    plugins: {
        '@next/next': nextPlugin,
        'react-hooks': reactHooks,
        'simple-import-sort': simpleImportSort,
        import: importPlugin,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        '@next/next/no-html-link-for-pages': 'error',
        '@next/next/no-img-element': 'error',
        '@next/next/no-sync-scripts': 'error',
        '@next/next/google-font-display': 'error',
        '@next/next/no-page-custom-font': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    ['^node:'],
                    ['^react', '^react-dom', '^next', '^@next'],
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
        'import/first': 'error',
        'import/no-duplicates': 'error',
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
});
