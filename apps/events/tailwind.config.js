/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                // Primary colors
                primary: '#F87171',
                'primary-light': '#FCA5A5',
                'primary-dark': '#DC2626',
                // Accent colors
                accent: {
                    gold: '#F59E0B',
                    jade: '#34D399',
                    silver: '#D1D5DB',
                },
                // Text colors
                text: {
                    primary: '#F87171',
                    secondary: '#FCA5A5',
                    disabled: 'rgba(248, 113, 113, 0.5)',
                    inverse: '#FFFFFF',
                    accent: '#F59E0B',
                },
                // Background colors
                background: {
                    primary: '#FEF2F2',
                    secondary: '#FFFBEB',
                    paper: '#FFFFFF',
                    overlay: 'rgba(248, 113, 113, 0.04)',
                },
                // Border colors
                border: {
                    primary: '#F87171',
                    hover: '#FCA5A5',
                    focus: '#DC2626',
                    divider: 'rgba(0, 0, 0, 0.09)',
                    golden: '#F59E0B',
                },
                // State colors
                state: {
                    success: '#10B981',
                    warning: '#FBBF24',
                    error: '#EF4444',
                    info: '#60A5FA',
                },
            },
            backgroundImage: {
                'gradient-primary':
                    'linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)',
                'gradient-festive':
                    'linear-gradient(135deg, #F87171 0%, #F59E0B 100%)',
            },
            boxShadow: {
                'primary-sm': '0 2px 8px rgba(248, 113, 113, 0.12)',
                'primary-md': '0 4px 16px rgba(248, 113, 113, 0.12)',
                'primary-lg': '0 8px 24px rgba(248, 113, 113, 0.12)',
                'golden-md': '0 4px 16px rgba(245, 158, 11, 0.12)',
            },
        },
    },
    plugins: [],
};
