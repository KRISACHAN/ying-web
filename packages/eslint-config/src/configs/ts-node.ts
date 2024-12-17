import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import type { ESLint, Linter } from 'eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const tsNodeConfig: Linter.Config[] = [
    js.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptParser as unknown as Linter.Parser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: ['./tsconfig.json', './tsconfig.test.json'],
            },
            globals: {
                // Node.js globals
                node: true,
                process: true,
                __dirname: true,
                __filename: true,
                // Test globals
                describe: true,
                it: true,
                expect: true,
                beforeEach: true,
                afterEach: true,
            },
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        plugins: {
            '@typescript-eslint': typescript as unknown as ESLint.Plugin,
            prettier: prettierPlugin as unknown as ESLint.Plugin,
            'simple-import-sort': simpleImportSort as unknown as ESLint.Plugin,
            import: importPlugin as unknown as ESLint.Plugin,
        },
        rules: {
            ...typescript.configs?.recommended?.rules,
            ...prettierConfig.rules,
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
                        ['^@?\\w'],
                        ['^@/'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
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
