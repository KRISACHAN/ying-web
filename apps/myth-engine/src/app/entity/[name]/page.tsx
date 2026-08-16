import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { EntityLink } from '@/components/EntityLink';
import { SourceRef } from '@/components/SourceRef';
import { TypeBadge } from '@/components/TypeBadge';
import {
    bookTitle,
    chapterHref,
    getEntityDetail,
    getEntityList,
    getEntityMap,
    getRelationsFor,
    relationLabel,
    TYPE_LABELS,
} from '@/lib/data';

export const dynamic = 'force-static';

export function generateStaticParams() {
    return getEntityList().map(e => ({ name: e.name }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ name: string }>;
}): Promise<Metadata> {
    const { name } = await params;
    const decoded = decodeURIComponent(name);
    const e = getEntityDetail(decoded);
    if (!e) return { title: '未找到 · 中国神话索引' };
    const desc =
        e.description ??
        `${e.name}（${TYPE_LABELS[e.type]}），见于 ${e.bookCount} 部典籍，共 ${e.mentionCount} 处记载。`;
    return {
        title: `${e.name} · 中国神话索引`,
        description: desc,
    };
}

export default async function EntityPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const decoded = decodeURIComponent(name);
    const entity = getEntityDetail(decoded);
    if (!entity) notFound();

    const { outgoing, incoming } = getRelationsFor(entity.name);

    // Group mentions by book for the source section.
    const mentionsByBook = new Map<string, typeof entity.mentions>();
    const bookIds: string[] = [];
    for (const m of entity.mentions) {
        const arr = mentionsByBook.get(m.bookId);
        if (arr) arr.push(m);
        else {
            mentionsByBook.set(m.bookId, [m]);
            bookIds.push(m.bookId);
        }
    }

    const annotationCount = entity.mentions.filter(
        m => m.type === 'annotation',
    ).length;
    const textCount = entity.mentions.length - annotationCount;

    return (
        <div className="space-y-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-ink-500">
                <Link href="/" className="hover:text-cinnabar">
                    首页
                </Link>
                <span className="mx-2 text-ink-300">/</span>
                <Link href="/entities" className="hover:text-cinnabar">
                    实体
                </Link>
                <span className="mx-2 text-ink-300">/</span>
                <span className="text-ink-700">{entity.name}</span>
            </nav>

            {/* Header */}
            <header className="rounded-lg border border-ink-200 bg-white/70 p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="font-serif text-4xl font-bold text-ink-900">
                                {entity.name}
                            </h1>
                            <TypeBadge type={entity.type} />
                        </div>
                        {entity.pinyin ? (
                            <p className="mt-1 text-sm italic text-ink-400">
                                {entity.pinyin}
                            </p>
                        ) : null}
                        {entity.aliases.length > 0 ? (
                            <p className="mt-3 text-sm text-ink-600">
                                <span className="text-ink-400">别名：</span>
                                {entity.aliases.join('、')}
                            </p>
                        ) : null}
                    </div>
                    <dl className="grid grid-cols-3 gap-4 text-center">
                        <Stat label="典籍" value={entity.bookCount} />
                        <Stat label="注释" value={annotationCount} />
                        <Stat label="原文" value={textCount} />
                    </dl>
                </div>

                <div className="mt-5 border-t border-ink-100 pt-4">
                    <h2 className="text-xs font-semibold tracking-widest text-ink-400">
                        释义
                    </h2>
                    {entity.description ? (
                        <p className="mt-2 leading-relaxed text-ink-800">
                            {entity.description}
                        </p>
                    ) : (
                        <p className="mt-2 italic text-ink-400">
                            所收资料未载其释义，暂付阙如。
                        </p>
                    )}
                </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-8 lg:col-span-2">
                    {/* Original evidence */}
                    <section>
                        <h2 className="mb-3 flex items-baseline gap-2 font-serif text-xl font-semibold text-ink-800">
                            原文依据
                            <span className="text-xs font-normal text-ink-400">
                                共 {entity.mentions.length} 处
                            </span>
                        </h2>
                        {entity.mentions.length === 0 ? (
                            <Empty>暂无记载。</Empty>
                        ) : (
                            <div className="space-y-4">
                                {[...mentionsByBook.entries()].map(
                                    ([bookId, mentions]) => (
                                        <div key={bookId}>
                                            <h3 className="mb-2 font-serif text-sm font-semibold text-ink-600">
                                                《{bookTitle(bookId)}》
                                            </h3>
                                            <ul className="space-y-2">
                                                {mentions.map((m, i) => (
                                                    <SourceRef
                                                        key={`${m.entryId}-${i}`}
                                                        mention={m}
                                                    />
                                                ))}
                                            </ul>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar: relations */}
                <aside className="space-y-6">
                    <section className="rounded-md border border-ink-200 bg-white/60 p-5">
                        <h2 className="mb-3 font-serif text-lg font-semibold text-ink-800">
                            关联
                        </h2>
                        {outgoing.length === 0 && incoming.length === 0 ? (
                            <p className="text-sm italic text-ink-400">
                                暂无可抽取的命名关联。
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {outgoing.length > 0 ? (
                                    <RelationGroup
                                        title="与此实体相关"
                                        relations={outgoing}
                                        direction="out"
                                        self={entity.name}
                                    />
                                ) : null}
                                {incoming.length > 0 ? (
                                    <RelationGroup
                                        title="相关于此实体"
                                        relations={incoming}
                                        direction="in"
                                        self={entity.name}
                                    />
                                ) : null}
                            </div>
                        )}
                    </section>

                    {/* Appears in */}
                    <section className="rounded-md border border-ink-200 bg-white/60 p-5">
                        <h2 className="mb-3 font-serif text-lg font-semibold text-ink-800">
                            出现于
                        </h2>
                        <ul className="space-y-1 text-sm">
                            {bookIds.map(b => (
                                <li key={b}>
                                    <Link
                                        href={`/book/${b}`}
                                        className="text-ink-700 hover:text-cinnabar"
                                    >
                                        《{bookTitle(b)}》
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        {entity.firstSeen ? (
                            <Link
                                href={chapterHref(
                                    entity.firstSeen.bookId,
                                    entity.firstSeen.chapterIndex,
                                )}
                                className="mt-3 inline-block text-xs text-cinnabar hover:underline"
                            >
                                最早记载：{bookTitle(entity.firstSeen.bookId)}{' '}
                                第 {entity.firstSeen.chapterIndex} 篇 →
                            </Link>
                        ) : null}
                    </section>
                </aside>
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div>
            <dt className="font-serif text-2xl font-semibold text-cinnabar">
                {value}
            </dt>
            <dd className="text-xs text-ink-500">{label}</dd>
        </div>
    );
}

function Empty({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded-md border border-dashed border-ink-300 bg-white/40 p-8 text-center text-sm italic text-ink-400">
            {children}
        </div>
    );
}

function RelationGroup({
    title,
    relations,
    direction,
    self,
}: {
    title: string;
    relations: ReturnType<typeof getRelationsFor>['outgoing'];
    direction: 'out' | 'in';
    self: string;
}) {
    const entityMap = getEntityMap();
    return (
        <div>
            <h3 className="mb-2 text-xs font-semibold tracking-widest text-ink-400">
                {title}
            </h3>
            <ul className="space-y-2">
                {relations.map((r, i) => {
                    const otherName = direction === 'out' ? r.target : r.source;
                    const other = entityMap.get(otherName);
                    return (
                        <li
                            key={`${r.source}-${r.target}-${r.type}-${i}`}
                            className="rounded border border-ink-100 bg-white/60 p-2.5 text-sm"
                        >
                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                <span className="text-ink-500">{self}</span>
                                <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] text-ink-600">
                                    {relationLabel(r.type)}
                                </span>
                                <EntityLink name={otherName}>
                                    <span className="font-medium text-cinnabar-dark">
                                        {otherName}
                                    </span>
                                </EntityLink>
                                {other ? (
                                    <TypeBadge type={other.type} size="xs" />
                                ) : null}
                            </div>
                            {r.description ? (
                                <p className="prose-classical mt-1.5 text-xs text-ink-600">
                                    {r.description}
                                </p>
                            ) : null}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
