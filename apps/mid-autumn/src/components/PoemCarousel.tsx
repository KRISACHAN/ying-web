import { useEffect, useRef, useState } from 'react';

/**
 * 诗句自动轮播。
 *
 * - 每隔数秒自动向上切换；
 * - prefers-reduced-motion 下不自动播放（保持当前诗句不动）。
 */

interface Poem {
    /** 诗句正文 */
    text: string;
    /** 出处：朝代·作者《篇名》 */
    source: string;
}

/** 中秋相关的经典诗句 / 词句（诗六首、词四首，唐至明） */
const POEMS: Poem[] = [
    { text: '海上生明月，天涯共此时。', source: '唐·张九龄《望月怀远》' },
    { text: '但愿人长久，千里共婵娟。', source: '宋·苏轼《水调歌头》' },
    {
        text: '今夜月明人尽望，不知秋思落谁家。',
        source: '唐·王建《十五夜望月寄杜郎中》',
    },
    {
        text: '此生此夜不长好，明月明年何处看。',
        source: '宋·苏轼《阳关曲·中秋月》',
    },
    {
        text: '西北望乡何处是，东南见月几回圆。',
        source: '唐·白居易《八月十五日夜湓亭望月》',
    },
    {
        text: '天上若无修月户，桂枝撑损向西轮。',
        source: '宋·米芾《中秋登楼望月》',
    },
    {
        text: '忆对中秋丹桂丛。花在杯中，月在杯中。',
        source: '宋·辛弃疾《一剪梅·中秋元月》',
    },
    {
        text: '若得长圆如此夜，人情未必看承别。',
        source: '宋·辛弃疾《满江红·中秋寄远》',
    },
    {
        text: '桂花浮玉，正月满天街，夜凉如洗。',
        source: '明·文徵明《念奴娇·中秋对月》',
    },
    { text: '阴晴圆缺都休说，且喜人间好时节。', source: '明·徐有贞《中秋月》' },
];

/** 自动轮播间隔（毫秒，留出长句的阅读时间） */
const AUTO_INTERVAL = 8000;
/** 单次切换动画时长（毫秒，与 CSS 保持一致） */
const ANIMATION_MS = 620;

/** 一个处于进入 / 离开状态的诗句槽位 */
interface Slot {
    id: number;
    poemIndex: number;
    leaving: boolean;
}

export default function PoemCarousel() {
    const [index, setIndex] = useState(0);
    const [slots, setSlots] = useState<Slot[]>([
        { id: 0, poemIndex: 0, leaving: false },
    ]);
    const [reducedMotion, setReducedMotion] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    // 跟随系统“减少动态效果”设置
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event: MediaQueryListEvent) =>
            setReducedMotion(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    const idRef = useRef(1);

    // 自动向上切换：旧槽位离场、新槽位进场，动画结束后清理旧槽位
    useEffect(() => {
        if (reducedMotion) return;
        const timer = window.setTimeout(() => {
            const target = (index + 1) % POEMS.length;
            const enterId = idRef.current++;
            setSlots(previous => [
                ...previous.map(slot => ({ ...slot, leaving: true })),
                { id: enterId, poemIndex: target, leaving: false },
            ]);
            setIndex(target);

            // 动画结束后移除旧槽位
            window.setTimeout(() => {
                setSlots(previous =>
                    previous.filter(slot => slot.id === enterId),
                );
            }, ANIMATION_MS + 60);
        }, AUTO_INTERVAL);
        return () => window.clearTimeout(timer);
    }, [index, reducedMotion]);

    return (
        <div className="poem-carousel">
            <div className="poem-stage" aria-live="polite">
                {slots.map(slot => {
                    const poem = POEMS[slot.poemIndex];
                    const classes = [
                        'poem-slide',
                        slot.leaving ? 'leave dir-up' : 'enter dir-up',
                    ].join(' ');
                    return (
                        <div
                            className={classes}
                            key={slot.id}
                            aria-hidden={slot.leaving}
                        >
                            <p className="poem-text">{poem.text}</p>
                            <p className="poem-source">—— {poem.source}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
