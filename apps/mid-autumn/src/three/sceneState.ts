import * as THREE from 'three';

/**
 * 场景共享状态（帧循环读写，绝不触碰 React state，不引发重渲染）。
 *
 * NightScene 是懒加载分包，被多个 chunk 引用的模块在某些情况下会被
 * Rollup 复制成多份实例，因此沿用全局注册表（Symbol.for）保证
 * 整个运行时只有一份状态。
 */
export interface SceneState {
    /** 平滑后的指针位置 -1..1（由 Canvas 内帧循环缓动） */
    pointer: { x: number; y: number };
    /** 指针原始位置 -1..1（由 DOM 事件直接写入） */
    rawPointer: { x: number; y: number };
    /** 指针是否位于场景区域内 */
    inside: boolean;
    /** 正在拖动月球：暂停所有图层的视差，避免月球从手指下滑走 */
    dragging: boolean;
    /** 系统“减少动态效果”：开启时无视差、无自动呼吸 */
    reducedMotion: boolean;
    /** 指针悬停月轮的程度 0..1（由 Moon 射线检测写入） */
    hover: number;
    /** 月轮实时状态：供金尘读取，真正“被月光影响” */
    moon: {
        position: THREE.Vector3;
        radius: number;
    };
}

const STATE_KEY: symbol = Symbol.for('mid-autumn.sceneState.v2');
const registry = globalThis as unknown as Record<symbol, unknown>;

if (!registry[STATE_KEY]) {
    registry[STATE_KEY] = {
        pointer: { x: 0, y: 0 },
        rawPointer: { x: 0, y: 0 },
        inside: false,
        dragging: false,
        reducedMotion: false,
        hover: 0,
        moon: {
            position: new THREE.Vector3(0, 0, 0),
            radius: 2,
        },
    } satisfies SceneState;
}

export const sceneState = registry[STATE_KEY] as SceneState;
