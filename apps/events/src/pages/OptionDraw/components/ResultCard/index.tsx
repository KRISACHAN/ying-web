import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import React from 'react';

interface ResultCardProps {
    result?: string;
}

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const ResultCard: React.FC<ResultCardProps> = ({ result = '' }) => {
    return (
        <Box
            sx={{
                width: '100%',
                maxWidth: 600,
                mx: 'auto',
                p: 2,
                borderRadius: 4,
                background: '#F87171',
                boxShadow: '0 4px 12px rgba(248, 113, 113, 0.2)',
                animation: `${floatAnimation} 2.5s ease-in-out infinite`,
                textAlign: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 700,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                transform: 'scale(1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.02)',
                },
            }}
        >
            {result}
        </Box>
    );
};

export default ResultCard;
