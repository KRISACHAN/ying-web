import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const navigate = useNavigate();
    const { refreshAccessToken } = useAuth();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            return;
        }

        const refreshToken = localStorage.getItem('refreshToken');
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
