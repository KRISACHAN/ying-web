import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { sceneState } from './sceneState';
import type { AmbientMotion } from './ambientMotion';

const vertexShader = /* glsl */ `
  varying vec3 vNormalV;
  varying vec3 vViewV;
  void main() {
    vec4 view = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewV = normalize(-view.xyz);
    gl_Position = projectionMatrix * view;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormalV;
  varying vec3 vViewV;
  void main() {
    float facing = clamp(dot(normalize(vNormalV), normalize(vViewV)), 0.0, 1.0);
    float radius = sqrt(max(1.0 - facing * facing, 0.0));
    // 球面上的宽光峰在投影边界前收束，避免看到球壳轮廓。
    float scatter = smoothstep(0.22, 0.5, radius) *
                    (1.0 - smoothstep(0.64, 0.98, radius));
    gl_FragColor = vec4(uColor, uOpacity * scatter);
  }
`;

function makeMaterial(color: string): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uColor: { value: new THREE.Color(color) },
            uOpacity: { value: 0 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        side: THREE.FrontSide,
    });
}

/**
 * 月球后方的三层真实球壳：一层持续起伏的散射月华、两层向外传播的光波。
 * 星点可在球壳前后穿行，月球本体仍按深度遮挡背景。
 */
export default function MoonAtmosphere({ motion }: { motion: AmbientMotion }) {
    const group = useRef<THREE.Group>(null);
    const shells = useRef<(THREE.Mesh | null)[]>([]);
    const time = useRef(0);
    const materials = useMemo(() => [
        makeMaterial('#a9c8f4'),
        makeMaterial('#91b8ef'),
        makeMaterial('#91b8ef'),
    ], []);

    useEffect(() => () => materials.forEach(material => material.dispose()), [materials]);

    useFrame((_, rawDt) => {
        if (motion.active) time.current += Math.min(rawDt, 0.05);
        if (group.current) {
            group.current.position.copy(sceneState.moon.position);
            group.current.position.z -= 5;
        }

        const base = shells.current[0];
        if (base) base.scale.setScalar(5.1 + Math.sin(time.current * 0.48) * 0.18);
        materials[0].uniforms.uOpacity.value = 0.024 +
            (motion.active ? Math.sin(time.current * 0.48) * 0.006 : 0);

        for (let i = 1; i < 3; i++) {
            const shell = shells.current[i];
            if (!shell) continue;
            shell.visible = motion.active;
            const phase = ((time.current / 14) + (i - 1) * 0.5) % 1;
            shell.scale.setScalar(3.2 + phase * 10.8);
            materials[i].uniforms.uOpacity.value =
                0.024 * Math.pow(Math.sin(Math.PI * phase), 2);
        }
    });

    return (
        <group ref={group}>
            {materials.map((material, index) => (
                <mesh
                    key={index}
                    ref={element => { shells.current[index] = element; }}
                    material={material}
                    frustumCulled={false}
                >
                    <sphereGeometry args={[1, 40, 24]} />
                </mesh>
            ))}
        </group>
    );
}
