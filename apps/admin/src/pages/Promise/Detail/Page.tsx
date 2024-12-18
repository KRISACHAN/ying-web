import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Image, message, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';

import { usePromise } from '@/hooks/usePromise';
import NotFoundPage from '@/pages/404/Page';
import type { PromiseItem } from '@/types/promise';

const PromiseDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getPromiseDetail, deletePromise, loading } = usePromise();
    const [promise, setPromise] = useState<PromiseItem | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const fetchPromise = async () => {
        if (!id) return;
        try {
            const { data } = await getPromiseDetail(parseInt(id, 10));
            setPromise(data);
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPromise();
    }, [id]);

    const handleDelete = async () => {
        if (!id) return;
        try {
            await deletePromise(parseInt(id, 10));
            message.success('删除成功');
            navigate('/promise');
        } catch {
            message.error('删除失败');
        }
    };

    const renderResource = () => {
        if (!promise?.resource_url) return null;

        switch (promise.resource_type) {
            case 'image':
                return (
                    <Image
                        src={promise.resource_url}
                        alt="经文配图"
                        style={{ maxWidth: '100%', maxHeight: 400 }}
                    />
                );
            case 'video':
                return (
                    <video
                        src={promise.resource_url}
                        controls
                        style={{ maxWidth: '100%' }}
                    />
                );
            case 'audio':
                return (
                    <audio
                        src={promise.resource_url}
                        controls
                        style={{ width: '100%' }}
                    />
                );
            default:
                return null;
        }
    };

    if (error?.toString()?.includes('404')) {
        return <NotFoundPage title="经文不存在" message="回到列表页看看？" />;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">经文详情</h1>
                <Space>
                    <Button
                        type="primary"
                        onClick={() => navigate(`/promise/edit/${id}`)}
                    >
                        编辑经文
                    </Button>
                    <Popconfirm
                        title="确认删除"
                        description="确定要删除这条经文吗？删除后无法恢复"
                        onConfirm={handleDelete}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="primary" danger>
                            删除经文
                        </Button>
                    </Popconfirm>
                </Space>
            </div>

            <Card loading={loading}>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-bold">分类：</p>
                        <p>{promise?.category_name || '-'}</p>
                    </div>
                    <div>
                        <p className="font-bold">章节：</p>
                        <p>{promise?.chapter || '-'}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-bold">经文内容：</p>
                        <p>{promise?.text || '-'}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-bold">描述：</p>
                        <p>{promise?.description || '-'}</p>
                    </div>
                    {promise?.resource_url && (
                        <div className="col-span-2">
                            <p className="font-bold">资源：</p>
                            {renderResource()}
                        </div>
                    )}
                    <div>
                        <p className="font-bold">发布状态：</p>
                        <p>{promise?.is_published ? '已发布' : '未发布'}</p>
                    </div>
                    <div>
                        <p className="font-bold">创建时间：</p>
                        <p>
                            {promise?.created_at
                                ? dayjs(promise.created_at).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : '-'}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PromiseDetail;
