import {
    Component,
    lazy,
    Suspense,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

import { Countdown } from './components/Countdown';
import PoemCarousel from './components/PoemCarousel';
import {
    formatLunarDate,
    formatSolarDate,
    useMidAutumn,
} from './hooks/useMidAutumn';
import { lunarDayName, lunarMonthName } from './utils/lunar';
import { AmbientMotion } from './three/ambientMotion';
import { useScenePointer } from './three/useScenePointer';
import NotePanel from './notes/NotePanel';
import { loadNote, type NoteRecord } from './notes/storage';

const NightScene = lazy(() => import('./three/NightScene'));

/* 调试工具只在开发环境加载：生产构建里条件恒为 false，
   Rollup 会把这个动态 import 连同整个 debug 目录一起剔除。 */
const DebugTools = lazy(async () => {
    if (import.meta.env.DEV) return import('./debug/DebugPanel');
    return { default: () => <></> };
});

function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event: MediaQueryListEvent) =>
            setReduced(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);
    return reduced;
}

function useIsMobile(): boolean {
    const [mobile, setMobile] = useState(
        () => window.matchMedia('(max-width: 760px)').matches,
    );
    useEffect(() => {
        const query = window.matchMedia('(max-width: 760px)');
        const onChange = (event: MediaQueryListEvent) =>
            setMobile(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);
    return mobile;
}

function supportsWebGL(): boolean {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGL2RenderingContext &&
            (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        );
    } catch {
        return false;
    }
}

class WebGLBoundary extends Component<
    { children: ReactNode; fallback: ReactNode },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children;
    }
}

export default function App() {
    const festival = useMidAutumn();
    const reducedMotion = useReducedMotion();
    const mobile = useIsMobile();
    const [webglOk] = useState(supportsWebGL);
    const [entered, setEntered] = useState(false);
    const [panelOpen, setPanelOpen] = useState(false);
    const [note, setNote] = useState<NoteRecord | null>(() => loadNote());

    // 环境动画持续播放；仅跟随系统“减少动态效果”设置。
    const [motion] = useState(
        () => new AmbientMotion({ enabled: !reducedMotion }),
    );

    useEffect(() => {
        motion.setEnabled(!reducedMotion);
    }, [motion, reducedMotion]);

    const interactiveRef = useRef<HTMLDivElement>(null);
    const [interactiveEl, setInteractiveEl] = useState<HTMLDivElement | null>(
        null,
    );

    const isDay = festival.status === 'day';

    useEffect(() => {
        const timer = window.setTimeout(() => setEntered(true), 80);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        setInteractiveEl(interactiveRef.current);
    }, []);

    useScenePointer(interactiveEl, reducedMotion);

    useEffect(() => {
        document.title = isDay
            ? '今夕月圆 · 中秋'
            : `中秋倒计时 · 还有 ${festival.countdown.days} 天`;
    }, [isDay, festival.countdown.days]);

    const todayLunar = festival.todayLunar
        ? `${lunarMonthName(
              festival.todayLunar.month,
              festival.todayLunar.isLeap,
          )}${lunarDayName(festival.todayLunar.day)}`
        : '';

    return (
        <div
            className={`scene ${isDay ? 'is-day' : 'is-waiting'} ${
                entered ? 'is-in' : ''
            }`}
        >
            <div className="sky-base" aria-hidden="true" />

            {/* 场景层：指针视差；按住月球可自由旋转月面 */}
            <div
                ref={interactiveRef}
                className="scene-interactive"
                aria-hidden="true"
            >
                <WebGLBoundary fallback={<div className="space-fallback" />}>
                    {webglOk ? (
                        <Suspense fallback={null}>
                            <NightScene
                                motion={motion}
                                festival={isDay}
                                mobile={mobile}
                            />
                        </Suspense>
                    ) : (
                        <div className="space-fallback" />
                    )}
                </WebGLBoundary>

                <p className="scene-hint">
                    按住月亮，转动月色
                </p>
            </div>

            <header className="topbar">
                <span className="brand">月满中秋</span>
                {todayLunar && <span className="today">{todayLunar}</span>}
            </header>

            <main className="info">
                <h1>{isDay ? '今夕月圆' : '共望一轮月'}</h1>

                <PoemCarousel />

                {isDay ? (
                    <p className="info-date">
                        {formatSolarDate(festival.now)}
                    </p>
                ) : festival.supported && festival.targetLunar ? (
                    <>
                        <p className="info-label">距离中秋还有</p>
                        <Countdown parts={festival.countdown} />
                        <p className="info-date">
                            {formatSolarDate(festival.target)}
                            <span aria-hidden="true">·</span>
                            {formatLunarDate(festival.targetLunar)}
                        </p>
                    </>
                ) : (
                    <p className="info-unsupported" role="status">
                        农历年历表仅支持至 2099 年，当前日期的中秋倒计时已无法计算。
                    </p>
                )}

                <div className="info-actions">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setPanelOpen(true)}
                    >
                        {note ? '看看这句思念' : '留一句思念'}
                    </button>

                </div>

                {note && (
                    <blockquote className="saved-note">
                        <p>{note.body}</p>
                        {note.name && <footer>—— {note.name}</footer>}
                    </blockquote>
                )}
            </main>

            {panelOpen && (
                <NotePanel
                    festivalYear={festival.target.getFullYear()}
                    onClose={() => setPanelOpen(false)}
                    onSaved={setNote}
                    onDeleted={() => setNote(null)}
                />
            )}

            <div className="grain" aria-hidden="true" />

            {/* 开发环境时间调试悬浮球（生产构建为空组件） */}
            <Suspense fallback={null}>
                <DebugTools />
            </Suspense>
        </div>
    );
}
