import { useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import { useLuckyNumber } from '@/hooks/useLuckyNumber';

const LuckyNumberCreate = () => {
    const navigate = useNavigate();
    const { createActivity, loading } = useLuckyNumber();

    const onFinish = async (values: {
        key: string;
        name: string;
        description: string;
        numbers: string;
        participant_limit: number;
    }) => {
        try {
            const numbers = values.numbers
                .split(',')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));

            await createActivity({
                key: values.key,
                name: values.name,
                description: values.description,
                numbers,
                participant_limit: Number(values.participant_limit),
            });
            message.success('活动创建成功');
            navigate('/lucky-number');
        } catch (error) {
            console.error(error);
            message.error('活动创建失败');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">创建幸运号码活动</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <Form
                    name="createLuckyNumber"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="活动标识"
                        name="key"
                        rules={[
                            {
                                required: true,
                                message: '请输入活动标识',
                            },
                            {
                                max: 20,
                                message: '活动标识长度不能超过20个字符',
                            },
                        ]}
                    >
                        <Input placeholder="请输入唯一的活动标识" />
                    </Form.Item>

                    <Form.Item
                        label="活动名称"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: '请输入活动名称',
                            },
                        ]}
                    >
                        <Input placeholder="请输入活动名称" />
                    </Form.Item>

                    <Form.Item
                        label="活动描述"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: '请输入活动描述',
                            },
                            {
                                max: 255,
                                message: '活动描述长度不能超过 255 个字符',
                            },
                        ]}
                    >
                        <Input.TextArea placeholder="请输入活动描述" />
                    </Form.Item>

                    <Form.Item
                        label="号码范围"
                        name="numbers"
                        rules={[
                            {
                                required: true,
                                message: '请输入号码范围',
                            },
                            {
                                pattern: /^[0-9,]+$/,
                                message: '请输入数字，用逗号分隔',
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="请输入号码，用逗号分隔"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item
                        label="参与人数限制"
                        name="participant_limit"
                        rules={[
                            {
                                required: true,
                                message: '请输入参与人数限制',
                            },
                            {
                                validator: async (_, value) => {
                                    const num = parseInt(value);
                                    if (isNaN(num) || num < 0) {
                                        throw new Error(
                                            '参与人数限制必须大于等于0',
                                        );
                                    }
                                },
                            },
                        ]}
                        help="0 表示不限制参与人数"
                    >
                        <Input type="number" placeholder="请输入参与人数限制" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="mt-8"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            创建活动
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LuckyNumberCreate;
