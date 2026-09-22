/** 节日状态边界校验：node --experimental-strip-types scripts/verify-core.ts */
import { computeFestival } from '../src/utils/festival.ts';

let failed = 0;
function check(name: string, ok: boolean): void {
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
}

/* ---------- 节日边界（2026 年中秋 = 2026-09-25） ---------- */

{
    const before = computeFestival(new Date(2026, 8, 24, 23, 59, 59));
    check('中秋前一秒：waiting', before.status === 'waiting' && before.rolledOver === false);
    check('倒计时剩 1 秒', before.countdown.days === 0 && before.countdown.hours === 0 && before.countdown.minutes === 0 && before.countdown.seconds === 1);

    const day = computeFestival(new Date(2026, 8, 25, 0, 0, 0));
    check('中秋零点：day', day.status === 'day');

    const noon = computeFestival(new Date(2026, 8, 25, 12, 0, 0));
    check('中秋中午仍为 day', noon.status === 'day');

    const after = computeFestival(new Date(2026, 8, 26, 0, 0, 0));
    check('中秋次日：自动滚动等待下一年', after.status === 'waiting' && after.rolledOver === true);
    check('下一年目标 = 2027-09-15', after.target.getFullYear() === 2027 && after.target.getMonth() === 8 && after.target.getDate() === 15);

    // 三位数天数：2026-01-01 距 2026-09-25 为 267 天
    const early = computeFestival(new Date(2026, 0, 1, 0, 0, 0));
    check('年初倒计时为三位数天数', early.countdown.days === 267);
}

if (failed) {
    console.error(`\n${failed} 项校验失败`);
    process.exit(1);
}
console.log('\n全部校验通过');
