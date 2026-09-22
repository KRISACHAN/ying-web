/**
 * 月夜持续播放的环境动画状态；只响应系统“减少动态效果”。
 *
 * 旧版的公转进度与方向键微调已删除。月球手动旋转由 Moon 独立处理；
 * 这里没有公转进度模型。3D 组件在帧循环内读取 active，
 * 自行累积本地动画时间。
 */
export interface AmbientMotionOptions {
    /** 初始是否播放（月亮自己“活着”） */
    enabled: boolean;
}

export class AmbientMotion {
    enabled: boolean;

    constructor({ enabled }: AmbientMotionOptions) {
        this.enabled = enabled;
    }

    setEnabled(value: boolean): void {
        this.enabled = value;
    }

    /** 是否播放环境动画（呼吸浮动与银河漂移） */
    get active(): boolean {
        return this.enabled;
    }
}
