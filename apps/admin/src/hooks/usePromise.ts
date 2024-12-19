import axiosInstance from '@/services/axios';
import type { Pagination } from '@/types';
import type { PromiseCategory, PromiseItem } from '@/types/promise';
import { isUndefined } from 'lodash';
import { useCallback, useState } from 'react';

export const usePromise = () => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<PromiseCategory[]>([]);
    const [categoryPagination, setCategoryPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const createCategory = useCallback(
        async (
            data: {
                name?: string;
                description?: string;
                is_published?: boolean;
            } = {},
        ) => {
            setLoading(true);
            try {
                const response = await axiosInstance.post<PromiseCategory>(
                    '/promise/category',
                    data,
                );
                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const updateCategory = useCallback(
        async (id: number, data: Partial<PromiseCategory>) => {
            setLoading(true);
            try {
                const response = await axiosInstance.put<PromiseCategory>(
                    `/promise/category/${id}`,
                    data,
                );
                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getCategoryList = useCallback(
        async ({
            page_num = 1,
            page_size = 10,
            name,
            description,
            is_published,
            order = 'DESC',
        }: {
            page_num?: number;
            page_size?: number;
            name?: string;
            description?: string;
            is_published?: boolean;
            order?: 'DESC' | 'ASC';
        }) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page_num: String(page_num),
                    page_size: String(page_size),
                    order,
                });

                if (name) {
                    params.append('name', name);
                }
                if (description) {
                    params.append('description', description);
                }
                if (!isUndefined(is_published)) {
                    params.append('is_published', String(is_published));
                }

                const response = await axiosInstance.get<
                    {},
                    {
                        data: PromiseCategory[];
                        pagination: Pagination;
                    }
                >(`/promise/category/list?${params.toString()}`);

                const { data, pagination } = response ?? {};
                setCategories(data);
                if (pagination) {
                    setCategoryPagination({
                        current: page_num,
                        pageSize: page_size,
                        total: pagination.total,
                    });
                }
                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getCategory = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<PromiseCategory>(
                `/promise/category/detail/${id}`,
            );
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const createPromise = useCallback(
        async (
            data: {
                category_id?: number;
                chapter?: string;
                text?: string;
                description?: string;
                resource_type?: 'image' | 'video' | 'audio';
                resource_url?: string;
                is_published?: boolean;
            } = {},
        ) => {
            setLoading(true);
            try {
                const response = await axiosInstance.post<PromiseItem>(
                    '/promise/create',
                    data,
                );
                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getPromiseList = useCallback(
        async ({
            page_num = 1,
            page_size = 10,
            category_id,
            category_name,
            chapter,
            text,
            description,
            is_published,
            order = 'DESC',
        }: {
            page_num?: number;
            page_size?: number;
            category_id?: number;
            category_name?: string;
            chapter?: string;
            text?: string;
            description?: string;
            is_published?: boolean;
            order?: 'DESC' | 'ASC';
        }) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page_num: String(page_num),
                    page_size: String(page_size),
                    order,
                });

                if (category_id) {
                    params.append('category_id', String(category_id));
                }
                if (category_name) {
                    params.append('category_name', category_name);
                }
                if (chapter) {
                    params.append('chapter', chapter);
                }
                if (text) {
                    params.append('text', text);
                }
                if (description) {
                    params.append('description', description);
                }
                if (!isUndefined(is_published)) {
                    params.append('is_published', String(is_published));
                }

                const response = await axiosInstance.get<
                    {},
                    {
                        data: PromiseItem[];
                        pagination: Pagination;
                    }
                >(`/promise/list?${params.toString()}`);

                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const updatePromise = useCallback(
        async (id: number, data: Partial<PromiseItem>) => {
            setLoading(true);
            try {
                const response = await axiosInstance.put<PromiseItem>(
                    `/promise/update/${id}`,
                    data,
                );
                return response;
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    const getPromiseDetail = useCallback(async (id: string | number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get<PromiseItem>(
                `/promise/detail/${id}`,
            );
            return response;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string | number) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/promise/category/${id}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePromise = useCallback(async (id: number) => {
        setLoading(true);
        try {
            await axiosInstance.delete(`/promise/${id}`);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createCategory,
        updateCategory,
        getCategoryList,
        getCategory,
        createPromise,
        getPromiseList,
        updatePromise,
        getPromiseDetail,
        deleteCategory,
        deletePromise,
        categories,
        categoryPagination,
        loading,
    };
};
