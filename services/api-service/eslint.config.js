const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const importPlugin = require('eslint-plugin-import');
const globals = require('globals');
const babelParser = require('@babel/eslint-parser');

module.exports = [
    js.configs.recommended,
    {
        languageOptions: {
            parser: babelParser,
            globals: {
                ...globals.node,
                ...globals.es2020,
                ...globals.jest,
            },
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            prettier: prettier,
            'simple-import-sort': simpleImportSort,
            import: importPlugin,
        },
        rules: {
            indent: [0, 4],
            'arrow-parens': 0,
            'generator-star-spacing': 0,
            'no-debugger': 0,
            'eol-last': 0,
            eqeqeq: 2,
            camelcase: 0,
            'space-before-function-paren': 0,
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
            // @TODO: Strongly recommend
            'simple-import-sort/exports': 'error',
            'import/first': 'error',
            'import/no-duplicates': 'error',
        },
    },
    {
        ignores: [
            '.git',
            'node_modules',
            'public',
            'sql',
            'dist',
            'tests',
            'pnpm-lock.yaml',
            '.turbo',
        ],
    },
];
