import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type { Pagination } from '@/types';
import type {
    ActivityInfo,
    CancelParticipationLuckyNumberRequest,
    CancelParticipationLuckyNumberResponse,
    CreateLuckyNumberRequest,
    CreateLuckyNumberResponse,
    DeleteLuckyNumberResponse,
    LuckyNumber,
    QueryLuckyNumberListResponse,
} from '@/types/luckyNumber';

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
                        '/lucky-number/create',
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
                        `/lucky-number/cancel-participation`,
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

    const queryActivity = useCallback(
        async (key: string, pageNum = 1, pageSize = 10) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get<
                    {},
                    {
                        data: LuckyNumber[];
                        pagination: Pagination;
                    }
                >(
                    `/lucky-number/query/${key}?page_num=${pageNum}&page_size=${pageSize}`,
                );

                const { data, pagination } = response ?? {};
                return {
                    list: data,
                    pagination,
                };
            } catch (err) {
                setError('查询活动失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const deleteActivity = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response =
                await axiosInstance.delete<DeleteLuckyNumberResponse>(
                    `/lucky-number/delete/${key}`,
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
                    `/lucky-number/list?page_num=${pageNum}&page_size=${pageSize}`,
                );
                const { data, pagination } = response ?? {};
                return {
                    list: data,
                    pagination,
                };
            } catch (err) {
                console.error(err);
                setError('获取活动列表失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const updateActivityStatus = useCallback(
        async (key: string, status: string) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.put('/lucky-number/update-status', {
                    key,
                    status,
                });
            } catch (err) {
                setError('更新活动状态失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getActivityInfo = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<ActivityInfo>(
                `/lucky-number/info/${key}`,
            );
            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('获取活动详情失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllParticipations = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<
                {},
                {
                    data: LuckyNumber[];
                    pagination: Pagination;
                }
            >(`/lucky-number/query/${key}?page_num=1&page_size=999999`);

            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('获取所有参与记录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createActivity,
        queryActivity,
        deleteActivity,
        cancelParticipation,
        getActivityList,
        updateActivityStatus,
        getActivityInfo,
        getAllParticipations,
        loading,
        error,
    };
};
