import { Link } from 'react-router-dom';

import { Box, Button } from '@mui/material';

import Header from '@/components/Header/Index';

interface NotFoundProps {
    name?: string;
    description?: string;
}

export default function NotFoundPage({
    name = '404 - 页面不存在',
    description = '要不你回到首页看看其它功能？',
}: NotFoundProps) {
    return (
        <Box sx={{ maxWidth: 580, mx: 'auto', px: 2, pt: { xs: 4, sm: 9 } }}>
            <Box
                className="event-paper"
                sx={{ p: { xs: 2, sm: 4 }, textAlign: 'center' }}
            >
                <Header name={name} description={description} />
                <Button
                    component={Link}
                    to="/"
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    回到首页
                </Button>
            </Box>
        </Box>
    );
}
