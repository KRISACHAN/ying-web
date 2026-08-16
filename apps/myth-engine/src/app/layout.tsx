import type { Metadata } from 'next';
import Link from 'next/link';

import { SiteHeader } from '@/components/SiteHeader';
import { getBooks } from '@/lib/data';

import './globals.css';

export const metadata: Metadata = {
    title: '中国神话索引',
    description:
        '基于《山海经》《搜神记》《楚辞》《淮南子》的中国神话知识库，人物、异兽、山川、邦国及其原文依据与关联。',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const books = getBooks().books.map(b => ({ id: b.id, title: b.title }));
    return (
        <html lang="zh-CN">
            <body className="paper-bg min-h-screen">
                <SiteHeader books={books} />

                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                    {children}
                </main>

                <footer className="mt-16 border-t border-ink-200/70 bg-ink-50/60">
                    <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-500 sm:px-6">
                        <p className="font-serif text-ink-700">中国神话索引</p>
                        <p className="mt-2 max-w-3xl leading-relaxed">
                            本站所有内容均依据所收录典籍原文与注释自动抽取生成，未作外部
                            知识补充。释义不明者标注为“资料未载”，宁缺毋造。详见
                            <Link
                                href="/about"
                                className="ml-1 text-cinnabar hover:underline"
                            >
                                关于
                            </Link>
                            。
                        </p>
                        <div className="mt-4 space-y-1 text-xs leading-relaxed text-ink-500">
                            <p>
                                <span className="text-ink-600">
                                    原文与注释底本：
                                </span>
                                <a
                                    href="https://www.8bei8.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cinnabar hover:underline"
                                >
                                    8bei8.com
                                </a>
                                （经站长授权整理）。
                            </p>
                            <p>
                                <span className="text-ink-600">
                                    原典校勘参照：
                                </span>
                                <a
                                    href="https://zh.wikisource.org/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-cinnabar hover:underline"
                                >
                                    维基文库 zh.wikisource.org
                                </a>
                                （公有领域原典，用于逐篇校验结构与用字）。
                            </p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
