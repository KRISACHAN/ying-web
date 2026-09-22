import { useEffect } from 'react';

import { sceneState } from './sceneState';

/**
 * 场景指针位置输入；月球拖动由 Moon 在 canvas 上单独处理。
 *
 * 只做两件事：
 * - 把指针位置换算为 -1..1（y 向上）写入 sceneState.rawPointer；
 * - 维护 inside 状态。
 *
 * 月轮悬停和按住旋转由 Moon 自行判断；这里仅提供背景视差坐标。
 */
export function useScenePointer(
    element: HTMLElement | null,
    reducedMotion: boolean,
): void {
    useEffect(() => {
        if (!element) return;

        sceneState.reducedMotion = reducedMotion;

        const update = (clientX: number, clientY: number) => {
            const rect = element.getBoundingClientRect();
            sceneState.rawPointer.x =
                ((clientX - rect.left) / rect.width) * 2 - 1;
            sceneState.rawPointer.y =
                -(((clientY - rect.top) / rect.height) * 2 - 1);
        };

        const onPointerMove = (event: PointerEvent) => {
            update(event.clientX, event.clientY);
            sceneState.inside = true;
        };

        const onPointerEnter = (event: PointerEvent) => {
            update(event.clientX, event.clientY);
            sceneState.inside = true;
        };

        const onPointerLeave = () => {
            sceneState.inside = false;
        };

        element.addEventListener('pointermove', onPointerMove);
        element.addEventListener('pointerenter', onPointerEnter);
        element.addEventListener('pointerleave', onPointerLeave);

        return () => {
            element.removeEventListener('pointermove', onPointerMove);
            element.removeEventListener('pointerenter', onPointerEnter);
            element.removeEventListener('pointerleave', onPointerLeave);
        };
    }, [element, reducedMotion]);
}
