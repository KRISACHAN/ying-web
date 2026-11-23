import { Typography } from '@mui/material';

export default function TipBar({ message }: { message: string }) {
    return (
        <Typography
            color="text.secondary"
            sx={{ textAlign: 'center', fontSize: '0.925rem' }}
        >
            {message}
        </Typography>
    );
}
