import { Box, keyframes } from '@mui/material';
import React from 'react';

const float = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-10px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
`;

interface OptionAnimationProps {
    result: string;
}

const OptionAnimation: React.FC<OptionAnimationProps> = ({ result }) => {
    return (
        <Box
            sx={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: '#F87171',
                textAlign: 'center',
                animation: `${float} 3s ease-in-out infinite`,
                background: 'linear-gradient(135deg, #F87171 0%, #FCA5A5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {result}
        </Box>
    );
};

export default OptionAnimation;
