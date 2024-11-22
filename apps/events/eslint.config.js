import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config({
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist', 'node_modules'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
        ecmaVersion: 2020,
        globals: {
            ...globals.browser,
            React: 'readonly',
        },
        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },
    plugins: {
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
        prettier: prettier,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
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
    },
    env: {
        browser: true,
        node: true,
    },
});
