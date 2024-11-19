import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { localStorage } from '../services/storage';

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const navigate = useNavigate();
    const { refreshAccessToken } = useAuth();

    useEffect(() => {
        const accessToken = localStorage.get('accessToken');
        if (accessToken) {
            return;
        }

        const refreshToken = localStorage.get('refreshToken');
        if (!refreshToken) {
            navigate('/login');
            return;
        }

        const refreshTokenIfNeeded = async () => {
            try {
                await refreshAccessToken();
            } catch (error) {
                navigate('/login');
            }
        };

        refreshTokenIfNeeded();
    }, [navigate, refreshAccessToken]);

    return <>{children}</>;
};
