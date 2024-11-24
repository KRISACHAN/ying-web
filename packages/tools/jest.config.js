const path = require('path');

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    rootDir: path.join(__dirname, ''),
    testMatch: ['**/*.test.ts'],
    globals: {
        'ts-jest': {
            tsconfig: './tsconfig.test.json',
        },
    },
    moduleFileExtensions: ['js', 'ts'],
    coverageDirectory: 'coverage',
    testPathIgnorePatterns: ['/node_modules/'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '/.turbo/'],
    coverageReporters: [
        'json',
        'lcov',
        'text',
        'clover',
        'html',
        'text-summary',
    ],
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
};
