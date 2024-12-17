// @FIXME: This configuration is not working as expected.

import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { baseConfig } from '../base';

export const reactConfig = {
    ...baseConfig,
    files: ['**/*.{jsx,tsx}'],
    plugins: {
        ...baseConfig.plugins,
        'react-hooks': reactHooks,
        'react-refresh': reactRefresh,
    },
    rules: {
        ...baseConfig.rules,
        ...reactHooks.configs.recommended.rules,
        'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
        ],
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
} as const;
