import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import AuthGuard from './components/AuthGuard/Index';
import BaseLayout from './layouts/Base/layout';
import NotFoundPage from './pages/404/Page';
import IndexPage from './pages/Index/Page';
import LoginPage from './pages/Login/Page';
import LuckyNumberCreatePage from './pages/LuckyNumber/Create/Page';
import LuckyNumberDetailPage from './pages/LuckyNumber/Detail/Page';
import LuckyNumberListPage from './pages/LuckyNumber/List/Page';

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <AuthGuard>
                                <BaseLayout />
                            </AuthGuard>
                        }
                    >
                        <Route index element={<IndexPage />} />
                        <Route
                            path="lucky-number"
                            element={<LuckyNumberListPage />}
                        />
                        <Route
                            path="lucky-number/create"
                            element={<LuckyNumberCreatePage />}
                        />
                        <Route
                            path="lucky-number/:key"
                            element={<LuckyNumberDetailPage />}
                        />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
