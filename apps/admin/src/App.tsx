import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Login } from './pages/Login';
import BaseLayout from './layouts/BaseLayout';
import { LuckyNumberList } from './pages/LuckyNumberList';
import { LuckyNumberDetail } from './pages/LuckyNumberDetail';
import { LuckyNumberCreate } from './pages/LuckyNumberCreate';
import { AuthGuard } from './components/AuthGuard';

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/"
                        element={
                            <AuthGuard>
                                <BaseLayout />
                            </AuthGuard>
                        }
                    >
                        <Route
                            index
                            element={<Navigate to="/lucky-number" />}
                        />
                        <Route
                            path="lucky-number"
                            element={<LuckyNumberList />}
                        />
                        <Route
                            path="lucky-number/create"
                            element={<LuckyNumberCreate />}
                        />
                        <Route
                            path="lucky-number/:key"
                            element={<LuckyNumberDetail />}
                        />
                    </Route>
                    <Route path="*" element={<Navigate to="/lucky-number" />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
