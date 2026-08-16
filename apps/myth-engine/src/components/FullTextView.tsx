'use client';

import { useState } from 'react';

import {
    type EntityCardData,
    EntityModalProvider,
    HighlightedText,
} from './EntityHighlighter';

/**
 * Full-chapter continuous reading view: the complete original text (with
 * inline entity highlighting + hover popovers) followed by the complete
 * translation. Paragraphs preserve the line breaks present in the source
 * (important for 楚辞 verse).
 */
export function FullTextView({
    originalParagraphs,
    translationParagraphs,
    mentions,
    entityData,
}: {
    originalParagraphs: string[];
    translationParagraphs: string[];
    mentions: { term: string; entityName: string }[];
    entityData: Record<string, EntityCardData>;
}) {
    const [enabled, setEnabled] = useState(true);

    return (
        <EntityModalProvider>
            <div className="space-y-8">
                <section>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-ink-800">
                            原文
                        </h2>
                        <button
                            onClick={() => setEnabled(v => !v)}
                            className="rounded border border-ink-300 px-2.5 py-1 text-xs text-ink-600 hover:border-cinnabar/50 hover:text-cinnabar"
                        >
                            {enabled ? '关闭实体高亮' : '开启实体高亮'}
                        </button>
                    </div>
                    <div className="prose-classical space-y-3 rounded-md border border-ink-200 bg-white/60 p-5 text-ink-900 shadow-sm">
                        {originalParagraphs.map((para, i) => {
                            const lines = para
                                .split(/\n\n+/)
                                .map(l => l.trim())
                                .filter(Boolean);
                            return (
                                <p key={i} className="leading-loose">
                                    {lines.map((line, j) => (
                                        <span
                                            key={j}
                                            className={
                                                j > 0 ? 'mt-1 block' : ''
                                            }
                                        >
                                            <HighlightedText
                                                text={line}
                                                mentions={mentions}
                                                entityData={entityData}
                                                enabled={enabled}
                                            />
                                        </span>
                                    ))}
                                </p>
                            );
                        })}
                    </div>
                    <p className="mt-2 text-right text-xs text-ink-400 md:hidden">
                        轻点高亮实体可查看释义
                    </p>
                </section>

                {translationParagraphs.length > 0 ? (
                    <section>
                        <h2 className="mb-3 font-serif text-xl font-semibold text-ink-800">
                            译文
                        </h2>
                        <div className="space-y-3 rounded-md border border-ink-200 bg-white/60 p-5 text-sm leading-loose text-ink-700 shadow-sm">
                            {translationParagraphs.map((para, i) => {
                                const lines = para
                                    .split(/\n\n+/)
                                    .map(l => l.trim())
                                    .filter(Boolean);
                                return (
                                    <p key={i}>
                                        {lines.map((line, j) => (
                                            <span
                                                key={j}
                                                className={
                                                    j > 0 ? 'mt-1 block' : ''
                                                }
                                            >
                                                {line}
                                            </span>
                                        ))}
                                    </p>
                                );
                            })}
                        </div>
                    </section>
                ) : null}
            </div>
        </EntityModalProvider>
    );
}
