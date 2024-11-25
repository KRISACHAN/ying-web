import React, { useState } from 'react';

import { Box, Button, Snackbar } from '@mui/material';
import { Heart } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts';

import axiosInstance from '@/services/axios';

const PromisePage: React.FC = () => {
    const [promise, setPromise] = useState<string>('请点击抽取经文！');
    const [isInit, setIsInit] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const fetchPromise = async () => {
        setIsInit(false);
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/promise/result');
            const data = response.data;
            setPromise(data);
        } catch {
            setPromise('获取经文失败，请重试。');
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetchPromise = useDebounceCallback(fetchPromise, 500);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(promise);
            setSnackbarOpen(true);
            setSnackbarMessage('经文已复制到剪贴板');
        } catch {
            setSnackbarOpen(true);
            setSnackbarMessage('复制失败，请重试。');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                px: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 4 },
                background:
                    'linear-gradient(135deg, #EBF5FF 0%, #F0F7FF 50%, #E6F3FF 100%)',
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
                <div className="flex items-center gap-2 mb-8">
                    <Heart className="w-9 h-9 text-red-400 fill-current" />
                    <h1 className="text-3xl font-bold">圣经应许</h1>
                </div>

                <div className="w-full max-w-xl bg-white/80 rounded-xl p-6 mb-8 min-h-[100px] flex items-center justify-center shadow-sm overflow-y-auto">
                    <p className="text-2xl text-center">{promise}</p>
                </div>

                <div className="w-[calc(100%-32px)] max-w-xl flex gap-4 fixed bottom-8">
                    <Button
                        onClick={debouncedFetchPromise}
                        disabled={isLoading}
                        className={`flex-1`}
                        size="large"
                        variant="contained"
                    >
                        抽取经文
                    </Button>

                    <Button
                        onClick={copyToClipboard}
                        disabled={isLoading || isInit}
                        className={`flex-1`}
                        size="large"
                        variant="outlined"
                    >
                        复制
                    </Button>
                </div>
                <Snackbar
                    autoHideDuration={2000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    open={snackbarOpen}
                    message={snackbarMessage}
                    onClose={() => setSnackbarOpen(false)}
                />
            </Box>
        </Box>
    );
};

export default PromisePage;
