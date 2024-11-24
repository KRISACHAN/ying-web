import React, { createContext, useContext, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface HeaderContextType {
    title: string;
    description: string;
    keywords: string;
    setHeaderInfo: (info: {
        title: string;
        description: string;
        keywords: string;
    }) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [headerInfo, setHeaderInfo] = useState({
        title: '爱我的我也爱他，恳切寻求我的必寻得见',
        description:
            '他要像一棵树栽在溪水旁，按时候结果子，叶子也不枯干。凡他所做的尽都顺利。',
        keywords: '基督教文化 基督教活动',
    });

    const handleSetHeaderInfo = (info: {
        title: string;
        description: string;
        keywords: string;
    }) => {
        setHeaderInfo(info);
    };

    return (
        <HeaderContext.Provider
            value={{ ...headerInfo, setHeaderInfo: handleSetHeaderInfo }}
        >
            <HelmetProvider>{children}</HelmetProvider>
        </HeaderContext.Provider>
    );
};

export const useHeader = () => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
};
