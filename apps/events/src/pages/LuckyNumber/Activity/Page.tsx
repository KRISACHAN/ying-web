import './page.less';

import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import axiosInstance from '@/services/axios';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Snackbar,
    TextField,
    Typography,
    useTheme,
    type Theme,
} from '@mui/material';
import type { AxiosError } from 'axios';
import { Gift, Heart, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { luckyNumberTheme } from '@/theme/luckyNumber';
import HeaderInterface from '../components/Header/Index';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

interface DrawLuckyNumberResponse {
    drawn_number: number;
}

const InitialInterface: React.FC<{ loading: boolean; onClick: () => void }> = ({
    onClick,
    loading,
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                width: '100%',
                position: 'relative',
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    py: 2,
                    px: 2,
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: 600,
                    textAlign: 'center',
                }}
            >
                <Box
                    component="img"
                    src="/love-banner.svg"
                    alt="爱心"
                    className="text-lucky-number-primary"
                    sx={{
                        width: '100%',
                        maxWidth: 200,
                        height: 'auto',
                        animation: 'float 3s ease-in-out infinite',
                        mx: 'auto',
                        display: 'block',
                    }}
                />
                <Typography
                    variant="h5"
                    component="h2"
                    className="text-lucky-number-primary"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    准备好开启新的一年了吗？
                </Typography>
                <Typography
                    variant="body1"
                    className="text-lucky-number-primary opacity-75"
                    sx={{ mb: 4 }}
                >
                    点击下方按钮，开启你的幸运之旅
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClick}
                    disabled={loading}
                    startIcon={
                        loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <Gift />
                        )
                    }
                    sx={{
                        py: 2,
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        boxShadow: theme.shadows[8],
                        width: '100%',
                        background: luckyNumberTheme.colors.primary,
                        '&:hover': {
                            background: luckyNumberTheme.colors.light,
                            transform: 'translateY(-2px)',
                            transition: 'transform 0.2s ease-in-out',
                        },
                    }}
                >
                    {loading ? '获取中...' : '获取幸运号码'}
                </Button>
            </Paper>
        </Box>
    );
};

const ResultInterface: React.FC<{
    luckyNumber: number | null;
    storedName: string | null;
}> = ({ luckyNumber, storedName }) => {
    return (
        <>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={300}
            />
            <Box sx={{ position: 'relative', width: '100%' }}>
                <Paper
                    elevation={4}
                    sx={{
                        py: 2,
                        px: 2,
                        borderRadius: 4,
                        background: luckyNumberTheme.colors.background.paper,
                        backdropFilter: 'blur(10px)',
                        textAlign: 'center',
                        maxWidth: 600,
                        mx: 'auto',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: luckyNumberTheme.shadows.medium,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                        },
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{
                            mb: 4,
                            color: luckyNumberTheme.colors.text.primary,
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <Heart className="text-lucky-number-primary" />
                        恭喜 {storedName}
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            mb: 3,
                            color: luckyNumberTheme.colors.text.secondary,
                        }}
                    >
                        你的幸运号码是
                    </Typography>
                    <Box
                        sx={{
                            position: 'relative',
                            mb: 4,
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: `radial-gradient(circle, ${luckyNumberTheme.colors.background.overlay}, transparent)`,
                                animation: 'pulse 2s ease-in-out infinite',
                            },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 200,
                                height: 200,
                                mx: 'auto',
                                bgcolor: luckyNumberTheme.colors.primary,
                                color: luckyNumberTheme.colors.text.inverse,
                                fontSize: '4rem',
                                fontWeight: 'bold',
                                boxShadow: luckyNumberTheme.shadows.large,
                            }}
                        >
                            {luckyNumber}
                        </Avatar>
                    </Box>
                    <Typography
                        variant="body1"
                        sx={{
                            fontStyle: 'italic',
                            mt: 2,
                            color: luckyNumberTheme.colors.text.secondary,
                            '& br': {
                                display: 'block',
                                content: '""',
                                mt: 1,
                            },
                        }}
                    >
                        愿这个数字背后所蕴含的祝福，
                        <br />
                        能成为你未来日子的能力！
                    </Typography>
                </Paper>
            </Box>
        </>
    );
};

const DialogInterface: React.FC<{
    open: boolean;
    handleClose: () => void;
    handleSubmit: () => Promise<void>;
    loading: boolean;
    theme: Theme;
    name: string;
    setName: (name: string) => void;
}> = ({ open, handleClose, handleSubmit, loading, theme, name, setName }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    width: '100%',
                    maxWidth: 400,
                },
            }}
        >
            <DialogTitle
                sx={{
                    pb: 1,
                    textAlign: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    color: luckyNumberTheme.colors.text.primary,
                }}
            >
                请输入你的名字
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="请输入您的名字"
                    type="text"
                    fullWidth
                    value={name}
                    onChange={e => setName(e.target.value)}
                    variant="outlined"
                    sx={{
                        mt: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor:
                                    luckyNumberTheme.colors.border.primary,
                            },
                            '&:hover fieldset': {
                                borderColor:
                                    luckyNumberTheme.colors.border.hover,
                            },
                            '&.Mui-focused fieldset': {
                                borderColor:
                                    luckyNumberTheme.colors.border.focus,
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: luckyNumberTheme.colors.text.primary,
                            '&.Mui-focused': {
                                color: luckyNumberTheme.colors.text.primary,
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            color: luckyNumberTheme.colors.text.primary,
                        },
                    }}
                />
            </DialogContent>
            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    size="large"
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        borderColor: luckyNumberTheme.colors.border.primary,
                        color: luckyNumberTheme.colors.text.primary,
                        '&:hover': {
                            borderColor: luckyNumberTheme.colors.border.hover,
                            backgroundColor:
                                luckyNumberTheme.colors.background.overlay,
                        },
                    }}
                >
                    取消
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={
                        loading && <Loader2 className="w-4 h-4 animate-spin" />
                    }
                    sx={{
                        borderRadius: 2,
                        px: 4,
                        background: luckyNumberTheme.colors.primary,
                        '&:hover': {
                            background: luckyNumberTheme.colors.light,
                        },
                    }}
                >
                    {loading ? '提交中...' : '提交'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看其它功能？" />;
};

const getQuery = (key: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
};

const LuckyNumberActivityPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const { queryActivityInfo } = useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const headerContext = useHeader();
    const theme = useTheme();

    const localLuckyNumberKey = `ying-events-${activityKey}-lucky-number`;
    const localNameKey = `ying-events-${activityKey}-name`;

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
        } catch (error) {
            setError(error as Error);
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
            const response = await axiosInstance.post<DrawLuckyNumberResponse>(
                '/lucky-number/draw',
                {
                    key: activityKey,
                    user_name: name,
                },
            );
            setLuckyNumber(response.data.drawn_number);
            setStoredName(name ?? null);
            handleClose();
        } catch (error: unknown) {
            setSnackbarMessage(
                (error as AxiosError).response?.data.message ??
                    '抽取失败，请刷新页面后重试',
            );
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    return (
        <Box
            className="bg-lucky-number-primary"
            sx={{
                minHeight: '100vh',
                width: '100%',
                p: { xs: 2, sm: 4 },
            }}
        >
            <Box
                sx={{
                    mx: 'auto',
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

                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                    className="bg-white opacity-75"
                >
                    <Heart className="w-5 h-5 text-lucky-number-primary" />
                    <Typography
                        variant="body2"
                        className="text-lucky-number-primary"
                        sx={{ fontWeight: 500 }}
                    >
                        注意：每人只能抽取一次哦
                    </Typography>
                </Paper>

                {luckyNumber === null ? (
                    <InitialInterface
                        onClick={handleClickOpen}
                        loading={loading}
                    />
                ) : (
                    <ResultInterface
                        luckyNumber={luckyNumber}
                        storedName={storedName}
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
