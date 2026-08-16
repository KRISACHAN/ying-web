import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { FullTextView } from '@/components/FullTextView';
import {
    getBook,
    getBooks,
    getChapter,
    getChapterHighlightData,
} from '@/lib/data';

export const dynamic = 'force-static';

export function generateStaticParams() {
    const params: { bookId: string; chapter: string }[] = [];
    for (const b of getBooks().books) {
        for (const c of b.chapters) {
            params.push({ bookId: b.id, chapter: String(c.index) });
        }
    }
    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ bookId: string; chapter: string }>;
}): Promise<Metadata> {
    const { bookId, chapter } = await params;
    const book = getBook(bookId);
    const ch = getChapter(bookId, Number(chapter));
    if (!book || !ch) return { title: '未找到篇章' };
    return {
        title: `${ch.chapterTitle} · ${book.title} · 中国神话索引`,
    };
}

export default async function ChapterPage({
    params,
}: {
    params: Promise<{ bookId: string; chapter: string }>;
}) {
    const { bookId, chapter: chapterParam } = await params;
    const book = getBook(bookId);
    const chapterIndex = Number(chapterParam);
    const chapter = getChapter(bookId, chapterIndex);
    if (!book || !chapter) notFound();

    const meta = book.chapters.find(c => c.index === chapterIndex)!;
    const { entityData, mentions } = getChapterHighlightData(chapter);

    const originalParagraphs = chapter.entries.map(e => e.originalText);
    const translationParagraphs = chapter.entries
        .map(e => e.translation)
        .filter((t): t is string => Boolean(t && t.trim()));

    const prev = book.chapters.find(c => c.index === chapterIndex - 1);
    const next = book.chapters.find(c => c.index === chapterIndex + 1);

    return (
        <div>
            <nav className="mb-4 text-sm text-ink-500">
                <Link href="/books" className="hover:text-cinnabar">
                    典籍
                </Link>
                <span className="mx-2 text-ink-300">/</span>
                <Link href={`/book/${book.id}`} className="hover:text-cinnabar">
                    {book.title}
                </Link>
                <span className="mx-2 text-ink-300">/</span>
                <span className="text-ink-700">{chapter.chapterTitle}</span>
            </nav>

            <header className="mb-6 rounded-md border border-ink-200 bg-white/60 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs tracking-widest text-ink-400">
                            {book.title} · 第 {chapter.chapterIndex} 篇
                        </p>
                        <h1 className="mt-1 font-serif text-3xl font-bold text-ink-900">
                            {chapter.chapterTitle}
                        </h1>
                    </div>
                    {meta.sourceUrl ? (
                        <a
                            href={meta.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-xs text-ink-400 hover:text-cinnabar"
                        >
                            原文底本：8bei8.com ↗
                        </a>
                    ) : null}
                </div>
            </header>

            <FullTextView
                originalParagraphs={originalParagraphs}
                translationParagraphs={translationParagraphs}
                mentions={mentions}
                entityData={entityData}
            />

            {/* Prev / Next */}
            <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-200 pt-6">
                {prev ? (
                    <Link
                        href={`/book/${book.id}/${prev.index}`}
                        className="group text-sm"
                    >
                        <span className="block text-xs text-ink-400">
                            ← 上一篇
                        </span>
                        <span className="font-serif text-ink-700 group-hover:text-cinnabar">
                            {prev.title}
                        </span>
                    </Link>
                ) : (
                    <span />
                )}
                {next ? (
                    <Link
                        href={`/book/${book.id}/${next.index}`}
                        className="group text-right text-sm"
                    >
                        <span className="block text-xs text-ink-400">
                            下一篇 →
                        </span>
                        <span className="font-serif text-ink-700 group-hover:text-cinnabar">
                            {next.title}
                        </span>
                    </Link>
                ) : (
                    <span />
                )}
            </div>
        </div>
    );
}
