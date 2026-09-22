import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { sceneState } from './sceneState';
import { PARALLAX } from './sceneConfig';

/**
 * 点精灵尺寸换算：
 *   gl_PointSize = 世界尺寸 × uScale / 视距
 * 其中 uScale = 视口高(px) / (2·tan(fov/2))，由当前透视相机直接推导。
 */
const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float wave = sin(uTime * aSpeed + aPhase);
    float glint = pow(max(0.0, sin(uTime * aSpeed * 2.17 + aPhase * 1.7)), 12.0);
    float twinkle = 0.58 + 0.28 * wave + 0.14 * glint;
    vAlpha = twinkle;
    gl_PointSize = clamp(
      (aSize * uScale / max(0.1, -mv.z)) * (0.9 + 0.15 * twinkle),
      1.25, 3.4
    );
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = 1.0 - smoothstep(0.18, 0.32, d);
    float edge = (1.0 - smoothstep(0.32, 0.5, d)) * 0.12;
    float alpha = (core + edge) * vAlpha;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function mulberry(seed: number) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** 远景穹顶星点：极轻微的指针视差（绕场景中心旋转穹顶） */
export function Stars({ mobile }: { mobile: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, camera } = useThree();

    const { geometry, material } = useMemo(() => {
        const random = mulberry(20260925);
        const count = mobile ? 1400 : 2400;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const speeds = new Float32Array(count);

        const palette = [
            new THREE.Color('#dfe7ff'),
            new THREE.Color('#dfe7ff'),
            new THREE.Color('#dfe7ff'),
            new THREE.Color('#ffe9c4'),
            new THREE.Color('#bcd2ff'),
            new THREE.Color('#ffffff'),
        ];

        for (let i = 0; i < count; i++) {
            // 分布在半径 70～210 的球壳上（相机 far=400，完整包围场景）
            const theta = random() * Math.PI * 2;
            const phi = Math.acos(random() * 2 - 1);
            const radius = 70 + Math.pow(random(), 0.7) * 140;
            positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
            positions[i * 3 + 1] = Math.cos(phi) * radius;
            positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius - 20;

            const c = palette[Math.floor(random() * palette.length)];
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = 0.055 + Math.pow(random(), 6) * 0.25;
            phases[i] = random() * Math.PI * 2;
            speeds[i] = 0.65 + random() * 1.8;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader: starVertex,
            fragmentShader: starFragment,
            uniforms: {
                uTime: { value: 0 },
                uScale: { value: 1000 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return { geometry, material };
    }, [mobile]);

    useFrame(state => {
        if (materialRef.current) {
            const u = materialRef.current.uniforms;
            u.uTime.value = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
            const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
            u.uScale.value =
                (size.height * Math.min(window.devicePixelRatio, 1.6)) /
                (2 * Math.tan(fov / 2));
        }
        if (groupRef.current) {
            groupRef.current.rotation.y = sceneState.pointer.x * PARALLAX.stars.y;
            groupRef.current.rotation.x = -sceneState.pointer.y * PARALLAX.stars.x;
        }
    });

    return (
        <group ref={groupRef}>
            <points geometry={geometry} frustumCulled={false}>
                <primitive ref={materialRef} object={material} attach="material" />
            </points>
        </group>
    );
}

/* ------------------------------------------------------------------ */

const dustVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  uniform vec3 uMoon;
  uniform float uMoonGlow;
  uniform float uHover;
  varying vec3 vColor;
  varying float vFade;
  varying float vGlow;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    vec3 pos = position;
    float range = 18.0;
    pos.y = mod(pos.y + uTime * aSpeed + aPhase + 9.0, range) - 9.0;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float depth = clamp(1.0 - (position.z + 6.0) / 14.0, 0.2, 1.0);
    vFade = depth;
    // 越靠近月轮、越与月轮同深度的尘埃，被月光照得越亮
    float d2 = dot(pos.xy - uMoon.xy, pos.xy - uMoon.xy);
    float zFade = exp(-pow(max(pos.z - uMoon.z + 2.0, 0.0), 2.0) / 40.0);
    vGlow = exp(-d2 / 30.0) * zFade * uMoonGlow * (0.7 + 0.7 * uHover);
    vTwinkle = 0.55 + 0.45 * sin(uTime * (1.3 + aSpeed * 4.0) + aPhase * 3.0);
    gl_PointSize = clamp(
      (aSize * uScale / max(0.1, -mv.z)) * (1.0 + vGlow * 0.4),
      1.0, 3.0
    );
    gl_Position = projectionMatrix * mv;
  }
`;

const dustFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vFade;
  varying float vGlow;
  varying float vTwinkle;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float disc = 1.0 - smoothstep(0.3, 0.47, d);
    vec3 warm = vec3(1.0, 0.9, 0.72);
    vec3 col = mix(vColor, warm, clamp(vGlow * 1.2, 0.0, 1.0));
    float alpha = disc * vFade * (0.28 + vGlow * 0.38) * vTwinkle;
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * 近景金尘：缓慢上浮，靠近月轮处被月光染亮；
 * 整层随指针轻微视差，幅度大于远景（近快远慢）。
 */
export function Dust({ mobile }: { mobile: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);
    const { size, camera } = useThree();
    const hoverSmooth = useRef(0);

    const { geometry, material } = useMemo(() => {
        const random = mulberry(42);
        const count = mobile ? 100 : 220;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const phases = new Float32Array(count);
        const speeds = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (random() - 0.5) * 30;
            positions[i * 3 + 1] = (random() - 0.5) * 18;
            positions[i * 3 + 2] = -12 + random() * 11;

            const gold = random() < 0.72;
            const c = new THREE.Color(gold ? '#e9c489' : '#cdd8f5');
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = 0.035 + random() * 0.07;
            phases[i] = random() * 18;
            speeds[i] = 0.08 + random() * 0.22;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

        const material = new THREE.ShaderMaterial({
            vertexShader: dustVertex,
            fragmentShader: dustFragment,
            uniforms: {
                uTime: { value: 0 },
                uScale: { value: 1000 },
                uMoon: { value: new THREE.Vector3() },
                uMoonGlow: { value: 0.5 },
                uHover: { value: 0 },
            },
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        return { geometry, material };
    }, [mobile]);

    useFrame((state, dtRaw) => {
        const dt = Math.min(dtRaw, 0.05);
        if (materialRef.current) {
            const u = materialRef.current.uniforms;
            u.uTime.value = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
            const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180;
            u.uScale.value =
                (size.height * Math.min(window.devicePixelRatio, 1.6)) /
                (2 * Math.tan(fov / 2));
            (u.uMoon.value as THREE.Vector3).copy(sceneState.moon.position);
            u.uMoonGlow.value = 0.5;
            hoverSmooth.current +=
                (sceneState.hover - hoverSmooth.current) * Math.min(1, dt * 2.5);
            u.uHover.value = hoverSmooth.current;
        }
        if (groupRef.current) {
            groupRef.current.position.set(
                sceneState.pointer.x * PARALLAX.dust.x,
                sceneState.pointer.y * PARALLAX.dust.y,
                0,
            );
        }
    });

    return (
        <group ref={groupRef}>
            <points geometry={geometry} frustumCulled={false}>
                <primitive ref={materialRef} object={material} attach="material" />
            </points>
        </group>
    );
}
