import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Table, message } from 'antd';
import { useLuckyNumber } from '../hooks/useLuckyNumber';
import { LuckyNumber } from '../types/lucky-number';

export const LuckyNumberDetail = () => {
    const { key } = useParams<{ key: string }>();
    const { queryActivity, loading } = useLuckyNumber();
    const [numbers, setNumbers] = useState<LuckyNumber[]>([]);
    const [activityKey, setActivityKey] = useState<string>('');

    useEffect(() => {
        const fetchActivity = async () => {
            if (!key) return;
            try {
                const data = await queryActivity(key);
                setNumbers(data.numbers);
                setActivityKey(data.activityKey);
            } catch (error) {
                message.error('获取活动详情失败');
            }
        };

        fetchActivity();
    }, [key, queryActivity]);

    const columns = [
        {
            title: '数字',
            dataIndex: 'number',
            key: 'number',
        },
        {
            title: '状态',
            dataIndex: 'is_drawn',
            key: 'is_drawn',
            render: (isDrawn: boolean) =>
                isDrawn ? (
                    <span className="text-red-500">已抽取</span>
                ) : (
                    <span className="text-green-500">未抽取</span>
                ),
        },
        {
            title: '抽取人',
            dataIndex: 'drawn_by',
            key: 'drawn_by',
            render: (text: string | null) => text || '-',
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
                        <p className="font-bold">总数字数量：</p>
                        <p>{numbers.length}</p>
                    </div>
                </div>
            </Card>

            <Table
                columns={columns}
                dataSource={numbers}
                rowKey="number"
                loading={loading}
                pagination={{
                    pageSize: 50,
                }}
            />
        </div>
    );
};
