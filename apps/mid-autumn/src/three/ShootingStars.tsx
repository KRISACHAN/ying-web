import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import { FRAME_DESKTOP, FRAME_MOBILE, MOON_RADIUS } from './sceneConfig';
import { sceneState } from './sceneState';

type Meteor = {
    depth: number;
    startX: number;
    startY: number;
    delay: number;
    period: number;
    duration: number;
    length: number;
};

const METEORS: Meteor[] = [
    { depth: 18, startX: 0.95, startY: 0.70, delay: 1.3, period: 11.8, duration: 0.62, length: 0.25 },
    { depth: 48, startX: 0.34, startY: 0.88, delay: 5.2, period: 15.1, duration: 0.72, length: 0.18 },
    { depth: 76, startX: 1.14, startY: -0.12, delay: 8.6, period: 13.7, duration: 0.58, length: 0.21 },
];

/** 窄三角带：尾尖颜色接近夜空，亮头随轨迹前进。 */
function makeTrailGeometry() {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([
        -0.5, 0, 0, 0.36, 0.13, 0, 0.5, 0, 0,
        -0.5, 0, 0, 0.5, 0, 0, 0.36, -0.13, 0,
    ], 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute([
        0.035, 0.055, 0.09, 0.72, 0.82, 1, 1, 1, 1,
        0.035, 0.055, 0.09, 1, 1, 1, 0.72, 0.82, 1,
    ], 3));
    geometry.computeVertexNormals();
    return geometry;
}

/** 深空中不同距离的短促流星，透视尺寸和遮挡均由相机决定。 */
export default function ShootingStars({ mobile }: { mobile: boolean }) {
    const { size } = useThree();
    const meshes = useRef<(THREE.Mesh | null)[]>([]);
    const geometry = useMemo(makeTrailGeometry, []);
    const materials = useMemo(() => METEORS.map(() => new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: true,
        side: THREE.DoubleSide,
        toneMapped: false,
    })), []);

    useEffect(() => () => {
        geometry.dispose();
        materials.forEach(material => material.dispose());
    }, [geometry, materials]);

    useFrame(state => {
        const frame = mobile ? FRAME_MOBILE : FRAME_DESKTOP;
        const tangent = Math.tan(frame.fov * Math.PI / 360);
        const distance = 2 * MOON_RADIUS / (frame.sizeY * tangent);
        const aspect = size.width / Math.max(size.height, 1);
        const cameraX = -(frame.anchor.x - 0.5) * 2 * distance * tangent * aspect;
        const cameraY = (frame.anchor.y - 0.5) * 2 * distance * tangent;

        METEORS.forEach((meteor, index) => {
            const mesh = meshes.current[index];
            if (!mesh) return;
            if (sceneState.reducedMotion || (mobile && index === 2)) {
                mesh.visible = false;
                return;
            }
            const elapsed = state.clock.elapsedTime - meteor.delay;
            const phase = ((elapsed % meteor.period) + meteor.period) % meteor.period;
            const active = elapsed >= 0 && phase < meteor.duration;
            mesh.visible = active;
            if (!active) return;

            const progress = phase / meteor.duration;
            const halfHeight = (distance + meteor.depth) * tangent;
            // 先换算为同一深度的世界坐标，再让位移与亮头方向共用这个向量。
            const travelX = -0.55 * halfHeight * aspect;
            const travelY = -0.30 * halfHeight;
            mesh.position.set(
                cameraX + meteor.startX * halfHeight * aspect + progress * travelX,
                cameraY + meteor.startY * halfHeight + progress * travelY,
                -meteor.depth,
            );
            mesh.rotation.z = Math.atan2(travelY, travelX);
            mesh.scale.set(
                meteor.length * halfHeight * aspect,
                Math.max(0.012, halfHeight * 0.025),
                1,
            );
            materials[index].opacity =
                Math.min(1, progress * 8, (1 - progress) * 9) * (index === 0 ? 0.9 : 0.72);
        });
    });

    return (
        <>
            {materials.map((material, index) => (
                <mesh
                    key={index}
                    ref={element => { meshes.current[index] = element; }}
                    geometry={geometry}
                    material={material}
                    visible={false}
                    frustumCulled={false}
                />
            ))}
        </>
    );
}
