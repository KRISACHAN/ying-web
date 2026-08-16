'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderBook {
    id: string;
    title: string;
}

const NAV_LINKS = [
    { href: '/entities', label: '浏览实体' },
    { href: '/books', label: '典籍' },
    { href: '/relations', label: '关联' },
    { href: '/about', label: '关于' },
] as const;

/**
 * Site-wide sticky header.
 *
 * Responsive by the `md` rule:
 * - ≥ md: inline nav links + a horizontally scrollable row of book chips.
 * - < md: a hamburger button toggles a panel containing all nav links (关联/关于
 *   are otherwise unreachable on small screens). The book-chip row stays visible
 *   and scrolls horizontally.
 *
 * The mobile panel closes on route change and on Escape.
 */
export function SiteHeader({ books }: { books: HeaderBook[] }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Close the menu whenever the route changes.
    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close on Escape; lock body scroll while the panel is open.
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    return (
        <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-ink-50/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <Link
                    href="/"
                    className="group flex min-w-0 items-center gap-3"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-cinnabar/40 bg-cinnabar/5 font-serif text-xl text-cinnabar">
                        神
                    </span>
                    <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate font-serif text-lg font-semibold text-ink-800 group-hover:text-cinnabar">
                            中国神话索引
                        </span>
                        <span className="hidden text-[11px] tracking-widest text-ink-400 sm:block">
                            YING MYTH ENGINE
                        </span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-1 text-sm md:flex">
                    {NAV_LINKS.map(l => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className="rounded px-3 py-1.5 text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                        >
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                    type="button"
                    onClick={() => setOpen(v => !v)}
                    aria-label={open ? '关闭菜单' : '打开菜单'}
                    aria-expanded={open}
                    aria-controls="mobile-nav-panel"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-ink-200 text-ink-700 hover:border-cinnabar/50 hover:text-cinnabar md:hidden"
                >
                    <span className="sr-only">菜单</span>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="h-5 w-5"
                        aria-hidden="true"
                    >
                        {open ? (
                            <>
                                <line x1="6" y1="6" x2="18" y2="18" />
                                <line x1="6" y1="18" x2="18" y2="6" />
                            </>
                        ) : (
                            <>
                                <line x1="4" y1="7" x2="20" y2="7" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="17" x2="20" y2="17" />
                            </>
                        )}
                    </svg>
                </button>
            </div>

            {/* Book chips — horizontally scrollable on every breakpoint */}
            <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-2 text-xs text-ink-500 no-scrollbar sm:px-6">
                {books.map(b => (
                    <Link
                        key={b.id}
                        href={`/book/${b.id}`}
                        className="whitespace-nowrap rounded border border-ink-200 px-2 py-0.5 hover:border-cinnabar/50 hover:text-cinnabar"
                    >
                        {b.title}
                    </Link>
                ))}
            </div>

            {/* Mobile nav panel */}
            {open ? (
                <div
                    id="mobile-nav-panel"
                    className="border-t border-ink-200 bg-ink-50 md:hidden"
                >
                    <nav className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-4 py-4 sm:px-6">
                        {NAV_LINKS.map(l => {
                            const active = pathname === l.href;
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    className={`rounded border px-3 py-3 text-center text-sm ${
                                        active
                                            ? 'border-cinnabar/50 bg-cinnabar/5 text-cinnabar'
                                            : 'border-ink-200 text-ink-700 hover:border-cinnabar/50 hover:text-cinnabar'
                                    }`}
                                >
                                    {l.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            ) : null}
        </header>
    );
}
