const typescript = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');
const prettier = require('eslint-plugin-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const importPlugin = require('eslint-plugin-import');
const eslintRecommended = require('@eslint/js').configs.recommended;
const prettierConfig = require('eslint-config-prettier');

module.exports = [
    eslintRecommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        ignores: [
            '.git/**',
            'node_modules/**',
            'public/**',
            'sql/**',
            'dist/**',
            'tests/**',
            'pnpm-lock.yaml',
            '.turbo/**',
        ],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
                project: './tsconfig.json',
            },
            globals: {
                node: true,
                jest: true,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            prettier: prettier,
            'simple-import-sort': simpleImportSort,
            import: importPlugin,
        },
        rules: {
            ...typescript.configs.recommended.rules,
            ...prettierConfig.rules,
            indent: ['off', 4],
            'arrow-parens': 'off',
            'generator-star-spacing': 'off',
            'no-debugger': 'off',
            'eol-last': 'off',
            eqeqeq: 'error',
            camelcase: 'off',
            'space-before-function-paren': 'off',
            quotes: ['error', 'single'],
            'prettier/prettier': 'error',
            'no-var': 'error',
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
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
];
