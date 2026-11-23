import tokens from './src/theme/tokens.json';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                ...tokens.colors,
                primary: {
                    DEFAULT: tokens.colors.primary.main,
                    ...tokens.colors.primary,
                },
            },
        },
    },
    plugins: [],
};
