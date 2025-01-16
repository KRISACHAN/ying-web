import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table, Tag } from 'antd';
import React, { type MouseEventHandler, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useOptionDraw } from '@/hooks/useOptionDraw';
import NotFoundPage from '@/pages/404/Page';
import type { ActivityInfo, OptionDraw } from '@/types/optionDraw';
import {
    getOptionDrawStatusLabel,
    OPTION_DRAW_STATUS,
} from '@/utils/constants';
import { eq } from 'lodash';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const OptionDrawDetail = () => {
    const { key } = useParams<{ key: string }>();
    const navigate = useNavigate();
    const {
        queryActivity,
        loading,
        error,
        cancelParticipation,
        updateActivityStatus,
        deleteActivity,
        getActivityDetail,
        getAllParticipations,
    } = useOptionDraw();
    const [participations, setParticipations] = useState<OptionDraw[]>([]);
    const [activityKey, setActivityKey] = useState<string>('');
    const [activityInfo, setActivityInfo] = useState<ActivityInfo | null>(null);
    const [pagination, setPagination] = useState<{
        current: number;
        pageSize: number;
        total: number;
    }>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [csvData, setCSVData] = useState<
        Array<{
            drawn_option: string;
            username: string;
            created_at: string;
        }>
    >([]);

    const fetchActivity = async (page = 1, pageSize = 10) => {
        if (!key) return;
        try {
            const data = await queryActivity(key, page, pageSize);
            setActivityKey(key);
            setParticipations(data.list);
            setPagination({
                current: page,
                pageSize: pageSize,
                total: data.pagination.total,
            });

            const allData = await getAllParticipations(key);
            const exportData = allData.map(record => ({
                drawn_option: record.drawn_option || '-',
                username: record.username || '-',
                created_at: record.created_at
                    ? new Date(record.created_at).toLocaleString('zh-CN')
                    : '-',
            }));
            setCSVData(exportData);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchActivityInfo = async () => {
        if (!key) return;
        try {
            const data = await getActivityDetail(key);
            setActivityInfo(data);
            setActivityKey(data.activity_key);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchActivity();
        fetchActivityInfo();
    }, [key]);

    const handleCancel = async (record: OptionDraw) => {
        if (!record.username) return;
        try {
            await cancelParticipation({
                key: activityKey,
                username: record.username,
            });
            message.success('取消参与成功');
            fetchActivity(pagination.current, pagination.pageSize);
        } catch {
            message.error('取消参与失败');
        }
    };

    const handleUpdateStatus = async (newStatus: string) => {
        try {
            await updateActivityStatus(activityKey, newStatus);
            message.success('状态更新成功');
            fetchActivity();
            fetchActivityInfo();
        } catch {
            message.error('状态更新失败');
        }
    };

    const handleDelete = async () => {
        try {
            if (!key) return;
            await deleteActivity(key);
            message.success('活动删除成功');
            navigate('/option-draw');
        } catch {
            message.error('删除失败');
        }
    };

    if (error?.toString?.()?.includes('404')) {
        return <ErrorInterface />;
    }

    const columns = [
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '抽取选项',
            dataIndex: 'drawn_option',
            key: 'drawn_option',
        },
        {
            title: '参与时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: string) =>
                text ? new Date(text).toLocaleString('zh-CN') : '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: unknown, record: OptionDraw) => (
                <Space>
                    {record.username && (
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
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={`活动详情 - ${activityInfo?.activity_key || ''}`}
                loading={loading}
                className="mb-6"
                extra={
                    <Space>
                        <CSVLink
                            data={csvData}
                            headers={[
                                { label: '选项', key: 'drawn_option' },
                                { label: '抽取人', key: 'username' },
                                { label: '抽取时间', key: 'created_at' },
                            ]}
                            filename={`选项抽取-${
                                activityInfo?.name || '未命名'
                            }-${new Date().toLocaleDateString('zh-CN')}.csv`}
                            className="ant-btn ant-btn-primary"
                            onClick={(
                                event: MouseEventHandler<HTMLAnchorElement>,
                            ) => {
                                if (!csvData.length) {
                                    // @ts-ignore
                                    event?.preventDefault?.();
                                    message.warning('没有数据可导出');
                                }
                            }}
                        >
                            <Space>
                                <DownloadOutlined />
                                导出列表
                            </Space>
                        </CSVLink>
                        {eq(
                            activityInfo?.status,
                            OPTION_DRAW_STATUS.NOT_STARTED,
                        ) && (
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
                        <p className="font-bold">选项数量：</p>
                        <p>{activityInfo?.count || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">访问链接：</p>
                        <p>
                            {activityInfo?.activity_key ? (
                                <Link
                                    className="text-blue-500 hover:text-blue-700"
                                    to={`${import.meta.env.VITE_EVENTS_BASE_URL}/option-draw/${activityInfo.activity_key}/activity`}
                                    target="_blank"
                                >
                                    {`${import.meta.env.VITE_EVENTS_BASE_URL}/option-draw/${activityInfo.activity_key}/activity`}
                                </Link>
                            ) : (
                                '-'
                            )}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold">活动状态：</p>
                        <Space>
                            <Tag
                                color={
                                    eq(
                                        activityInfo?.status,
                                        OPTION_DRAW_STATUS.NOT_STARTED,
                                    )
                                        ? 'default'
                                        : eq(
                                                activityInfo?.status,
                                                OPTION_DRAW_STATUS.ONGOING,
                                            )
                                          ? 'processing'
                                          : 'error'
                                }
                            >
                                {getOptionDrawStatusLabel(activityInfo?.status)}
                            </Tag>
                            {eq(
                                activityInfo?.status,
                                OPTION_DRAW_STATUS.NOT_STARTED,
                            ) && (
                                <Popconfirm
                                    title="确认开始"
                                    description="确定要开始这个活动吗？"
                                    onConfirm={() =>
                                        handleUpdateStatus(
                                            OPTION_DRAW_STATUS.ONGOING,
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
                            {eq(
                                activityInfo?.status,
                                OPTION_DRAW_STATUS.ONGOING,
                            ) && (
                                <Popconfirm
                                    title="确认结束"
                                    description="确定要结束这个活动吗？结束后将无法继续抽取"
                                    onConfirm={() =>
                                        handleUpdateStatus(
                                            OPTION_DRAW_STATUS.ENDED,
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
                    <div>
                        <p className="font-bold">允许重复选项：</p>
                        <p>
                            {activityInfo?.allow_duplicate_options
                                ? '是'
                                : '否'}
                        </p>
                    </div>
                </div>
            </Card>

            <Card title="选项列表" className="mb-6">
                <div className="flex flex-wrap gap-2">
                    {activityInfo?.options.map(option => (
                        <Tag key={option}>{option}</Tag>
                    ))}
                </div>
            </Card>

            <Card title="参与记录">
                <Table
                    columns={columns}
                    dataSource={participations}
                    rowKey={record =>
                        `${record.drawn_option}_${record.username || 'empty'}`
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
            </Card>
        </div>
    );
};

export default OptionDrawDetail;
