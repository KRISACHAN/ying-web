import type { Config } from 'tailwindcss';

const config = {
    content: ['./public/en.html', './public/zh.html'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;

export default config;
