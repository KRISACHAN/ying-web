import { Box, Button, Typography } from '@mui/material';
import { Heart } from 'lucide-react';
import React from 'react';
import Confetti from 'react-confetti';

import TransitionWrapper from '../TransitionWrapper/Index';

interface ResultInterfaceProps {
    show: boolean;
    name: string | null;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    color?: string;
    icon?: React.ReactNode;
    resultComponent: React.ReactNode;
    showConfetti?: boolean;
    showResetButton?: boolean;
    onReset?: () => void;
}

const ResultInterface: React.FC<ResultInterfaceProps> = ({
    show,
    name,
    title = '恭喜',
    subtitle,
    footer,
    color = '#F87171',
    icon = <Heart />,
    resultComponent,
    showConfetti = true,
    showResetButton = false,
    onReset,
}) => {
    return (
        <>
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={300}
                />
            )}
            <TransitionWrapper show={show}>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        mb: 1,
                        color,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                    }}
                >
                    {icon}
                    {title} {name}
                </Typography>
                {subtitle && (
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 1,
                            color,
                            textAlign: 'center',
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
                <Box sx={{ position: 'relative', mb: 2 }}>
                    {resultComponent}
                    {showResetButton && (
                        <Button
                            variant="contained"
                            onClick={onReset}
                            fullWidth
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: 3,
                                fontSize: '1rem',
                                textTransform: 'none',
                                backgroundColor: color,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    transition: 'transform 0.2s ease-in-out',
                                    backgroundColor: color,
                                },
                            }}
                        >
                            重新抽选
                        </Button>
                    )}
                </Box>
                {footer && (
                    <Typography
                        variant="body1"
                        sx={{
                            fontStyle: 'italic',
                            color,
                            textAlign: 'center',
                        }}
                    >
                        {footer}
                    </Typography>
                )}
            </TransitionWrapper>
        </>
    );
};

export default ResultInterface;
