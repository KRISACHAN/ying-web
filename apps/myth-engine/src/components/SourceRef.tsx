import Link from 'next/link';

import { bookTitle, entryHref, type Mention } from '@/lib/data';

/** A single source-citation row: where a claim/mention comes from. */
export function SourceRef({ mention }: { mention: Mention }) {
    const {
        bookId,
        chapterIndex,
        entryId,
        type,
        context,
        annotationExplanation,
    } = mention;
    const entryIndex = Number(entryId.split('-').pop());
    const href = entryHref(bookId, chapterIndex, entryIndex);
    const isAnnotation = type === 'annotation';

    return (
        <li className="rounded-md border border-ink-200 bg-white/50 p-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-serif text-sm font-semibold text-ink-800">
                    {bookTitle(bookId)}
                </span>
                <span className="text-ink-400">·</span>
                <Link href={href} className="text-ink-500 hover:text-cinnabar">
                    第 {chapterIndex} 篇 · 条目 {entryIndex}
                </Link>
                <span
                    className={`ml-auto rounded px-1.5 py-0.5 text-[10px] ${
                        isAnnotation
                            ? 'bg-jade/10 text-jade border border-jade/20'
                            : 'bg-ink-100 text-ink-500 border border-ink-200'
                    }`}
                >
                    {isAnnotation ? '注释' : '原文'}
                </span>
            </div>

            {context ? (
                <blockquote className="prose-classical mt-2 border-l-2 border-cinnabar/40 pl-3 text-sm text-ink-700">
                    {context}
                </blockquote>
            ) : null}

            {isAnnotation && annotationExplanation ? (
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    <span className="text-jade">释：</span>
                    {annotationExplanation}
                </p>
            ) : null}
        </li>
    );
}
