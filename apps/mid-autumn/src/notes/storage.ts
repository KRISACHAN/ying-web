/**
 * 思念留笺：仅保存在当前浏览器的 localStorage。
 *
 * 明确边界：
 * - 不需要姓名 / 邮箱 / 地理位置；
 * - 不发送给任何人，不承诺跨设备同步或永久保存；
 * - 存储失败（隐私模式、配额已满等）时返回错误，绝不假装成功；
 * - 读取时按数据版本校验，损坏数据视为无记录。
 */

const STORAGE_KEY = 'ying-mid-autumn-note:v1';
/** 当前数据版本（后续结构调整时据此迁移或拒绝） */
export const NOTE_DATA_VERSION = 1;
/** 正文长度上限 */
export const NOTE_MAX_LENGTH = 120;

export interface NoteRecord {
    version: typeof NOTE_DATA_VERSION;
    /** 称呼（可空） */
    name: string;
    /** 留言正文 */
    body: string;
    /** 保存时间（ISO 字符串，留笺时间，与真实/演示时间分开） */
    savedAt: string;
    /** 保存时对应的中秋公历年 */
    festivalYear: number;
}

export interface SaveResult {
    ok: boolean;
    note?: NoteRecord;
    error?: string;
}

/** 校验一条记录是否结构完整且为当前版本 */
function isNoteRecord(value: unknown): value is NoteRecord {
    if (typeof value !== 'object' || value === null) return false;
    const note = value as Record<string, unknown>;
    return (
        note.version === NOTE_DATA_VERSION &&
        typeof note.name === 'string' &&
        typeof note.body === 'string' &&
        typeof note.savedAt === 'string' &&
        typeof note.festivalYear === 'number'
    );
}

/** 读取当前浏览器中的留笺；无记录或数据损坏时返回 null */
export function loadNote(): NoteRecord | null {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        return isNoteRecord(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

/** 保存（新建或覆盖）；失败时返回明确错误提示 */
export function saveNote(input: {
    name: string;
    body: string;
    festivalYear: number;
}): SaveResult {
    const name = input.name.trim().slice(0, 30);
    const body = input.body.trim();

    if (!body) {
        return { ok: false, error: '留言内容不能为空' };
    }
    if (body.length > NOTE_MAX_LENGTH) {
        return { ok: false, error: `留言请控制在 ${NOTE_MAX_LENGTH} 字以内` };
    }

    const note: NoteRecord = {
        version: NOTE_DATA_VERSION,
        name,
        body,
        savedAt: new Date().toISOString(),
        festivalYear: input.festivalYear,
    };

    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(note));
    } catch {
        return { ok: false, error: '保存失败：浏览器拒绝了本地存储（可能处于隐私模式或存储已满）' };
    }

    return { ok: true, note };
}

/** 删除留笺；失败时返回错误 */
export function deleteNote(): { ok: boolean; error?: string } {
    try {
        window.localStorage.removeItem(STORAGE_KEY);
        return { ok: true };
    } catch {
        return { ok: false, error: '删除失败：浏览器拒绝了本地存储操作' };
    }
}
