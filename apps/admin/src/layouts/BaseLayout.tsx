import { Layout, Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const { Header, Content, Sider } = Layout;

const BaseLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Layout className="min-h-screen">
            <Header className="flex justify-between items-center bg-white px-6">
                <h1 className="text-xl font-bold">Ying 后台管理</h1>
                <Button onClick={handleLogout}>退出登录</Button>
            </Header>
            <Layout>
                <Sider width={200} className="bg-white">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={[
                            {
                                key: '1',
                                label: '幸运数字活动',
                                onClick: () => navigate('/lucky-number'),
                            },
                        ]}
                    />
                </Sider>
                <Layout className="p-6">
                    <Content className="bg-white rounded-lg">
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default BaseLayout;
