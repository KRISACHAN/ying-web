import { createTheme } from '@mui/material/styles';

import { luckyNumberTheme } from './luckyNumber';

const baseTheme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#dc2626',
            light: '#ef5350',
            dark: '#c62828',
            contrastText: '#ffffff',
        },
    },
});

export const luckyNumberMuiTheme = createTheme({
    ...baseTheme,
    palette: {
        ...baseTheme.palette,
        primary: {
            main: luckyNumberTheme.colors.primary,
            light: luckyNumberTheme.colors.light,
            dark: luckyNumberTheme.colors.dark,
            contrastText: '#ffffff',
        },
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    // ... Lucky Number specific styles
                },
            },
        },
    },
});

export const theme = baseTheme;
