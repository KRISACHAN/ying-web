import { Box, Button, Paper, Typography } from '@mui/material';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface InitialStateProps {
    title: string;
    subtitle: string;
    buttonText: string;
    loading: boolean;
    onClick: () => void;
    color?: string;
    icon?: React.ReactNode;
}

const InitialState: React.FC<InitialStateProps> = ({
    title,
    subtitle,
    buttonText,
    loading,
    onClick,
    color = '#F87171',
    icon,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                width: '100%',
                position: 'relative',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    py: 2,
                    px: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: 600,
                    textAlign: 'center',
                }}
            >
                <Box
                    component="img"
                    src="/love-banner.svg"
                    alt="爱心"
                    sx={{
                        width: '100%',
                        maxWidth: 200,
                        height: 'auto',
                        animation: 'float 3s ease-in-out infinite',
                        mx: 'auto',
                        display: 'block',
                    }}
                />
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 'bold', color }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mb: 2, color, opacity: 0.75 }}
                >
                    {subtitle}
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClick}
                    disabled={loading}
                    startIcon={
                        loading ? <Loader2 className="animate-spin" /> : icon
                    }
                    sx={{
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        width: '100%',
                        backgroundColor: color,
                        '&:hover': {
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s ease-in-out',
                            backgroundColor: color,
                        },
                    }}
                >
                    {loading ? '获取中...' : buttonText}
                </Button>
            </Paper>
        </Box>
    );
};

export default InitialState;
