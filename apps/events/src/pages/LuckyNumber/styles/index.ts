// Minimal theme for runtime color access (e.g., in CSS keyframes)
// For styling, prefer Tailwind CSS classes defined in tailwind.config.js
// Import colors from global theme
import { themeColors } from '@/theme';

// Re-export only the primary color for keyframes that need direct color access
export const luckyNumberTheme = {
    colors: {
        primary: themeColors.primary.main,
    },
} as const;
