import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useHeader } from '@/contexts/HeaderContext';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { title, description, keywords } = useHeader();

    return (
        <article>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Helmet>
            <div className="min-h-screen w-full relative bg-[#F87171]">
                {children}
            </div>
        </article>
    );
};

export default BaseLayout;
