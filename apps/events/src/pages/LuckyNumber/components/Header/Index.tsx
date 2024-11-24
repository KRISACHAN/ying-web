import { CalendarCheck } from 'lucide-react';
import React from 'react';

const Header: React.FC<{
    description?: string;
    name?: string;
}> = ({ description, name }) => {
    return (
        <div className="text-center h-24 w-full">
            <h1 className="text-4xl mb-5 text-orange-500 flex items-center gap-2 text-center justify-center">
                <CalendarCheck className="w-9 h-9" />
                {name || ''}
            </h1>
            <p className="text-lg text-orange-500 opacity-75">
                {description || ''}
            </p>
        </div>
    );
};

export default Header;
