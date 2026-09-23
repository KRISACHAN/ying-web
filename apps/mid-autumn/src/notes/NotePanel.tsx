import { useEffect, useRef, useState } from 'react';

import {
    deleteNote,
    loadNote,
    saveNote,
    NOTE_MAX_LENGTH,
    type NoteRecord,
} from './storage';

interface NotePanelProps {
    /** 当前倒计时对应的中秋年份 */
    festivalYear: number;
    onClose: () => void;
    onSaved: (note: NoteRecord) => void;
    onDeleted: () => void;
}

/**
 * 留笺面板。
 *
 * - 月夜场景在面板打开期间继续播放。
 * - 所有内容以普通文本渲染，不使用 HTML 注入。
 * - 存储失败时在面板内明确提示。
 */
export default function NotePanel({
    festivalYear,
    onClose,
    onSaved,
    onDeleted,
}: NotePanelProps) {
    const existing = useRef<NoteRecord | null>(loadNote());
    const [name, setName] = useState(existing.current?.name ?? '');
    const [body, setBody] = useState(existing.current?.body ?? '');
    const [error, setError] = useState<string | null>(null);
    const bodyRef = useRef<HTMLTextAreaElement>(null);

    // 打开时将焦点移到留言框。
    useEffect(() => {
        const id = window.setTimeout(() => bodyRef.current?.focus(), 60);
        return () => window.clearTimeout(id);
    }, []);

    // Escape 关闭
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const handleSave = () => {
        setError(null);
        const result = saveNote({ name, body, festivalYear });
        if (!result.ok || !result.note) {
            setError(result.error ?? '保存失败，请稍后再试');
            return;
        }
        existing.current = result.note;
        onSaved(result.note);
        onClose();
    };

    const handleDelete = () => {
        setError(null);
        const result = deleteNote();
        if (!result.ok) {
            setError(result.error ?? '删除失败，请稍后再试');
            return;
        }
        existing.current = null;
        onDeleted();
        onClose();
    };

    const remaining = NOTE_MAX_LENGTH - body.trim().length;

    return (
        <div className="note-scrim" onMouseDown={onClose}>
            <section
                className="note-panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="note-title"
                onMouseDown={event => event.stopPropagation()}
            >
                <header className="note-head">
                    <h2 id="note-title">
                        {existing.current ? '修改这句思念' : '此刻，你想起了谁？'}
                    </h2>
                    <button
                        type="button"
                        className="note-close"
                        aria-label="关闭"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <label className="note-field">
                    <span>称呼（可不填）</span>
                    <input
                        type="text"
                        value={name}
                        maxLength={30}
                        placeholder="例如：外婆、阿明、未来的自己"
                        onChange={event => setName(event.target.value)}
                    />
                </label>

                <label className="note-field">
                    <span>想说的话</span>
                    <textarea
                        ref={bodyRef}
                        value={body}
                        maxLength={NOTE_MAX_LENGTH}
                        rows={4}
                        placeholder="海上生明月，天涯共此时。写下你此刻的想念。"
                        onChange={event => setBody(event.target.value)}
                    />
                    <em className={remaining < 0 ? 'is-warn' : undefined}>
                        {body.trim().length} / {NOTE_MAX_LENGTH}
                    </em>
                </label>

                {error && <p className="note-error" role="alert">{error}</p>}

                <p className="note-privacy">仅保存在此浏览器，不会发送给任何人</p>

                <footer className="note-actions">
                    {existing.current && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-danger"
                            onClick={handleDelete}
                        >
                            删除
                        </button>
                    )}
                    <span className="note-actions-spacer" />
                    <button type="button" className="btn btn-ghost" onClick={onClose}>
                        取消
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!body.trim()}
                    >
                        保存
                    </button>
                </footer>
            </section>
        </div>
    );
}
