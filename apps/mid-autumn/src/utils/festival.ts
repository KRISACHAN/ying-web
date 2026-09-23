/**
 * 中秋节日状态（纯函数，不依赖 React，便于直接测试边界）
 *
 * 约定：所有日期均使用浏览器本地时区的零点，
 * 不混用其他时区；倒计时差值也在同一时区下计算。
 */

import { findMidAutumn } from './lunar.ts';

export type MidAutumnStatus = 'waiting' | 'day';

export interface CountdownParts {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export interface FestivalState {
    status: MidAutumnStatus;
    /** 目标中秋日期（本地零点） */
    target: Date;
    /** 今年中秋已过、已转为等待下一年 */
    rolledOver: boolean;
    countdown: CountdownParts;
    /**
     * 年历表无法继续支持（如 2099 年中秋过后需要 2100 年数据）：
     * 明确标记，由界面提示，不静默给出错误日期。
     */
    supported: boolean;
}

export function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function diffToParts(diffMs: number): CountdownParts {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    return {
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
    };
}

/**
 * 计算当前时刻对应的中秋状态。
 *
 * - 中秋之前：倒计时到当年中秋；
 * - 中秋当天：status='day'，界面显示「今夕月圆」；
 * - 当天结束后：自动开始等待下一年。
 */
export function computeFestival(now: Date): FestivalState {
    const today = startOfDay(now);

    let thisYearFestival: Date;
    try {
        thisYearFestival = startOfDay(findMidAutumn(now.getFullYear()));
    } catch {
        // 年历表超范围：明确标记为不支持，界面不再显示倒计时/目标日期
        return {
            status: 'waiting',
            target: today,
            rolledOver: false,
            countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
            supported: false,
        };
    }

    if (today.getTime() === thisYearFestival.getTime()) {
        return {
            status: 'day',
            target: thisYearFestival,
            rolledOver: false,
            countdown: diffToParts(thisYearFestival.getTime() - now.getTime()),
            supported: true,
        };
    }

    if (today.getTime() < thisYearFestival.getTime()) {
        return {
            status: 'waiting',
            target: thisYearFestival,
            rolledOver: false,
            countdown: diffToParts(thisYearFestival.getTime() - now.getTime()),
            supported: true,
        };
    }

    // 今年已过 → 需要下一年数据；取不到时明确提示不支持
    let nextYearFestival: Date;
    try {
        nextYearFestival = startOfDay(findMidAutumn(now.getFullYear() + 1));
    } catch {
        return {
            status: 'waiting',
            target: thisYearFestival,
            rolledOver: true,
            countdown: { days: 0, hours: 0, minutes: 0, seconds: 0 },
            supported: false,
        };
    }

    return {
        status: 'waiting',
        target: nextYearFestival,
        rolledOver: true,
        countdown: diffToParts(nextYearFestival.getTime() - now.getTime()),
        supported: true,
    };
}
