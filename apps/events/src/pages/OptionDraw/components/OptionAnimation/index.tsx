import { Avatar, Box, keyframes } from '@mui/material';
import React from 'react';
import { optionDrawTheme } from '../../styles/index';

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
    box-shadow: 0 0 20px ${optionDrawTheme.colors.primary};
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 0 40px ${optionDrawTheme.colors.primary};
  }
`;

interface OptionAnimationProps {
    option: string;
}

const OptionAnimation: React.FC<OptionAnimationProps> = ({ option }) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <Avatar
                sx={{
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    bgcolor: optionDrawTheme.colors.primary,
                    color: optionDrawTheme.colors.text.inverse,
                    fontSize: '32px',
                    fontWeight: 'bold',
                    boxShadow: `0 0 20px ${optionDrawTheme.colors.primary}`,
                    animation: `${float} 3s ease-in-out infinite`,
                    wordBreak: 'break-all',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                {option}
            </Avatar>
        </Box>
    );
};

export default OptionAnimation;
