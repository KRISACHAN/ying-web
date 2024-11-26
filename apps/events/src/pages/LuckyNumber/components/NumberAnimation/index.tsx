import React from 'react';

import { Avatar, Box, keyframes } from '@mui/material';

import { luckyNumberTheme } from '@/theme/luckyNumber';

const rotate = keyframes`
  0% {
    transform: rotate(-10deg);
    box-shadow: 0 0 20px ${luckyNumberTheme.colors.primary};
  }
  50% {
    transform: rotate(10deg);
    box-shadow: 0 0 40px ${luckyNumberTheme.colors.primary};
  }
  100% {
    transform: rotate(-10deg);
    box-shadow: 0 0 20px ${luckyNumberTheme.colors.primary};
  }
`;

interface NumberAnimationProps {
    number: number;
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({ number }) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <Avatar
                sx={{
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    bgcolor: luckyNumberTheme.colors.primary,
                    color: luckyNumberTheme.colors.text.inverse,
                    fontSize: '72px',
                    fontWeight: 'bold',
                    boxShadow: `0 0 20px ${luckyNumberTheme.colors.primary}`,
                    animation: `${rotate} 3s ease-in-out infinite`,
                }}
            >
                {number}
            </Avatar>
        </Box>
    );
};

export default NumberAnimation;
