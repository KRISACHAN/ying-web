import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { sceneState } from './sceneState';
import { MOON_BREATHE, MOON_RADIUS, PARALLAX } from './sceneConfig';
import type { AmbientMotion } from './ambientMotion';

interface MoonProps {
    motion: AmbientMotion;
    /** 中秋当天：微弱的暖色 / 亮度增益 */
    festival: boolean;
}

/* ------------------------------------------------------------------ */
/* 月面 Shader：所有明暗都在 shader 内完成，不依赖场景灯光               */
/* ------------------------------------------------------------------ */

const moonVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = cameraPosition - world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const moonFragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform sampler2D uHeight;
  uniform vec2 uTexel;
  uniform vec3 uLightDir;
  uniform float uHover;
  uniform float uPulse;
  uniform float uFestival;

  varying vec3 vNormalW;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  varying vec2 vUv;

  /* sRGB 贴图手动反变换到线性空间（Raw ShaderMaterial 不会自动解码） */
  vec3 sRGBToLinear(vec3 c) {
    return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(vec3(0.04045), c));
  }

  void main() {
    vec3 base = sRGBToLinear(texture2D(uMap, vUv).rgb);

    /* 用高程图的屏幕空间导数重建切线空间，为月面增加细腻浮雕光影 */
    float h  = texture2D(uHeight, vUv).r;
    float hx = texture2D(uHeight, vUv + vec2(uTexel.x, 0.0)).r;
    float hy = texture2D(uHeight, vUv + vec2(0.0, uTexel.y)).r;

    vec3 q0 = dFdx(vWorldPos);
    vec3 q1 = dFdy(vWorldPos);
    vec2 st0 = dFdx(vUv);
    vec2 st1 = dFdy(vUv);
    vec3 N = normalize(vNormalW);
    vec3 T = normalize(q0 * st1.t - q1 * st0.t);
    vec3 B = normalize(cross(N, T));
    /* 浮雕强度随 hover 轻微增强，像月光忽然清澈了一瞬 */
    float relief = 2.2 + uHover * 1.4;
    vec3 perturbed = normalize(mat3(T, B, N) * vec3((hx - h) * relief, (hy - h) * relief, 1.0));

    vec3 V = normalize(vViewDir);
    vec3 L = normalize(uLightDir);

    float ndl = dot(perturbed, L);
    float facing = clamp(dot(perturbed, V), 0.0, 1.0);

    /* 柔光（wrap lighting）：太阳几乎在相机身后，整面皆昼，
       只在边缘极缓地沉入阴影，保持满月气质的同时交代球体 */
    float wrap = clamp((ndl + 0.55) / 1.55, 0.0, 1.0);
    float diffuse = pow(wrap, 0.85);

    /* 临边昏暗：月轮中心饱满，向边缘温柔暗下去，体积感的主要来源 */
    float limb = pow(facing, 0.62);

    vec3 col = base * diffuse * limb;

    /* 对冲增亮（opposition surge）：月心一抹由内而外的光华，
       克制、缓慢脉动，是“华丽”而非“爆光”的关键 */
    float surge = pow(facing, 4.0);
    col += vec3(1.0, 0.93, 0.78) * surge * (0.1 + uPulse * 0.05 + uHover * 0.12 + uFestival * 0.04);

    /* 边缘光 rim light：冷调月白勾边，悬停时更亮，强化空灵与体积 */
    float rim = pow(1.0 - facing, 3.4);
    vec3 rimWarm = vec3(0.72, 0.82, 1.0);
    col += rimWarm * rim * (0.16 + uPulse * 0.05 + uHover * 0.22 + uFestival * 0.03);

    /* 象牙暖调统一月面色性，避免月面发“脏” */
    col *= vec3(1.02, 0.99, 0.93);

    /* 柔和高光压缩：电影化 rolloff，杜绝过曝硬切（输出仍为线性，
       交由 postprocessing 统一编码） */
    col = 1.04 * (1.0 - exp(-col * 1.15));

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Moon({ motion, festival }: MoonProps) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRef = useRef<THREE.Mesh>(null);
    const rotationRef = useRef<THREE.Group>(null);
    const rotationTarget = useRef(new THREE.Quaternion());
    const dragRef = useRef<{ pointerId: number; x: number; y: number } | null>(null);
    const hoverRef = useRef(0);
    /** 暂停感知的本地动画时间：面板关闭后不会补跳 */
    const animTime = useRef(0);

    const { raycaster, camera, gl } = useThree();

    const [map, heightMap] = useLoader(THREE.TextureLoader, [
        '/textures/celestial/moon-lroc-color-2k.jpg',
        '/textures/celestial/moon-lola-height-1k.jpg',
    ]);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    heightMap.anisotropy = 4;

    const material = useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader: moonVertex,
                fragmentShader: moonFragment,
                uniforms: {
                    uMap: { value: map },
                    uHeight: { value: heightMap },
                    uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 512) },
                    // 太阳几乎沿相机视线照来，略微偏移以保留明暗层次
                    uLightDir: {
                        value: new THREE.Vector3(0.22, 0.14, 0.96).normalize(),
                    },
                    uHover: { value: 0 },
                    uPulse: { value: 0 },
                    uFestival: { value: festival ? 1 : 0 },
                },
            }),
        [map, heightMap, festival],
    );

    // 只在按下月面时接管指针；后续移动由 canvas 捕获，手指滑出月轮也不断触。
    // DOM 输入只更新目标姿态，实际球体在帧循环内平滑追上，避免手机触摸采样抖动。
    useEffect(() => {
        const canvas = gl.domElement;
        const onDown = (event: PointerEvent) => {
            if (dragRef.current || !meshRef.current ||
                (event.pointerType === 'mouse' && event.button !== 0)) return;
            const rect = canvas.getBoundingClientRect();
            tmpNdc.set(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            meshRef.current.updateWorldMatrix(true, false);
            raycaster.setFromCamera(tmpNdc, camera);
            if (!raycaster.intersectObject(meshRef.current, false).length) return;

            event.preventDefault();
            dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
            sceneState.dragging = true;
            canvas.setPointerCapture(event.pointerId);
        };
        const onMove = (event: PointerEvent) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;
            event.preventDefault();
            const dx = event.clientX - drag.x;
            const dy = event.clientY - drag.y;
            drag.x = event.clientX;
            drag.y = event.clientY;
            rotationTarget.current.premultiply(tmpRotation.setFromAxisAngle(worldY, dx * 0.007));
            rotationTarget.current.premultiply(tmpRotation.setFromAxisAngle(worldX, dy * 0.007));
            rotationTarget.current.normalize();
        };
        const onEnd = (event: PointerEvent) => {
            if (dragRef.current?.pointerId !== event.pointerId) return;
            dragRef.current = null;
            sceneState.dragging = false;
            if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
        };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('pointermove', onMove);
        canvas.addEventListener('pointerup', onEnd);
        canvas.addEventListener('pointercancel', onEnd);
        canvas.addEventListener('lostpointercapture', onEnd);
        return () => {
            canvas.removeEventListener('pointerdown', onDown);
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerup', onEnd);
            canvas.removeEventListener('pointercancel', onEnd);
            canvas.removeEventListener('lostpointercapture', onEnd);
            sceneState.dragging = false;
            canvas.style.cursor = 'default';
        };
    }, [camera, gl, raycaster]);

    useFrame((_, dtRaw) => {
        const dt = Math.min(dtRaw, 0.05);
        rotationRef.current?.quaternion.slerp(
            rotationTarget.current,
            1 - Math.exp(-18 * dt),
        );

        if (motion.active) {
            animTime.current += dt;
        }

        /* 悬停射线检测：直接使用 DOM 侧写入的 NDC 坐标 */
        let hoverTarget = 0;
        if (meshRef.current && sceneState.inside && !dragRef.current) {
            raycaster.setFromCamera(
                // sceneState.rawPointer 即 NDC（y 向上）
                tmpNdc.set(sceneState.rawPointer.x, sceneState.rawPointer.y),
                camera,
            );
            hoverTarget = raycaster.intersectObject(meshRef.current, false).length
                ? 1
                : 0;
        }
        hoverRef.current +=
            (hoverTarget - hoverRef.current) * Math.min(1, dt * 3.0);
        gl.domElement.style.cursor = dragRef.current
            ? 'grabbing'
            : hoverTarget ? 'grab' : 'default';

        /* 月华缓慢脉动 */
        const pulse = motion.active
            ? Math.sin(animTime.current * 0.5) * 0.5 + 0.5
            : 0;

        material.uniforms.uHover.value = hoverRef.current;
        material.uniforms.uPulse.value = pulse;

        /* 月轮位置：克制视差 + 极轻呼吸浮动 */
        if (groupRef.current) {
            const breathe = motion.active
                ? Math.sin(animTime.current * MOON_BREATHE.floatSpeed) *
                  MOON_BREATHE.floatY
                : 0;
            groupRef.current.position.set(
                sceneState.pointer.x * PARALLAX.moon.x,
                sceneState.pointer.y * PARALLAX.moon.y + breathe,
                0,
            );
            groupRef.current.getWorldPosition(sceneState.moon.position);
        }

        sceneState.hover = hoverRef.current;
        sceneState.moon.radius = MOON_RADIUS;
    });

    return (
        <group ref={groupRef}>
            <group ref={rotationRef}>
                <mesh ref={meshRef} material={material} rotation={[0.05, 0, -0.03]}>
                    <sphereGeometry args={[MOON_RADIUS, 96, 96]} />
                </mesh>
            </group>
        </group>
    );
}

/** 复用临时向量，避免每帧分配 */
const tmpNdc = new THREE.Vector2();
const tmpRotation = new THREE.Quaternion();
const worldX = new THREE.Vector3(1, 0, 0);
const worldY = new THREE.Vector3(0, 1, 0);
