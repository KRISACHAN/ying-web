import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../services/axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Skeleton,
    Alert,
} from '@mui/material';
import { CalendarCheck } from 'lucide-react';
import { useInterval } from 'usehooks-ts';
import './page.css';
import NotFoundPage from '../../404/page';
import type { QueryLuckyNumberResponse } from '../../../types/lucky-number';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const TableCoreInterface: React.FC<{
    activityData: QueryLuckyNumberResponse;
}> = ({ activityData }) => {
    return activityData.numbers.map(luckyNumber => (
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
    activityData: QueryLuckyNumberResponse | null;
}> = ({ activityData }) => {
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
                    {activityData ? (
                        <TableCoreInterface activityData={activityData} />
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
    const [activityData, setActivityData] =
        useState<QueryLuckyNumberResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const fetchActivityData = async () => {
        try {
            const response = await axiosInstance.get<QueryLuckyNumberResponse>(
                `/lucky-number/query/${activityKey}`,
            );
            setActivityData(response.data);
            setError(null);
        } catch (error) {
            setError(error as Error);
        }
    };

    useEffect(() => {
        fetchActivityData();
    }, []);

    useInterval(() => {
        fetchActivityData();
    }, 1000);

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    return (
        <div className="lucky-number-list-page w-full flex flex-col items-center">
            <h1 className="text-4xl mb-5 text-gray-800 flex items-center gap-2">
                <CalendarCheck className="w-9 h-9 text-blue-500" />
                {activityKey}
            </h1>
            <p className="text-gray-600">{activityData?.description}</p>
            {error ? (
                <Alert severity="error">获取活动数据失败，请稍后再试</Alert>
            ) : (
                <TableInterface activityData={activityData} />
            )}
        </div>
    );
};

export default LuckyNumberListPage;
