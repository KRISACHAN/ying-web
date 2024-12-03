import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type {
    DrawLuckyNumberRequest,
    DrawLuckyNumberResponse,
    QueryLuckyNumberResponse,
} from '@/types/luckyNumber';

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
            return response.data;
        } catch (err) {
            setError('获取活动信息失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const drawLuckyNumber = useCallback(
        async (params: DrawLuckyNumberRequest) => {
            setError(null);
            setLoading(true);

            try {
                const response =
                    await axiosInstance.post<DrawLuckyNumberResponse>(
                        '/lucky-number/draw',
                        params,
                    );
                return response.data;
            } catch (err) {
                setError('抽取号码失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        loading,
        error,
        queryActivityInfo,
        drawLuckyNumber,
    };
};
