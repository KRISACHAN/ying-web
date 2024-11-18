import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { AxiosError } from 'axios';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Snackbar,
} from '@mui/material';
import axiosInstance from '../../../services/axios';
import { useLocalStorage } from 'usehooks-ts';
import './page.css';

interface GetActivityResponse {
    activity_key: string;
    description: string;
}

interface DrawLuckyNumberResponse {
    drawn_number: number;
}

const LuckyNumberActivityPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [luckyNumber, setLuckyNumber] = useLocalStorage<number | null>(
        'luckyNumber',
        null,
    );
    const [storedName, setStoredName] = useLocalStorage<string | null>(
        'name',
        null,
    );
    const [storedInfo, setStoredInfo] =
        useLocalStorage<GetActivityResponse | null>('info', null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchActivityInfo = async () => {
            try {
                const response = await axiosInstance.get<GetActivityResponse>(
                    `/lucky-number/query/${activityKey}`,
                );
                setActivityInfo(response.data);
                setStoredInfo(response.data);
            } catch (error) {
                console.error('Error fetching activity info:', error);
            }
        };

        if (!activityKey) {
            return;
        }

        if (!storedInfo) {
            fetchActivityInfo();
            return;
        }
        setActivityInfo(storedInfo);
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

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl mb-5">{activityKey}</h1>
            {activityInfo && (
                <p className="text-lg mb-5">{activityInfo.description}</p>
            )}
            {luckyNumber === null ? (
                <Button variant="contained" onClick={handleClickOpen}>
                    获取幸运号码
                </Button>
            ) : (
                <div>
                    <p>亲爱的 {storedName}，你好</p>
                    <p>你的号码是：{luckyNumber}</p>
                    <p>本次号码只能抽取一次，不能重复抽哦</p>
                </div>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>输入您的名字</DialogTitle>
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
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={handleSubmit}>提交</Button>
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
