import { styled, TextField } from '@mui/material';
import { optionDrawTheme } from '../../styles/index';

const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: optionDrawTheme.colors.border.primary,
        },
        '&:hover fieldset': {
            borderColor: optionDrawTheme.colors.border.hover,
        },
        '&.Mui-focused fieldset': {
            borderColor: optionDrawTheme.colors.border.focus,
        },
    },
    '& .MuiInputLabel-root': {
        color: optionDrawTheme.colors.text.primary,
        '&.Mui-focused': {
            color: optionDrawTheme.colors.text.primary,
        },
    },
    '& .MuiOutlinedInput-input': {
        color: optionDrawTheme.colors.text.primary,
    },
});

export default StyledTextField;
