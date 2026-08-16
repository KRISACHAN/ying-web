import Link from 'next/link';

export const dynamic = 'force-static';

export default function NotFound() {
    return (
        <div className="mx-auto max-w-md py-20 text-center">
            <div className="font-serif text-6xl font-bold text-cinnabar">
                404
            </div>
            <p className="mt-4 font-serif text-xl text-ink-800">
                典籍无征，此页阙如
            </p>
            <p className="mt-2 text-sm text-ink-500">
                所寻页面不存在，或所据资料未载。
            </p>
            <Link
                href="/"
                className="mt-8 inline-block rounded bg-cinnabar px-5 py-2.5 text-sm text-ink-50 hover:bg-cinnabar-dark"
            >
                返回首页
            </Link>
        </div>
    );
}
