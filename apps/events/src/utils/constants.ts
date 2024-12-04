export const LUCKY_NUMBER_STATUS = Object.freeze({
    NOT_STARTED: 'not_started',
    ONGOING: 'ongoing',
    ENDED: 'ended',
});

export type LuckyNumberStatus =
    (typeof LUCKY_NUMBER_STATUS)[keyof typeof LUCKY_NUMBER_STATUS];

export const LUCKY_NUMBER_STATUS_MAP = {
    [LUCKY_NUMBER_STATUS.NOT_STARTED]: '未开始',
    [LUCKY_NUMBER_STATUS.ONGOING]: '进行中',
    [LUCKY_NUMBER_STATUS.ENDED]: '已结束',
};

export const getLuckyNumberStatusLabel = (status: LuckyNumberStatus) => {
    return LUCKY_NUMBER_STATUS_MAP[status];
};
