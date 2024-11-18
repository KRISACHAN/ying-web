import { useState, useCallback } from 'react';
import type {
    LoginParams,
    LoginResponse,
    RefreshTokenResponse,
} from '../types/auth';
import axiosInstance from '../services/axios';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (params: LoginParams) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post<LoginResponse>(
                '/admin/login',
                params,
            );
            const { data } = response ?? {};
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('refreshToken', data.refresh_token);
            localStorage.setItem('adminInfo', JSON.stringify(data.admin_info));
            return response;
        } catch (err) {
            setError('登录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('无效的刷新令牌');
        }

        try {
            const response = await axiosInstance.post<RefreshTokenResponse>(
                '/admin/refresh-token',
                { refresh_token: refreshToken },
            );
            const { data } = response ?? {};
            localStorage.setItem('accessToken', data.accessToken);
            return response;
        } catch (err) {
            throw new Error('刷新令牌失败');
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('adminInfo');
    }, []);

    return {
        login,
        logout,
        loading,
        error,
        refreshAccessToken,
    };
};
