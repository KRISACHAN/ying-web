import './page.css';

import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    TextField,
} from '@mui/material';
import type { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import { useLuckyNumber } from '@/hooks/use-lucky-number';
import NotFoundPage from '@/pages/404/page';
import axiosInstance from '@/services/axios';
import type { QueryLuckyNumberResponse } from '@/types/lucky-number';

import HeaderInterface from '../components/header';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

interface DrawLuckyNumberResponse {
    drawn_number: number;
}

const InitialInterface: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <>
            <div className="text-center h-60 w-full">
                <Avatar
                    className="mx-auto mb-5 font-bold"
                    sx={{
                        width: 200,
                        height: 200,
                    }}
                    src="/love-banner.svg"
                    alt="爱心"
                    variant="rounded"
                />
            </div>
            <div className="fixed left-1/2 -translate-x-1/2 bottom-[60px]">
                <Button
                    variant="contained"
                    size="large"
                    onClick={onClick}
                    className="w-[calc(100vw-64px)] h-[60px]"
                >
                    获取幸运号码
                </Button>
            </div>
        </>
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
            />
            <div className="text-center">
                <p className="text-3xl mb-8">亲爱的{storedName}，你的号码是</p>
                <Avatar
                    className="mx-auto mb-8"
                    sx={{
                        width: 250,
                        height: 250,
                        color: 'white',
                        fontSize: '100px',
                        backgroundColor: '#1976d2',
                    }}
                >
                    {luckyNumber}
                </Avatar>
                <p className="text-lg">本次号码只能抽取一次，不能重复抽哦</p>
            </div>
        </>
    );
};

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
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

    const localLuckyNumberKey = `ying-events-lucky-number-${activityKey}`;
    const localNameKey = `ying-events-name-${activityKey}`;

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
    };

    const handleSubmit = async () => {
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
        }
    };

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    return (
        <div className="flex flex-col items-center">
            <HeaderInterface
                description={activityInfo?.description}
                name={activityInfo?.name}
            />
            {luckyNumber === null ? (
                <InitialInterface onClick={handleClickOpen} />
            ) : (
                <ResultInterface
                    luckyNumber={luckyNumber}
                    storedName={storedName}
                />
            )}
            <Dialog fullWidth={true} open={open} onClose={handleClose}>
                <DialogTitle>输入你的名字</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="名字"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button size="large" onClick={handleClose}>
                        取消
                    </Button>
                    <Button size="large" onClick={handleSubmit}>
                        提交
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                autoHideDuration={2000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={snackbarOpen}
                message={snackbarMessage}
                onClose={() => setSnackbarOpen(false)}
            />
        </div>
    );
};

export default LuckyNumberActivityPage;
