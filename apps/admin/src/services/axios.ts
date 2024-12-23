import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { eq } from 'lodash';

import { KEYS } from '@/utils/constants';

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

/**
 * Processes the queue of failed requests during token refresh.
 *
 * This function is used to handle requests that failed due to an expired token.
 * When a token refresh is initiated, any requests that fail with a 401 status
 * are added to the `failedQueue`. Once the token is successfully refreshed,
 * `processQueue` is called to retry these requests.
 *
 * @param err - An error object if the token refresh failed, otherwise null.
 *
 * Execution Mechanism:
 * - If `err` is provided, it indicates that the token refresh failed.
 *   In this case, each promise in the `failedQueue` is rejected with the error.
 * - If `err` is null, it indicates that the token refresh was successful.
 *   Each promise in the `failedQueue` is resolved, allowing the original
 *   requests to be retried with the new token.
 * - After processing, the `failedQueue` is cleared to prepare for any future
 *   token refresh attempts.
 */
const processQueue = (err: any = null) => {
    failedQueue.forEach(prom => {
        if (err) {
            prom.reject(err); // Reject the promise with the error
        } else {
            prom.resolve(undefined); // Resolve the promise with undefined
        }
    });
    failedQueue = []; // Clear the failed queue after processing
};

axiosInstance.interceptors.request.use(
    config => {
        const accessToken = localCache.get(KEYS.ACCESS_TOKEN);
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
        if (
            eq(err.response?.status, 401) &&
            !originalRequest._retry &&
            !eq(originalRequest.url, '/login')
        ) {
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
                const refreshToken = localCache.get(KEYS.REFRESH_TOKEN);
                if (!refreshToken) {
                    message.error('登录已过期，请重新登录');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_REQUEST_BASE_URL}/api/v1/admin/refresh-token`,
                    {
                        refresh_token: refreshToken,
                    },
                );

                const { access_token } = response.data;
                localCache.set(KEYS.ACCESS_TOKEN, access_token);

                processQueue();
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                localCache.remove(KEYS.ACCESS_TOKEN);
                localCache.remove(KEYS.REFRESH_TOKEN);
                localCache.remove(KEYS.ADMIN_INFO);
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
