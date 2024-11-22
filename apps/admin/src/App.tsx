import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import BaseLayout from './layouts/base/layout';
import AuthGuard from './components/auth-guard';
import LoginPage from './pages/login/page';
import IndexPage from './pages/index/page';
import NotFoundPage from './pages/404/page';
import LuckyNumberListPage from './pages/lucky-number/list/page';
import LuckyNumberDetailPage from './pages/lucky-number/detail/page';
import LuckyNumberCreatePage from './pages/lucky-number/create/page';

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
