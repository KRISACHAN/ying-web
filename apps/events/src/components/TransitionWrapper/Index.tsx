import { Box, Paper } from '@mui/material';
import React from 'react';
import { CSSTransition } from 'react-transition-group';
import '../Transitions/transitions.less';

interface TransitionWrapperProps {
    show: boolean;
    children: React.ReactNode;
    maxWidth?: number;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
    show,
    children,
    maxWidth = 600,
}) => {
    const nodeRef = React.useRef(null);

    return (
        <CSSTransition
            nodeRef={nodeRef}
            in={show}
            timeout={1000}
            classNames="result"
            unmountOnExit
        >
            <div className="relative w-full">
                <Box ref={nodeRef} sx={{ position: 'relative', width: '100%' }}>
                    <Paper
                        elevation={4}
                        sx={{
                            py: 4,
                            px: 4,
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            textAlign: 'left',
                            maxWidth,
                            mx: 'auto',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        {children}
                    </Paper>
                </Box>
            </div>
        </CSSTransition>
    );
};

export default TransitionWrapper;
