import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Alert, Box, Button, Snackbar, useTheme } from '@mui/material';
import type { AxiosError } from 'axios';
import { Gift } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

import DialogInterface from '@/components/DialogInterface/Index';
import HeaderInterface from '@/components/Header/Index';
import InitialState from '@/components/InitialState/Index';
import LoadingState from '@/components/LoadingState/Index';
import ResultInterface from '@/components/ResultInterface/Index';
import TipBar from '@/components/TipBar/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';
import { getQuery } from '@/utils/query';

import DrawLoading from '../components/DrawLoading';

const DRAW_REQUEST_DELAY_MS = 2000;

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

type LuckyNumberResult = {
    number: number;
    name: string;
    timestamp: number;
};

function LuckyNumberActivity({ activityKey }: { activityKey?: string }) {
    const navigate = useNavigate();
    const { queryActivityInfo, drawLuckyNumber, queryParticipations } =
        useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [pendingName, setPendingName] = useState<string | null>(null);
    const [revealNumber, setRevealNumber] = useState(false);
    const activeDraw = useRef<AbortController | null>(null);
    const loading = pendingName !== null;
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
    const numberText = latestResult?.number.toString() ?? '';
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [error, setError] = useState<Error | null>(null);
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
                const removedLocalResults = luckyNumberResults.filter(
                    localResult => {
                        const key = `${localResult.number}_${localResult.name}`;
                        return !serverDataMap.has(key);
                    },
                );

                if (removedLocalResults.length > 0) {
                    const resultKey = ({
                        name,
                        number,
                        timestamp,
                    }: LuckyNumberResult) =>
                        JSON.stringify([name, number, timestamp]);
                    const removedKeys = new Set(
                        removedLocalResults.map(resultKey),
                    );
                    // The response only applies to records present when this sync began.
                    setLuckyNumberResults(current =>
                        current.filter(
                            result => !removedKeys.has(resultKey(result)),
                        ),
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

        return () => activeDraw.current?.abort();
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
        if (activeDraw.current || !activityKey) return;

        const username = name.trim();
        if (!username) {
            setSnackbarMessage('请输入你的名字');
            setSnackbarOpen(true);
            return;
        }

        const draw = new AbortController();
        activeDraw.current = draw;
        setRevealNumber(false);
        setPendingName(username);
        setOpen(false);

        try {
            await new Promise<void>(resolve => {
                const timer = window.setTimeout(resolve, DRAW_REQUEST_DELAY_MS);
                draw.signal.addEventListener(
                    'abort',
                    () => {
                        window.clearTimeout(timer);
                        resolve();
                    },
                    { once: true },
                );
            });
            if (draw.signal.aborted) return;

            const response = await drawLuckyNumber({
                key: activityKey,
                username,
            });

            const newResult: LuckyNumberResult = {
                number: response.drawn_number,
                name: username,
                timestamp: Date.now(),
            };

            setLuckyNumberResults(prev => [...prev, newResult]);
            if (draw.signal.aborted) return;
            setName('');
            setRevealNumber(true);
        } catch (error: unknown) {
            if (draw.signal.aborted) return;
            setSnackbarMessage(
                (error as AxiosError)?.response?.data?.message ??
                    '抽取失败，请刷新页面后重试',
            );
            setSnackbarOpen(true);
            setOpen(true);
        } finally {
            activeDraw.current = null;
            if (!draw.signal.aborted) setPendingName(null);
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
                display: 'flex',
                flexDirection: 'column',
                p: { xs: 2, sm: 4 },
            }}
        >
            <Box
                sx={{
                    mx: 'auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <HeaderInterface
                    description={activityInfo?.description}
                    name={activityInfo?.name}
                    illustration="small"
                />

                <TipBar message="注意：每人只能抽取一次哦" />

                {error ? (
                    <Alert severity="error">获取活动数据失败，请稍后再试</Alert>
                ) : !activityInfo ? (
                    <LoadingState message="正在获取活动信息…" />
                ) : !loading && latestResult === null ? (
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
                        show
                        name={pendingName ?? latestResult?.name}
                        subtitle={
                            loading ? '正在抽取幸运号码…' : '你的幸运号码是'
                        }
                        footer={
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                    gap: 1.5,
                                    mt: 2,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={handleClickOpen}
                                    disabled={loading}
                                >
                                    帮他人抽取
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={handleViewHistory}
                                    disabled={loading}
                                >
                                    查看历史
                                </Button>
                            </Box>
                        }
                        resultComponent={
                            <div className="event-gift-tag">
                                <DrawLoading active={loading} />
                                {!loading && (
                                    <strong
                                        className={
                                            revealNumber
                                                ? 'event-gift-tag__number event-gift-tag__number--reveal'
                                                : 'event-gift-tag__number'
                                        }
                                        style={{
                                            fontSize:
                                                numberText.length > 4
                                                    ? 'clamp(1.25rem, 6vw, 2.5rem)'
                                                    : undefined,
                                        }}
                                    >
                                        {numberText}
                                    </strong>
                                )}
                            </div>
                        }
                    />
                )}

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
            </Box>
            <Box
                component="footer"
                aria-hidden="true"
                sx={{
                    mt: 'auto',
                    pt: 'clamp(28px, 8vh, 68px)',
                    pb: { xs: 1, sm: 2 },
                }}
            >
                <Box
                    component="img"
                    src="/christmas/sprig.webp"
                    alt=""
                    width={110}
                    height={32}
                    sx={{
                        display: 'block',
                        mx: 'auto',
                        opacity: 0.62,
                        transform: 'rotate(180deg)',
                    }}
                />
            </Box>
        </Box>
    );
}

export default function LuckyNumberActivityPage() {
    const { activityKey } = useParams<{ activityKey: string }>();
    return <LuckyNumberActivity key={activityKey} activityKey={activityKey} />;
}
