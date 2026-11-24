import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table, Tag } from 'antd';
import { eq } from 'lodash';

import { useLuckyNumber } from '@/hooks/useLuckyNumber';
import NotFoundPage from '@/pages/404/Page';
import {
    getEventAccess,
    getParticipationCsv,
} from '@/services/luckyNumberData';
import type { ActivityInfo, LuckyNumber } from '@/types/luckyNumber';
import {
    getLuckyNumberStatusLabel,
    LUCKY_NUMBER_STATUS,
} from '@/utils/constants';

import ImportNumberDataModal from './ImportNumberDataModal';
import ParticipationNumberDataModal from './ParticipationNumberDataModal';

const ErrorInterface: React.FC = () => {
    return <NotFoundPage title="活动不存在" message="回到首页看看其它功能？" />;
};

const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
};

const LuckyNumberDetail = ({
    activityRouteKey: key,
}: {
    activityRouteKey?: string;
}) => {
    const navigate = useNavigate();
    const {
        queryActivity,
        loading,
        cancelParticipation,
        updateActivityStatus,
        deleteActivity,
        getActivityInfo,
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
    const [importOpen, setImportOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<LuckyNumber>();
    const [exporting, setExporting] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const listRequest = useRef(0);
    const { canWatch, canEdit } = getEventAccess();

    const fetchActivity = useCallback(
        async (page = 1, pageSize = 10) => {
            if (!key) return;
            const request = ++listRequest.current;
            setListLoading(true);
            try {
                const data = await queryActivity(key, page, pageSize, true);
                if (listRequest.current !== request) return;
                setError(null);
                setNumbers(data.list);
                setPagination({
                    current: page,
                    pageSize,
                    total: data.pagination.total,
                });
            } catch (err) {
                if (listRequest.current === request) setError(err as Error);
            } finally {
                if (listRequest.current === request) setListLoading(false);
            }
        },
        [key, queryActivity],
    );

    const refreshPage = () =>
        fetchActivity(pagination.current, pagination.pageSize);

    const handleExport = async () => {
        if (!key) return;
        setExporting(true);
        try {
            const csv = await getParticipationCsv(key);
            if (!csv?.size) {
                message.warning('没有数据可导出');
                return;
            }
            const url = URL.createObjectURL(csv);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toLocaleDateString('sv-SE', {
                timeZone: 'Asia/Shanghai',
            });
            link.download = `幸运号码-${activityInfo?.name || '未命名'}-${date}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            const blob = (error as { response?: { data?: Blob } }).response
                ?.data;
            const messageText =
                blob instanceof Blob
                    ? await blob
                          .text()
                          .then(text => JSON.parse(text).message as string)
                          .catch(() => undefined)
                    : undefined;
            message.error(messageText ?? '导出失败，请稍后重试');
        } finally {
            setExporting(false);
        }
    };

    const fetchActivityInfo = useCallback(async () => {
        if (!key) return;
        try {
            const data = await getActivityInfo(key);
            setActivityInfo(data);
            setActivityKey(data.activity_key);
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    }, [key, getActivityInfo]);

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
    }, [fetchActivityInfo]);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

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
                text ? formatDateTime(text) : '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: unknown, record: LuckyNumber) => (
                <Space wrap>
                    {record.has_number_data ? (
                        <Button
                            type="link"
                            onClick={() => setSelectedRecord(record)}
                        >
                            {canEdit ? '编辑资料' : '查看资料'}
                        </Button>
                    ) : (
                        <span className="text-gray-500">资料未导入</span>
                    )}
                    {canEdit && record.username && (
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
                        {canEdit && (
                            <Button onClick={() => setImportOpen(true)}>
                                导入号码资料
                            </Button>
                        )}
                        {canWatch && (
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                onClick={handleExport}
                                loading={exporting}
                            >
                                导出列表
                            </Button>
                        )}
                        {canEdit &&
                            eq(
                                activityInfo?.status,
                                LUCKY_NUMBER_STATUS.NOT_STARTED,
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
                            <Tag
                                color={
                                    eq(
                                        activityInfo?.status,
                                        LUCKY_NUMBER_STATUS.NOT_STARTED,
                                    )
                                        ? 'default'
                                        : eq(
                                                activityInfo?.status,
                                                LUCKY_NUMBER_STATUS.ONGOING,
                                            )
                                          ? 'processing'
                                          : 'error'
                                }
                            >
                                {getLuckyNumberStatusLabel(
                                    activityInfo?.status,
                                )}
                            </Tag>
                            {canEdit &&
                                eq(
                                    activityInfo?.status,
                                    LUCKY_NUMBER_STATUS.NOT_STARTED,
                                ) && (
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
                            {canEdit &&
                                eq(
                                    activityInfo?.status,
                                    LUCKY_NUMBER_STATUS.ONGOING,
                                ) && (
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
                                        <Button
                                            type="primary"
                                            danger
                                            size="small"
                                        >
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

            {canWatch && (
                <Table
                    columns={columns}
                    dataSource={numbers}
                    rowKey="id"
                    loading={listLoading}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        onChange: fetchActivity,
                    }}
                />
            )}
            {key && importOpen && canEdit && (
                <ImportNumberDataModal
                    activityKey={key}
                    onClose={() => setImportOpen(false)}
                    onCommitted={written => {
                        setImportOpen(false);
                        message.success(`导入完成，写入 ${written} 条号码资料`);
                        refreshPage();
                    }}
                />
            )}
            {key && selectedRecord && canWatch && (
                <ParticipationNumberDataModal
                    key={selectedRecord.id}
                    activityKey={key}
                    record={selectedRecord}
                    readOnly={!canEdit}
                    onClose={() => setSelectedRecord(undefined)}
                    onSaved={() => {
                        setSelectedRecord(undefined);
                        message.success('号码资料已保存');
                    }}
                />
            )}
        </div>
    );
};

export default function LuckyNumberDetailPage() {
    const { key } = useParams<{ key: string }>();
    return <LuckyNumberDetail key={key} activityRouteKey={key} />;
}
