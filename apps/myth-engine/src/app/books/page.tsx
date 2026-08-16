import Link from 'next/link';

import { getBooks } from '@/lib/data';

export const dynamic = 'force-static';

export const metadata = {
    title: '典籍 · 中国神话索引',
};

export default function BooksPage() {
    const books = getBooks();
    return (
        <div>
            <header className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-ink-800">
                    典籍
                </h1>
                <p className="mt-2 text-sm text-ink-500">
                    本站知识抽取自以下四部典籍，共 {books.totalChapters} 篇、
                    {books.totalEntries} 条。
                </p>
            </header>

            <div className="space-y-6">
                {books.books.map(b => (
                    <section
                        key={b.id}
                        className="rounded-md border border-ink-200 bg-white/60 p-6"
                    >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div>
                                <h2 className="font-serif text-2xl font-semibold text-ink-900">
                                    <Link
                                        href={`/book/${b.id}`}
                                        className="hover:text-cinnabar"
                                    >
                                        {b.title}
                                    </Link>
                                </h2>
                                {b.titleEn || b.pinyin ? (
                                    <p className="text-sm italic text-ink-400">
                                        {[b.titleEn, b.pinyin]
                                            .filter(Boolean)
                                            .join(' · ')}
                                    </p>
                                ) : null}
                            </div>
                            <div className="text-left md:text-right text-xs text-ink-500">
                                {b.era ? <p>{b.era}</p> : null}
                                {b.category ? <p>{b.category}</p> : null}
                            </div>
                        </div>

                        {b.description ? (
                            <p className="mt-3 leading-relaxed text-ink-700">
                                {b.description}
                            </p>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {b.chapters.map(c => (
                                <Link
                                    key={c.index}
                                    href={`/book/${b.id}/${c.index}`}
                                    className="rounded border border-ink-200 bg-ink-50 px-2.5 py-1 text-xs text-ink-700 hover:border-cinnabar/50 hover:text-cinnabar"
                                >
                                    {c.index}. {c.title}
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
