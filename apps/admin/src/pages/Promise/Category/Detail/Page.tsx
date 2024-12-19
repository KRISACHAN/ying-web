import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Card, Form, Input, message, Popconfirm, Switch } from 'antd';

import { usePromise } from '@/hooks/usePromise';
import NotFoundPage from '@/pages/404/Page';
import type { PromiseCategory } from '@/types/promise';

const PromiseCategoryDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getCategory, updateCategory, deleteCategory, loading } =
        usePromise();
    const [form] = Form.useForm();
    const [error, setError] = useState<Error | null>(null);

    const fetchCategory = async () => {
        if (!id) return;
        try {
            const { data } = await getCategory(parseInt(id, 10));
            form.setFieldsValue(data);
        } catch (err) {
            setError(err as Error);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, [id]);

    const onFinish = async (values: Partial<PromiseCategory>) => {
        if (!id) return;
        try {
            await updateCategory(parseInt(id, 10), values);
            message.success('更新成功');
            navigate('/promise/category');
        } catch {
            message.error('更新失败');
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        try {
            await deleteCategory(parseInt(id, 10));
            message.success('删除成功');
            navigate('/promise/category');
        } catch {
            message.error('删除失败');
        }
    };

    if (error?.toString()?.includes('404')) {
        return <NotFoundPage title="分类不存在" message="回到列表页看看？" />;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-bold">分类详情</h1>
                <Popconfirm
                    title="确认删除"
                    description="确定要删除这个分类吗？删除后无法恢复"
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button type="primary" danger>
                        删除分类
                    </Button>
                </Popconfirm>
            </div>

            <Card loading={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="max-w-2xl"
                >
                    <Form.Item
                        label="分类名称"
                        name="name"
                        rules={[
                            { required: true, message: '请输入分类名称' },
                            { max: 20, message: '分类名称长度为 1-20' },
                        ]}
                    >
                        <Input placeholder="请输入分类名称" />
                    </Form.Item>

                    <Form.Item
                        label="分类描述"
                        name="description"
                        rules={[{ max: 100, message: '分类描述长度为 1-100' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="请输入分类描述（选填）"
                        />
                    </Form.Item>

                    <Form.Item
                        label="发布状态"
                        name="is_published"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            保存修改
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PromiseCategoryDetail;
