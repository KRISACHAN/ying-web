import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useHeader } from '@/contexts/header-context';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { title, description, keywords } = useHeader();

    return (
        <article className="bg-[#EBF5FF]">
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Helmet>
            <main className="min-h-screen w-full py-8 px-8 relative">
                {children}
            </main>
        </article>
    );
};

export default BaseLayout;
