import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, message, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';

import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { Pagination } from '@/types';
import type { LuckyNumberActivity } from '@/types/luckyNumber';
import { LUCKY_NUMBER_STATUS } from '@/utils/constants';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const LuckyNumberList = () => {
    const navigate = useNavigate();
    const { getActivityList, deleteActivity, loading, updateActivityStatus } =
        useLuckyNumber();
    const [activities, setActivities] = useState<LuckyNumberActivity[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        count: 0,
        size: 0,
        total: 0,
    });
    const [error, setError] = useState<Error | null>(null);

    const fetchActivities = async () => {
        try {
            const data = await getActivityList(1, 10);
            setActivities(data.list);
            setPagination(data.pagination);
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handleDelete = async (key: string) => {
        try {
            await deleteActivity(key);
            message.success('删除成功');
            fetchActivities();
        } catch {
            message.error('删除失败');
        }
    };

    const handleUpdateStatus = async (key: string, status: string) => {
        try {
            await updateActivityStatus(key, status);
            message.success('状态更新成功');
            fetchActivities();
        } catch {
            message.error('状态更新失败');
        }
    };

    const columns = [
        {
            title: '活动标识',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusMap = {
                    not_started: <span className="text-gray-500">未开始</span>,
                    ongoing: <span className="text-green-500">进行中</span>,
                    ended: <span className="text-red-500">已结束</span>,
                };
                return statusMap[status as keyof typeof statusMap];
            },
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: LuckyNumberActivity) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => navigate(`/lucky-number/${record.key}`)}
                    >
                        查看详情
                    </Button>
                    {record.status === LUCKY_NUMBER_STATUS.NOT_STARTED && (
                        <Popconfirm
                            title="确认开始"
                            description="确定要开始这个活动吗？"
                            onConfirm={() =>
                                handleUpdateStatus(
                                    record.key,
                                    LUCKY_NUMBER_STATUS.ONGOING,
                                )
                            }
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link">开始活动</Button>
                        </Popconfirm>
                    )}
                    {record.status === LUCKY_NUMBER_STATUS.ONGOING && (
                        <Popconfirm
                            title="确认结束"
                            description="确定要结束这个活动吗？结束后将无法继续抽取"
                            onConfirm={() =>
                                handleUpdateStatus(
                                    record.key,
                                    LUCKY_NUMBER_STATUS.ENDED,
                                )
                            }
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" danger>
                                结束活动
                            </Button>
                        </Popconfirm>
                    )}
                    {record.status === LUCKY_NUMBER_STATUS.NOT_STARTED && (
                        <Popconfirm
                            title="确认删除"
                            description="确定要删除这个活动吗？删除后无法恢复"
                            onConfirm={() => handleDelete(record.key)}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="link" danger>
                                删除
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">幸运号码活动列表</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/lucky-number/create')}
                >
                    创建新活动
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={activities}
                rowKey="id"
                loading={loading}
                pagination={{
                    total: pagination.total,
                    current: pagination.count,
                    pageSize: pagination.size,
                }}
            />
        </div>
    );
};

export default LuckyNumberList;
