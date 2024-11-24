import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';
import { localCache } from '@/services/storage';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const navigate = useNavigate();
    const { refreshAccessToken } = useAuth();

    useEffect(() => {
        const accessToken = localCache.get('accessToken');
        if (accessToken) {
            return;
        }

        const refreshToken = localCache.get('refreshToken');
        if (!refreshToken) {
            navigate('/login');
            return;
        }

        const refreshTokenIfNeeded = async () => {
            try {
                await refreshAccessToken();
            } catch {
                navigate('/login');
            }
        };

        refreshTokenIfNeeded();
    }, [navigate, refreshAccessToken]);

    return <>{children}</>;
};

export default AuthGuard;
