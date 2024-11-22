import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type { QueryLuckyNumberResponse } from '@/types/lucky-number';

export const useLuckyNumber = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryActivityInfo = useCallback(async (activityKey?: string) => {
        setError(null);
        if (!activityKey) {
            setError('活动key不能为空');
            throw new Error('活动key不能为空');
        }
        setLoading(true);

        try {
            const response = await axiosInstance.get<QueryLuckyNumberResponse>(
                `/lucky-number/query/${activityKey}`,
            );
            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('获取活动信息失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        queryActivityInfo,
    };
};
