import { useState, useCallback } from 'react';
import type {
    CreateLuckyNumberRequest,
    CreateLuckyNumberResponse,
    QueryLuckyNumberResponse,
    DeleteLuckyNumberResponse,
    QueryLuckyNumberListResponse,
    CancelParticipationLuckyNumberRequest,
    CancelParticipationLuckyNumberResponse,
    Pagination,
} from '@/types/lucky-number';
import axiosInstance from '@/services/axios';

export const useLuckyNumber = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createActivity = useCallback(
        async (params: CreateLuckyNumberRequest) => {
            setLoading(true);
            setError(null);
            try {
                const response =
                    await axiosInstance.post<CreateLuckyNumberResponse>(
                        '/admin/lucky-number/create',
                        params,
                    );
                const { data } = response ?? {};
                return data;
            } catch (err) {
                setError('创建活动失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const cancelParticipation = useCallback(
        async (params: CancelParticipationLuckyNumberRequest) => {
            setLoading(true);
            setError(null);

            try {
                const response =
                    await axiosInstance.put<CancelParticipationLuckyNumberResponse>(
                        `/admin/lucky-number/cancel-participation`,
                        params,
                    );
                const { data } = response ?? {};
                return data;
            } catch (err) {
                setError('更新活动失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const queryActivity = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<QueryLuckyNumberResponse>(
                `/admin/lucky-number/query/${key}`,
            );
            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('查询活动失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteActivity = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response =
                await axiosInstance.delete<DeleteLuckyNumberResponse>(
                    `/admin/lucky-number/delete/${key}`,
                );
            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('删除活动失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getActivityList = useCallback(
        async (pageNum: number, pageSize: number) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get<
                    {},
                    {
                        data: QueryLuckyNumberListResponse;
                        pagination: Pagination;
                    }
                >(
                    `/admin/lucky-number/list?page_num=${pageNum}&page_size=${pageSize}`,
                );
                const { data, pagination } = response ?? {};
                return {
                    list: data,
                    pagination,
                };
            } catch (error) {
                console.error(error);
                setError('获取活动列表失败');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    return {
        createActivity,
        queryActivity,
        deleteActivity,
        cancelParticipation,
        getActivityList,
        loading,
        error,
    };
};
