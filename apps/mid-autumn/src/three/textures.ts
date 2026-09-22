import * as THREE from 'three';

type Stop = readonly [number, string];

/** 生成严格收敛到 0 的径向渐变贴图（配合 AdditiveBlending 不会出现几何硬边）。 */
function makeRadialTexture(size: number, stops: readonly Stop[]): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2,
    );
    for (const [offset, color] of stops) {
        gradient.addColorStop(offset, color);
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

/**
 * 内层月华：暖、亮、集中，紧贴月轮边缘。
 * 是月亮“华丽感”的主要来源之一，但半径只到 2.4 倍月半径。
 */
export function makeInnerGlowTexture(size = 512): THREE.CanvasTexture {
    return makeRadialTexture(size, [
        [0, 'rgba(255,251,240,0.9)'],
        [0.22, 'rgba(255,239,208,0.5)'],
        [0.5, 'rgba(255,222,172,0.16)'],
        [0.78, 'rgba(255,212,152,0.04)'],
        [1, 'rgba(255,210,150,0)'],
    ]);
}

/**
 * 外层月晕：冷象牙白、大范围、极淡，营造空灵的“月有晕”氛围。
 */
export function makeHaloTexture(size = 512): THREE.CanvasTexture {
    return makeRadialTexture(size, [
        [0, 'rgba(238,244,255,0.42)'],
        [0.28, 'rgba(228,238,255,0.2)'],
        [0.58, 'rgba(212,228,255,0.06)'],
        [0.84, 'rgba(202,222,255,0.014)'],
        [1, 'rgba(200,220,255,0)'],
    ]);
}
