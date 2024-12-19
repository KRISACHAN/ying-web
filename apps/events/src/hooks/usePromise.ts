import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type { Promise, PromiseCategory } from '@/types/promise';

export const usePromise = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getRandomPromise = useCallback(async (category_id?: number) => {
        setLoading(true);
        setError(null);
        try {
            const url = category_id
                ? `/promise/random/${category_id}`
                : '/promise/random';
            const { data } = await axiosInstance.get<Promise>(url);
            return data;
        } catch (err) {
            setError('获取经文失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCategoryList = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } =
                await axiosInstance.get<PromiseCategory[]>('/promise-category');
            return data;
        } catch (err) {
            setError('获取分类列表失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getRandomPromise,
        getCategoryList,
    };
};
