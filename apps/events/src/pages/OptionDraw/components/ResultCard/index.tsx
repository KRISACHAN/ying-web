import { Box, Button } from '@mui/material';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import React, { useRef } from 'react';
import OptionAnimation from '../OptionAnimation';

interface ResultCardProps {
    result?: string;
    prefix?: string;
    name?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
    result = '',
    prefix = '',
    name = '',
}) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleSaveImage = async () => {
        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: null,
                scale: 2,
            });

            const link = document.createElement('a');
            link.download = `${prefix}-${name}.png`;
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
                    background: 'white',
                    color: '#F87171',
                    p: 4,
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <OptionAnimation result={result ?? ''} />
                </Box>
            </Box>

            <Button
                fullWidth
                variant="outlined"
                onClick={handleSaveImage}
                startIcon={<Download className="text-[#F87171]" />}
                sx={{
                    borderRadius: 3,
                    py: 2,
                    px: 6,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    backgroundColor: 'white',
                    color: '#F87171',
                    borderColor: '#F87171',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        transition: 'transform 0.2s ease-in-out',
                        backgroundColor: 'white',
                        borderColor: '#FCA5A5',
                        color: '#FCA5A5',
                    },
                }}
            >
                保存图片
            </Button>
        </Box>
    );
};

export default ResultCard;
