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
import type { PromiseCategory } from '@/types/promise';

const PromiseCategoryList = () => {
    const navigate = useNavigate();
    const { getCategoryList, updateCategory, loading, deleteCategory } =
        usePromise();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<PromiseCategory[]>([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchCategories = async (params = {}) => {
        try {
            const result = await getCategoryList({
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
            setCategories(data);
            setPagination({
                current: pager.count,
                pageSize: pager.size,
                total: pager.total,
            });
        } catch (err) {
            console.error(err);
            message.error('获取分类列表失败');
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handlePublishChange = async (id: number, is_published: boolean) => {
        try {
            await updateCategory(id, { is_published });
            message.success('更新成功');
            fetchCategories();
        } catch {
            message.error('更新失败');
        }
    };

    const handleSearch = async (values: any) => {
        await fetchCategories(values);
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteCategory(id);
            message.success('删除成功');
            fetchCategories();
        } catch {
            message.error('删除失败');
        }
    };

    const columns: ColumnsType<PromiseCategory> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '分类名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
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
                        onClick={() =>
                            navigate(`/promise/category/${record.id}`)
                        }
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确认删除"
                        description="确定要删除这个分类吗？"
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
                <h1 className="text-2xl font-bold">经文分类列表</h1>
                <Button
                    type="primary"
                    onClick={() => navigate('/promise/category/create')}
                >
                    创建分类
                </Button>
            </div>

            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                className="mb-4"
            >
                <Form.Item name="name">
                    <Input placeholder="分类名称" />
                </Form.Item>
                <Form.Item name="description">
                    <Input placeholder="分类描述" />
                </Form.Item>
                <Form.Item name="is_published">
                    <Select
                        placeholder="发布状态"
                        allowClear
                        options={[
                            { label: '已发布', value: true },
                            { label: '未发布', value: false },
                        ]}
                    />
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
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={{
                    ...pagination,
                    onChange: (page, pageSize) => {
                        fetchCategories({
                            page_num: page,
                            page_size: pageSize,
                        });
                    },
                }}
            />
        </div>
    );
};

export default PromiseCategoryList;
