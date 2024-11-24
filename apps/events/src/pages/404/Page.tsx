import { Heart } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC<{ title?: string; message?: string }> = ({
    title = '404 - 页面不存在',
    message = '要不你回到首页看看其它功能？',
}) => {
    return (
        <div className="min-h-screen bg-[#EBF5FF] flex flex-col items-center pt-8 px-4">
            <div className="flex items-center gap-2 mb-8">
                <Heart className="w-9 h-9 text-red-400 fill-current" />
                <h1 className="text-3xl font-bold">{title}</h1>
            </div>
            <p className="text-xl mb-4">{message}</p>
            <Link to="/" className="text-blue-500 underline">
                回到首页
            </Link>
        </div>
    );
};

export default NotFoundPage;
