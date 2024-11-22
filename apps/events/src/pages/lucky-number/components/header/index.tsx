import './index.css';

import { CalendarCheck } from 'lucide-react';
import React from 'react';

const Header: React.FC<{
    description?: string;
    name?: string;
}> = ({ description, name }) => {
    return (
        <div className="text-center h-32 w-full">
            <h1 className="text-4xl mb-5 text-gray-800 flex items-center gap-2">
                <CalendarCheck className="w-9 h-9 text-blue-500" />
                {name || ''}
            </h1>
            <p className="text-lg mb-5">{description || ''}</p>
        </div>
    );
};

export default Header;
