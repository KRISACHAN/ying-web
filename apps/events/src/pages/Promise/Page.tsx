import { Box, Button, Snackbar } from '@mui/material';
import { Gift } from 'lucide-react';
import React, { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import InitialState from '@/components/InitialState/Index';
import LoadingState from '@/components/LoadingState/Index';
import TipBar from '@/components/TipBar/Index';
import TransitionWrapper from '@/components/TransitionWrapper/Index';
import axiosInstance from '@/services/axios';

import './Page.less';

const PromisePage: React.FC = () => {
    const [promise, setPromise] = useState<string>('');
    const [isInit, setIsInit] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const fetchPromise = async () => {
        setIsInit(false);
        setIsLoading(true);
        setIsTransitioning(true);
        setShowResult(false);

        try {
            const response = await axiosInstance.get('/promise/result');
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPromise(response.data);
            setIsTransitioning(false);
            setShowResult(true);
        } catch {
            setPromise('获取经文失败，请重试。');
            setIsTransitioning(false);
            setShowResult(true);
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
                <HeaderInterface name="圣经应许" description="圣经应许" />

                <TipBar message="快来看看今天神要对你说什么吧！" />

                {isTransitioning ? (
                    <LoadingState message="正在抽取今日经文" />
                ) : isInit ? (
                    <InitialState
                        title="准备好了吗？"
                        subtitle="点击按钮，获取今日经文"
                        buttonText="开始抽取"
                        loading={isLoading}
                        onClick={debouncedFetchPromise}
                        icon={<Gift />}
                    />
                ) : (
                    <TransitionWrapper show={showResult}>
                        <Box sx={{ textAlign: 'center' }}>
                            <p className="text-2xl text-[#F87171]">{promise}</p>
                        </Box>
                    </TransitionWrapper>
                )}

                {!isInit && !isTransitioning && (
                    <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
                        <Button
                            onClick={copyToClipboard}
                            disabled={isLoading}
                            variant="outlined"
                            fullWidth
                            size="large"
                            sx={{
                                mb: 2,
                                color: '#fff',
                                borderColor: '#fff',
                            }}
                        >
                            复制经文
                        </Button>
                        <Button
                            onClick={debouncedFetchPromise}
                            disabled={isLoading}
                            variant="contained"
                            fullWidth
                            size="large"
                            className="opacity-75"
                            sx={{ color: '#F87171', backgroundColor: '#fff' }}
                        >
                            再次抽取
                        </Button>
                    </Box>
                )}

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
