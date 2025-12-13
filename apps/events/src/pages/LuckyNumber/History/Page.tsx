import {
    ArrowBack,
    DeleteOutline,
    DoNotDisturbOutlined,
    History as HistoryIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Chip,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import NewYearBackground from '@/components/NewYearBackground';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';

import { themeColors } from '@/theme';

type GetActivityResponse = Pick<
    QueryLuckyNumberResponse,
    'activity_key' | 'name' | 'description'
>;

type LuckyNumberResult = {
    number: number;
    name: string;
    timestamp: number;
};

const headerCellStyle = {
    background: themeColors.background.primary,
    color: themeColors.text.primary,
    fontWeight: 'bold',
    borderBottom: 'none',
    '&:first-of-type': {
        borderTopLeftRadius: 12,
    },
    '&:last-of-type': {
        borderTopRightRadius: 12,
    },
};

const LuckyNumberHistoryPage: React.FC = () => {
    const { activityKey } = useParams<{ activityKey: string }>();
    const navigate = useNavigate();
    const { queryActivityInfo } = useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<GetActivityResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const headerContext = useHeader();

    const localResultsKey = `YING_EVENTS_LUCKY_NUMBER_RESULTS_${activityKey}`;
    const [luckyNumberResults, setLuckyNumberResults] = useLocalStorage<
        LuckyNumberResult[]
    >(localResultsKey, []);

    const fetchActivityInfo = async () => {
        try {
            const data = await queryActivityInfo(activityKey);
            setActivityInfo(data);
            headerContext.setHeaderInfo({
                title: `${data.name} - 抽取记录`,
                description: `查看 ${data.name} 的本地抽取历史记录`,
                keywords: `${data.activity_key}, 历史记录`,
            });
        } catch (err) {
            setError(err as Error);
        }
    };

    useEffect(() => {
        if (!activityKey) {
            return;
        }
        fetchActivityInfo();
    }, [activityKey]);

    const handleClearHistory = () => {
        if (window.confirm('确定要清空所有历史记录吗？此操作无法撤销。')) {
            setLuckyNumberResults([]);
        }
    };

    const handleGoBack = () => {
        navigate(`/lucky-number/${activityKey}/activity`);
    };

    const formatDateTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');

    if (is404Error) {
        return (
            <NotFoundPage
                name="活动不存在"
                description="回到首页看看其它功能？"
            />
        );
    }

    const isEmpty = luckyNumberResults.length === 0;

    return (
        <Box
            className="min-h-screen w-full relative"
            sx={{
                p: { xs: 2, sm: 4 },
            }}
        >
            <NewYearBackground showStars={true} showParticles={true} />
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                }}
            >
                <HeaderInterface
                    description={activityInfo?.description || ''}
                    name={activityInfo?.name || ''}
                />

                {/* Action Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '1024px',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Button
                        variant="contained"
                        startIcon={<ArrowBack />}
                        onClick={handleGoBack}
                        sx={{
                            borderRadius: 2,
                            backgroundColor: themeColors.background.paper,
                            color: themeColors.primary.main,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: themeColors.background.primary,
                            },
                        }}
                    >
                        返回活动
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                            icon={<HistoryIcon />}
                            label={`共 ${luckyNumberResults.length} 条记录`}
                            sx={{
                                backgroundColor: themeColors.background.paper,
                                color: themeColors.primary.main,
                                fontWeight: 'bold',
                                '& .MuiChip-icon': {
                                    color: themeColors.primary.main,
                                },
                            }}
                        />

                        {!isEmpty && (
                            <Button
                                variant="outlined"
                                startIcon={<DeleteOutline />}
                                onClick={handleClearHistory}
                                sx={{
                                    borderColor: themeColors.background.paper,
                                    color: themeColors.background.paper,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        borderColor:
                                            themeColors.background.primary,
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                清空记录
                            </Button>
                        )}
                    </Box>
                </Box>

                {/* Content */}
                {error && !is404Error ? (
                    <Alert
                        severity="error"
                        sx={{ width: '100%', maxWidth: '1024px' }}
                    >
                        获取活动信息失败，但可以查看本地历史记录
                    </Alert>
                ) : null}

                {isEmpty ? (
                    <Paper
                        sx={{
                            maxWidth: '1024px',
                            width: '100%',
                            p: 6,
                            borderRadius: 3,
                            textAlign: 'center',
                            background: themeColors.background.paper,
                            boxShadow: `0 4px 16px ${themeColors.background.overlay}`,
                        }}
                    >
                        <DoNotDisturbOutlined
                            sx={{
                                fontSize: 64,
                                color: themeColors.text.disabled,
                                mb: 2,
                            }}
                        />
                        <Typography
                            variant="h6"
                            className="text-primary"
                            sx={{ mb: 1 }}
                        >
                            暂无抽取记录
                        </Typography>
                        <Typography variant="body2" className="text-secondary">
                            去活动页面抽取一个幸运号码吧！
                        </Typography>
                    </Paper>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            maxWidth: '1024px',
                            width: '100%',
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: `0 4px 16px ${themeColors.background.overlay}`,
                            background: themeColors.background.paper,
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        sx={headerCellStyle}
                                    >
                                        序号
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={headerCellStyle}
                                    >
                                        抽取人
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={headerCellStyle}
                                    >
                                        幸运号码
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={headerCellStyle}
                                    >
                                        抽取时间
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {luckyNumberResults.map((result, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            '&:nth-of-type(odd)': {
                                                backgroundColor:
                                                    themeColors.background
                                                        .overlay,
                                            },
                                            '&:hover': {
                                                backgroundColor:
                                                    themeColors.background
                                                        .primary,
                                            },
                                        }}
                                    >
                                        <TableCell align="center">
                                            <Chip
                                                label={index + 1}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        themeColors.primary
                                                            .main,
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    minWidth: 32,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: themeColors.text
                                                        .primary,
                                                    fontWeight: 'medium',
                                                }}
                                            >
                                                {result.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: themeColors.text
                                                        .primary,
                                                    fontWeight: 'medium',
                                                }}
                                            >
                                                {result.number}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: themeColors.text
                                                        .secondary,
                                                }}
                                            >
                                                {formatDateTime(
                                                    result.timestamp,
                                                )}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>
    );
};

export default LuckyNumberHistoryPage;
