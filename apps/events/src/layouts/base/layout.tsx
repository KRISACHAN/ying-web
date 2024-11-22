import './layout.css';

import React from 'react';

const BaseLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <article className="bg-[#EBF5FF]">
            <main className="min-h-screen w-full py-8 px-8 relative">
                {children}
            </main>
        </article>
    );
};

export default BaseLayout;
