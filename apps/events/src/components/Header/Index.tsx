import React from 'react';

import giftAnimation from '@/animations/gift.json';
import { Typography } from '@mui/material';
import Lottie from 'lottie-react';

const Header: React.FC<{
    description?: string;
    name?: string;
    color?: string;
    backgroundColor?: string;
}> = ({ description, name, color = '#fff' }) => {
    return (
        <div
            style={{ color: color }}
            className="text-center h-20 w-full flex flex-col justify-between"
        >
            <Typography
                variant="h5"
                component="h1"
                className="inherit flex items-center gap-2 text-center justify-center"
            >
                <div className="w-9 h-9 flex items-center justify-center">
                    <Lottie
                        animationData={giftAnimation}
                        loop={true}
                        autoplay={true}
                        style={{ width: '36px', height: '36px' }}
                    />
                </div>
                <span className="relative top-1">{name || ''}</span>
            </Typography>
            <Typography variant="body1" className="inherit opacity-75">
                {description || ''}
            </Typography>
        </div>
    );
};

export default Header;
