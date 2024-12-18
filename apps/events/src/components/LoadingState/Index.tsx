import { Box, Paper, Typography } from '@mui/material';
import { Disc3 } from 'lucide-react';
import React from 'react';

interface LoadingStateProps {
    message: string;
    color?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
    message,
    color = '#F87171',
}) => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '300px',
                gap: 4,
            }}
        >
            <Paper
                elevation={4}
                className="w-full"
                sx={{
                    py: 2,
                    px: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    textAlign: 'center',
                    maxWidth: 600,
                    mx: 'auto',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Typography
                    variant="body1"
                    className="text-center w-full"
                    sx={{
                        fontWeight: '500',
                        color,
                        fontSize: '2rem',
                    }}
                >
                    {message}
                </Typography>
                <Disc3
                    className="w-60 h-60 animate-spin mx-auto"
                    style={{ color }}
                    strokeWidth={1}
                />
            </Paper>
        </Box>
    );
};

export default LoadingState;
