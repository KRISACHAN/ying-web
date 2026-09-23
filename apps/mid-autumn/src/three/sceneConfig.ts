/**
 * 月夜场景的构图与动效参数（纯氛围作品，不含任何天文比例）。
 *
 * 所有取景均为确定性计算：相机轴保持水平，月轮锚定在屏幕固定比例处，
 * 月轮直径精确等于视口高度的指定比例，见 CameraRig。
 */

/** 月轮世界半径（场景单位，桌面 / 移动统一，相机距离随之推导） */
export const MOON_RADIUS = 2;

/** 取景参数 */
export interface FrameSpec {
    fov: number;
    /** 月轮直径占视口高度的比例 */
    sizeY: number;
    /** 月轮中心在屏幕上的锚点（0..1） */
    anchor: { x: number; y: number };
}

/**
 * 桌面：月轮偏右，直径约 72% 视口高，右侧允许轻微出画（电影感留白），
 * 左缘不越过 0.34，左侧文案安全区清晰。
 */
export const FRAME_DESKTOP: FrameSpec = {
    fov: 38,
    sizeY: 0.72,
    anchor: { x: 0.7, y: 0.5 },
};

/**
 * 移动：月轮水平居中、偏上，直径约 46% 视口高
 * （竖屏按宽度收敛，避免横向出画），下方留给倒计时。
 */
export const FRAME_MOBILE: FrameSpec = {
    fov: 42,
    sizeY: 0.46,
    anchor: { x: 0.5, y: 0.33 },
};

/** 指针视差幅度：全部克制，近景层位移大于远景层 */
export const PARALLAX = {
    /** 月轮本体的世界位移（约为半径的 1/6，几乎不可察但画面有“呼吸方向”） */
    moon: { x: 0.32, y: 0.2 },
    /** 近景金尘层 */
    dust: { x: 0.5, y: 0.32 },
    /** 远景穹顶星点（弧度） */
    stars: { y: 0.03, x: 0.016 },
    /** 银河穹顶（弧度） */
    nebula: { y: 0.016, z: 0.01 },
} as const;

/** 月轮自动呼吸：浮动幅度与速度 */
export const MOON_BREATHE = {
    floatY: 0.08,
    floatSpeed: 0.42,
} as const;
