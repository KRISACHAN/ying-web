import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';

import { localCache } from './storage';

interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
    headers: {
        'x-pagination'?: string;
    };
}

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1/admin`,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (err: any = null) => {
    failedQueue.forEach(prom => {
        if (err) {
            prom.reject(err);
        } else {
            prom.resolve(undefined);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localCache.get('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    },
);

axiosInstance.interceptors.response.use(
    (response: CustomAxiosResponse) => {
        const pagination = response.headers['x-pagination'];
        return {
            data: response.data,
            pagination: JSON.parse(pagination ?? '{}'),
        };
    },
    async err => {
        const originalRequest = err.config;

        if (err.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localCache.get('refreshToken');
                if (!refreshToken) {
                    message.error('登录已过期，请重新登录');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1/admin/refresh-token`,
                    {
                        refreshToken,
                    },
                );

                const { access_token } = response.data;
                localCache.set('accessToken', access_token);

                processQueue();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                localCache.remove('accessToken');
                localCache.remove('refreshToken');
                localCache.remove('adminInfo');
                message.error('登录已过期，请重新登录');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        message.error(err.response?.data?.message ?? '请求失败');

        return Promise.reject(err);
    },
);

export default axiosInstance;
