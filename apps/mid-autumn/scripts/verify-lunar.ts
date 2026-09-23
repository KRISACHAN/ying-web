/**
 * 农历换算验证脚本：node --experimental-strip-types scripts/verify-lunar.ts
 * 用公开可查的历年中秋节公历日期校验 lunarInfo 数据表与扫描逻辑。
 */
import {
    findMidAutumn,
    ganZhiYear,
    solarToLunar,
    zodiacYear,
} from '../src/utils/lunar.ts';

const KNOWN_MID_AUTUMN: Record<number, string> = {
    2020: '2020-10-01',
    2021: '2021-09-21',
    2022: '2022-09-10',
    2023: '2023-09-29',
    2024: '2024-09-17',
    2025: '2025-10-06',
    2026: '2026-09-25',
    2027: '2027-09-15',
    2028: '2028-10-03',
    2029: '2029-09-22',
    2030: '2030-09-12',
    2031: '2031-10-01',
    2032: '2032-09-19',
    2033: '2033-09-08', // 2033 年有闰冬月，是特殊年；中秋为历年最早之一
};

function fmt(date: Date): string {
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${m}-${d}`;
}

let failed = 0;

for (const [yearText, expected] of Object.entries(KNOWN_MID_AUTUMN)) {
    const year = Number(yearText);
    const actual = fmt(findMidAutumn(year));
    const ok = actual === expected;
    if (!ok) failed++;
    console.log(
        `${ok ? 'PASS' : 'FAIL'}  ${year} 期望 ${expected} 实际 ${actual}`,
    );
}

// 节日当天反查农历必须是八月十五
for (const [yearText, dateText] of Object.entries(KNOWN_MID_AUTUMN)) {
    const [y, m, d] = dateText.split('-').map(Number);
    const lunar = solarToLunar(new Date(y, m - 1, d));
    const ok = lunar.month === 8 && lunar.day === 15 && !lunar.isLeap;
    if (!ok) failed++;
    console.log(
        `${ok ? 'PASS' : 'FAIL'}  ${dateText} 农历 = ${ganZhiYear(lunar.year)}(${zodiacYear(lunar.year)})年 ${lunar.month}月${lunar.day}日${lunar.isLeap ? ' 闰' : ''}`,
    );
}

// 正月初一（春节）抽查
const SPRING_FESTIVALS: Record<number, string> = {
    2024: '2024-02-10',
    2025: '2025-01-29',
    2026: '2026-02-17',
    2027: '2027-02-06',
    2033: '2033-01-31',
};
for (const [yearText, dateText] of Object.entries(SPRING_FESTIVALS)) {
    const [y, m, d] = dateText.split('-').map(Number);
    const lunar = solarToLunar(new Date(y, m - 1, d));
    const ok = lunar.month === 1 && lunar.day === 1 && !lunar.isLeap;
    if (!ok) failed++;
    console.log(
        `${ok ? 'PASS' : 'FAIL'}  春节 ${dateText} -> 农历${lunar.month}月${lunar.day}日`,
    );
}

if (failed) {
    console.error(`\n${failed} 项校验失败`);
    process.exit(1);
}
console.log('\n全部校验通过');
