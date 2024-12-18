import { useEffect, useState } from 'react';

import {
    Box,
    Button,
    List,
    ListItem,
    ListItemButton,
    Snackbar,
    Typography,
} from '@mui/material';

import HeaderInterface from '@/components/Header/Index';
import LoadingState from '@/components/LoadingState/Index';
import Preview from '@/components/Preview';
import TipBar from '@/components/TipBar/Index';
import TransitionWrapper from '@/components/TransitionWrapper/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { usePromise } from '@/hooks/usePromise';
import type { Promise, PromiseCategory } from '@/types/promise';

const CategoryButtonInterface = ({
    onClick,
    children,
    selected = false,
}: {
    onClick: () => void;
    children: React.ReactNode;
    selected?: boolean;
}) => (
    <ListItemButton
        onClick={onClick}
        sx={{
            borderRadius: '12px',
            mb: 1,
            backgroundColor: selected ? '#F87171' : 'rgba(255, 255, 255, 0.9)',
            color: selected ? 'white' : '#F87171',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: '#F87171',
                color: 'white',
                transform: 'translateX(8px)',
            },
        }}
    >
        <Typography
            sx={{
                fontSize: '1rem',
                fontWeight: 500,
                py: 1,
            }}
        >
            {children}
        </Typography>
    </ListItemButton>
);

const ResourceInterface = (promise: Promise) => {
    return (
        <Preview
            resource_type={promise.resource_type}
            resource_url={promise.resource_url}
        />
    );
};

const TransitioningInterface = () => {
    return (
        <>
            <HeaderInterface name="圣经应许" description="正在抽取经文" />
            <TipBar message="神的话语正在向你展开..." />
            <LoadingState message="正在抽取经文..." />
        </>
    );
};

const InitialInterface = ({
    categories,
    handleCategoryClick,
}: {
    categories: PromiseCategory[];
    handleCategoryClick: (categoryId: number | null) => void;
}) => {
    return (
        <>
            <HeaderInterface name="圣经应许" description="请选择一个分类" />
            <TipBar message="每个分类都蕴含着神的智慧和应许" />

            <List sx={{ width: '100%', maxWidth: 600, px: 2 }}>
                <ListItem disablePadding>
                    <CategoryButtonInterface
                        onClick={() => handleCategoryClick(null)}
                    >
                        全部经文
                    </CategoryButtonInterface>
                </ListItem>
                {categories.map(category => (
                    <ListItem key={category.id} disablePadding>
                        <CategoryButtonInterface
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            {category.name}
                        </CategoryButtonInterface>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

const ResultInterface = ({
    promise,
    showResult,
    handleReset,
    copyToClipboard,
}: {
    promise: Promise;
    showResult: boolean;
    handleReset: () => void;
    copyToClipboard: (promise: Promise) => void;
}) => {
    return (
        <>
            <HeaderInterface
                name="圣经应许"
                description="神的话语已经向你展开"
            />
            <TipBar message="点击下方按钮返回分类列表" />

            <TransitionWrapper show={showResult}>
                <Box sx={{ width: '100%', maxWidth: 800 }}>
                    <Typography
                        variant="h5"
                        component="h3"
                        gutterBottom
                        sx={{
                            color: '#F87171',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            mb: 2,
                        }}
                    >
                        {promise.chapter}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#374151',
                            fontSize: '14px',
                            textAlign: 'center',
                        }}
                    >
                        {promise.text}
                    </Typography>
                    {promise.description && (
                        <Typography
                            variant="body2"
                            sx={{
                                opacity: 0.75,
                                textAlign: 'center',
                                mt: 2,
                                fontSize: '18px',
                            }}
                        >
                            {promise.description}
                        </Typography>
                    )}
                    {ResourceInterface(promise)}
                    <Box
                        sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={async () => await copyToClipboard(promise)}
                            variant="outlined"
                            fullWidth
                            size="large"
                            sx={{
                                color: '#F87171',
                                borderColor: '#F87171',
                            }}
                        >
                            复制经文
                        </Button>
                        <Button
                            onClick={handleReset}
                            variant="contained"
                            fullWidth
                            size="large"
                            className="opacity-75"
                            sx={{
                                color: '#fff',
                                backgroundColor: '#F87171',
                            }}
                        >
                            再次抽取
                        </Button>
                    </Box>
                </Box>
            </TransitionWrapper>
        </>
    );
};

const PromiseNewPage = () => {
    const { setHeaderInfo } = useHeader();
    const { getRandomPromise, getCategoryList } = usePromise();
    const [promise, setPromise] = useState<Promise | null>(null);
    const [categories, setCategories] = useState<PromiseCategory[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        setHeaderInfo({
            title: '圣经应许',
            description:
                '耶和华说：我知道我向你们所怀的意念是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。',
            keywords: '圣经应许 经文 基督教',
        });
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategoryList();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories:', error);
            setSnackbarMessage('获取分类失败，请稍后再试');
            setSnackbarOpen(true);
        }
    };

    const handleCategoryClick = async (categoryId: number | null) => {
        setIsTransitioning(true);
        setShowResult(false);

        try {
            const data = await getRandomPromise(categoryId || undefined);
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPromise(data);
            setIsTransitioning(false);
            setShowResult(true);
        } catch (error) {
            console.error('Failed to get promise:', error);
            setSnackbarMessage('获取经文失败，请稍后再试');
            setSnackbarOpen(true);
            setIsTransitioning(false);
            setShowResult(true);
        }
    };

    const handleReset = () => {
        setPromise(null);
        setShowResult(false);
        setIsTransitioning(false);
    };

    const copyToClipboard = async (promise: Promise) => {
        try {
            const textToCopy = `${promise?.chapter}\n${promise?.text}\n${
                promise?.description ? `\n${promise.description}` : ''
            }`;
            await navigator.clipboard.writeText(textToCopy);
            setSnackbarMessage('经文已复制到剪贴板');
            setSnackbarOpen(true);
        } catch {
            setSnackbarMessage('复制失败，请重试');
            setSnackbarOpen(true);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100%',
                px: { xs: 2, sm: 4 },
                py: { xs: 4, sm: 6 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
            }}
        >
            {isTransitioning ? (
                <TransitioningInterface />
            ) : promise ? (
                <ResultInterface
                    promise={promise}
                    showResult={showResult}
                    handleReset={handleReset}
                    copyToClipboard={copyToClipboard}
                />
            ) : (
                <InitialInterface
                    categories={categories}
                    handleCategoryClick={handleCategoryClick}
                />
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Box>
    );
};

export default PromiseNewPage;
