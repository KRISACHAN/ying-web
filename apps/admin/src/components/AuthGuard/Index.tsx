import { useAuth } from '@/hooks/useAuth';
import { localCache } from '@/services/storage';
import { ReactNode, useEffect } from 'react';

import { KEYS } from '@/utils/constants';

interface AuthGuardProps {
    children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const { handler } = useAuth();

    useEffect(() => {
        const accessToken = localCache.get(KEYS.ACCESS_TOKEN);
        if (accessToken) {
            handler.getAdminInfo();
            return;
        }

        const refreshToken = localCache.get(KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
            handler.redirectToLogin();
            return;
        }

        handler.refreshTokenIfNeeded();
    }, []);

    return <>{children}</>;
};

export default AuthGuard;
