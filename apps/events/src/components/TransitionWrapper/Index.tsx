import type { ReactNode } from 'react';

import { Box } from '@mui/material';

interface TransitionWrapperProps {
    show: boolean;
    children: ReactNode;
    maxWidth?: number;
    reveal?: boolean;
}

export default function TransitionWrapper({
    show,
    children,
    maxWidth = 560,
    reveal = false,
}: TransitionWrapperProps) {
    if (!show) return null;

    return (
        <Box
            className={reveal ? 'event-paper event-reveal' : 'event-paper'}
            sx={{
                width: '100%',
                maxWidth,
                mx: 'auto',
                p: { xs: 2, sm: 3 },
                overflowWrap: 'anywhere',
            }}
        >
            {children}
        </Box>
    );
}
