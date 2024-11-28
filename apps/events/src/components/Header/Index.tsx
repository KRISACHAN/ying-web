import React from 'react';

import { Typography } from '@mui/material';
import { Gift } from 'lucide-react';

const Header: React.FC<{
    description?: string;
    name?: string;
    color?: string;
}> = ({ description, name, color = '#fff' }) => {
    return (
        <div
            style={{ color: color }}
            className="text-center h-20 w-full flex flex-col justify-between"
        >
            <Typography
                variant="h4"
                component="h1"
                className="inherit flex items-center gap-2 text-center justify-center"
            >
                <Gift className="w-9 h-9" />
                {name || ''}
            </Typography>
            <Typography variant="body1" className="inherit opacity-75">
                {description || ''}
            </Typography>
        </div>
    );
};

export default Header;
