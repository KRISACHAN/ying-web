import { useOptionDraw } from '@/hooks/useOptionDraw';
import { Button, Form, Input, Switch, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const OptionDrawCreate = () => {
    const navigate = useNavigate();
    const { createActivity, loading } = useOptionDraw();

    const onFinish = async (values: {
        key: string;
        name: string;
        description: string;
        options: string;
        participant_limit: number;
        allow_duplicate_options: boolean;
    }) => {
        try {
            const options = values.options
                .split(',')
                .map(option => option.trim())
                .filter(option => option);

            await createActivity({
                key: values.key,
                name: values.name,
                description: values.description,
                options,
                participant_limit: Number(values.participant_limit),
                allow_duplicate_options: values.allow_duplicate_options,
            });
            message.success('活动创建成功');
            navigate('/option-draw');
        } catch (error) {
            console.error(error);
            message.error('活动创建失败');
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">创建选项抽取活动</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <Form
                    name="optionDrawCreate"
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
                        label="选项列表"
                        name="options"
                        rules={[
                            {
                                required: true,
                                message: '请输入选项列表',
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="请输入选项，用逗号分隔"
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

                    <Form.Item
                        label="允许重复选项"
                        name="allow_duplicate_options"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            className="mt-8"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            创建新活动
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default OptionDrawCreate;
