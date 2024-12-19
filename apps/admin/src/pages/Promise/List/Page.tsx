import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Form,
    Input,
    message,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import { usePromise } from '@/hooks/usePromise';
import type { PromiseItem } from '@/types/promise';

const PromiseList = () => {
    const navigate = useNavigate();
    const {
        getPromiseList,
        updatePromise,
        deletePromise,
        loading,
        categories,
        getCategoryList,
    } = usePromise();
    const [form] = Form.useForm();
    const [promises, setPromises] = useState<PromiseItem[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchPromises = async (params = {}) => {
        try {
            const result = await getPromiseList({
                page_num: pagination.current,
                page_size: pagination.pageSize,
                ...params,
            });
            const { data, pagination: pager } = result ?? {
                data: [],
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
            };
            setPromises(data);
            setPagination({
                current: pager.count,
                pageSize: pager.size,
                total: pager.total,
            });
        } catch (err) {
            console.error(err);
            message.error('获取经文列表失败');
        }
    };

    useEffect(() => {
        fetchPromises();
        getCategoryList({ page_num: 1, page_size: 100 });
    }, []);

    const handlePublishChange = async (id: number, is_published: boolean) => {
        try {
            await updatePromise(id, { is_published });
            message.success('更新成功');
            fetchPromises();
        } catch {
            message.error('更新失败');
        }
    };

    const handleSearch = async (values: any) => {
        await fetchPromises(values);
    };

    const handleDelete = async (id: number) => {
        try {
            await deletePromise(id);
            message.success('删除成功');
            fetchPromises();
        } catch {
            message.error('删除失败');
        }
    };

    const columns: ColumnsType<PromiseItem> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '分类',
            dataIndex: 'category_name',
            key: 'category_name',
        },
        {
            title: '章节',
            dataIndex: 'chapter',
            key: 'chapter',
        },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: '发布状态',
            dataIndex: 'is_published',
            key: 'is_published',
            render: (is_published: boolean, record) => (
                <Switch
                    checked={is_published}
                    onChange={checked =>
                        handlePublishChange(record.id, checked)
                    }
                />
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => navigate(`/promise/edit/${record.id}`)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认删除"
                        description="确定要删除这条经文吗？"
                        onConfirm={() => handleDelete(record.id)}
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
                <h1 className="text-2xl font-bold">经文列表</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/promise/create')}
                >
                    创建经文
                </Button>
            </div>

            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                className="mb-4"
            >
                <Form.Item name="category_id">
                    <Select
                        placeholder="选择分类"
                        allowClear
                        style={{ width: 200 }}
                    >
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
                <Form.Item name="chapter">
                    <Input placeholder="章节" />
                </Form.Item>
                <Form.Item name="is_published">
                    <Select
                        placeholder="发布状态"
                        allowClear
                        style={{ width: 120 }}
                    >
                        <Select.Option value={true}>已发布</Select.Option>
                        <Select.Option value={false}>未发布</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            搜索
                        </Button>
                        <Button onClick={() => form.resetFields()}>重置</Button>
                    </Space>
                </Form.Item>
            </Form>

            <Table
                columns={columns}
                dataSource={promises}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => {
                        fetchPromises({
                            page_num: page,
                            page_size: pageSize,
                        });
                    },
                }}
            />
        </div>
    );
};

export default PromiseList;
