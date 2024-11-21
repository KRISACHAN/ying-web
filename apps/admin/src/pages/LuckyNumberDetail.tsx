import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Table, message, Button } from 'antd';
import { useLuckyNumber } from '../hooks/useLuckyNumber';
import { LuckyNumber } from '../types/lucky-number';

export const LuckyNumberDetail = () => {
    const { key } = useParams<{ key: string }>();
    const { queryActivity, loading, cancelParticipation } = useLuckyNumber();
    const [numbers, setNumbers] = useState<LuckyNumber[]>([]);
    const [activityKey, setActivityKey] = useState<string>('');
    const [activityDescription, setActivityDescription] = useState<string>('');

    const fetchActivity = async () => {
        if (!key) return;
        try {
            const data = await queryActivity(key);
            setNumbers(data.numbers);
            setActivityKey(data.activity_key);
            setActivityDescription(data.description);
        } catch (error) {
            message.error('获取活动详情失败');
        }
    };

    const handleCancel = async (record: LuckyNumber) => {
        return cancelParticipation({
            key: activityKey,
            drawn_number: record.drawn_number,
            user_name: record.user_name || '',
        }).finally(() => {
            fetchActivity();
        });
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
            title: '状态',
            dataIndex: 'is_drawn',
            key: 'is_drawn',
            render: (isDrawn: boolean) =>
                isDrawn ? (
                    <span className="text-green-500">已抽取</span>
                ) : (
                    <span className="text-gray-500">未抽取</span>
                ),
        },
        {
            title: '抽取人',
            dataIndex: 'user_name',
            key: 'user_name',
            render: (text: string | null) => text || '-',
        },
        {
            title: '操作',
            key: 'action',
            render: (_: any, record: LuckyNumber) =>
                record.user_name ? (
                    <Button type="link" onClick={() => handleCancel(record)}>
                        取消抽取
                    </Button>
                ) : null,
        },
    ];

    return (
        <div className="p-6">
            <Card
                title={`活动详情 - ${activityKey}`}
                loading={loading}
                className="mb-6"
            >
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">活动标识：</p>
                        <p>{activityKey}</p>
                    </div>
                    <div>
                        <p className="font-bold">活动描述：</p>
                        <p>{activityDescription}</p>
                    </div>
                    <div>
                        <p className="font-bold">总号码数量：</p>
                        <p>{numbers.length}</p>
                    </div>
                    <div>
                        <p className="font-bold">访问链接：</p>
                        <p>
                            <Link
                                className="text-blue-500 hover:text-blue-700"
                                to={`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityKey}/activity`}
                                target="_blank"
                            >
                                {`${import.meta.env.VITE_EVENTS_BASE_URL}/lucky-number/${activityKey}/activity`}
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>

            <Table
                columns={columns}
                dataSource={numbers}
                rowKey="drawn_number"
                loading={loading}
                pagination={{
                    pageSize: 50,
                }}
            />
        </div>
    );
};
