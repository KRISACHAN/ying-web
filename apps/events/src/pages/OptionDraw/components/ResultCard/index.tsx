import { Box, Button, Typography } from '@mui/material';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import React, { useRef } from 'react';

interface ResultCardProps {
    option: string;
    username: string;
    activityName: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
    option,
    username,
    activityName,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2, // 提高图片质量
            });

            const link = document.createElement('a');
            link.download = `${activityName}-${username}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to save image:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
            <Box
                ref={cardRef}
                className="result-card"
                sx={{
                    mb: 2,
                    background:
                        'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
                    color: 'white',
                    p: 4,
                }}
            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    {activityName}
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                    恭喜 {username}
                </Typography>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                    {option}
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    愿这个选项为你带来好运！
                </Typography>
            </Box>

            <Button
                fullWidth
                variant="contained"
                onClick={handleSaveImage}
                startIcon={<Download />}
                sx={{
                    borderRadius: 2,
                    py: 1.5,
                    background: '#6366F1',
                    '&:hover': {
                        background: '#818CF8',
                    },
                }}
            >
                保存图片
            </Button>
        </Box>
    );
};

export default ResultCard;
