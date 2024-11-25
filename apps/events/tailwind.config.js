import { luckyNumberTheme } from './src/theme/luckyNumber';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#1976d2',
                secondary: '#dc2626',
                success: '#52c41a',
                warning: '#faad14',
                error: '#f5222d',
                'lucky-number': {
                    primary: luckyNumberTheme.colors.primary,
                    light: luckyNumberTheme.colors.light,
                    dark: luckyNumberTheme.colors.dark,
                },
            },
        },
    },
    plugins: [],
};
