// Client-safe types and display constants. This module must NOT import node
// APIs so it can be imported by "use client" components. The data-loading
// functions live in lib/data.ts (server-only).

export type EntityType =
    | 'mountain'
    | 'river'
    | 'state'
    | 'creature'
    | 'place'
    | 'deity'
    | 'person'
    | 'bird'
    | 'plant'
    | 'mineral'
    | 'tree'
    | 'concept'
    | 'object'
    | 'fish'
    | 'serpent'
    | 'star'
    | 'unknown'
    | 'unit';

export interface BookMeta {
    id: string;
    title: string;
    titleEn?: string;
    pinyin?: string;
    era?: string;
    category?: string;
    description?: string;
    totalEntries?: number;
    chapters: ChapterMeta[];
}

export interface ChapterMeta {
    index: number;
    title: string;
    entryCount: number;
    entityCount: number;
    file: string;
    sourceUrl?: string;
}

export interface Annotation {
    term: string;
    explanation: string;
}

export interface Entry {
    index: number;
    title?: string;
    originalText: string;
    translation?: string;
    annotations: Annotation[];
}

export interface EntityRef {
    entityName: string;
    entryId: string;
    entryTitle: string;
    term: string;
}

export interface Chapter {
    id: string;
    bookId: string;
    bookTitle: string;
    chapterIndex: number;
    chapterTitle: string;
    entryCount: number;
    entries: Entry[];
    entityRefs: EntityRef[];
    source?: string;
}

export interface Mention {
    bookId: string;
    chapterIndex: number;
    entryId: string;
    type: 'annotation' | 'text';
    context?: string;
    annotationExplanation?: string;
}

export interface EntitySummary {
    id: string;
    name: string;
    pinyin?: string | null;
    aliases: string[];
    type: EntityType;
    typeConfidence?: number;
    description: string | null;
    bookCount: number;
    mentionCount: number;
    books: string[];
}

export interface EntityDetail extends EntitySummary {
    mentions: Mention[];
    firstSeen?: {
        bookId: string;
        chapterIndex: number;
        entryId: string;
    } | null;
}

export interface RelationOccurrence {
    bookId: string;
    chapterIndex: number;
    entryId: string;
}

export interface Relation {
    source: string;
    target: string;
    type: string;
    description: string;
    occurrenceCount: number;
    occurrences: RelationOccurrence[];
}

export interface BooksIndex {
    generatedAt: string;
    source: string;
    bookCount: number;
    totalChapters: number;
    totalEntries: number;
    entityCount: number;
    relationCount: number;
    entityTypes: Record<string, number>;
    books: BookMeta[];
}

/** Minimal entity info needed by the inline highlighter's hover popover. */
export interface EntityCardData {
    name: string;
    type: EntityType;
    pinyin?: string | null;
    aliases: string[];
    description: string | null;
}

export const TYPE_LABELS: Record<EntityType, string> = {
    mountain: '山岳',
    river: '河川',
    state: '邦国',
    creature: '异兽',
    place: '地名',
    deity: '神祇',
    person: '人物',
    bird: '禽鸟',
    plant: '草木',
    mineral: '金石',
    tree: '树木',
    concept: '概念',
    object: '器物',
    fish: '鳞介',
    serpent: '蛇虫',
    star: '星象',
    unknown: '未详',
    unit: '度量',
};

export const TYPE_ORDER: EntityType[] = [
    'person',
    'deity',
    'creature',
    'bird',
    'fish',
    'serpent',
    'mountain',
    'river',
    'state',
    'place',
    'plant',
    'tree',
    'mineral',
    'object',
    'concept',
    'star',
    'unit',
    'unknown',
];

export const RELATION_LABELS: Record<string, string> = {
    flows_into: '流注于',
    contains: '产有',
    appears_with: '并见于',
};

export function relationLabel(type: string): string {
    return RELATION_LABELS[type] ?? type;
}
