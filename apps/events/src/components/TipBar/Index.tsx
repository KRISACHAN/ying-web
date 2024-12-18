import { Paper, Typography } from '@mui/material';
import { Heart } from 'lucide-react';
import React from 'react';

interface TipBarProps {
    message: string;
    color?: string;
}

const TipBar: React.FC<TipBarProps> = ({ message, color = '#F87171' }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
            }}
            className="bg-white opacity-75"
        >
            <Heart className="w-5 h-5" style={{ color }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color }}>
                {message}
            </Typography>
        </Paper>
    );
};

export default TipBar;
