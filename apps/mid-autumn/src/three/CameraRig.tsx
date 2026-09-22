import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

import {
    FRAME_DESKTOP,
    FRAME_MOBILE,
    MOON_RADIUS,
    type FrameSpec,
} from './sceneConfig';

/**
 * 确定性取景（相机轴始终水平，看向 z=0 平面上的一点）。
 *
 * 月轮世界中心在原点 (0,0,0)：
 * - 相机距离由「月轮直径 = 视口高 × sizeY」直接反推；
 * - 视线点由「月轮中心 = 屏幕锚点」反推。
 *
 * 交互期间相机完全静止，空间感全部来自各图层自身的克制视差
 * （近快远慢），而非晃动镜头。
 */
function solveCamera(
    camera: THREE.PerspectiveCamera,
    aspect: number,
    frame: FrameSpec,
) {
    const t = Math.tan((frame.fov / 2) * (Math.PI / 180));

    // 月轮直径（世界 2R，位于 z=0、距相机 distance）占视口高 sizeY
    const distance = (2 * MOON_RADIUS) / (frame.sizeY * t);

    // 月轮中心投影到锚点：视线点即屏幕中心对应的世界点
    const lookX =
        -(frame.anchor.x - 0.5) * 2 * distance * t * aspect;
    const lookY = (frame.anchor.y - 0.5) * 2 * distance * t;

    camera.fov = frame.fov;
    camera.near = 0.1;
    camera.far = 400;
    camera.position.set(lookX, lookY, distance);
    camera.lookAt(lookX, lookY, 0);
    camera.updateProjectionMatrix();
}

export default function CameraRig({ mobile }: { mobile: boolean }) {
    const { camera: baseCamera, size } = useThree();
    const camera = baseCamera as THREE.PerspectiveCamera;
    const lastSignature = useRef('');

    useFrame(() => {
        // 只在视口尺寸 / 设备类型变化时重新取景，其余帧相机纹丝不动
        const signature = `${mobile}|${size.width}x${size.height}`;
        if (lastSignature.current === signature) return;
        lastSignature.current = signature;

        const aspect = size.width / Math.max(1, size.height);
        solveCamera(camera, aspect, mobile ? FRAME_MOBILE : FRAME_DESKTOP);
    });

    return null;
}
