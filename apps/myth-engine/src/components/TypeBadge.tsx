import { type EntityType, TYPE_LABELS } from '@/lib/types';

const BADGE_STYLES: Record<string, string> = {
    person: 'bg-cinnabar/10 text-cinnabar-dark border-cinnabar/30',
    deity: 'bg-amber-700/10 text-amber-800 border-amber-700/30',
    creature: 'bg-stone-700/10 text-stone-800 border-stone-700/30',
    bird: 'bg-sky-700/10 text-sky-800 border-sky-700/30',
    fish: 'bg-cyan-700/10 text-cyan-800 border-cyan-700/30',
    serpent: 'bg-emerald-800/10 text-emerald-900 border-emerald-800/30',
    mountain: 'bg-stone-600/10 text-stone-700 border-stone-600/30',
    river: 'bg-blue-700/10 text-blue-800 border-blue-700/30',
    state: 'bg-purple-700/10 text-purple-800 border-purple-700/30',
    place: 'bg-yellow-700/10 text-yellow-800 border-yellow-700/30',
    plant: 'bg-green-700/10 text-green-800 border-green-700/30',
    tree: 'bg-lime-700/10 text-lime-800 border-lime-700/30',
    mineral: 'bg-zinc-600/10 text-zinc-700 border-zinc-600/30',
    object: 'bg-orange-700/10 text-orange-800 border-orange-700/30',
    concept: 'bg-rose-700/10 text-rose-800 border-rose-700/30',
    star: 'bg-indigo-700/10 text-indigo-800 border-indigo-700/30',
    unit: 'bg-gray-500/10 text-gray-700 border-gray-500/30',
    unknown: 'bg-gray-400/10 text-gray-600 border-gray-400/30',
};

export function TypeBadge({
    type,
    size = 'sm',
}: {
    type: EntityType;
    size?: 'sm' | 'xs';
}) {
    const style = BADGE_STYLES[type] ?? BADGE_STYLES.unknown;
    const sizing =
        size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
    return (
        <span
            className={`inline-flex items-center rounded border font-medium ${sizing} ${style}`}
        >
            {TYPE_LABELS[type] ?? type}
        </span>
    );
}
