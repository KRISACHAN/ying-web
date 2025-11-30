import React from 'react';

import { Avatar, Box, keyframes } from '@mui/material';

import { themeColors } from '@/theme';

const rotate = keyframes`
  0% {
    transform: rotate(-10deg);
    box-shadow: 0 0 20px ${themeColors.primary.main};
  }
  50% {
    transform: rotate(10deg);
    box-shadow: 0 0 40px ${themeColors.primary.main};
  }
  100% {
    transform: rotate(-10deg);
    box-shadow: 0 0 20px ${themeColors.primary.main};
  }
`;

interface NumberAnimationProps {
    number: number;
}

const NumberAnimation: React.FC<NumberAnimationProps> = ({ number }) => {
    return (
        <Box sx={{ position: 'relative' }}>
            <Avatar
                className="bg-primary text-text-inverse"
                sx={{
                    width: 200,
                    height: 200,
                    mx: 'auto',
                    bgcolor: 'primary.main',
                    color: 'text.inverse',
                    fontSize: '72px',
                    fontWeight: 'bold',
                    boxShadow: `0 0 20px ${themeColors.primary.main}`,
                    animation: `${rotate} 3s ease-in-out infinite`,
                }}
            >
                {number}
            </Avatar>
        </Box>
    );
};

export default NumberAnimation;
