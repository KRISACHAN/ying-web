import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import type { Pagination } from '@/types';
import type {
    ActivityInfo,
    CancelParticipationOptionDrawRequest,
    CancelParticipationOptionDrawResponse,
    CreateOptionDrawRequest,
    CreateOptionDrawResponse,
    DeleteOptionDrawResponse,
    OptionDraw,
    OptionDrawActivity,
} from '@/types/optionDraw';

export const useOptionDraw = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createActivity = useCallback(
        async (params: CreateOptionDrawRequest) => {
            setLoading(true);
            setError(null);
            try {
                const response =
                    await axiosInstance.post<CreateOptionDrawResponse>(
                        '/option-draw/create',
                        params,
                    );
                const { data } = response ?? {};
                return data;
            } catch (err) {
                setError('创建新活动失败');
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getActivityList = useCallback(async (pageNum = 1, pageSize = 10) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<
                {},
                {
                    data: OptionDrawActivity[];
                    pagination: Pagination;
                }
            >('/option-draw/list', {
                params: {
                    page_num: pageNum,
                    page_size: pageSize,
                },
            });
            const { data, pagination } = response ?? {};
            return {
                list: data,
                pagination,
            };
        } catch (err) {
            setError('获取活动列表失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getActivityDetail = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<ActivityInfo>(
                `/option-draw/info/${key}`,
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

    const queryActivity = useCallback(
        async (key: string, pageNum = 1, pageSize = 10) => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get<
                    {},
                    {
                        data: OptionDraw[];
                        pagination: Pagination;
                    }
                >(`/option-draw/query/${key}`, {
                    params: {
                        page_num: pageNum,
                        page_size: pageSize,
                    },
                });
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

    const getAllParticipations = useCallback(async (key: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get<
                {},
                {
                    data: OptionDraw[];
                }
            >(`/option-draw/query/${key}`, {
                params: {
                    page_num: 1,
                    page_size: 999999,
                },
            });
            const { data } = response ?? {};
            return data;
        } catch (err) {
            setError('获取所有参与记录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateActivityStatus = useCallback(
        async (key: string, status: string) => {
            setLoading(true);
            setError(null);
            try {
                await axiosInstance.put('/option-draw/update-status', {
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

    const cancelParticipation = useCallback(
        async (params: CancelParticipationOptionDrawRequest) => {
            setLoading(true);
            setError(null);
            try {
                const response =
                    await axiosInstance.put<CancelParticipationOptionDrawResponse>(
                        '/option-draw/cancel-participation',
                        params,
                    );
                const { data } = response ?? {};
                return data;
            } catch (err) {
                setError('取消参与失败');
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
                await axiosInstance.delete<DeleteOptionDrawResponse>(
                    `/option-draw/delete/${key}`,
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

    return {
        loading,
        error,
        createActivity,
        getActivityList,
        getActivityDetail,
        queryActivity,
        getAllParticipations,
        updateActivityStatus,
        cancelParticipation,
        deleteActivity,
    };
};
