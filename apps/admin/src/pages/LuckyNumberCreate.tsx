import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLuckyNumber } from '../hooks/useLuckyNumber';

export const LuckyNumberCreate = () => {
    const navigate = useNavigate();
    const { createActivity, loading } = useLuckyNumber();

    const onFinish = async (values: {
        key: string;
        description: string;
        numberRange: string;
    }) => {
        try {
            const numbers = values.numberRange
                .split(',')
                .map(n => parseInt(n.trim()))
                .filter(n => !isNaN(n));

            await createActivity({
                key: values.key,
                description: values.description,
                numbers,
            });
            message.success('活动创建成功');
            navigate('/lucky-number');
        } catch (error) {
            message.error('活动创建失败');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">创建幸运数字活动</h1>
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
                        label="数字范围"
                        name="numberRange"
                        rules={[
                            {
                                required: true,
                                message: '请输入数字范围',
                            },
                            {
                                max: 300,
                                message: '数字范围长度不能超过 300 个字符',
                            },
                        ]}
                        help="请输入数字，用逗号分隔，例如：1,2,3,4,5"
                    >
                        <Input.TextArea
                            placeholder="请输入数字，用逗号分隔"
                            rows={4}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
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
