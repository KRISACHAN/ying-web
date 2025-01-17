import { useNavigate } from 'react-router-dom';

import { Button, Form, Input, message } from 'antd';

import { useAuth } from '@/hooks/useAuth';
import { LoginParams } from '@/types/auth';

const Login = () => {
    const navigate = useNavigate();
    const { handler, state } = useAuth();

    const onFinish = async (values: LoginParams) => {
        await handler.login(values);
        message.success('登录成功');
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">
                    管理员登录
                </h1>
                <Form
                    name="login"
                    onFinish={onFinish}
                    layout="vertical"
                    autoComplete="off"
                >
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: '请输入邮箱',
                            },
                            {
                                type: 'email',
                                message: '请输入有效的邮箱地址',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={state.loading}
                            className="w-full"
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
