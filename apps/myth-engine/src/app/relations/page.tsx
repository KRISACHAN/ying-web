import Link from 'next/link';

import { TypeBadge } from '@/components/TypeBadge';
import {
    entityHref,
    getBooks,
    getEntityMap,
    getRelations,
    RELATION_LABELS,
    relationLabel,
} from '@/lib/data';

export const dynamic = 'force-static';

export const metadata = {
    title: '关联 · 中国神话索引',
};

export default function RelationsPage() {
    const relations = getRelations();
    const entityMap = getEntityMap();
    const books = getBooks();

    // Group by relation type.
    const byType = new Map<string, typeof relations>();
    for (const r of relations) {
        const arr = byType.get(r.type);
        if (arr) arr.push(r);
        else byType.set(r.type, [r]);
    }

    const typeOrder = ['flows_into', 'contains', 'appears_with'];
    const orderedTypes = [
        ...typeOrder.filter(t => byType.has(t)),
        ...[...byType.keys()].filter(t => !typeOrder.includes(t)),
    ];

    return (
        <div>
            <header className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-ink-800">
                    关联
                </h1>
                <p className="mt-2 text-sm text-ink-500">
                    从原文中自动抽取的命名实体关系，共 {relations.length} 条。
                    关系与原文依据一一对应，未作外部补全。
                </p>
                <p className="mt-2 text-xs text-ink-400">
                    数据来源：{books.books.map(b => b.title).join('、')}
                </p>
            </header>

            <div className="space-y-10">
                {orderedTypes.map(type => {
                    const rels = byType.get(type)!;
                    return (
                        <section key={type}>
                            <h2 className="mb-1 flex items-baseline gap-2 font-serif text-xl font-semibold text-ink-800">
                                {RELATION_LABELS[type] ?? type}
                                <span className="text-xs font-normal text-ink-400">
                                    {rels.length} 条
                                </span>
                            </h2>
                            <p className="mb-4 text-xs text-ink-400">
                                关系类型：
                                <code className="text-ink-500">{type}</code>
                            </p>

                            <div className="grid gap-2 sm:grid-cols-2">
                                {rels.slice(0, 200).map((r, i) => {
                                    const src = entityMap.get(r.source);
                                    const tgt = entityMap.get(r.target);
                                    return (
                                        <div
                                            key={`${r.source}-${r.target}-${i}`}
                                            className="rounded border border-ink-200 bg-white/60 p-3 text-sm"
                                        >
                                            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                                                {src ? (
                                                    <TypeBadge
                                                        type={src.type}
                                                        size="xs"
                                                    />
                                                ) : null}
                                                <Link
                                                    href={entityHref(r.source)}
                                                    className="font-medium text-ink-800 hover:text-cinnabar"
                                                >
                                                    {r.source}
                                                </Link>
                                                <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[11px] text-ink-600">
                                                    {relationLabel(r.type)}
                                                </span>
                                                {tgt ? (
                                                    <TypeBadge
                                                        type={tgt.type}
                                                        size="xs"
                                                    />
                                                ) : null}
                                                <Link
                                                    href={entityHref(r.target)}
                                                    className="font-medium text-cinnabar-dark hover:text-cinnabar"
                                                >
                                                    {r.target}
                                                </Link>
                                            </div>
                                            {r.description ? (
                                                <p className="prose-classical mt-1.5 text-xs text-ink-600">
                                                    {r.description}
                                                </p>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                            {rels.length > 200 ? (
                                <p className="mt-3 text-xs text-ink-400">
                                    仅展示前 200 条，其余可在对应实体页查看。
                                </p>
                            ) : null}
                        </section>
                    );
                })}
            </div>
        </div>
    );
}
