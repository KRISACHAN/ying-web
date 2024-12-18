import React from 'react';
import { Link } from 'react-router-dom';

import HeaderInterface from '@/components/Header/Index';

const NotFoundPage: React.FC<{
    name?: string;
    description?: string;
}> = ({
    name = '404 - 页面不存在',
    description = '要不你回到首页看看其它功能？',
}) => {
    return (
        <div className={`min-h-screen flex flex-col items-center pt-8 px-4`}>
            <HeaderInterface name={name} description={description} />
            <Link to="/" style={{ color: '#fff' }} className="underline mt-4">
                回到首页
            </Link>
        </div>
    );
};

export default NotFoundPage;
