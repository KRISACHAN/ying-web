import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import type { ESLint, Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const nextConfig: Linter.Config[] = [
    js.configs.recommended,
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parser: typescriptParser as unknown as Linter.Parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.eslint.json',
            },
            globals: {
                // Browser globals
                window: true,
                document: true,
                localStorage: true,
                sessionStorage: true,
                navigator: true,
                fetch: true,
                console: true,
                // Node.js globals (for Next.js)
                process: true,
                __dirname: true,
                __filename: true,
                Buffer: true,
                // React globals
                React: true,
                JSX: true,
            },
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
            react: {
                version: 'detect',
            },
            next: {
                rootDir: '.',
            },
        },
        plugins: {
            '@typescript-eslint': typescript as unknown as ESLint.Plugin,
            next: nextPlugin as unknown as ESLint.Plugin,
            'react-hooks': reactHooks as unknown as ESLint.Plugin,
            prettier: prettierPlugin as unknown as ESLint.Plugin,
            'simple-import-sort': simpleImportSort as unknown as ESLint.Plugin,
            import: importPlugin as unknown as ESLint.Plugin,
        },
        rules: {
            ...typescript.configs?.recommended?.rules,
            ...prettierConfig.rules,
            ...reactHooks.configs?.recommended?.rules,
            // Next.js rules
            'next/no-html-link-for-pages': 'error',
            'next/no-img-element': 'error',
            'next/no-sync-scripts': 'error',

            // Formatting
            indent: ['off', 4],
            'arrow-parens': 'off',
            'generator-star-spacing': 'off',
            'no-debugger': 'off',
            'eol-last': 'off',
            'space-before-function-paren': 'off',
            quotes: ['error', 'single'],
            'prettier/prettier': 'error',

            // Code Quality
            'no-var': 'error',
            eqeqeq: 'error',
            camelcase: 'off',

            // Import Rules
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

            // TypeScript Specific
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
