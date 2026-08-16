import Link from 'next/link';

import { entityHref, getEntityMap } from '@/lib/data';

/** Server-side link to an entity; renders plain text if the name is unknown. */
export function EntityLink({
    name,
    className,
    children,
}: {
    name: string;
    className?: string;
    children?: React.ReactNode;
}) {
    const map = getEntityMap();
    const exists = map.has(name);
    const content = children ?? name;
    if (!exists) {
        return <span className={className}>{content}</span>;
    }
    return (
        <Link
            href={entityHref(name)}
            className={
                className ??
                'text-ink-800 underline decoration-ink-300 decoration-dotted underline-offset-4 hover:text-cinnabar hover:decoration-cinnabar'
            }
        >
            {content}
        </Link>
    );
}
