import { useCallback, useState } from 'react';

import axiosInstance from '@/services/axios';
import { localCache } from '@/services/storage';
import type {
    LoginParams,
    LoginResponse,
    RefreshTokenResponse,
} from '@/types/auth';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (params: LoginParams) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post<LoginResponse>(
                '/login',
                params,
            );
            const { data } = response ?? {};
            localCache.set('accessToken', data.access_token);
            localCache.set('refreshToken', data.refresh_token);
            localCache.set('adminInfo', JSON.stringify(data.admin_info));
            return response;
        } catch (err) {
            setError('登录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localCache.get('refreshToken');
        if (!refreshToken) {
            throw new Error('无效的刷新令牌');
        }

        try {
            const response = await axiosInstance.post<RefreshTokenResponse>(
                '/refresh-token',
                { refresh_token: refreshToken },
            );
            const { data } = response ?? {};
            localCache.set('accessToken', data.access_token);
            return response;
        } catch {
            throw new Error('刷新令牌失败，请重新登录');
        }
    }, []);

    const logout = useCallback(() => {
        localCache.remove('accessToken');
        localCache.remove('refreshToken');
        localCache.remove('adminInfo');
    }, []);

    return {
        login,
        logout,
        loading,
        error,
        refreshAccessToken,
    };
};
