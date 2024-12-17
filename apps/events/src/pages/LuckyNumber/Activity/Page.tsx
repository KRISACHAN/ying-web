import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Snackbar,
    TextField,
    type Theme,
    Typography,
    useTheme,
} from '@mui/material';
import type { AxiosError } from 'axios';
import { Disc3, Gift, Heart, Loader2 } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';

import NumberAnimation from '../components/NumberAnimation';
import { luckyNumberTheme } from '../styles/index';

import './Page.less';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

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
                    准备好了吗？
                </Typography>
                <Typography
                    variant="body1"
                    className="text-lucky-number-primary opacity-75"
                    sx={{ mb: 2 }}
                >
                    点击按钮，开启幸运之旅
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
                    {loading ? '获取中...' : '开启幸运之旅'}
                </Button>
            </Paper>
        </Box>
    );
};

const TransitioningInterface: React.FC<{ name: string }> = ({ name }) => {
    return (
        <>
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '300px',
                    gap: 4,
                }}
            >
                <Paper
                    elevation={4}
                    className="w-full"
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
                        variant="body1"
                        className="text-center w-full"
                        sx={{
                            fontWeight: '500',
                            color: luckyNumberTheme.colors.primary,
                            fontSize: '2rem',
                        }}
                    >
                        正在为 {name} 抽取幸运数字
                    </Typography>
                    <Disc3
                        className="w-60 h-60 animate-spin mx-auto"
                        style={{ color: luckyNumberTheme.colors.primary }}
                        strokeWidth={1}
                    />
                </Paper>
            </Box>
        </>
    );
};

const ResultInterface: React.FC<{
    luckyNumber: number;
    storedName: string | null;
    show: boolean;
}> = ({ luckyNumber, storedName, show }) => {
    const nodeRef = React.useRef(null);

    return (
        <>
            <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                recycle={false}
                numberOfPieces={300}
            />
            <CSSTransition
                nodeRef={nodeRef}
                in={show}
                timeout={1000}
                classNames="result"
                unmountOnExit
            >
                <div className="relative w-full">
                    <Box
                        ref={nodeRef}
                        sx={{ position: 'relative', width: '100%' }}
                    >
                        <Paper
                            elevation={4}
                            sx={{
                                py: 2,
                                px: 2,
                                borderRadius: 4,
                                background:
                                    luckyNumberTheme.colors.background.paper,
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
                                    mb: 1,
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
                                    mb: 1,
                                    color: luckyNumberTheme.colors.text
                                        .secondary,
                                }}
                            >
                                你的幸运号码是
                            </Typography>
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <NumberAnimation number={luckyNumber ?? 0} />
                            </Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontStyle: 'italic',
                                    color: luckyNumberTheme.colors.text
                                        .secondary,
                                    '& br': {
                                        display: 'block',
                                        content: '""',
                                    },
                                }}
                            >
                                愿这个数字背后所蕴含的祝福，
                                <br />
                                能成为你未来日子的能力！
                            </Typography>
                        </Paper>
                    </Box>
                </div>
            </CSSTransition>
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
                    提交
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const ErrorInterface: React.FC = () => {
    return (
        <NotFoundPage name="活动不存在" description="回到首页看其它功能？" />
    );
};

const getQuery = (key: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
};

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
                (error as AxiosError).response?.data?.message ??
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

                {isTransitioning ? (
                    <TransitioningInterface name={tempResult?.name ?? ''} />
                ) : luckyNumber === null ? (
                    <InitialInterface
                        onClick={handleClickOpen}
                        loading={loading}
                    />
                ) : (
                    <ResultInterface
                        luckyNumber={luckyNumber}
                        storedName={storedName}
                        show={showResult}
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
