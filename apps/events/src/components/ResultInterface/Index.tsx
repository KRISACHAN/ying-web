import type { ReactNode } from 'react';

import { Box, Button, Typography } from '@mui/material';

import TransitionWrapper from '@/components/TransitionWrapper/Index';

interface ResultInterfaceProps {
    show: boolean;
    name?: string | null;
    subtitle?: string;
    footer?: ReactNode;
    resultComponent: ReactNode;
    reveal?: boolean;
    onReset?: () => void;
}

export default function ResultInterface({
    show,
    name,
    subtitle,
    footer,
    resultComponent,
    reveal,
    onReset,
}: ResultInterfaceProps) {
    return (
        <TransitionWrapper show={show} reveal={reveal}>
            <Box role="status" sx={{ textAlign: 'center' }}>
                {name && (
                    <Typography variant="h2" sx={{ fontSize: '1.5rem', mb: 1 }}>
                        {name}
                    </Typography>
                )}
                {subtitle && (
                    <Typography color="text.secondary">{subtitle}</Typography>
                )}
                {resultComponent}
            </Box>
            {footer}
            {onReset && (
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onReset}
                    sx={{ mt: 2 }}
                >
                    重新抽选
                </Button>
            )}
        </TransitionWrapper>
    );
}
