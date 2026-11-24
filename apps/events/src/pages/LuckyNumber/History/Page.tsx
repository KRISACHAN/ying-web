import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ArrowBack, DeleteOutline } from '@mui/icons-material';
import { Alert, Box, Button, Typography } from '@mui/material';
import { useLocalStorage } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

type LuckyNumberResult = {
    number: number;
    name: string;
    timestamp: number;
};

const LuckyNumberHistoryPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const navigate = useNavigate();
    const { queryActivityInfo } = useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const headerContext = useHeader();

    const localResultsKey = `YING_EVENTS_LUCKY_NUMBER_RESULTS_${activityKey}`;
    const [luckyNumberResults, setLuckyNumberResults] = useLocalStorage<
        LuckyNumberResult[]
    >(localResultsKey, []);

    const fetchActivityInfo = async () => {
        try {
            const data = await queryActivityInfo(activityKey);
            setActivityInfo(data);
            headerContext.setHeaderInfo({
                title: `${data.name} - 抽取记录`,
                description: `查看 ${data.name} 的本地抽取历史记录`,
                keywords: `${data.activity_key}, 历史记录`,
            });
        } catch (err) {
            setError(err as Error);
        }
    };

    useEffect(() => {
        if (!activityKey) {
            return;
        }
        fetchActivityInfo();
    }, [activityKey]);

    const handleClearHistory = () => {
        if (window.confirm('确定要清空所有历史记录吗？此操作无法撤销。')) {
            setLuckyNumberResults([]);
        }
    };

    const handleGoBack = () => {
        navigate(`/lucky-number/${activityKey}/activity`);
    };

    const formatDateTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');

    if (is404Error) {
        return (
            <NotFoundPage
                name="活动不存在"
                description="回到首页看看其它功能？"
            />
        );
    }

    return (
        <Box sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, sm: 4 } }}>
            <HeaderInterface
                name={
                    activityInfo
                        ? `${activityInfo.name} · 抽取历史`
                        : '抽取历史'
                }
                description="此浏览器保存的抽取记录"
            />
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                    my: 2,
                }}
            >
                <Button startIcon={<ArrowBack />} onClick={handleGoBack}>
                    返回抽取
                </Button>
                {luckyNumberResults.length > 0 && (
                    <Button
                        color="error"
                        startIcon={<DeleteOutline />}
                        onClick={handleClearHistory}
                    >
                        清空记录
                    </Button>
                )}
            </Box>
            {error && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    获取活动信息失败，仍可查看本地记录。
                </Alert>
            )}
            <Box className="event-paper" sx={{ overflow: 'hidden' }}>
                {luckyNumberResults.length === 0 ? (
                    <Typography
                        color="text.secondary"
                        sx={{ p: 3, textAlign: 'center' }}
                    >
                        暂无抽取记录
                    </Typography>
                ) : (
                    <Box
                        component="ol"
                        aria-label="抽取记录"
                        sx={{ listStyle: 'none', m: 0, p: 0 }}
                    >
                        {luckyNumberResults.map((result, index) => (
                            <Box
                                component="li"
                                key={`${result.timestamp}-${index}`}
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: {
                                        xs: 'minmax(48px, auto) 1fr',
                                        sm: 'minmax(72px, auto) 1fr auto',
                                    },
                                    alignItems: 'baseline',
                                    columnGap: 2,
                                    rowGap: 0.5,
                                    px: { xs: 2, sm: 3 },
                                    py: 1.5,
                                    '& + &': {
                                        borderTop:
                                            '1px solid var(--events-line)',
                                    },
                                }}
                            >
                                <Typography
                                    component="strong"
                                    sx={{
                                        fontSize: '1.35rem',
                                        fontWeight: 700,
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                    aria-label={`号码 ${result.number}`}
                                >
                                    {result.number}
                                </Typography>
                                <Typography sx={{ overflowWrap: 'anywhere' }}>
                                    {result.name}
                                </Typography>
                                <Typography
                                    component="time"
                                    sx={{
                                        gridColumn: { xs: 2, sm: 'auto' },
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                    color="text.secondary"
                                    variant="body2"
                                >
                                    {formatDateTime(result.timestamp)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LuckyNumberHistoryPage;
