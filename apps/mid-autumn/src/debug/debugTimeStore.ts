/**
 * 开发调试用：当前时刻（now）的覆盖存储。
 *
 * 仅在 DEV 下由 DebugPanel 操作；生产构建里这份模块虽然存在，
 * 但没有任何入口会改变状态（始终为 live）。
 *
 * 时间链路：useNow 读取这里 → computeFestival 推导节日状态。
 * 因此冻结到任意时刻，即可真实预览中秋当天 / 跨年滚动 /
 * 年历表不支持等各种界面，而不需要手动改系统时间。
 */

export type DebugMode = 'live' | 'frozen';

export interface DebugTimeState {
    mode: DebugMode;
    /** 冻结时刻（epoch ms）；mode='live' 时忽略 */
    frozenAt: number;
}

let state: DebugTimeState = { mode: 'live', frozenAt: 0 };
const listeners = new Set<() => void>();

export function getDebugTimeState(): DebugTimeState {
    return state;
}

function emit(): void {
    listeners.forEach(listener => listener());
}

/** 恢复真实时间 */
export function setDebugLive(): void {
    if (state.mode === 'live') return;
    state = { mode: 'live', frozenAt: 0 };
    emit();
}

/** 冻结到指定时刻 */
export function setDebugFrozen(time: number | Date): void {
    state = {
        mode: 'frozen',
        frozenAt: time instanceof Date ? time.getTime() : time,
    };
    emit();
}

export function subscribeDebugTime(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}
