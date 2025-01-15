import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    Typography,
    useTheme,
} from '@mui/material';
import { CSSTransition } from 'react-transition-group';

import HeaderInterface from '@/components/Header/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useOptionDraw } from '@/hooks/useOptionDraw';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, DrawOptionResponse } from '@/types/optionDraw';

import ResultCard from '../components/ResultCard';
import { DialogInterface } from './components/DialogInterface';
import './Page.less';

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
    const [result, setResult] = useState<DrawOptionResponse | null>(null);
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

    useEffect(() => {
        if (!activityKey || !!error) return;
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
        if (!activityKey || !name.trim()) return;

        setLoading(true);
        try {
            const response = await drawOption({
                key: activityKey,
                username: name.trim(),
            });
            setResult(response);
            handleClose();
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    };

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
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                p: { xs: 2, sm: 4 },
                backgroundColor: '#F87171',
            }}
        >
            <Container maxWidth="sm">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                    }}
                >
                    <HeaderInterface
                        description={activityInfo?.description}
                        name={activityInfo?.name}
                    />

                    {error ? (
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error.message || '获取活动数据失败，请稍后再试'}
                        </Alert>
                    ) : (
                        <>
                            {!result ? (
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        borderRadius: 3,
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        gutterBottom
                                    >
                                        参与活动
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        color="text.secondary"
                                        sx={{ mb: 3 }}
                                    >
                                        点击下方按钮开始抽取选项
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        onClick={handleClickOpen}
                                        sx={{
                                            borderRadius: 2,
                                            py: 1.5,
                                            px: 4,
                                            background: '#6366F1',
                                            '&:hover': {
                                                background: '#818CF8',
                                            },
                                        }}
                                    >
                                        开始抽取
                                    </Button>
                                </Paper>
                            ) : (
                                <CSSTransition
                                    in={!!result}
                                    timeout={1000}
                                    classNames="result"
                                    unmountOnExit
                                >
                                    <ResultCard
                                        option={result.drawn_option}
                                        username={result.username}
                                        activityName={activityInfo?.name || ''}
                                    />
                                </CSSTransition>
                            )}
                        </>
                    )}
                </Box>

                <DialogInterface
                    open={open}
                    handleClose={handleClose}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    theme={theme}
                    name={name}
                    setName={setName}
                />
            </Container>
        </Box>
    );
};

export default OptionDrawActivity;
