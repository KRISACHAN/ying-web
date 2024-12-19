import { useNavigate } from 'react-router-dom';

import { Button, Card, Form, Input, message, Switch } from 'antd';

import { usePromise } from '@/hooks/usePromise';
import type { PromiseCategory } from '@/types/promise';

const PromiseCategoryCreate = () => {
    const navigate = useNavigate();
    const { createCategory, loading } = usePromise();
    const [form] = Form.useForm();

    const onFinish = async (values: Partial<PromiseCategory>) => {
        try {
            await createCategory(values);
            message.success('创建成功');
            navigate('/promise/category');
        } catch {
            message.error('创建失败');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">创建分类</h1>
            <Card>
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
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            创建分类
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PromiseCategoryCreate;
