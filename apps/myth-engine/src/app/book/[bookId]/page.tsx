import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getBook, getBooks } from '@/lib/data';

export const dynamic = 'force-static';

export function generateStaticParams() {
    return getBooks().books.map(b => ({ bookId: b.id }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ bookId: string }>;
}): Promise<Metadata> {
    const { bookId } = await params;
    const b = getBook(bookId);
    if (!b) return { title: '未找到典籍' };
    return {
        title: `${b.title} · 典籍 · 中国神话索引`,
        description: b.description,
    };
}

export default async function BookPage({
    params,
}: {
    params: Promise<{ bookId: string }>;
}) {
    const { bookId } = await params;
    const book = getBook(bookId);
    if (!book) notFound();

    return (
        <div>
            <nav className="mb-4 text-sm text-ink-500">
                <Link href="/books" className="hover:text-cinnabar">
                    典籍
                </Link>
                <span className="mx-2 text-ink-300">/</span>
                <span className="text-ink-700">{book.title}</span>
            </nav>

            <header className="mb-8 rounded-md border border-ink-200 bg-white/60 p-6">
                <h1 className="font-serif text-3xl font-bold text-ink-900">
                    {book.title}
                </h1>
                {book.titleEn || book.pinyin ? (
                    <p className="mt-1 text-sm italic text-ink-400">
                        {[book.titleEn, book.pinyin]
                            .filter(Boolean)
                            .join(' · ')}
                    </p>
                ) : null}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-500">
                    {book.era ? <span>{book.era}</span> : null}
                    {book.category ? <span>{book.category}</span> : null}
                    <span>{book.chapters.length} 篇</span>
                    <span>{book.totalEntries} 条</span>
                </div>
                {book.description ? (
                    <p className="mt-4 leading-relaxed text-ink-700">
                        {book.description}
                    </p>
                ) : null}
            </header>

            <ol className="divide-y divide-ink-200 rounded-md border border-ink-200 bg-white/50">
                {book.chapters.map(c => (
                    <li key={c.index}>
                        <Link
                            href={`/book/${book.id}/${c.index}`}
                            className="flex items-center gap-4 px-4 py-3 hover:bg-ink-50"
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-cinnabar/10 font-serif text-sm font-semibold text-cinnabar">
                                {c.index}
                            </span>
                            <span className="font-serif text-lg text-ink-800">
                                {c.title}
                            </span>
                            <span className="ml-auto text-xs text-ink-400">
                                {c.entryCount} 条 · {c.entityCount} 实体
                            </span>
                        </Link>
                    </li>
                ))}
            </ol>
        </div>
    );
}
