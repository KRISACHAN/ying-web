import type { CSSProperties } from 'react';

import { createTheme } from '@mui/material/styles';

import tokens from './tokens.json';

export const themeColors = tokens.colors;

export const themeVariables = {
    '--events-paper': themeColors.background.primary,
    '--events-surface': themeColors.background.paper,
    '--events-ink': themeColors.text.primary,
    '--events-muted': themeColors.text.secondary,
    '--events-line': themeColors.border.divider,
    '--events-focus': themeColors.border.focus,
    '--events-ember': themeColors.accent.ember,
    '--events-shadow': tokens.shadow,
    '--events-radius': `${tokens.radius}px`,
    '--events-font': tokens.fonts.ui,
    '--events-display-font': tokens.fonts.heading,
} as CSSProperties;

// Create MUI theme with custom colors
export const theme = createTheme({
    typography: {
        fontFamily: tokens.fonts.ui,
        h1: { fontFamily: tokens.fonts.heading },
        h2: { fontFamily: tokens.fonts.heading },
    },
    shape: { borderRadius: tokens.radius },
    palette: {
        primary: {
            contrastText: themeColors.text.inverse,
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
        MuiDialog: {
            styleOverrides: { paper: { backgroundImage: 'none' } },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.border.input,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: themeColors.border.focus,
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    minHeight: tokens.controlHeight,
                    textTransform: 'none',
                    fontWeight: 650,
                    '&.Mui-focusVisible': {
                        outline: `2px solid ${themeColors.border.focus}`,
                        outlineOffset: 3,
                    },
                },
            },
        },
    },
});
