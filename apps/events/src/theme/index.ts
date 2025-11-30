import { createTheme } from '@mui/material/styles';

// Theme colors matching Tailwind config
export const themeColors = {
    primary: {
        main: '#F87171',
        light: '#FCA5A5',
        dark: '#DC2626',
    },
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
        paper: '#FFFFFF',
        overlay: 'rgba(248, 113, 113, 0.04)',
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
} as const;

// Create MUI theme with custom colors
export const theme = createTheme({
    palette: {
        primary: {
            main: themeColors.primary.main,
            light: themeColors.primary.light,
            dark: themeColors.primary.dark,
        },
        error: {
            main: themeColors.state.error,
        },
        warning: {
            main: themeColors.state.warning,
        },
        info: {
            main: themeColors.state.info,
        },
        success: {
            main: themeColors.state.success,
        },
        divider: themeColors.border.divider,
        background: {
            default: themeColors.background.primary,
            paper: themeColors.background.paper,
        },
        text: {
            primary: themeColors.text.primary,
            secondary: themeColors.text.secondary,
            disabled: themeColors.text.disabled,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
    },
});
