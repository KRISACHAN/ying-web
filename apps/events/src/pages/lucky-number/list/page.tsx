import './page.css';

import {
    Alert,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useInterval } from 'usehooks-ts';
import { useHeader } from '@/contexts/header-context';
import { useLuckyNumber } from '@/hooks/use-lucky-number';
import NotFoundPage from '@/pages/404/page';
import type { QueryLuckyNumberResponse } from '@/types/lucky-number';

import HeaderInterface from '../components/header';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const TableCoreInterface: React.FC<{
    activityInfo: QueryLuckyNumberResponse;
}> = ({ activityInfo }) => {
    return activityInfo.numbers.map(luckyNumber => (
        <TableRow key={luckyNumber.drawn_number}>
            <TableCell className="text-gray-700">
                {luckyNumber.drawn_number}
            </TableCell>
            <TableCell className="text-gray-700">
                {luckyNumber.is_drawn ? '是' : '否'}
            </TableCell>
            <TableCell className="text-gray-700">
                {luckyNumber.user_name || '暂未抽取'}
            </TableCell>
        </TableRow>
    ));
};

const TableSkeleton: React.FC = () => {
    return Array.from(new Array(5)).map((_, index) => (
        <TableRow key={index}>
            <TableCell>
                <Skeleton />
            </TableCell>
        </TableRow>
    ));
};

const TableInterface: React.FC<{
    activityInfo: QueryLuckyNumberResponse | null;
}> = ({ activityInfo }) => {
    return (
        <TableContainer
            component={Paper}
            className="max-w-2xl w-full mt-5 shadow-lg rounded-lg overflow-hidden"
        >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell className="bg-blue-500 text-white font-bold table-header">
                            号码
                        </TableCell>
                        <TableCell className="bg-blue-500 text-white font-bold table-header">
                            是否已经被抽取
                        </TableCell>
                        <TableCell className="bg-blue-500 text-white font-bold table-header">
                            抽取人
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activityInfo ? (
                        <TableCoreInterface activityInfo={activityInfo} />
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
            sx={{
                minHeight: '100vh',
                width: '100%',
                px: { xs: 2, sm: 4 },
                py: { xs: 2, sm: 4 },
                background:
                    'linear-gradient(135deg, #EBF5FF 0%, #F0F7FF 50%, #E6F3FF 100%)',
            }}
            className="lucky-number-list-page"
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
