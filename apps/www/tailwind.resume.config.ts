import type { Config } from 'tailwindcss';

const config = {
    content: ['./public/en.html', './public/zh.html'],
    safelist: ['from-cyan-500', 'to-blue-600'],
    theme: {
        extend: {},
    },
    plugins: [],
} satisfies Config;

export default config;
