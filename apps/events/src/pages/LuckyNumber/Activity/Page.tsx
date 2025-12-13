import { Box, Snackbar, useTheme } from '@mui/material';
import type { AxiosError } from 'axios';
import { Gift } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import InitialState from '@/components/InitialState/Index';
import LoadingState from '@/components/LoadingState/Index';
import TipBar from '@/components/TipBar/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';
import { getQuery } from '@/utils/query';

import DialogInterface from '@/components/DialogInterface/Index';
import NewYearBackground from '@/components/NewYearBackground';
import ResultInterface from '@/components/ResultInterface/Index';
import NumberAnimation from '../components/NumberAnimation';

import './Page.less';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

type LuckyNumberResult = {
    number: number;
    name: string;
    timestamp: number;
};

const LuckyNumberActivityPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const navigate = useNavigate();
    const { queryActivityInfo, drawLuckyNumber, queryParticipations } =
        useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const headerContext = useHeader();
    const theme = useTheme();

    const localResultsKey = `YING_EVENTS_LUCKY_NUMBER_RESULTS_${activityKey}`;

    const [luckyNumberResults, setLuckyNumberResults] = useLocalStorage<
        LuckyNumberResult[]
    >(localResultsKey, []);

    // Get the latest result for display
    const latestResult =
        luckyNumberResults.length > 0
            ? luckyNumberResults[luckyNumberResults.length - 1]
            : null;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [error, setError] = useState<Error | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [tempResult, setTempResult] = useState<{
        number: number;
        name: string;
    } | null>(null);

    const cleanUserResult = () => {
        const needClean = getQuery('__clean');
        if (!needClean) {
            return;
        }
        setLuckyNumberResults([]);
    };

    const fetchActivityInfo = async () => {
        try {
            const data = await queryActivityInfo(activityKey);
            setActivityInfo(data);
            headerContext.setHeaderInfo({
                title: data.name,
                description: data.description,
                keywords: data.activity_key,
            });
            setShowResult(true);
        } catch (err) {
            setError(err as Error);
        }
    };

    const syncWithServerData = async () => {
        if (!activityKey) return;

        try {
            // 获取服务器端的参与记录
            const serverParticipations = await queryParticipations(activityKey);

            // 如果本地有数据，进行同步
            if (luckyNumberResults.length > 0) {
                // 创建服务器数据的查找映射
                const serverDataMap = new Set(
                    serverParticipations.map(
                        p => `${p.drawn_number}_${p.username}`,
                    ),
                );

                // 过滤本地数据，只保留服务器上存在的记录
                const validLocalResults = luckyNumberResults.filter(
                    localResult => {
                        const key = `${localResult.number}_${localResult.name}`;
                        return serverDataMap.has(key);
                    },
                );

                // 如果过滤后的数据与原数据不同，更新本地存储
                if (validLocalResults.length !== luckyNumberResults.length) {
                    setLuckyNumberResults(validLocalResults);
                    console.log(
                        `已同步本地数据，移除了 ${luckyNumberResults.length - validLocalResults.length} 条无效记录`,
                    );
                }
            }
        } catch (err) {
            console.error('同步服务器数据失败:', err);
            // 同步失败不影响正常功能，只记录错误
        }
    };

    useEffect(() => {
        cleanUserResult();
        if (!activityKey) {
            return;
        }

        const initializeData = async () => {
            await fetchActivityInfo();
            await syncWithServerData();
        };

        initializeData();
    }, [activityKey]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
    };

    const handleViewHistory = () => {
        navigate(`/lucky-number/${activityKey}/history`);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setSnackbarMessage('请输入你的名字');
            setSnackbarOpen(true);
            return;
        }

        setLoading(true);
        try {
            const response = await drawLuckyNumber({
                key: activityKey!,
                username: name.trim(),
            });

            const newResult: LuckyNumberResult = {
                number: response.drawn_number,
                name: name.trim(),
                timestamp: Date.now(),
            };

            setTempResult({
                number: response.drawn_number,
                name: name.trim(),
            });

            handleClose();
            setIsTransitioning(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            setLuckyNumberResults(prev => [...prev, newResult]);
            setIsTransitioning(false);
            setShowResult(true);
            setTempResult(null);
        } catch (error: unknown) {
            setSnackbarMessage(
                (error as AxiosError)?.response?.data?.message ??
                    '抽取失败，请刷新页面后重试',
            );
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');
    const is400Error = errorMessage?.includes('400');

    if (is404Error) {
        return (
            <NotFoundPage
                name="活动不存在"
                description="回到首页看其它功能？"
            />
        );
    }

    if (is400Error) {
        return (
            <NotFoundPage
                name="活动未开始或已结束"
                description="回到首页看其它功能？"
            />
        );
    }

    return (
        <Box
            className="min-h-screen w-full"
            sx={{
                p: { xs: 2, sm: 4 },
            }}
        >
            <NewYearBackground showStars={true} showParticles={true} />
            <Box
                sx={{
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <HeaderInterface
                    description={activityInfo?.description}
                    name={activityInfo?.name}
                />

                <TipBar message="注意：每人只能抽取一次哦" />

                {isTransitioning ? (
                    <LoadingState
                        message={`正在为 ${tempResult?.name} 抽取幸运数字`}
                    />
                ) : latestResult === null ? (
                    <InitialState
                        title="准备好了吗？"
                        subtitle="点击按钮，开启幸运之旅"
                        buttonText="开启幸运之旅"
                        loading={loading}
                        onClick={handleClickOpen}
                        icon={<Gift />}
                    />
                ) : (
                    <ResultInterface
                        show={showResult}
                        name={latestResult.name}
                        subtitle="你的幸运号码是"
                        footer={
                            <>
                                愿这个数字背后所蕴含的祝福，
                                <br />
                                能成为你未来日子的能力！
                                <br />
                                <Box sx={{ mt: 2 }}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            justifyContent: 'center',
                                            flexWrap: 'wrap',
                                        }}
                                    >
                                        <button
                                            onClick={handleClickOpen}
                                            className="bg-background-paper text-primary border-2 border-primary rounded-[25px] px-6 py-3 text-base font-bold cursor-pointer transition-all duration-300 shadow-primary-sm hover:bg-primary hover:text-text-inverse disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            帮他人抽取
                                        </button>
                                        <button
                                            onClick={handleViewHistory}
                                            className="bg-background-paper text-primary border-2 border-primary rounded-[25px] px-6 py-3 text-base font-bold cursor-pointer transition-all duration-300 shadow-primary-sm hover:bg-primary hover:text-text-inverse disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={loading}
                                        >
                                            查看历史
                                        </button>
                                    </Box>
                                </Box>
                            </>
                        }
                        resultComponent={
                            <NumberAnimation number={latestResult.number} />
                        }
                    />
                )}

                <DialogInterface
                    open={open}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    theme={theme}
                    name={name}
                    setName={setName}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            bgcolor: theme.palette.error.main,
                            borderRadius: 2,
                        },
                    }}
                />
            </Box>
        </Box>
    );
};

export default LuckyNumberActivityPage;
