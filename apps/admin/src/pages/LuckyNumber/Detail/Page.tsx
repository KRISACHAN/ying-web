import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button, Card, message, Popconfirm, Space, Table } from 'antd';

import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { LuckyNumber } from '@/types/luckyNumber';
import {
    getLuckyNumberStatusLabel,
    LUCKY_NUMBER_STATUS,
    LuckyNumberStatus,
} from '@/utils/constants';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const LuckyNumberDetail = () => {
    const { key } = useParams<{ key: string }>();
    const navigate = useNavigate();
    const {
        queryActivity,
        loading,
        cancelParticipation,
        updateActivityStatus,
        deleteActivity,
    } = useLuckyNumber();
    const [numbers, setNumbers] = useState<LuckyNumber[]>([]);
    const [activityKey, setActivityKey] = useState<string>('');
    const [activityName, setActivityName] = useState<string>('');
    const [activityDescription, setActivityDescription] = useState<string>('');
    const [error, setError] = useState<Error | null>(null);
    const [status, setStatus] = useState<LuckyNumberStatus>(
        LUCKY_NUMBER_STATUS.NOT_STARTED,
    );
    const [statistics, setStatistics] = useState<{
        total_participants: number;
        remaining_slots: number | null;
    }>({
        total_participants: 0,
        remaining_slots: null,
    });

    const fetchActivity = async () => {
        if (!key) return;
        try {
            const data = await queryActivity(key);
            setActivityKey(data.activity_key);
            setActivityName(data.name);
            setActivityDescription(data.description);
            setStatus(data.status);
            const allNumbers = [
                ...(data.participations || []).map(p => ({
                    drawn_number: p.drawn_number,
                    username: p.username,
                    drawn_at: p.drawn_at,
                })),
            ];
            setNumbers(allNumbers);
            setStatistics(
                data.statistics || {
                    total_participants: 0,
                    remaining_slots: null,
                },
            );
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    };

    const handleCancel = async (record: LuckyNumber) => {
        return cancelParticipation({
            key: activityKey,
            drawn_number: record.drawn_number,
            username: record.username || '',
        }).finally(() => {
            fetchActivity();
        });
    };

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            await updateActivityStatus(activityKey, newStatus);
            message.success('状态更新成功');
            fetchActivity();
        } catch {
            message.error('状态更新失败');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteActivity(activityKey!);
            message.success('活动删除成功');
            navigate('/lucky-number');
        } catch (err) {
            message.error('删除失败，请稍后重试');
            console.error('Delete activity error:', err);
        }
    };

    useEffect(() => {
        fetchActivity();
    }, [key, queryActivity]);

    const columns = [
        {
            title: '号码',
            dataIndex: 'drawn_number',
            key: 'drawn_number',
        },
        {
            title: '抽取人',
            dataIndex: 'username',
            key: 'username',
            render: (text: string | null) => text || '-',
        },
        {
            title: '抽取时间',
            dataIndex: 'drawn_at',
            key: 'drawn_at',
            render: (text: string | null) =>
                text ? new Date(text).toLocaleString('zh-CN') : '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: LuckyNumber) =>
                record.username ? (
                    <Popconfirm
                        title="确认取消"
                        description="确定要取消该用户的抽取记录吗？"
                        onConfirm={() => handleCancel(record)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>
                            取消抽取
                        </Button>
                    </Popconfirm>
                ) : null,
        },
    ];

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    return (
        <div className="p-6">
            <Card
                title={`活动详情 - ${activityKey}`}
                loading={loading}
                className="mb-6"
                extra={
                    status === LUCKY_NUMBER_STATUS.NOT_STARTED && (
                        <Popconfirm
                            title="确认删除"
                            description="确定要删除这个活动吗？删除后无法恢复"
                            onConfirm={handleDelete}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button type="primary" danger>
                                删除活动
                            </Button>
                        </Popconfirm>
                    )
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">活动名称：</p>
                        <p>{activityName || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">活动描述：</p>
                        <p>{activityDescription || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">总号码数量：</p>
                        <p>{Array.isArray(numbers) ? numbers.length : 0}</p>
                    </div>
                    <div>
                        <p className="font-bold">访问链接：</p>
                        <p>
                            {activityKey ? (
                                <Link
                                    className="text-blue-500 hover:text-blue-700"
                                    to={`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityKey}/activity`}
                                    target="_blank"
                                >
                                    {`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityKey}/activity`}
                                </Link>
                            ) : (
                                '-'
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold">活动状态：</p>
                        <Space>
                            <span>{getLuckyNumberStatusLabel(status)}</span>
                            {status === LUCKY_NUMBER_STATUS.NOT_STARTED && (
                                <Popconfirm
                                    title="确认开始"
                                    description="确定要开始这个活动吗？"
                                    onConfirm={() =>
                                        handleUpdateStatus(
                                            LUCKY_NUMBER_STATUS.ONGOING,
                                        )
                                    }
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="primary" size="small">
                                        开始活动
                                    </Button>
                                </Popconfirm>
                            )}
                            {status === LUCKY_NUMBER_STATUS.ONGOING && (
                                <Popconfirm
                                    title="确认结束"
                                    description="确定要结束这个活动吗？结束后将无法继续抽取"
                                    onConfirm={() =>
                                        handleUpdateStatus(
                                            LUCKY_NUMBER_STATUS.ENDED,
                                        )
                                    }
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type="primary" danger size="small">
                                        结束活动
                                    </Button>
                                </Popconfirm>
                            )}
                        </Space>
                    </div>
                    <div>
                        <p className="font-bold">参与情况：</p>
                        <p>
                            已参与人数：{statistics.total_participants}
                            {statistics.remaining_slots !== null && (
                                <>，剩余名额：{statistics.remaining_slots}</>
                            )}
                        </p>
                    </div>
                </div>
            </Card>

            <Table
                columns={columns}
                dataSource={numbers}
                rowKey={record =>
                    `${record.drawn_number}_${record.username || 'empty'}`
                }
                loading={loading}
                pagination={{
                    pageSize: 50,
                }}
            />
        </div>
    );
};

export default LuckyNumberDetail;
