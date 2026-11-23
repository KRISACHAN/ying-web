import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useHeader } from '@/contexts/HeaderContext';
import { themeVariables } from '@/theme';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { title, description, keywords } = useHeader();

    return (
        <main className="events-shell" style={themeVariables}>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="keywords" content={keywords} />
            </Helmet>
            {children}
        </main>
    );
};

export default BaseLayout;
