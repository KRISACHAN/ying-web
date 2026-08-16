import Link from 'next/link';

import { getBooks } from '@/lib/data';

export const dynamic = 'force-static';

export const metadata = {
    title: '关于 · 中国神话索引',
};

export default function AboutPage() {
    const books = getBooks();
    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <header>
                <h1 className="font-serif text-3xl font-bold text-ink-800">
                    关于
                </h1>
            </header>

            <section className="space-y-3 leading-relaxed text-ink-700">
                <p>
                    本站是一个以
                    <strong className="text-ink-900">数据为唯一依据</strong>
                    的中国神话索引。人物、神祇、异兽、禽鱼、山川、邦国、草木金石——
                    每一条目的释义、别名、出处与关联，均从所收典籍原文与注释中自动抽取、
                    交叉合并而成，不加入任何典籍之外的知识补写。
                </p>
                <p>
                    对于注释中没有解释的名称，释义一律保留为空，标注为
                    <span className="italic text-ink-500">「资料未载」</span>
                    ，宁缺毋造，不以后世研究或外部资料填充。
                </p>
            </section>

            <section>
                <h2 className="mb-2 font-serif text-xl font-semibold text-ink-800">
                    收录典籍
                </h2>
                <ul className="space-y-2">
                    {books.books.map(b => (
                        <li
                            key={b.id}
                            className="rounded border border-ink-200 bg-white/60 p-4"
                        >
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <Link
                                    href={`/book/${b.id}`}
                                    className="font-serif text-lg font-semibold text-ink-800 hover:text-cinnabar"
                                >
                                    《{b.title}》
                                </Link>
                                <span className="text-xs text-ink-400">
                                    {[b.era, b.category]
                                        .filter(Boolean)
                                        .join(' · ')}
                                </span>
                            </div>
                            {b.description ? (
                                <p className="mt-1 text-sm text-ink-600">
                                    {b.description}
                                </p>
                            ) : null}
                            <p className="mt-1 text-xs text-ink-400">
                                {b.chapters.length} 篇 · {b.totalEntries} 条
                            </p>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="space-y-2 leading-relaxed text-ink-700">
                <h2 className="font-serif text-xl font-semibold text-ink-800">
                    数据规模
                </h2>
                <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                    <li className="rounded border border-ink-200 bg-white/60 p-3 text-center">
                        <div className="font-serif text-2xl font-semibold text-cinnabar">
                            {books.bookCount}
                        </div>
                        <div className="text-ink-500">部典籍</div>
                    </li>
                    <li className="rounded border border-ink-200 bg-white/60 p-3 text-center">
                        <div className="font-serif text-2xl font-semibold text-cinnabar">
                            {books.totalChapters}
                        </div>
                        <div className="text-ink-500">篇章</div>
                    </li>
                    <li className="rounded border border-ink-200 bg-white/60 p-3 text-center">
                        <div className="font-serif text-2xl font-semibold text-cinnabar">
                            {books.entityCount}
                        </div>
                        <div className="text-ink-500">实体</div>
                    </li>
                    <li className="rounded border border-ink-200 bg-white/60 p-3 text-center">
                        <div className="font-serif text-2xl font-semibold text-cinnabar">
                            {books.relationCount}
                        </div>
                        <div className="text-ink-500">关系</div>
                    </li>
                </ul>
            </section>

            <section className="space-y-2 leading-relaxed text-ink-700">
                <h2 className="font-serif text-xl font-semibold text-ink-800">
                    资料来源与方法
                </h2>
                <p>
                    典籍的原文、注释与白话译文底本来自
                    <a
                        href="https://www.8bei8.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cinnabar hover:underline"
                    >
                        太极书馆（8bei8.com）
                    </a>
                    ，已经站长授权整理使用；本站所展示的原文与释义均以此底本为准，
                    不擅改字句。
                </p>
                <p>
                    原典原文另以
                    <a
                        href="https://zh.wikisource.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cinnabar hover:underline"
                    >
                        维基文库（zh.wikisource.org）
                    </a>
                    所收公有领域版本为参照，进行逐篇结构与用字校验，确认篇章完整、
                    引用可回溯。实体、别名与关系由代码仓库内的抽取与校验脚本从上述资料中
                    自动生成，脚本一并公开。
                </p>
                <p className="text-sm text-ink-500">
                    因古籍版本流传，用字、分章与异文在所难免；本站以所据底本为准，
                    不擅改原文。繁简、异体字差异已在知识库中以别名形式保留。
                </p>
            </section>
        </div>
    );
}
