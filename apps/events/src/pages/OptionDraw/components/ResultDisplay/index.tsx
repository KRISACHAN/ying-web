import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import OptionAnimation from '../OptionAnimation';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    textAlign: 'center',
    borderRadius: theme.spacing(2),
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

interface ResultDisplayProps {
    option: string;
    username: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ option, username }) => {
    return (
        <StyledPaper elevation={3}>
            <Box sx={{ mb: 3 }}>
                <OptionAnimation option={option} />
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
                恭喜 {username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
                抽中了选项
            </Typography>
            <Typography
                variant="h5"
                color="primary"
                sx={{ mt: 1, fontWeight: 'bold' }}
            >
                {option}
            </Typography>
        </StyledPaper>
    );
};

export default ResultDisplay;
