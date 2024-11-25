import { createTheme } from '@mui/material/styles';
import { luckyNumberTheme } from './luckyNumber';

// 创建基础主题
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
        // ... 其他基础配置
    },
});

// 为 Lucky Number 页面创建特定主题
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
                    // ... Lucky Number 特定的样式
                },
            },
        },
    },
});

// 导出默认主题（用于其他页面）
export const theme = baseTheme;
