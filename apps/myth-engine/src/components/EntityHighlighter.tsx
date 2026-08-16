'use client';

import {
    createContext,
    type ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import Link from 'next/link';

import { type EntityType, TYPE_LABELS } from '@/lib/types';

// Minimal entity info needed to render the hover popover / mobile modal. Built
// on the server (only for entities referenced in the current chapter) and
// passed in.
export interface EntityCardData {
    name: string;
    type: EntityType;
    pinyin?: string | null;
    aliases: string[];
    description: string | null;
}

export interface Mention {
    term: string;
    entityName: string;
}

// Tailwind's `md` breakpoint. Taps below this open a modal instead of
// navigating / showing the hover popover (which has no hover on touch).
const MD_QUERY = '(min-width: 768px)';

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const TYPE_DOT: Record<string, string> = {
    person: 'bg-cinnabar',
    deity: 'bg-amber-600',
    creature: 'bg-stone-700',
    bird: 'bg-sky-700',
    fish: 'bg-cyan-700',
    serpent: 'bg-emerald-800',
    mountain: 'bg-stone-600',
    river: 'bg-blue-700',
    state: 'bg-purple-700',
    place: 'bg-yellow-700',
    plant: 'bg-green-700',
    tree: 'bg-lime-700',
    mineral: 'bg-zinc-600',
    object: 'bg-orange-700',
    concept: 'bg-rose-700',
    star: 'bg-indigo-700',
    unit: 'bg-gray-500',
    unknown: 'bg-gray-400',
};

function buildSegments(text: string, mentions: Mention[]) {
    // One surface form can map to several refs; collapse to a unique term ->
    // entityName map, keeping only terms that actually occur. Longest first so
    // nested matches (招摇之山 vs 山) resolve to the more specific term.
    const termToEntity = new Map<string, string>();
    for (const m of mentions) {
        if (m.term && m.term.length >= 1 && text.includes(m.term)) {
            if (!termToEntity.has(m.term))
                termToEntity.set(m.term, m.entityName);
        }
    }
    const terms = [...termToEntity.keys()].sort((a, b) => b.length - a.length);
    if (terms.length === 0)
        return { segments: [text] as (string | Segment)[], count: 0 };

    const re = new RegExp(terms.map(escapeRegex).join('|'), 'g');
    const out: (string | Segment)[] = [];
    let last = 0;
    let count = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
        if (match.index > last) out.push(text.slice(last, match.index));
        const term = match[0];
        out.push({ term, entityName: termToEntity.get(term) ?? term });
        count++;
        last = match.index + term.length;
    }
    if (last < text.length) out.push(text.slice(last));
    return { segments: out, count };
}

interface Segment {
    term: string;
    entityName: string;
}

// ── Mobile modal ───────────────────────────────────────────────────────────
// One shared modal per highlighted region. Below `md`, tapping a mention calls
// openModal() instead of following the link; the modal shows the full entity
// summary with a link through to the entity page.

interface ModalState {
    data: EntityCardData;
    surfaceTerm: string;
}

interface ModalContextValue {
    openModal: (data: EntityCardData, surfaceTerm: string) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function EntityModalProvider({ children }: { children: ReactNode }) {
    const [active, setActive] = useState<ModalState | null>(null);

    const openModal = useCallback(
        (data: EntityCardData, surfaceTerm: string) =>
            setActive({ data, surfaceTerm }),
        [],
    );

    // Close on Escape and lock body scroll while open.
    useEffect(() => {
        if (!active) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActive(null);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [active]);

    const value = useMemo(() => ({ openModal }), [openModal]);

    return (
        <ModalContext.Provider value={value}>
            {children}
            {active ? (
                <EntityModal
                    data={active.data}
                    surfaceTerm={active.surfaceTerm}
                    onClose={() => setActive(null)}
                />
            ) : null}
        </ModalContext.Provider>
    );
}

function EntityModal({
    data,
    surfaceTerm,
    onClose,
}: {
    data: EntityCardData;
    surfaceTerm: string;
    onClose: () => void;
}) {
    const dotColor = TYPE_DOT[data.type] ?? 'bg-gray-400';
    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-900/50 p-0 sm:items-center sm:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={data.name}
        >
            <div
                className="w-full max-w-lg rounded-t-xl border border-ink-200 bg-ink-50 p-5 shadow-2xl sm:rounded-xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${dotColor}`}
                        />
                        <span className="font-serif text-xl font-semibold text-ink-900">
                            {data.name}
                        </span>
                        {surfaceTerm !== data.name ? (
                            <span className="text-sm text-ink-400">
                                （{surfaceTerm}）
                            </span>
                        ) : null}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="关闭"
                        className="-mr-2 -mt-1 rounded p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span className="text-ink-600">
                        {TYPE_LABELS[data.type]}
                    </span>
                    {data.pinyin ? (
                        <span className="italic text-ink-400">
                            {data.pinyin}
                        </span>
                    ) : null}
                </div>

                {data.aliases.length > 0 ? (
                    <p className="mt-2 text-sm text-ink-500">
                        <span className="text-ink-400">别名：</span>
                        {data.aliases.join('、')}
                    </p>
                ) : null}

                <div className="mt-3 max-h-[50vh] overflow-y-auto rounded border border-ink-100 bg-white/70 p-3 text-sm leading-relaxed text-ink-700">
                    {data.description ?? (
                        <span className="italic text-ink-400">
                            资料未载，仅知其名见于此篇。
                        </span>
                    )}
                </div>

                <Link
                    href={`/entity/${encodeURIComponent(data.name)}`}
                    className="mt-4 block rounded border border-cinnabar/40 bg-cinnabar/5 px-3 py-2 text-center text-sm font-medium text-cinnabar-dark hover:bg-cinnabar/10"
                >
                    查看完整条目 →
                </Link>
            </div>
        </div>
    );
}

/**
 * Presentational: render `text` with entity terms highlighted.
 *
 * Desktop (≥ md): hover shows a popover; click navigates to the entity page.
 * Mobile (< md): there is no hover, so a tap opens a modal (provided by
 * EntityModalProvider) instead of navigating. Wrap any region using this
 * component in <EntityModalProvider> so taps have somewhere to surface.
 */
export function HighlightedText({
    text,
    mentions,
    entityData,
    enabled = true,
}: {
    text: string;
    mentions: Mention[];
    entityData: Record<string, EntityCardData>;
    enabled?: boolean;
}) {
    const modal = useContext(ModalContext);
    const { segments } = useMemo(
        () => buildSegments(text, mentions),
        [text, mentions],
    );
    return (
        <>
            {segments.map((seg, i) => {
                if (typeof seg === 'string') return <span key={i}>{seg}</span>;
                const data = entityData[seg.entityName];
                if (!enabled || !data) return <span key={i}>{seg.term}</span>;
                return (
                    <Link
                        key={i}
                        href={`/entity/${encodeURIComponent(data.name)}`}
                        onClick={e => {
                            // Below md: intercept the tap and open the modal rather than
                            // navigate. matchMedia is the JS mirror of Tailwind's md.
                            if (
                                typeof window !== 'undefined' &&
                                !window.matchMedia(MD_QUERY).matches
                            ) {
                                e.preventDefault();
                                modal?.openModal(data, seg.term);
                            }
                        }}
                        className="entity-mention group relative inline cursor-pointer rounded-sm underline decoration-cinnabar/40 decoration-dotted underline-offset-4 hover:bg-cinnabar/10 active:bg-cinnabar/20"
                    >
                        <span className="border-b border-cinnabar/30">
                            {seg.term}
                        </span>
                        <Popover data={data} surfaceTerm={seg.term} />
                    </Link>
                );
            })}
        </>
    );
}

function Popover({
    data,
    surfaceTerm,
}: {
    data: EntityCardData;
    surfaceTerm: string;
}) {
    const dotColor = TYPE_DOT[data.type] ?? 'bg-gray-400';
    return (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-72 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 md:block">
            <span className="block rounded-md border border-ink-200 bg-ink-50 p-3 text-left shadow-xl">
                <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${dotColor}`} />
                    <span className="font-serif text-base font-semibold text-ink-900">
                        {data.name}
                    </span>
                    {surfaceTerm !== data.name ? (
                        <span className="text-xs text-ink-400">
                            （{surfaceTerm}）
                        </span>
                    ) : null}
                </span>
                <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-ink-500">
                    <span className="text-ink-600">
                        {TYPE_LABELS[data.type]}
                    </span>
                    {data.pinyin ? (
                        <span className="italic text-ink-400">
                            {data.pinyin}
                        </span>
                    ) : null}
                </span>
                {data.aliases.length > 0 ? (
                    <p className="mt-1.5 text-xs text-ink-500">
                        <span className="text-ink-400">别名：</span>
                        {data.aliases.join('、')}
                    </p>
                ) : null}
                <p className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-ink-700">
                    {data.description ?? (
                        <span className="italic text-ink-400">资料未载</span>
                    )}
                </p>
                <p className="mt-2 text-[11px] text-cinnabar">
                    点击查看完整条目 →
                </p>
            </span>
        </span>
    );
}
