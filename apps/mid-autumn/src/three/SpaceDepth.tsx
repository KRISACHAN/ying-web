import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { FRAME_DESKTOP, FRAME_MOBILE, MOON_RADIUS } from './sceneConfig';
import { sceneState } from './sceneState';

const starVertex = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  uniform float uScale;
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float nearness = 1.0 / (1.0 + max(-position.z, 0.0) * 0.05);
    vec3 pos = position;
    pos.xy += uPointer * nearness * 0.5;
    pos.x += sin(uTime * 0.065 + aPhase) * nearness * 0.08;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float pulse = 0.65 + 0.28 * sin(uTime * aSpeed + aPhase);
    vColor = aColor;
    vAlpha = pulse;
    gl_PointSize = clamp(aSize * uScale / max(-mv.z, 1.0), 1.0, 3.6);
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float core = 1.0 - smoothstep(0.16, 0.32, d);
    gl_FragColor = vec4(vColor, core * vAlpha);
  }
`;

const cloudVertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uScale;
  uniform float uTime;
  uniform vec2 uPointer;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float nearness = 1.0 / (1.0 + max(-position.z, 0.0) * 0.06);
    vec3 pos = position;
    pos.xy += uPointer * nearness * 0.9;
    pos.x += sin(uTime * 0.045 + aPhase) * nearness * 0.16;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vColor = aColor;
    vAlpha = aAlpha;
    gl_PointSize = min(aSize * uScale / max(-mv.z, 1.0), 110.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const cloudFragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = length(gl_PointCoord - vec2(0.5)) * 2.0;
    float haze = pow(max(1.0 - r * r, 0.0), 2.6);
    gl_FragColor = vec4(vColor, haze * vAlpha);
  }
`;

function randomGenerator(seed: number) {
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** 依据镜头取景，把屏幕分布投进不同世界深度；每颗星仍有真实 z 坐标。 */
function makeProjector(mobile: boolean, aspect: number) {
    const frame = mobile ? FRAME_MOBILE : FRAME_DESKTOP;
    const tangent = Math.tan(frame.fov * Math.PI / 360);
    const cameraDistance = 2 * MOON_RADIUS / (frame.sizeY * tangent);
    const cameraX = -(frame.anchor.x - 0.5) * 2 * cameraDistance * tangent * aspect;
    const cameraY = (frame.anchor.y - 0.5) * 2 * cameraDistance * tangent;
    return (nx: number, ny: number, depth: number): [number, number, number] => {
        const halfHeight = (cameraDistance + depth) * tangent;
        return [
            cameraX + nx * halfHeight * aspect,
            cameraY + ny * halfHeight,
            -depth,
        ];
    };
}

function makeMaterial(vertexShader: string, fragmentShader: string) {
    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uScale: { value: 1000 },
            uTime: { value: 0 },
            uPointer: { value: new THREE.Vector2() },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
    });
}

/** 月球与最远银河之间的三维星雾体积，近层位移快、远层位移慢。 */
export default function SpaceDepth({ mobile }: { mobile: boolean }) {
    const { size, camera } = useThree();
    const { starGeometry, cloudGeometry, starMaterial, cloudMaterial } = useMemo(() => {
        const random = randomGenerator(91827);
        const project = makeProjector(mobile, size.width / Math.max(size.height, 1));
        const starCount = mobile ? 240 : 460;
        const cloudCount = mobile ? 12 : 22;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);
        const starPhases = new Float32Array(starCount);
        const starSpeeds = new Float32Array(starCount);
        const palette = ['#eef3ff', '#ccddff', '#f6e4bd'];

        for (let i = 0; i < starCount; i++) {
            const depth = 7 + Math.pow(random(), 0.9) * 90;
            const position = project((random() - 0.5) * 2.5, (random() - 0.5) * 2.5, depth);
            starPositions.set(position, i * 3);
            const color = new THREE.Color(palette[Math.floor(random() * palette.length)]);
            starColors.set([color.r, color.g, color.b], i * 3);
            starSizes[i] = 0.055 + Math.pow(random(), 5) * 0.18;
            starPhases[i] = random() * Math.PI * 2;
            starSpeeds[i] = 0.5 + random() * 1.5;
        }

        const cloudPositions = new Float32Array(cloudCount * 3);
        const cloudColors = new Float32Array(cloudCount * 3);
        const cloudSizes = new Float32Array(cloudCount);
        const cloudAlphas = new Float32Array(cloudCount);
        const cloudPhases = new Float32Array(cloudCount);
        for (let i = 0; i < cloudCount; i++) {
            const depth = 14 + random() * 72;
            const nx = (random() - 0.5) * 2.2;
            const ny = (random() - 0.5) * 0.8 + nx * 0.1;
            cloudPositions.set(project(nx, ny, depth), i * 3);
            const color = new THREE.Color(random() < 0.75 ? '#879ac9' : '#b4a8c2');
            cloudColors.set([color.r, color.g, color.b], i * 3);
            cloudSizes[i] = 2.8 + random() * 4;
            cloudAlphas[i] = 0.007 + random() * 0.011;
            cloudPhases[i] = random() * Math.PI * 2;
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
        starGeometry.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
        starGeometry.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
        starGeometry.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeeds, 1));
        const cloudGeometry = new THREE.BufferGeometry();
        cloudGeometry.setAttribute('position', new THREE.BufferAttribute(cloudPositions, 3));
        cloudGeometry.setAttribute('aColor', new THREE.BufferAttribute(cloudColors, 3));
        cloudGeometry.setAttribute('aSize', new THREE.BufferAttribute(cloudSizes, 1));
        cloudGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(cloudAlphas, 1));
        cloudGeometry.setAttribute('aPhase', new THREE.BufferAttribute(cloudPhases, 1));

        return {
            starGeometry,
            cloudGeometry,
            starMaterial: makeMaterial(starVertex, starFragment),
            cloudMaterial: makeMaterial(cloudVertex, cloudFragment),
        };
    }, [mobile, size.width, size.height]);

    useEffect(() => () => {
        starGeometry.dispose();
        cloudGeometry.dispose();
        starMaterial.dispose();
        cloudMaterial.dispose();
    }, [starGeometry, cloudGeometry, starMaterial, cloudMaterial]);

    useFrame(state => {
        const fov = (camera as THREE.PerspectiveCamera).fov * Math.PI / 180;
        const scale = size.height * Math.min(window.devicePixelRatio, 1.6) /
            (2 * Math.tan(fov / 2));
        for (const material of [starMaterial, cloudMaterial]) {
            material.uniforms.uScale.value = scale;
            material.uniforms.uTime.value = sceneState.reducedMotion ? 0 : state.clock.elapsedTime;
            (material.uniforms.uPointer.value as THREE.Vector2).set(
                sceneState.pointer.x, sceneState.pointer.y,
            );
        }
    });

    return (
        <>
            <points geometry={cloudGeometry} material={cloudMaterial} frustumCulled={false} />
            <points geometry={starGeometry} material={starMaterial} frustumCulled={false} />
        </>
    );
}
