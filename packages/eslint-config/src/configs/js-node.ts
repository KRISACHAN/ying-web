import * as babelParser from '@babel/eslint-parser';
import js from '@eslint/js';
import type { ESLint, Linter } from 'eslint';
import * as importPlugin from 'eslint-plugin-import';
import * as prettier from 'eslint-plugin-prettier';
import * as simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import { baseConfig } from '../base';

export const jsNodeConfig: Linter.Config[] = [
    js.configs.recommended,
    {
        ...baseConfig,
        files: ['**/*.js'],
        languageOptions: {
            parser: babelParser as Linter.Parser,
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.jest,
                __dirname: 'readonly',
                __filename: 'readonly',
                exports: 'writable',
                module: 'readonly',
                require: 'readonly',
                process: 'readonly',
                Buffer: 'readonly',
                global: 'readonly',
                console: 'readonly',
            },
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                requireConfigFile: false,
                babelOptions: {
                    presets: ['@babel/preset-env'],
                },
            },
        },
        plugins: {
            prettier: prettier as unknown as ESLint.Plugin,
            'simple-import-sort': simpleImportSort as unknown as ESLint.Plugin,
            import: importPlugin as unknown as ESLint.Plugin,
        },
        rules: {
            // Indentation & Formatting
            indent: [0, 4],
            'arrow-parens': 0,
            'generator-star-spacing': 0,
            'no-debugger': 0,
            'eol-last': 0,
            'space-before-function-paren': 0,
            quotes: ['error', 'single'],
            'prettier/prettier': 'error',

            // Code Quality
            'no-var': 'error',
            eqeqeq: 2,
            camelcase: 0,

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
        },
    },
    {
        ignores: ['.git', 'node_modules', 'dist', 'pnpm-lock.yaml', '.turbo'],
    },
];
