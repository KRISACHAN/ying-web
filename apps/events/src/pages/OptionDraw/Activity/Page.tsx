import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert, Box, Container, Snackbar, useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import { Gift } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

import DialogInterface from '@/components/DialogInterface/Index';
import HeaderInterface from '@/components/Header/Index';
import InitialState from '@/components/InitialState/Index';
import LoadingState from '@/components/LoadingState/Index';
import ResultInterface from '@/components/ResultInterface/Index';
import TipBar from '@/components/TipBar/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useOptionDraw } from '@/hooks/useOptionDraw';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, DrawOptionResponse } from '@/types/optionDraw';
import { getQuery } from '@/utils/query';

import ResultCard from '../components/ResultCard';

const ErrorInterface: React.FC<{ message?: string }> = ({
    message = '活动不存在或已结束',
}) => {
    return <NotFoundPage name={message} description="回到首页看看其它功能？" />;
};

const OptionDrawActivity: React.FC = () => {
    const { activityKey } = useParams();
    const theme = useTheme();
    const { getActivityInfo, drawOption } = useOptionDraw();
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [reveal, setReveal] = useState(0);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showResult, setShowResult] = useState(false);
    const headerContext = useHeader();

    const localResultKey = `YING_EVENTS_OPTION_DRAW_RESULT_${activityKey}`;
    const localNameKey = `YING_EVENTS_OPTION_DRAW_NAME_${activityKey}`;

    const [result, setResult] = useLocalStorage<DrawOptionResponse | null>(
        localResultKey,
        null,
    );
    const [storedName, setStoredName] = useLocalStorage<string | null>(
        localNameKey,
        null,
    );

    const cleanUserResult = () => {
        const needClean = getQuery('__clean');
        if (!needClean) {
            return;
        }
        setResult(null);
        setStoredName(null);
    };

    const fetchActivityInfo = async () => {
        try {
            const info = await getActivityInfo(activityKey);
            setActivityInfo(info);
            headerContext.setHeaderInfo({
                title: info.name,
                description: info.description,
                keywords: info.activity_key,
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
            const response = await drawOption({
                key: activityKey!,
                username: name.trim(),
            });

            handleClose();
            setResult(response);
            setStoredName(name.trim());
            setShowResult(true);
            setReveal(value => value + 1);
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
        return <ErrorInterface />;
    }

    if (is400Error) {
        return <ErrorInterface message="活动未开始或已结束" />;
    }

    return (
        <Box
            className="min-h-screen w-full"
            sx={{
                p: { xs: 2, sm: 4 },
            }}
        >
            <Container style={{ padding: 0 }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                        px: 0,
                    }}
                >
                    <HeaderInterface
                        description={activityInfo?.description}
                        name={activityInfo?.name}
                        illustration="small"
                    />

                    <TipBar message="注意：每人只能抽取一次哦" />

                    {error ? (
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error.message || '获取活动数据失败，请稍后再试'}
                        </Alert>
                    ) : (
                        <>
                            {!activityInfo ? (
                                <LoadingState message="正在获取活动信息…" />
                            ) : !result ? (
                                <InitialState
                                    title="准备好了吗？"
                                    subtitle="点击按钮，开启抽取之旅"
                                    buttonText="开始抽取"
                                    loading={loading}
                                    onClick={handleClickOpen}
                                    icon={<Gift />}
                                />
                            ) : (
                                <ResultInterface
                                    key={reveal}
                                    reveal={reveal > 0}
                                    show={showResult}
                                    name={storedName}
                                    subtitle="你抽到的选项是"
                                    resultComponent={
                                        <ResultCard
                                            result={result.drawn_option}
                                        />
                                    }
                                    onReset={() => {
                                        setResult(null);
                                        setStoredName(null);
                                        setShowResult(false);
                                        setReveal(0);
                                    }}
                                />
                            )}
                        </>
                    )}
                </Box>

                <DialogInterface
                    open={open}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    loading={loading}
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
            </Container>
        </Box>
    );
};

export default OptionDrawActivity;
