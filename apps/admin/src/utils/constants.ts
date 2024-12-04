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

export const getLuckyNumberStatusLabel = (status: LuckyNumberStatus) => {
    return LUCKY_NUMBER_STATUS_MAP[status];
};

export const KEYS = Object.freeze({
    ADMIN_INFO: 'YING_ADMIN_INFO',
    ACCESS_TOKEN: 'YING_ADMIN_ACCESS_TOKEN',
    REFRESH_TOKEN: 'YING_ADMIN_REFRESH_TOKEN',
});
