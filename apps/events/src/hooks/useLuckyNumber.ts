import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type {
    ActivityInfo,
    DrawLuckyNumberRequest,
    DrawLuckyNumberResponse,
    LuckyNumber,
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
            const response = await axiosInstance.get<ActivityInfo>(
                `/lucky-number/info/${activityKey}`,
            );
            return response.data;
        } catch (err) {
            setError('获取活动信息失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const queryParticipations = useCallback(async (activityKey?: string) => {
        setError(null);
        if (!activityKey) {
            setError('活动key不能为空');
            throw new Error('活动key不能为空');
        }
        setLoading(true);

        try {
            const response = await axiosInstance.get<LuckyNumber[]>(
                `/lucky-number/query/${activityKey}?page=1&page_size=10000`,
            );
            return response.data;
        } catch (err) {
            setError('获取参与记录失败');
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
        queryParticipations,
        drawLuckyNumber,
    };
};
