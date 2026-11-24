import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box } from '@mui/material';
import { useInterval } from 'usehooks-ts';

import DrawTable from '@/components/DrawTable';
import HeaderInterface from '@/components/Header/Index';
import LoadingState from '@/components/LoadingState/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useOptionDraw } from '@/hooks/useOptionDraw';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, OptionDraw } from '@/types/optionDraw';

const ErrorInterface: React.FC<{ message?: string }> = ({
    message = '活动不存在或已结束',
}) => {
    return <NotFoundPage name={message} description="回到首页看看其它功能？" />;
};

const OptionDrawListPage: React.FC = () => {
    const { activityKey } = useParams();
    const { getActivityInfo, queryParticipations } = useOptionDraw();
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [participations, setParticipations] = useState<OptionDraw[] | null>(
        null,
    );
    const [error, setError] = useState<Error | null>(null);
    const headerContext = useHeader();

    const fetchActivityInfo = async () => {
        try {
            const info = await getActivityInfo(activityKey);
            setActivityInfo(info);
            headerContext.setHeaderInfo({
                title: info.name,
                description: info.description,
                keywords: info.activity_key,
            });
        } catch (err) {
            setError(err as Error);
        }
    };

    const fetchParticipations = async () => {
        if (!activityKey) return;
        try {
            const records = await queryParticipations(activityKey);
            setParticipations(records);
        } catch (err) {
            setError(err as Error);
        }
    };

    useEffect(() => {
        if (!activityKey || !!error) return;
        fetchActivityInfo();
        fetchParticipations();
    }, [activityKey]);

    useInterval(
        () => {
            fetchParticipations();
        },
        !activityKey || !!error ? null : 2000,
    );

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');
    const is400Error = errorMessage?.includes('400');
    const isNotStartedError = errorMessage?.includes('未开始');
    const isEndedError = errorMessage?.includes('已结束');

    if (is404Error) {
        return <ErrorInterface />;
    }

    if (is400Error) {
        return (
            <NotFoundPage
                name="活动未开始或已结束"
                description="回到首页看其它功能？"
            />
        );
    }

    if (isNotStartedError) {
        return <ErrorInterface message="活动未开始" />;
    }

    if (isEndedError) {
        return <ErrorInterface message="活动已结束" />;
    }

    return (
        <Box sx={{ p: { xs: 2, sm: 4 }, maxWidth: 1560, mx: 'auto' }}>
            <HeaderInterface
                name={activityInfo?.name}
                description={activityInfo?.description}
                illustration="wide"
            />
            {error ? (
                <Alert severity="error" sx={{ mt: 3 }}>
                    获取活动数据失败，请稍后再试
                </Alert>
            ) : !activityInfo || participations === null ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <LoadingState message="正在获取活动信息…" />
                </Box>
            ) : (
                <Box sx={{ maxWidth: 1120, mx: 'auto', mt: 3 }}>
                    <DrawTable
                        resultLabel="选项"
                        rows={participations.map(record => ({
                            id: record.id,
                            username: record.username,
                            result: record.drawn_option,
                            createdAt: record.created_at,
                        }))}
                    />
                </Box>
            )}
        </Box>
    );
};

export default OptionDrawListPage;
