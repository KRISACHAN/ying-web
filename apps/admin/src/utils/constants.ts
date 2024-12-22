export const LUCKY_NUMBER_STATUS = Object.freeze({
    NOT_STARTED: 'not_started',
    ONGOING: 'ongoing',
    ENDED: 'ended',
});

export type LuckyNumberStatus =
    (typeof LUCKY_NUMBER_STATUS)[keyof typeof LUCKY_NUMBER_STATUS];

export const LUCKY_NUMBER_STATUS_MAP = Object.freeze({
    [LUCKY_NUMBER_STATUS.NOT_STARTED]: '未开始',
    [LUCKY_NUMBER_STATUS.ONGOING]: '进行中',
    [LUCKY_NUMBER_STATUS.ENDED]: '已结束',
});

export const getLuckyNumberStatusLabel = (
    status: LuckyNumberStatus | undefined,
) => {
    return status ? LUCKY_NUMBER_STATUS_MAP[status] : '';
};

export const KEYS = Object.freeze({
    ADMIN_INFO: 'YING_ADMIN_INFO',
    ACCESS_TOKEN: 'YING_ADMIN_ACCESS_TOKEN',
    REFRESH_TOKEN: 'YING_ADMIN_REFRESH_TOKEN',
});

export const ALLOWED_RESOURCE_TYPES = Object.freeze({
    'image/jpg': 'image',
    'image/jpeg': 'image',
    'image/png': 'image',
    'image/gif': 'image',
    'image/webp': 'image',
    'image/svg+xml': 'image',
    'video/mp4': 'video',
    'video/webm': 'video',
    'video/avi': 'video',
    'video/mov': 'video',
    'video/wmv': 'video',
    'video/flv': 'video',
    'video/mkv': 'video',
    'audio/mp3': 'audio',
    'audio/wav': 'audio',
    'audio/ogg': 'audio',
    'audio/aac': 'audio',
    'audio/m4a': 'audio',
    'audio/flac': 'audio',
    'audio/wma': 'audio',
});
