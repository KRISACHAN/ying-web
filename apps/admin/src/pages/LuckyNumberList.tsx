import { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLuckyNumber } from '../hooks/useLuckyNumber';
import type { LuckyNumberActivity, Pagination } from '../types/lucky-number';
import dayjs from 'dayjs';

export const LuckyNumberList = () => {
    const navigate = useNavigate();
    const { getActivityList, deleteActivity, loading } = useLuckyNumber();
    const [activities, setActivities] = useState<LuckyNumberActivity[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        count: 0,
        size: 0,
        total: 0,
    });

    const fetchActivities = async () => {
        try {
            const data = await getActivityList(1, 10);
            setActivities(data.list);
            setPagination(data.pagination);
        } catch (error) {
            console.error(error);
            message.error('获取活动列表失败');
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
        } catch (error) {
            message.error('删除失败');
        }
    };

    const columns = [
        {
            title: '活动ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '活动标识',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
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
                    <Popconfirm
                        title="确定要删除这个活动吗？"
                        onConfirm={() => handleDelete(record.key)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

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
