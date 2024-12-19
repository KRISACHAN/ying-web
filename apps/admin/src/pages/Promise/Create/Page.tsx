import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { UploadOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Form,
    Input,
    message,
    Select,
    Switch,
    Upload,
} from 'antd';

import Preview from '@/components/Preview';
import { useOss } from '@/hooks/useOss';
import { usePromise } from '@/hooks/usePromise';
import type { PromiseItem } from '@/types/promise';

const PromiseCreate = () => {
    const navigate = useNavigate();
    const { createPromise, loading, categories, getCategoryList } =
        usePromise();
    const { uploadFile } = useOss();
    const [form] = Form.useForm();
    const resourceType = Form.useWatch('resource_type', form);
    const resourceUrl = Form.useWatch('resource_url', form);

    useEffect(() => {
        getCategoryList({ page_num: 1, page_size: 100 });
    }, []);

    const onFinish = async (values: Partial<PromiseItem>) => {
        try {
            await createPromise(values);
            message.success('创建成功');
            navigate('/promise');
        } catch {
            message.error('创建失败');
        }
    };

    const handleUpload = async (file: File) => {
        try {
            const result = await uploadFile(file);
            form.setFieldsValue({
                resource_url: result.data.url,
                resource_type: result.data.resource_type,
            });
            message.success('文件上传成功');
            return false;
        } catch {
            message.error('文件上传失败');
            return false;
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        form.setFieldsValue({ resource_url: e.target.value });
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">创建经文</h1>
            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="max-w-2xl"
                >
                    <Form.Item
                        label="分类"
                        name="category_id"
                        rules={[{ required: true, message: '请选择分类' }]}
                    >
                        <Select placeholder="请选择分类">
                            {categories.map(category => (
                                <Select.Option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="章节"
                        name="chapter"
                        rules={[
                            { required: true, message: '请输入章节' },
                            { max: 20, message: '章节长度为 1-20' },
                        ]}
                    >
                        <Input placeholder="请输入章节" />
                    </Form.Item>

                    <Form.Item
                        label="经文内容"
                        name="text"
                        rules={[
                            { required: true, message: '请输入经文内容' },
                            { max: 255, message: '经文内容长度为 1-255' },
                        ]}
                    >
                        <Input.TextArea rows={4} placeholder="请输入经文内容" />
                    </Form.Item>

                    <Form.Item
                        label="描述"
                        name="description"
                        rules={[{ max: 510, message: '描述长度为 1-510' }]}
                    >
                        <Input.TextArea
                            rows={4}
                            placeholder="请输入描述（选填）"
                        />
                    </Form.Item>

                    <Form.Item name="resource_type" hidden>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="资源"
                        extra={
                            <div className="mt-2">
                                <Upload
                                    beforeUpload={handleUpload}
                                    showUploadList={false}
                                    accept="image/*,video/*,audio/*"
                                >
                                    <Button icon={<UploadOutlined />}>
                                        上传资源（支持图片/视频/音频）
                                    </Button>
                                </Upload>
                            </div>
                        }
                    >
                        <Form.Item name="resource_url" noStyle>
                            <Input
                                placeholder="请输入资源链接或点击上传按钮"
                                onChange={handleUrlChange}
                            />
                        </Form.Item>
                    </Form.Item>

                    {resourceUrl && (
                        <Form.Item label="资源预览">
                            <Preview type={resourceType} url={resourceUrl} />
                        </Form.Item>
                    )}

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
                            创建经文
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default PromiseCreate;
