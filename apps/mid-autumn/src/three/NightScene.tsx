import { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

import Nebula from './Nebula';
import { Dust, Stars } from './Starfield';
import SpaceDepth from './SpaceDepth';
import MoonAtmosphere from './MoonAtmosphere';
import ShootingStars from './ShootingStars';
import Moon from './Moon';
import CameraRig from './CameraRig';
import { sceneState } from './sceneState';
import type { AmbientMotion } from './ambientMotion';

interface NightSceneProps {
    motion: AmbientMotion;
    /** 中秋当天：微弱暖色 / 亮度增益 */
    festival: boolean;
    mobile: boolean;
}

/**
 * 指针平滑：DOM 事件只写 rawPointer，这里在帧循环内用指数缓动
 * 收敛到 pointer，所有图层读取的都是平滑值，杜绝画面生硬跳动。
 * 减少动态效果 / 指针离场时回归中心。
 */
function PointerSmoother() {
    useFrame((_, dtRaw) => {
        if (sceneState.dragging) return;
        const dt = Math.min(dtRaw, 0.05);
        const target = sceneState.inside && !sceneState.reducedMotion
            ? sceneState.rawPointer
            : { x: 0, y: 0 };
        const k = 1 - Math.exp(-3.2 * dt);
        sceneState.pointer.x += (target.x - sceneState.pointer.x) * k;
        sceneState.pointer.y += (target.y - sceneState.pointer.y) * k;
    });
    return null;
}

/**
 * 月夜场景。
 *
 * 主角只有一轮自发光的月轮（明暗全部在其 shader 内完成，无需场景灯）；
 * 背景为深空穹顶 / 体积星雾 / 稀疏星点 / 缓慢金尘，
 * 统一由共享 sceneState 的克制视差串联（近快远慢）。
 */
export default function NightScene({
    motion,
    festival,
    mobile,
}: NightSceneProps) {
    return (
        <Canvas
            className="webgl-canvas"
            camera={{
                fov: mobile ? 42 : 38,
                near: 0.1,
                far: 400,
                position: [0, 0, 20],
            }}
            dpr={[1, 1.6]}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
        >
            <Suspense fallback={null}>
                <PointerSmoother />

                {/* 银河穹顶之后，星、雾、月华和流星都有独立的空间深度。 */}
                <Nebula motion={motion} />
                <Stars mobile={mobile} />
                <SpaceDepth mobile={mobile} />
                <Dust mobile={mobile} />
                <Moon motion={motion} festival={festival} />
                <MoonAtmosphere motion={motion} />
                <ShootingStars mobile={mobile} />

                <CameraRig mobile={mobile} />

                {/* 微弱 bloom 保留月面质感，同时避免星点被晕成光斑。 */}
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        intensity={0.18}
                        luminanceThreshold={0.82}
                        luminanceSmoothing={0.32}
                        radius={0.6}
                    />
                    <Vignette eskil={false} offset={0.18} darkness={0.72} />
                </EffectComposer>
            </Suspense>
        </Canvas>
    );
}
