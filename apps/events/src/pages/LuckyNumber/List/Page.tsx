import './page.less';

import {
    Alert,
    Box,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInterval } from 'usehooks-ts';

import { useHeader } from '@/contexts/HeaderContext';
import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { QueryLuckyNumberResponse } from '@/types/luckyNumber';

import { luckyNumberTheme } from '@/theme/luckyNumber';
import HeaderInterface from '../components/Header/Index';
const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const TableSkeleton: React.FC = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`skeleton-row-${index}`}>
                    <TableCell>
                        <Skeleton />
                    </TableCell>
                    <TableCell>
                        <Skeleton />
                    </TableCell>
                    <TableCell>
                        <Skeleton />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};

const TableInterface: React.FC<{
    activityInfo: QueryLuckyNumberResponse | null;
}> = ({ activityInfo }) => {
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
                            sx={{
                                background:
                                    luckyNumberTheme.colors.background.primary,
                                color: luckyNumberTheme.colors.text.primary,
                                fontWeight: 'bold',
                                borderBottom: `0px solid ${luckyNumberTheme.colors.border.primary}`,
                                transition: 'background-color 0.2s ease',
                                '&:first-of-type': {
                                    borderTopLeftRadius: 12,
                                },
                                '&:last-child': {
                                    borderTopRightRadius: 12,
                                },
                            }}
                        >
                            号码
                        </TableCell>
                        <TableCell
                            sx={{
                                background:
                                    luckyNumberTheme.colors.background.primary,
                                color: luckyNumberTheme.colors.text.primary,
                                fontWeight: 'bold',
                                borderBottom: `0px solid ${luckyNumberTheme.colors.border.primary}`,
                                transition: 'background-color 0.2s ease',
                            }}
                        >
                            是否已经被抽取
                        </TableCell>
                        <TableCell
                            sx={{
                                background:
                                    luckyNumberTheme.colors.background.primary,
                                color: luckyNumberTheme.colors.text.primary,
                                fontWeight: 'bold',
                                borderBottom: `0px solid ${luckyNumberTheme.colors.border.primary}`,
                                transition: 'background-color 0.2s ease',
                            }}
                        >
                            抽取人
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activityInfo ? (
                        activityInfo.numbers.map((luckyNumber, index) => (
                            <TableRow
                                key={`number-${luckyNumber.drawn_number}-${index}`}
                                sx={{
                                    '&:hover': {
                                        backgroundColor:
                                            luckyNumberTheme.colors.background
                                                .overlay,
                                    },
                                }}
                            >
                                <TableCell
                                    sx={{
                                        color: luckyNumberTheme.colors.text
                                            .primary,
                                        fontWeight: 500,
                                    }}
                                >
                                    {luckyNumber.drawn_number}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: luckyNumber.is_drawn
                                            ? luckyNumberTheme.colors.state
                                                  .success
                                            : luckyNumberTheme.colors.text
                                                  .secondary,
                                    }}
                                >
                                    {luckyNumber.is_drawn ? '是' : '否'}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        color: luckyNumber.user_name
                                            ? luckyNumberTheme.colors.text
                                                  .primary
                                            : luckyNumberTheme.colors.text
                                                  .disabled,
                                        fontStyle: luckyNumber.user_name
                                            ? 'normal'
                                            : 'italic',
                                    }}
                                >
                                    {luckyNumber.user_name || '暂未抽取'}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableSkeleton />
                    )}
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
        } catch (error) {
            setError(error as Error);
        }
    };

    useEffect(() => {
        if (!activityKey) {
            return;
        }
        fetchActivityInfo();
    }, []);

    useInterval(() => {
        fetchActivityInfo();
    }, 2000);

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
