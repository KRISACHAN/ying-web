import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLocalStorage } from 'usehooks-ts';

import axiosInstance from '@/services/axios';
import { localCache } from '@/services/storage';
import type {
    AdminInfo,
    LoginParams,
    LoginResponse,
    RefreshTokenResponse,
} from '@/types/auth';
import { KEYS } from '@/utils/constants';

export const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [adminInfo, setAdminInfo] = useLocalStorage<AdminInfo | null>(
        KEYS.ADMIN_INFO,
        null,
    );

    const login = useCallback(async (params: LoginParams) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post<LoginResponse>(
                '/login',
                params,
            );
            const { data } = response ?? {};
            setAdminInfo(data.admin_info?.admin ?? null);
            localCache.set(KEYS.ACCESS_TOKEN, data.access_token);
            localCache.set(KEYS.REFRESH_TOKEN, data.refresh_token);
            return response;
        } catch (err: any) {
            setError(err.response?.data?.message ?? '登录失败');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshAccessToken = useCallback(async () => {
        const refreshToken = localCache.get(KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            throw new Error('无效的刷新令牌');
        }

        try {
            const response = await axiosInstance.post<RefreshTokenResponse>(
                '/refresh-token',
                { refresh_token: refreshToken },
            );
            const { data } = response ?? {};
            localCache.set(KEYS.ACCESS_TOKEN, data.access_token);
            return response;
        } catch {
            throw new Error('刷新令牌失败，请重新登录');
        }
    }, []);

    const getAdminInfo = useCallback(async () => {
        const accessToken = localCache.get(KEYS.ACCESS_TOKEN);
        const response = await axiosInstance.get<AdminInfo>('/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const { data } = response ?? {};
        setAdminInfo(data);
        return response;
    }, []);

    const logout = useCallback(() => {
        localCache.remove(KEYS.ACCESS_TOKEN);
        localCache.remove(KEYS.REFRESH_TOKEN);
        setAdminInfo(null);
        navigate('/login');
    }, []);

    const redirectToLogin = useCallback(() => {
        navigate('/login');
    }, []);

    const refreshTokenIfNeeded = useCallback(async () => {
        try {
            await refreshAccessToken();
        } catch {
            redirectToLogin();
        }
    }, []);

    return {
        handler: {
            login,
            logout,
            refreshAccessToken,
            getAdminInfo,
            redirectToLogin,
            refreshTokenIfNeeded,
        },
        state: {
            adminInfo,
            loading,
            error,
        },
    };
};
