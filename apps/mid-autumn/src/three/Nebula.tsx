import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

import { sceneState } from './sceneState';
import { PARALLAX } from './sceneConfig';
import type { AmbientMotion } from './ambientMotion';

interface NebulaProps {
    motion: AmbientMotion;
}

/**
 * ESO GigaGalaxy 实拍全天银河全景，作为深空穹顶。
 *
 * 以场景为心、半径 260 的球：相机始终在球内，任何构图调整都不会
 * 把背景裁出画面。极轻微的指针视差 + 缓慢自转，幅度为全场最小
 * （远景最慢），并刻意压暗压灰，绝不与月轮争辉。
 */
export default function Nebula({ motion }: NebulaProps) {
    const groupRef = useRef<THREE.Group>(null);
    const map = useLoader(
        THREE.TextureLoader,
        '/textures/celestial/milky-way-eso-4k.jpg',
    );
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;

    useFrame((_, dtRaw) => {
        const dt = Math.min(dtRaw, 0.05);
        if (groupRef.current) {
            // 极其缓慢的自行漂移（暂停感知）
            if (motion.active) drift.current += dt * 0.0016;
            groupRef.current.rotation.y =
                sceneState.pointer.x * PARALLAX.nebula.y + drift.current;
            groupRef.current.rotation.z =
                sceneState.pointer.y * PARALLAX.nebula.z;
        }
    });

    return (
        <group ref={groupRef} rotation={[0.08, 0.48, -0.2]}>
            <mesh renderOrder={-20}>
                <sphereGeometry args={[260, 64, 40]} />
                <meshBasicMaterial
                    map={map}
                    side={THREE.BackSide}
                    color="#7d899f"
                    transparent
                    opacity={0.42}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

const drift = { current: 0 };
