export const luckyNumberTheme = {
    colors: {
        primary: '#F87171',
        light: '#FCA5A5',
        dark: '#DC2626',
        accent: {
            gold: '#F59E0B',
            jade: '#34D399',
            silver: '#D1D5DB',
        },
        text: {
            primary: '#F87171',
            secondary: '#FCA5A5',
            disabled: 'rgba(248, 113, 113, 0.5)',
            inverse: '#FFFFFF',
            accent: '#F59E0B',
        },
        background: {
            primary: '#FEF2F2',
            secondary: '#FFFBEB',
            gradient: 'linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)',
            paper: '#FFFFFF',
            overlay: 'rgba(248, 113, 113, 0.04)',
            festive: 'linear-gradient(135deg, #F87171 0%, #F59E0B 100%)',
        },
        border: {
            primary: '#F87171',
            hover: '#FCA5A5',
            focus: '#DC2626',
            divider: 'rgba(0, 0, 0, 0.09)',
            golden: '#F59E0B',
        },
        state: {
            success: '#10B981',
            warning: '#FBBF24',
            error: '#EF4444',
            info: '#60A5FA',
        },
    },
    spacing: {
        xs: '4px',
        small: '8px',
        medium: '16px',
        large: '24px',
        xl: '32px',
        xxl: '48px',
    },
    borderRadius: {
        xs: '2px',
        small: '4px',
        medium: '8px',
        large: '16px',
        xl: '24px',
        circle: '50%',
    },
    shadows: {
        small: '0 2px 8px rgba(248, 113, 113, 0.12)',
        medium: '0 4px 16px rgba(248, 113, 113, 0.12)',
        large: '0 8px 24px rgba(248, 113, 113, 0.12)',
        golden: '0 4px 16px rgba(245, 158, 11, 0.12)',
    },
    animation: {
        fast: '0.2s',
        medium: '0.3s',
        slow: '0.5s',
        timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
} as const;

export type LuckyNumberTheme = typeof luckyNumberTheme;
