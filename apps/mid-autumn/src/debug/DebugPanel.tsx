import { useEffect, useRef, useState } from 'react';

import './debug.css';

import { findMidAutumn } from '../utils/lunar';
import { computeFestival } from '../utils/festival';
import {
    getDebugTimeState,
    setDebugFrozen,
    setDebugLive,
    subscribeDebugTime,
} from './debugTimeStore';

/**
 * 开发调试悬浮球（仅 DEV 下由 App 挂载）。
 *
 * 点击展开时间配置：
 * - 一组围绕“今年中秋”的动态预设（当天、前一天、跨年、年历边界）；
 * - 自定义任意时刻（datetime-local）；
 * - 一键恢复真实时间。
 *
 * 时间被覆盖后整条节日链路都会如实重算，因此可以直接预览
 * 中秋当天界面，而不必改系统时间。
 */

interface Preset {
    key: string;
    label: string;
    time: number;
}

/** 根据给定年份的中秋日期构造一组预设 */
function buildPresets(year: number): Preset[] {
    const festival = findMidAutumn(year);
    const at = (
        base: Date,
        dayOffset: number,
        h: number,
        m = 0,
    ): number => {
        const d = new Date(base);
        d.setDate(d.getDate() + dayOffset);
        d.setHours(h, m, 0, 0);
        return d.getTime();
    };

    const yearStart = new Date(year, 0, 1, 9, 0).getTime();

    // 2099 中秋次日：需要 2100 数据 → supported=false
    let boundaryAfter = 0;
    if (year < 2099) {
        const f2099 = findMidAutumn(2099);
        boundaryAfter = at(f2099, 1, 10);
    }

    const presets: Preset[] = [
        { key: 'day-start', label: '中秋当天 00:00', time: at(festival, 0, 0) },
        { key: 'day-noon', label: '中秋当天 12:00', time: at(festival, 0, 12) },
        { key: 'day-eve', label: '中秋当天 20:00', time: at(festival, 0, 20) },
        { key: 'before-3d', label: '中秋前 3 天', time: at(festival, -3, 12) },
        { key: 'before-1d', label: '前一天 20:00', time: at(festival, -1, 20) },
        { key: 'after', label: '中秋次日（等明年）', time: at(festival, 1, 9) },
        { key: 'year-start', label: `${year} 年初`, time: yearStart },
    ];

    if (boundaryAfter) {
        presets.push({
            key: 'unsupported',
            label: '2099 后（不支持）',
            time: boundaryAfter,
        });
    }

    return presets;
}

/** Date → datetime-local 输入框字符串 */
function toLocalInput(time: number): string {
    const d = new Date(time);
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        `T${pad(d.getHours())}:${pad(d.getMinutes())}`
    );
}

const FAB_SIZE = 44;

export default function DebugPanel() {
    const [open, setOpen] = useState(false);
    const [frozen, setFrozen] = useState(false);
    const [custom, setCustom] = useState(() => toLocalInput(Date.now()));

    const [fabPos, setFabPos] = useState(() => ({
        x: Math.max(16, window.innerWidth - FAB_SIZE - 24),
        y: Math.max(16, Math.round(window.innerHeight * 0.42)),
    }));

    // 悬浮球拖动状态（区分点击与拖动）
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
        moved: boolean;
    } | null>(null);

    // 订阅时间覆盖状态
    useEffect(() => subscribeDebugTime(() => {
        setFrozen(getDebugTimeState().mode === 'frozen');
    }), []);

    const presets = buildPresets(new Date().getFullYear());
    const snapshot = getDebugTimeState();
    const displayTime =
        snapshot.mode === 'frozen' ? snapshot.frozenAt : Date.now();
    const festivalState = computeFestival(new Date(displayTime));

    const clampPos = (x: number, y: number) => ({
        x: Math.min(
            Math.max(8, x),
            Math.max(8, window.innerWidth - FAB_SIZE - 8),
        ),
        y: Math.min(
            Math.max(8, y),
            Math.max(8, window.innerHeight - FAB_SIZE - 8),
        ),
    });

    const onFabDown = (event: React.PointerEvent) => {
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            originX: fabPos.x,
            originY: fabPos.y,
            moved: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onFabMove = (event: React.PointerEvent) => {
        const drag = dragRef.current;
        if (!drag || event.pointerId !== drag.pointerId) return;
        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
            drag.moved = true;
            setFabPos(clampPos(drag.originX + dx, drag.originY + dy));
        }
    };

    const onFabUp = (event: React.PointerEvent) => {
        const drag = dragRef.current;
        try {
            event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
            /* ignore */
        }
        dragRef.current = null;
        // 没有发生位移才算点击 → 展开/收起
        if (drag && !drag.moved) setOpen(value => !value);
    };

    const goLive = () => {
        setDebugLive();
    };

    const applyPreset = (time: number) => {
        setCustom(toLocalInput(time));
        setDebugFrozen(time);
    };

    const applyCustom = () => {
        const t = new Date(custom).getTime();
        if (!Number.isNaN(t)) setDebugFrozen(t);
    };

    const cd = festivalState.countdown;

    // 面板定位在悬浮球上方/下方，避免出界
    const panelStyle: React.CSSProperties = {
        left: Math.min(fabPos.x, window.innerWidth - 288 - 12),
        top:
            fabPos.y > window.innerHeight / 2
                ? Math.max(12, fabPos.y - Math.min(420, window.innerHeight * 0.72) - 12)
                : fabPos.y + FAB_SIZE + 12,
    };

    return (
        <>
            <button
                type="button"
                className={`debug-fab${frozen ? ' is-frozen' : ''}`}
                style={{ left: fabPos.x, top: fabPos.y }}
                aria-label="调试时间"
                onPointerDown={onFabDown}
                onPointerMove={onFabMove}
                onPointerUp={onFabUp}
            >
                {frozen ? '⏱' : '⚙'}
            </button>

            {open && (
                <div className="debug-panel" style={panelStyle}>
                    <div className="debug-title">
                        时间调试
                        <button
                            type="button"
                            className="debug-close"
                            onClick={() => setOpen(false)}
                            aria-label="关闭"
                        >
                            ×
                        </button>
                    </div>

                    <div className="debug-status">
                        模式：
                        {frozen ? (
                            <b className="is-frozen">已冻结</b>
                        ) : (
                            <b>真实时间</b>
                        )}
                        <br />
                        节日状态：
                        <b>
                            {festivalState.status === 'day'
                                ? '中秋当天'
                                : festivalState.supported
                                  ? '等待中秋'
                                  : '年历不支持'}
                        </b>
                        {festivalState.supported &&
                            festivalState.status === 'waiting' && (
                                <>
                                    <br />
                                    倒计时：
                                    <b>
                                        {cd.days}天 {cd.hours}时 {cd.minutes}分{' '}
                                        {cd.seconds}秒
                                    </b>
                                </>
                            )}
                    </div>

                    <div className="debug-section-label">快捷预设</div>
                    <div className="debug-presets">
                        {presets.map(p => (
                            <button
                                key={p.key}
                                type="button"
                                className={
                                    frozen && displayTime === p.time
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => applyPreset(p.time)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>

                    <div className="debug-section-label">自定义时刻</div>
                    <div className="debug-custom">
                        <input
                            type="datetime-local"
                            value={custom}
                            step={1}
                            onChange={e => setCustom(e.target.value)}
                        />
                        <button type="button" onClick={applyCustom}>
                            冻结到此时刻
                        </button>
                    </div>

                    <button
                        type="button"
                        className="debug-live"
                        onClick={goLive}
                    >
                        恢复真实时间
                    </button>

                    <p className="debug-note">
                        仅开发环境显示。冻结只影响当前浏览器的界面演示，
                        不会改动系统时间，也不影响三维演示的进度数据。
                    </p>
                </div>
            )}
        </>
    );
}
