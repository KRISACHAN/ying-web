import Link from 'next/link';

import { TypeBadge } from '@/components/TypeBadge';
import {
    type EntityType,
    getBooks,
    getEntityList,
    TYPE_LABELS,
    TYPE_ORDER,
} from '@/lib/data';

export const dynamic = 'force-static';

function StatCard({
    label,
    value,
    hint,
}: {
    label: string;
    value: number | string;
    hint?: string;
}) {
    return (
        <div className="rounded-md border border-ink-200 bg-white/60 p-4 text-center shadow-sm">
            <div className="font-serif text-3xl font-semibold text-cinnabar">
                {value}
            </div>
            <div className="mt-1 text-sm text-ink-600">{label}</div>
            {hint ? (
                <div className="mt-0.5 text-[11px] text-ink-400">{hint}</div>
            ) : null}
        </div>
    );
}

export default function HomePage() {
    const books = getBooks();
    const entities = getEntityList();

    const typeCounts = new Map<EntityType, number>();
    for (const e of entities) {
        typeCounts.set(e.type, (typeCounts.get(e.type) ?? 0) + 1);
    }

    // A few representative "named" entities for the showcase, chosen by mention
    // count across the corpus. Pure data-driven — nothing fabricated.
    const featured = [...entities]
        .sort((a, b) => b.mentionCount - a.mentionCount)
        .slice(0, 12);

    return (
        <div className="space-y-12">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-lg border border-ink-200 bg-gradient-to-br from-ink-800 to-ink-900 px-6 py-12 text-ink-50 shadow-md sm:px-12 sm:py-16">
                <div className="pointer-events-none absolute -right-6 top-2 select-none font-serif text-[10rem] leading-none text-cinnabar/20 sm:text-[14rem]">
                    神秘
                </div>
                <div className="relative max-w-2xl">
                    <p className="text-xs tracking-[0.4em] text-cinnabar-light">
                        MYTH · GEOGRAPHY · LEGEND
                    </p>
                    <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">
                        中国神话索引
                    </h1>
                    <p className="mt-4 leading-relaxed text-ink-200">
                        从《山海经》《搜神记》《楚辞》《淮南子》四部典籍中，
                        系统梳理人物神祇、异兽禽鱼、山川邦国——每一条知识都可回溯到
                        原文与注释，所见皆有据，未知者不补。
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href="/entities"
                            className="rounded bg-cinnabar px-5 py-2.5 text-sm font-medium text-ink-50 hover:bg-cinnabar-dark"
                        >
                            浏览全部实体
                        </Link>
                        <Link
                            href="/books"
                            className="rounded border border-ink-50/40 px-5 py-2.5 text-sm font-medium text-ink-50 hover:bg-ink-50/10"
                        >
                            翻阅典籍
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard label="部典籍" value={books.bookCount} />
                    <StatCard label="篇章" value={books.totalChapters} />
                    <StatCard label="条目" value={books.totalEntries} />
                    <StatCard
                        label="实体"
                        value={books.entityCount}
                        hint={`关系 ${books.relationCount} 条`}
                    />
                </div>
            </section>

            {/* Browse by type */}
            <section>
                <div className="mb-4 flex items-baseline justify-between">
                    <h2 className="font-serif text-2xl font-semibold text-ink-800">
                        按类浏览
                    </h2>
                    <Link
                        href="/entities"
                        className="text-sm text-cinnabar hover:underline"
                    >
                        全部 →
                    </Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {TYPE_ORDER.map(t => {
                        const count = typeCounts.get(t) ?? 0;
                        if (count === 0) return null;
                        return (
                            <Link
                                key={t}
                                href={`/entities?type=${t}`}
                                className="group rounded-md border border-ink-200 bg-white/60 p-4 text-center transition hover:border-cinnabar/50 hover:shadow-sm"
                            >
                                <div className="font-serif text-2xl font-semibold text-ink-800 group-hover:text-cinnabar">
                                    {count}
                                </div>
                                <div className="mt-1 text-sm text-ink-600">
                                    {TYPE_LABELS[t]}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Books */}
            <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold text-ink-800">
                    典籍来源
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {books.books.map(b => (
                        <Link
                            key={b.id}
                            href={`/book/${b.id}`}
                            className="group flex gap-4 rounded-md border border-ink-200 bg-white/60 p-5 transition hover:border-cinnabar/50 hover:shadow-sm"
                        >
                            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded border border-cinnabar/30 bg-cinnabar/5 font-serif text-cinnabar">
                                <span className="text-xl font-bold leading-none">
                                    {b.title.slice(0, 2)}
                                </span>
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="font-serif text-lg font-semibold text-ink-800 group-hover:text-cinnabar">
                                        {b.title}
                                    </h3>
                                    {b.era ? (
                                        <span className="text-xs text-ink-400">
                                            {b.era}
                                        </span>
                                    ) : null}
                                </div>
                                {b.pinyin ? (
                                    <p className="text-xs italic text-ink-400">
                                        {b.pinyin}
                                    </p>
                                ) : null}
                                <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-600">
                                    {b.description}
                                </p>
                                <p className="mt-2 text-xs text-ink-500">
                                    {b.chapters.length} 篇 ·{' '}
                                    {b.totalEntries ?? 0} 条
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured entities */}
            <section>
                <h2 className="mb-4 font-serif text-2xl font-semibold text-ink-800">
                    常见条目
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {featured.map(e => (
                        <Link
                            key={e.id}
                            href={`/entity/${encodeURIComponent(e.name)}`}
                            className="group rounded-md border border-ink-200 bg-white/60 p-4 hover:border-cinnabar/50 hover:shadow-sm"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <span className="font-serif text-lg font-semibold text-ink-800 group-hover:text-cinnabar">
                                    {e.name}
                                </span>
                                <TypeBadge type={e.type} size="xs" />
                            </div>
                            {e.pinyin ? (
                                <p className="mt-0.5 text-xs italic text-ink-400">
                                    {e.pinyin}
                                </p>
                            ) : null}
                            <p className="mt-2 line-clamp-2 text-xs text-ink-500">
                                {e.description ?? '资料未载'}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
