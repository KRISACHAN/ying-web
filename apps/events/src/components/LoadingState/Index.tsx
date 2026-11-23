import { Typography } from '@mui/material';

export default function LoadingState({ message }: { message: string }) {
    return (
        <Typography
            role="status"
            className="event-paper"
            sx={{ width: '100%', maxWidth: 560, p: 3, textAlign: 'center' }}
        >
            {message}
        </Typography>
    );
}
