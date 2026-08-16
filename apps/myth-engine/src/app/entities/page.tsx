import { EntityBrowser } from '@/components/EntityBrowser';
import { getEntityList } from '@/lib/data';

export const dynamic = 'force-static';

export const metadata = {
    title: '浏览实体 · 中国神话索引',
};

export default async function EntitiesPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>;
}) {
    const { type } = await searchParams;
    const entities = getEntityList();

    return (
        <div>
            <header className="mb-6">
                <h1 className="font-serif text-3xl font-bold text-ink-800">
                    实体浏览
                </h1>
                <p className="mt-2 text-sm text-ink-500">
                    按类别筛选，或按名称、拼音、别名、释义全文检索。共{' '}
                    {entities.length} 个实体。
                </p>
            </header>
            <EntityBrowser entities={entities} initialType={type} />
        </div>
    );
}
