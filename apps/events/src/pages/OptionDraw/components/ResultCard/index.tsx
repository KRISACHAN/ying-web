import { Box } from '@mui/material';

export default function ResultCard({ result }: { result: string }) {
    return (
        <Box
            component="p"
            sx={{
                backgroundColor: 'var(--events-paper)',
                border: '1px solid var(--events-line)',
                borderRadius: 'var(--events-radius)',
                fontSize: 'clamp(1.35rem, 5vw, 2.2rem)',
                fontWeight: 700,
                lineHeight: 1.45,
                mt: 2,
                p: { xs: 2, sm: 3 },
                overflowWrap: 'anywhere',
                textAlign: 'start',
                whiteSpace: 'pre-wrap',
            }}
        >
            {result}
        </Box>
    );
}
