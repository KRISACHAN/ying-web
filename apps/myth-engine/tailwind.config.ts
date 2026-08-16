import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    50: '#f6f3ec',
                    100: '#ece5d6',
                    200: '#d8ccb1',
                    300: '#bcae8c',
                    400: '#9a8966',
                    500: '#7a6a4b',
                    600: '#5c4f38',
                    700: '#423828',
                    800: '#2b251b',
                    900: '#1a1610',
                    950: '#100d09',
                },
                cinnabar: {
                    DEFAULT: '#a8322d',
                    light: '#c9504a',
                    dark: '#7d2521',
                },
                jade: {
                    DEFAULT: '#3f6b54',
                    light: '#5e9174',
                },
            },
            fontFamily: {
                serif: [
                    '"Noto Serif SC"',
                    '"Songti SC"',
                    '"STSong"',
                    '"SimSun"',
                    'serif',
                ],
                sans: [
                    '"Noto Sans SC"',
                    '"PingFang SC"',
                    '"Microsoft YaHei"',
                    'system-ui',
                    'sans-serif',
                ],
            },
        },
    },
    plugins: [],
};

export default config;
