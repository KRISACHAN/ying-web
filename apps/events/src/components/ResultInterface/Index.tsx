import celebrationAnimation from '@/animations/confetti.json';
import { Box, Button, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import { Heart } from 'lucide-react';
import React from 'react';

import { themeColors } from '@/theme';
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
    color = themeColors.primary.main,
    icon = <Heart />,
    resultComponent,
    showConfetti = true,
    showResetButton = false,
    onReset,
}) => {
    return (
        <>
            {showConfetti && (
                <div
                    className="fixed inset-0 pointer-events-none"
                    style={{ zIndex: 100 }}
                >
                    <Lottie
                        animationData={celebrationAnimation}
                        loop={false}
                        autoplay={true}
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
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
                                color: themeColors.text.inverse,
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    transition: 'transform 0.2s ease-in-out',
                                    backgroundColor: color,
                                    color: themeColors.text.inverse,
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
