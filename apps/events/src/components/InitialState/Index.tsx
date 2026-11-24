import type { ReactNode } from 'react';

import { Box, Button, Typography } from '@mui/material';

interface InitialStateProps {
    title: string;
    subtitle?: string;
    buttonText: string;
    loading: boolean;
    onClick: () => void;
    icon?: ReactNode;
}

export default function InitialState({
    title,
    subtitle,
    buttonText,
    loading,
    onClick,
    icon,
}: InitialStateProps) {
    return (
        <Box
            className="event-paper"
            sx={{
                width: '100%',
                maxWidth: 560,
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
            }}
        >
            <Typography variant="h2" sx={{ fontSize: '1.55rem', mb: 1 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {subtitle}
                </Typography>
            )}
            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={onClick}
                disabled={loading}
                startIcon={icon}
            >
                {loading ? '获取中…' : buttonText}
            </Button>
        </Box>
    );
}
