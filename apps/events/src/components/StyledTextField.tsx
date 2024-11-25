import { luckyNumberTheme } from '@/theme/luckyNumber';
import { styled, TextField } from '@mui/material';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: luckyNumberTheme.colors.border.primary,
        },
        '&:hover fieldset': {
            borderColor: luckyNumberTheme.colors.border.hover,
        },
        '&.Mui-focused fieldset': {
            borderColor: luckyNumberTheme.colors.border.focus,
        },
    },
    '& .MuiInputLabel-root': {
        color: luckyNumberTheme.colors.text.primary,
        '&.Mui-focused': {
            color: luckyNumberTheme.colors.text.primary,
        },
    },
    '& .MuiOutlinedInput-input': {
        color: luckyNumberTheme.colors.text.primary,
    },
});

export default StyledTextField;
