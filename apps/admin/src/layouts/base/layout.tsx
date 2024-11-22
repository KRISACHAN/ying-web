import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { localCache } from '@/services/storage';
import './layout.css';

const { Header, Content, Sider } = Layout;

const BaseLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminInfo = localCache.get<{ admin: { username: string } }>(
        'adminInfo',
    );

    return (
        <Layout className="min-h-screen">
            <Header className="flex justify-between items-center bg-white px-6">
                <h1 className="text-xl font-bold">Ying 后台管理</h1>
                <div className="flex items-center gap-2">
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    label: '退出登录',
                                    onClick: handleLogout,
                                    key: 'logout',
                                },
                            ],
                        }}
                    >
                        <Avatar
                            size="large"
                            className="bg-blue-500 text-white cursor-pointer"
                        >
                            {adminInfo?.admin?.username.slice(0, 4)}
                        </Avatar>
                    </Dropdown>
                </div>
            </Header>
            <Layout>
                <Sider width={200} className="bg-white">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={[
                            {
                                key: '0',
                                label: '首页',
                                onClick: () => navigate('/'),
                            },
                            {
                                key: '1',
                                label: '幸运号码活动',
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
