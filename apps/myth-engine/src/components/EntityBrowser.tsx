'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { TypeBadge } from '@/components/TypeBadge';
import {
    type EntitySummary,
    type EntityType,
    TYPE_LABELS,
    TYPE_ORDER,
} from '@/lib/types';

const PAGE_SIZE = 48;

export function EntityBrowser({
    entities,
    initialType,
}: {
    entities: EntitySummary[];
    initialType?: string;
}) {
    const [query, setQuery] = useState('');
    const [type, setType] = useState<string>(initialType ?? 'all');
    const [page, setPage] = useState(0);

    const counts = useMemo(() => {
        const m = new Map<string, number>();
        for (const e of entities) m.set(e.type, (m.get(e.type) ?? 0) + 1);
        return m;
    }, [entities]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entities.filter(e => {
            if (type !== 'all' && e.type !== type) return false;
            if (!q) return true;
            if (e.name.toLowerCase().includes(q)) return true;
            if (e.pinyin && e.pinyin.toLowerCase().includes(q)) return true;
            if (e.aliases.some(a => a.toLowerCase().includes(q))) return true;
            if (e.description && e.description.toLowerCase().includes(q))
                return true;
            return false;
        });
    }, [entities, query, type]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages - 1);
    const pageItems = filtered.slice(
        safePage * PAGE_SIZE,
        safePage * PAGE_SIZE + PAGE_SIZE,
    );

    function setTypeAndReset(t: string) {
        setType(t);
        setPage(0);
    }

    return (
        <div>
            {/* Search */}
            <div className="mb-4">
                <input
                    type="search"
                    value={query}
                    onChange={e => {
                        setQuery(e.target.value);
                        setPage(0);
                    }}
                    placeholder="搜索名称、拼音、别名或释义……"
                    className="w-full rounded-md border border-ink-300 bg-white/70 px-4 py-2.5 text-ink-800 outline-none placeholder:text-ink-400 focus:border-cinnabar/60 focus:ring-2 focus:ring-cinnabar/20"
                />
            </div>

            {/* Type filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <FilterChip
                    active={type === 'all'}
                    onClick={() => setTypeAndReset('all')}
                    label="全部"
                    count={entities.length}
                />
                {TYPE_ORDER.map(t => {
                    const c = counts.get(t);
                    if (!c) return null;
                    return (
                        <FilterChip
                            key={t}
                            active={type === t}
                            onClick={() => setTypeAndReset(t)}
                            label={TYPE_LABELS[t as EntityType]}
                            count={c}
                        />
                    );
                })}
            </div>

            <p className="mb-4 text-sm text-ink-500">
                共{' '}
                <span className="font-semibold text-ink-700">
                    {filtered.length}
                </span>{' '}
                条结果
            </p>

            {/* Grid */}
            {pageItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-ink-300 bg-white/40 p-12 text-center text-ink-500">
                    未找到匹配的实体。
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {pageItems.map(e => (
                        <Link
                            key={e.id}
                            href={`/entity/${encodeURIComponent(e.name)}`}
                            className="group rounded-md border border-ink-200 bg-white/60 p-4 transition hover:border-cinnabar/50 hover:shadow-sm"
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
                            {e.aliases.length > 0 ? (
                                <p className="mt-1 truncate text-xs text-ink-500">
                                    别名：{e.aliases.join('、')}
                                </p>
                            ) : null}
                            <p className="mt-2 line-clamp-2 text-sm text-ink-600">
                                {e.description ?? (
                                    <span className="italic text-ink-400">
                                        资料未载
                                    </span>
                                )}
                            </p>
                            <p className="mt-2 text-[11px] text-ink-400">
                                见 {e.bookCount} 部典籍 · {e.mentionCount} 处
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={safePage === 0}
                        className="rounded border border-ink-300 px-3 py-1.5 text-sm text-ink-700 disabled:opacity-40 hover:bg-ink-100"
                    >
                        上一页
                    </button>
                    <span className="px-2 text-sm text-ink-500">
                        {safePage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() =>
                            setPage(p => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={safePage >= totalPages - 1}
                        className="rounded border border-ink-300 px-3 py-1.5 text-sm text-ink-700 disabled:opacity-40 hover:bg-ink-100"
                    >
                        下一页
                    </button>
                </div>
            ) : null}
        </div>
    );
}

function FilterChip({
    active,
    onClick,
    label,
    count,
}: {
    active: boolean;
    onClick: () => void;
    label: string;
    count: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full border px-3 py-1 text-sm transition ${
                active
                    ? 'border-cinnabar bg-cinnabar text-ink-50'
                    : 'border-ink-300 bg-white/60 text-ink-700 hover:border-cinnabar/50 hover:text-cinnabar'
            }`}
        >
            {label}
            <span
                className={`ml-1.5 text-xs ${
                    active ? 'text-ink-50/80' : 'text-ink-400'
                }`}
            >
                {count}
            </span>
        </button>
    );
}
