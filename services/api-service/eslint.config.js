const { jsNodeConfig } = require('@ying-web/eslint-config');

module.exports = [
    ...jsNodeConfig,
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
