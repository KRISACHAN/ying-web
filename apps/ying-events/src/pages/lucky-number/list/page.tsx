import React, { useState } from 'react';
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
} from '@mui/material';
import { useInterval } from 'usehooks-ts';
import type { QueryLuckyNumberResponse } from '../../../types/lucky-number';
import './page.css';
import NotFoundPage from '../../404/page';
import { CalendarCheck } from 'lucide-react';

const LuckyNumberListPage: React.FC = () => {
    const { activityKey } = useParams();
    const [activityData, setActivityData] =
        useState<QueryLuckyNumberResponse | null>(null);
    const [error, setError] = useState(false);

    const fetchActivityData = async () => {
        try {
            const response = await axiosInstance.get<QueryLuckyNumberResponse>(
                `/lucky-number/query/${activityKey}`,
            );
            setActivityData(response.data);
            setError(false);
        } catch (err) {
            setError(true);
        }
    };

    useInterval(() => {
        fetchActivityData();
    }, 3000);

    if (error) {
        return (
            <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />
        );
    }

    return (
        <div className="lucky-number-list-page w-full flex flex-col items-center">
            <h1 className="text-4xl mb-5 text-gray-800 flex items-center gap-2">
                <CalendarCheck className="w-9 h-9 text-blue-500" />
                {activityKey}
            </h1>
            <p className="text-gray-600">{activityData?.description}</p>
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
                        {activityData
                            ? activityData.numbers.map(luckyNumber => (
                                  <TableRow key={luckyNumber.number}>
                                      <TableCell className="text-gray-700">
                                          {luckyNumber.number}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                          {luckyNumber.is_drawn ? '是' : '否'}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                          {luckyNumber.drawn_by || '暂未抽取'}
                                      </TableCell>
                                  </TableRow>
                              ))
                            : Array.from(new Array(5)).map((_, index) => (
                                  <TableRow key={index}>
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
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default LuckyNumberListPage;
