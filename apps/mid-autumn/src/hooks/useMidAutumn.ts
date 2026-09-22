import { useMemo } from 'react';

import {
    ganZhiYear,
    lunarDayName,
    lunarMonthName,
    solarToLunar,
    zodiacYear,
    type LunarDate,
} from '../utils/lunar';
import {
    computeFestival,
    startOfDay,
    type CountdownParts,
    type MidAutumnStatus,
} from '../utils/festival';

import { useNow } from './useNow';

export type { CountdownParts, MidAutumnStatus };

export interface MidAutumnState {
    now: Date;
    /** waiting = 等待中秋；day = 中秋当天 */
    status: MidAutumnStatus;
    /** 目标中秋日期（本地零点） */
    target: Date;
    /** 今年中秋已过（文案区分「等今年」与「等明年」） */
    rolledOver: boolean;
    countdown: CountdownParts;
    /** 年历表是否仍支持当前需要的年份 */
    supported: boolean;
    /** 目标中秋的农历信息 */
    targetLunar: LunarDate | null;
    /** 今天的农历信息 */
    todayLunar: LunarDate | null;
}

export function useMidAutumn(): MidAutumnState {
    const now = useNow();

    return useMemo(() => {
        const festival = computeFestival(now);

        // 农历反查同样可能超范围；失败时给 null，由界面降级处理
        let targetLunar: LunarDate | null = null;
        let todayLunar: LunarDate | null = null;
        try {
            targetLunar = solarToLunar(festival.target);
            todayLunar = solarToLunar(startOfDay(now));
        } catch {
            targetLunar = null;
            todayLunar = null;
        }

        return {
            now,
            status: festival.status,
            target: festival.target,
            rolledOver: festival.rolledOver,
            countdown: festival.countdown,
            supported: festival.supported,
            targetLunar,
            todayLunar,
        };
    }, [now]);
}

/** 公历日期中文格式，如「2026年9月25日 星期五」 */
export function formatSolarDate(date: Date): string {
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 星期${weekdays[date.getDay()]}`;
}

/** 农历完整称呼，如「丙午马年 八月十五」 */
export function formatLunarDate(lunar: LunarDate): string {
    return `${ganZhiYear(lunar.year)}${zodiacYear(lunar.year)}年 ${lunarMonthName(lunar.month, lunar.isLeap)}${lunarDayName(lunar.day)}`;
}
