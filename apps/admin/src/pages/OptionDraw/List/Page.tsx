import { Button, message, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useOptionDraw } from '@/hooks/useOptionDraw';
import type { OptionDrawActivity } from '@/types/optionDraw';
import { OPTION_DRAW_STATUS } from '@/utils/constants';
import dayjs from 'dayjs';
import { eq } from 'lodash';

const OptionDrawList = () => {
    const navigate = useNavigate();
    const { getActivityList, updateActivityStatus, deleteActivity, loading } =
        useOptionDraw();

    const [activities, setActivities] = useState<OptionDrawActivity[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = async (pageNum = 1, pageSize = 10) => {
        try {
            const { list, pagination: pager } = await getActivityList(
                pageNum,
                pageSize,
            );
            setActivities(list);
            setPagination({
                current: pageNum,
                pageSize,
                total: pager.total,
            });
        } catch (error) {
            console.error(error);
            message.error('获取活动列表失败');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStatus = async (key: string, status: string) => {
        try {
            await updateActivityStatus(key, status);
            message.success('状态更新成功');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error('状态更新失败');
        }
    };

    const handleDelete = async (key: string) => {
        try {
            await deleteActivity(key);
            message.success('删除成功');
            fetchData(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            message.error('删除失败');
        }
    };

    const columns: ColumnsType<OptionDrawActivity> = [
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
            render: (_, record) => (
                <div className="space-x-2">
                    <Button
                        type="link"
                        onClick={() => navigate(`/option-draw/${record.key}`)}
                    >
                        查看详情
                    </Button>
                    {eq(record.status, OPTION_DRAW_STATUS.NOT_STARTED) && (
                        <Button
                            type="link"
                            onClick={() =>
                                handleUpdateStatus(
                                    record.key,
                                    OPTION_DRAW_STATUS.ONGOING,
                                )
                            }
                        >
                            开始活动
                        </Button>
                    )}
                    {eq(record.status, OPTION_DRAW_STATUS.ONGOING) && (
                        <Button
                            type="link"
                            onClick={() =>
                                handleUpdateStatus(
                                    record.key,
                                    OPTION_DRAW_STATUS.ENDED,
                                )
                            }
                        >
                            结束活动
                        </Button>
                    )}
                    {eq(record.status, OPTION_DRAW_STATUS.NOT_STARTED) && (
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
                </div>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">选项抽取活动</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/option-draw/create')}
                >
                    创建新活动
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={activities}
                rowKey="id"
                pagination={pagination}
                loading={loading}
                onChange={({ current, pageSize }) =>
                    fetchData(current, pageSize)
                }
            />
        </div>
    );
};

export default OptionDrawList;
