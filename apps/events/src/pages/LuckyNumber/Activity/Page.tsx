import { Box, Snackbar, useTheme } from '@mui/material';
import type { AxiosError } from 'axios';
import { Gift } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import ResultInterface from '@/components/ResultInterface/Index';
import NumberAnimation from '../components/NumberAnimation';

import './Page.less';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

const LuckyNumberActivityPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const { queryActivityInfo, drawLuckyNumber } = useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const headerContext = useHeader();
    const theme = useTheme();

    const localLuckyNumberKey = `YING_EVENTS_LUCKY_NUMBER_NUMBER_${activityKey}`;
    const localNameKey = `YING_EVENTS_LUCKY_NUMBER_NAME_${activityKey}`;

    const [luckyNumber, setLuckyNumber] = useLocalStorage<number | null>(
        localLuckyNumberKey,
        null,
    );
    const [storedName, setStoredName] = useLocalStorage<string | null>(
        localNameKey,
        null,
    );
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
        setLuckyNumber(null);
        setStoredName(null);
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

    useEffect(() => {
        cleanUserResult();
        if (!activityKey) {
            return;
        }
        fetchActivityInfo();
    }, [activityKey]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setName('');
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

            setTempResult({
                number: response.drawn_number,
                name: name.trim(),
            });

            handleClose();
            setIsTransitioning(true);

            await new Promise(resolve => setTimeout(resolve, 1000));

            setLuckyNumber(response.drawn_number);
            setStoredName(name.trim());
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
            sx={{
                minHeight: '100vh',
                width: '100%',
                p: { xs: 2, sm: 4 },
                backgroundColor: '#F87171',
            }}
        >
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
                ) : luckyNumber === null ? (
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
                        name={storedName}
                        subtitle="你的幸运号码是"
                        footer={
                            <>
                                愿这个数字背后所蕴含的祝福，
                                <br />
                                能成为你未来日子的能力！
                            </>
                        }
                        resultComponent={
                            <NumberAnimation number={luckyNumber} />
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
