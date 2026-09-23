import { useEffect, useState, useSyncExternalStore } from 'react';

import {
    getDebugTimeState,
    subscribeDebugTime,
} from '../debug/debugTimeStore';

/**
 * 当前时间（每秒对齐刷新）。
 *
 * DEV 下若调试面板冻结了时间，则返回被冻结的时刻且不再走秒；
 * 生产环境没有任何入口能改变调试状态，因此始终是真实时间。
 */
export function useNow(): Date {
    const debug = useSyncExternalStore(subscribeDebugTime, getDebugTimeState);
    const [now, setNow] = useState(() =>
        debug.mode === 'frozen' ? new Date(debug.frozenAt) : new Date(),
    );

    useEffect(() => {
        if (debug.mode === 'frozen') {
            setNow(new Date(debug.frozenAt));
            return;
        }

        let timer: number;

        const tick = () => {
            setNow(new Date());
            timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));
        };

        timer = window.setTimeout(tick, 1000 - (Date.now() % 1000));

        return () => window.clearTimeout(timer);
    }, [debug.mode, debug.frozenAt]);

    return now;
}
