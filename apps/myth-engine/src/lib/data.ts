import fs from 'node:fs';
import path from 'node:path';

// Server-only data access. Imports node:fs — do NOT import this module from a
// "use client" component. Client components should use lib/types.ts for the
// pure types and display constants.
import type {
    BookMeta,
    BooksIndex,
    Chapter,
    ChapterMeta,
    EntityCardData,
    EntityDetail,
    EntitySummary,
    Relation,
} from './types';

// Re-export display constants & types so server code has one import surface.
export * from './types';

export type {
    BookMeta,
    BooksIndex,
    Chapter,
    ChapterMeta,
    EntityDetail,
    EntitySummary,
    Relation,
};

// ── Loading ────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'data');

function readJson<T>(rel: string): T {
    return JSON.parse(fs.readFileSync(path.join(DATA_DIR, rel), 'utf-8')) as T;
}

let _books: BooksIndex | null = null;
let _entityList: EntitySummary[] | null = null;
let _entityMap: Map<string, EntitySummary> | null = null;
let _relations: Relation[] | null = null;
let _relationIndex: Map<string, Relation[]> | null = null;
const _chapterCache = new Map<string, Chapter>();
const _entityDetailCache = new Map<string, EntityDetail>();

export function getBooks(): BooksIndex {
    if (!_books) {
        _books = readJson<BooksIndex>('books.json');
        // Guarantee canonical source order (by the numeric source page index)
        // regardless of how the JSON array happens to be serialized.
        for (const b of _books.books) {
            b.chapters.sort((a, z) => a.index - z.index);
        }
    }
    return _books;
}

export function getBook(id: string): BookMeta | undefined {
    return getBooks().books.find(b => b.id === id);
}

export function getEntityList(): EntitySummary[] {
    if (!_entityList) {
        const data = readJson<{ entities: EntitySummary[] }>('entities.json');
        _entityList = data.entities;
    }
    return _entityList;
}

export function getEntityMap(): Map<string, EntitySummary> {
    if (!_entityMap) {
        _entityMap = new Map(getEntityList().map(e => [e.name, e]));
    }
    return _entityMap;
}

export function getEntityDetail(name: string): EntityDetail | null {
    const cached = _entityDetailCache.get(name);
    if (cached) return cached;
    const file = path.join(DATA_DIR, 'entities', `${name}.json`);
    if (!fs.existsSync(file)) return null;
    const detail = readJson<EntityDetail>(
        path.join('entities', `${name}.json`),
    );
    _entityDetailCache.set(name, detail);
    return detail;
}

export function getRelations(): Relation[] {
    if (!_relations) {
        const data = readJson<{ relations: Relation[] }>('relations.json');
        _relations = data.relations;
    }
    return _relations;
}

/** Relations keyed by entity name (both as source and as target). */
export function getRelationsFor(name: string): {
    outgoing: Relation[];
    incoming: Relation[];
} {
    if (!_relationIndex) {
        const idx = new Map<string, Relation[]>();
        for (const r of getRelations()) {
            for (const endpoint of [r.source, r.target]) {
                const arr = idx.get(endpoint);
                if (arr) arr.push(r);
                else idx.set(endpoint, [r]);
            }
        }
        _relationIndex = idx;
    }
    const all = _relationIndex.get(name) ?? [];
    return {
        outgoing: all.filter(r => r.source === name),
        incoming: all.filter(r => r.target === name),
    };
}

export function getChapter(
    bookId: string,
    chapterIndex: number,
): Chapter | null {
    const key = `${bookId}/${chapterIndex}`;
    const cached = _chapterCache.get(key);
    if (cached) return cached;
    const book = getBook(bookId);
    if (!book) return null;
    const meta = book.chapters.find(c => c.index === chapterIndex);
    if (!meta) return null;
    const chapter = readJson<Chapter>(
        path.join('chapters', bookId, path.basename(meta.file)),
    );
    _chapterCache.set(key, chapter);
    return chapter;
}

/** Build the per-chapter entity popover data and a flat mention list used by
 *  the highlighter. Only entities actually referenced in the chapter are
 *  included, so the whole 1434-entity catalog is not shipped to the client. */
export function getChapterHighlightData(chapter: Chapter): {
    entityData: Record<string, EntityCardData>;
    mentions: { term: string; entityName: string }[];
} {
    const entityMap = getEntityMap();
    const entityData: Record<string, EntityCardData> = {};
    const mentions: { term: string; entityName: string }[] = [];
    for (const ref of chapter.entityRefs) {
        mentions.push({ term: ref.term, entityName: ref.entityName });
        if (!entityData[ref.entityName]) {
            const e = entityMap.get(ref.entityName);
            if (e) {
                entityData[ref.entityName] = {
                    name: e.name,
                    type: e.type,
                    pinyin: e.pinyin,
                    aliases: e.aliases,
                    description: e.description,
                };
            }
        }
    }
    return { entityData, mentions };
}

// ── Routing helpers ────────────────────────────────────────────────────────

export function bookTitle(bookId: string): string {
    return getBook(bookId)?.title ?? bookId;
}

export function entityHref(name: string): string {
    return `/entity/${encodeURIComponent(name)}`;
}

export function chapterHref(bookId: string, chapterIndex: number): string {
    return `/book/${bookId}/${chapterIndex}`;
}

export function entryHref(
    bookId: string,
    chapterIndex: number,
    _entryIndex: number,
): string {
    // Entries are anchored within their chapter page.
    return `${chapterHref(bookId, chapterIndex)}#entry-${_entryIndex}`;
}
