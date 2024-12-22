import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table } from 'antd';
import { CSVLink } from 'react-csv';

import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, LuckyNumber } from '@/types/luckyNumber';
import {
    getLuckyNumberStatusLabel,
    LUCKY_NUMBER_STATUS,
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
        getActivityInfo,
        getAllParticipations,
    } = useLuckyNumber();
    const [numbers, setNumbers] = useState<LuckyNumber[]>([]);
    const [activityKey, setActivityKey] = useState<string>('');
    const [error, setError] = useState<Error | null>(null);
    const [pagination, setPagination] = useState<{
        current: number;
        pageSize: number;
        total: number;
    }>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [csvData, setCSVData] = useState<
        Array<{
            drawn_number: number;
            username: string;
            created_at: string;
        }>
    >([]);

    const fetchActivity = async (page = 1, pageSize = 10) => {
        if (!key) return;
        try {
            const data = await queryActivity(key, page, pageSize);
            setActivityKey(key);
            setNumbers(data.list);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: data.pagination.total,
            });

            const allData = await getAllParticipations(key);
            const exportData = allData.map(record => ({
                drawn_number: record.drawn_number,
                username: record.username || '-',
                created_at: record.created_at
                    ? new Date(record.created_at).toLocaleString('zh-CN')
                    : '-',
            }));
            setCSVData(exportData);
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    };

    const fetchActivityInfo = async () => {
        if (!key) return;
        try {
            const data = await getActivityInfo(key);
            setActivityInfo(data);
            setActivityKey(data.activity_key);
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
        fetchActivityInfo();
        fetchActivity(1, pagination.pageSize);
    }, [key]);

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
            dataIndex: 'created_at',
            key: 'created_at',
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
                title={`活动详情 - ${activityInfo?.activity_key}`}
                loading={loading}
                className="mb-6"
                extra={
                    <Space>
                        <CSVLink
                            data={csvData}
                            headers={[
                                { label: '号码', key: 'drawn_number' },
                                { label: '抽取人', key: 'username' },
                                { label: '抽取时间', key: 'created_at' },
                            ]}
                            filename={`幸运号码-${activityInfo?.name || '未命名'}-${new Date().toLocaleDateString('zh-CN')}.csv`}
                            className="ant-btn ant-btn-primary"
                            onClick={event => {
                                if (csvData.length === 0) {
                                    event.preventDefault();
                                    message.warning('没有数据可导出');
                                }
                            }}
                        >
                            <Space>
                                <DownloadOutlined />
                                导出列表
                            </Space>
                        </CSVLink>
                        {activityInfo?.status ===
                            LUCKY_NUMBER_STATUS.NOT_STARTED && (
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
                        )}
                    </Space>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">活动名称：</p>
                        <p>{activityInfo?.name || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">活动描述：</p>
                        <p>{activityInfo?.description || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">总号码数量：</p>
                        <p>{activityInfo?.count || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">访问链接：</p>
                        <p>
                            {activityInfo?.activity_key ? (
                                <Link
                                    className="text-blue-500 hover:text-blue-700"
                                    to={`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityInfo.activity_key}/activity`}
                                    target="_blank"
                                >
                                    {`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityInfo.activity_key}/activity`}
                                </Link>
                            ) : (
                                '-'
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold">活动状态：</p>
                        <Space>
                            <span>
                                {getLuckyNumberStatusLabel(
                                    activityInfo?.status,
                                )}
                            </span>
                            {activityInfo?.status ===
                                LUCKY_NUMBER_STATUS.NOT_STARTED && (
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
                            {activityInfo?.status ===
                                LUCKY_NUMBER_STATUS.ONGOING && (
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
                        <p className="font-bold">参与限制：</p>
                        <p>
                            {activityInfo?.participant_limit
                                ? `限制 ${activityInfo.participant_limit} 人参与`
                                : '不限制参与人数'}
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
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    onChange: (page, pageSize) => {
                        fetchActivity(page, pageSize);
                    },
                }}
            />
        </div>
    );
};

export default LuckyNumberDetail;
