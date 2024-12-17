import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { DoNotDisturbOutlined } from '@mui/icons-material';
import {
    Alert,
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { useInterval } from 'usehooks-ts';

import HeaderInterface from '@/components/Header/Index';
import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';

import { luckyNumberTheme } from '../styles/index';

const ErrorInterface: React.FC<{ message?: string }> = ({
    message = '活动不存在或已结束',
}) => {
    return <NotFoundPage name={message} description="回到首页看看其它功能？" />;
};

const headerCellStyle = {
    background: luckyNumberTheme.colors.background.primary,
    color: luckyNumberTheme.colors.text.primary,
    fontWeight: 'bold',
    borderBottom: `0px solid ${luckyNumberTheme.colors.border.primary}`,
    '&:first-of-type': {
        borderTopLeftRadius: 12,
    },
    '&:last-of-type': {
        borderTopRightRadius: 12,
    },
};

const TableInterface: React.FC<{
    activityInfo: QueryLuckyNumberResponse | null;
}> = ({ activityInfo }) => {
    if (!activityInfo) return null;

    const isEmpty = activityInfo.participations.length === 0;

    const EmptyInterface: React.FC = () => (
        <TableRow>
            <TableCell colSpan={12}>
                <Typography
                    variant="body1"
                    color={luckyNumberTheme.colors.text.primary}
                    className="flex items-center gap-2"
                >
                    <DoNotDisturbOutlined />
                    暂无参与者
                </Typography>
            </TableCell>
        </TableRow>
    );

    const ExistingInterface: React.FC = () => (
        <>
            {activityInfo.participations.map((record, index) => (
                <TableRow key={index}>
                    <TableCell align="center" colSpan={4}>
                        {record.username}
                    </TableCell>
                    <TableCell align="center" colSpan={4}>
                        {record.drawn_number}
                    </TableCell>
                    <TableCell align="center" colSpan={4}>
                        {new Date(record.drawn_at).toLocaleString('zh-CN')}
                    </TableCell>
                </TableRow>
            ))}
        </>
    );

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxWidth: '1024px',
                width: '100%',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: `0 4px 16px ${luckyNumberTheme.colors.background.overlay}`,
                background: luckyNumberTheme.colors.background.paper,
            }}
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            参与者
                        </TableCell>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            号码
                        </TableCell>
                        <TableCell
                            align="center"
                            colSpan={4}
                            sx={headerCellStyle}
                        >
                            抽取时间
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {isEmpty ? <EmptyInterface /> : <ExistingInterface />}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const LuckyNumberListPage: React.FC = () => {
    const { activityKey } = useParams();
    const { queryActivityInfo } = useLuckyNumber();
    const [activityInfo, setActivityInfo] =
        useState<QueryLuckyNumberResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const headerContext = useHeader();

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

    useEffect(() => {
        if (!activityKey || !!error) return;
        fetchActivityInfo();
    }, [activityKey]);

    useInterval(
        () => {
            fetchActivityInfo();
        },
        !activityKey || !!error ? null : 2000,
    );

    const errorMessage = error?.toString?.();
    const is404Error = errorMessage?.includes('404');
    const is400Error = errorMessage?.includes('400');
    const isNotStartedError = errorMessage?.includes('未开始');
    const isEndedError = errorMessage?.includes('已结束');

    if (is404Error) {
        return <ErrorInterface />;
    }

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
                {error ? (
                    <Alert severity="error">获取活动数据失败，请稍后再试</Alert>
                ) : (
                    <TableInterface activityInfo={activityInfo} />
                )}
            </Box>
        </Box>
    );
};

export default LuckyNumberListPage;
