import type { MetadataRoute } from 'next';

import { getBooks, getEntityList } from '@/lib/data';

export const dynamic = 'force-static';

const BASE = 'https://ying-myth-engine.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/entities',
        '/books',
        '/relations',
        '/about',
    ].map(p => ({
        url: `${BASE}${p}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: p === '' ? 1 : 0.7,
    }));

    const entities = getEntityList().map(e => ({
        url: `${BASE}/entity/${encodeURIComponent(e.name)}`,
        lastModified: now,
        changeFrequency: 'yearly' as const,
        priority: 0.5,
    }));

    const chapters: MetadataRoute.Sitemap = [];
    for (const b of getBooks().books) {
        chapters.push({
            url: `${BASE}/book/${b.id}`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.6,
        });
        for (const c of b.chapters) {
            chapters.push({
                url: `${BASE}/book/${b.id}/${c.index}`,
                lastModified: now,
                changeFrequency: 'yearly',
                priority: 0.4,
            });
        }
    }

    return [...staticRoutes, ...chapters, ...entities];
}
