import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Button, Typography } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import { useInterval } from 'usehooks-ts';

import DrawTable from '@/components/DrawTable';
import HeaderInterface from '@/components/Header/Index';
import LoadingState from '@/components/LoadingState/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, LuckyNumber } from '@/types/luckyNumber';

const ErrorInterface: React.FC<{ message?: string }> = ({
    message = '活动不存在或已结束',
}) => {
    return <NotFoundPage name={message} description="回到首页看看其它功能？" />;
};

const LuckyNumberListPage: React.FC = () => {
    const { activityKey } = useParams();
    const { queryActivityInfo, queryParticipations } = useLuckyNumber();
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [participations, setParticipations] = useState<LuckyNumber[] | null>(
        null,
    );
    const [error, setError] = useState<Error | null>(null);
    const [showOverlay, setShowOverlay] = useState<boolean>(true);
    const headerContext = useHeader();

    const fetchActivityInfo = async () => {
        try {
            const info = await queryActivityInfo(activityKey);
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

    const showTable = !!participations?.length;
    const qrCodeUrl = `${window.location.origin}/lucky-number/${activityKey}/activity`;

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
                <Box
                    className={
                        showTable
                            ? 'event-stage event-stage--lucky'
                            : 'event-stage'
                    }
                    sx={{ mt: 3 }}
                >
                    <Box
                        className="event-paper"
                        sx={{
                            width: '100%',
                            maxWidth: 354,
                            mx: 'auto',
                            p: { xs: 2, sm: 3 },
                            textAlign: 'center',
                        }}
                    >
                        {showOverlay && !showTable ? (
                            <>
                                <Typography
                                    variant="h2"
                                    sx={{ fontSize: '1.6rem', mb: 1 }}
                                >
                                    准备开始活动？
                                </Typography>
                                <Typography
                                    color="text.secondary"
                                    sx={{ mb: 2 }}
                                >
                                    确认后显示参与二维码。
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setShowOverlay(false)}
                                >
                                    确认开始
                                </Button>
                            </>
                        ) : (
                            <>
                                <Typography
                                    variant="h2"
                                    sx={{ fontSize: '1.4rem', mb: 1.5 }}
                                >
                                    扫描二维码参与活动
                                </Typography>
                                <QRCodeSVG
                                    title="活动参与二维码"
                                    value={qrCodeUrl}
                                    size={320}
                                    marginSize={4}
                                    level="M"
                                    style={{
                                        display: 'block',
                                        width: '100%',
                                        height: 'auto',
                                    }}
                                />
                                <Button href={qrCodeUrl} sx={{ mt: 1 }}>
                                    打开抽取页
                                </Button>
                            </>
                        )}
                    </Box>
                    {showTable && (
                        <DrawTable
                            resultLabel="号码"
                            rows={participations.map(record => ({
                                id: record.id,
                                username: record.username,
                                result: record.drawn_number,
                                createdAt: record.created_at,
                            }))}
                        />
                    )}
                </Box>
            )}
        </Box>
    );
};

export default LuckyNumberListPage;
