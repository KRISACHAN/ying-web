import { theme } from '@/theme';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { Helmet } from 'react-helmet-async';

import { useHeader } from '@/contexts/HeaderContext';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { title, description, keywords } = useHeader();

    return (
        <ThemeProvider theme={theme}>
            <article>
                <Helmet>
                    <title>{title}</title>
                    <meta name="description" content={description} />
                    <meta name="keywords" content={keywords} />
                </Helmet>
                <main className="min-h-screen w-full relative">{children}</main>
            </article>
        </ThemeProvider>
    );
};

export default BaseLayout;
