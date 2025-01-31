import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type {
    ActivityInfo,
    DrawOptionRequest,
    DrawOptionResponse,
    OptionDraw,
} from '@/types/optionDraw';

export const useOptionDraw = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getActivityInfo = useCallback(async (activityKey?: string) => {
        setError(null);
        if (!activityKey) {
            setError('活动key不能为空');
            throw new Error('活动key不能为空');
        }
        setLoading(true);

        try {
            const response = await axiosInstance.get<ActivityInfo>(
                `/option-draw/info/${activityKey}`,
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
            const response = await axiosInstance.get<OptionDraw[]>(
                `/option-draw/query/${activityKey}?page=1&page_size=10000`,
            );
            return response.data;
        } catch (err) {
            setError('获取参与记录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const drawOption = useCallback(async (params: DrawOptionRequest) => {
        setError(null);
        setLoading(true);

        try {
            const response = await axiosInstance.post<DrawOptionResponse>(
                '/option-draw/draw',
                params,
            );
            return response.data;
        } catch (err) {
            setError('抽取选项失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllParticipations = useCallback(async (activityKey?: string) => {
        setError(null);
        if (!activityKey) {
            setError('活动key不能为空');
            throw new Error('活动key不能为空');
        }
        setLoading(true);

        try {
            const response = await axiosInstance.get<OptionDraw[]>(
                `/option-draw/query/${activityKey}`,
                {
                    params: {
                        page: 1,
                        page_size: 999999,
                    },
                },
            );
            return response.data;
        } catch (err) {
            setError('获取所有参与记录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getActivityInfo,
        queryParticipations,
        drawOption,
        getAllParticipations,
    };
};
