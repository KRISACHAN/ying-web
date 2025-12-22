import { Paper, Typography } from '@mui/material';
import { Heart } from 'lucide-react';
import React from 'react';

import { themeColors } from '@/theme';

interface TipBarProps {
    message: string;
    color?: string;
}

const TipBar: React.FC<TipBarProps> = ({
    message,
    color = themeColors.primary.main,
}) => {
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
            <Typography
                className="!text-[18px] !font-bold"
                variant="body2"
                sx={{ color }}
            >
                {message}
            </Typography>
        </Paper>
    );
};

export default TipBar;
