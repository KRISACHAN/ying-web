import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { localCache } from './storage';

interface CustomAxiosResponse<T = any> extends AxiosResponse<T> {
    headers: {
        'x-pagination'?: string;
    };
}

const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1`,
    timeout: 10000,
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(undefined);
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    config => {
        const token = localCache.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
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
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
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
                    throw new Error('登录已过期，请重新登录');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1/admin/refresh-token`,
                    {
                        refreshToken,
                    },
                );

                const { accessToken } = response.data;
                localCache.set('accessToken', accessToken);

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

        return Promise.reject(error);
    },
);

export default axiosInstance;
