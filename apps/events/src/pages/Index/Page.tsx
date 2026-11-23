import { Link } from 'react-router-dom';

import { Box } from '@mui/material';
import { ArrowRight } from 'lucide-react';

import Header from '@/components/Header/Index';

export default function IndexPage() {
    return (
        <Box sx={{ maxWidth: 560, mx: 'auto', px: 2, pt: { xs: 4, sm: 7 } }}>
            <Header name="活动" illustration="wide" />
            <nav aria-label="经文抽取">
                <ul className="event-home-links">
                    <li>
                        <Link className="event-paper" to="/promise">
                            抽取经文 <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </li>
                    <li>
                        <Link className="event-paper" to="/promise-new">
                            抽取经文（新版）{' '}
                            <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </Box>
    );
}
