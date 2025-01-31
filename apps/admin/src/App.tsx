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
import OptionDrawCreatePage from './pages/OptionDraw/Create/Page';
import OptionDrawDetailPage from './pages/OptionDraw/Detail/Page';
import OptionDrawListPage from './pages/OptionDraw/List/Page';
import PromiseCategoryCreatePage from './pages/Promise/Category/Create/Page';
import PromiseCategoryDetailPage from './pages/Promise/Category/Detail/Page';
import PromiseCategoryListPage from './pages/Promise/Category/List/Page';
import PromiseCreatePage from './pages/Promise/Create/Page';
import PromiseDetailPage from './pages/Promise/Detail/Page';
import PromiseEditPage from './pages/Promise/Edit/Page';
import PromiseListPage from './pages/Promise/List/Page';

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
                        <Route
                            path="option-draw"
                            element={<OptionDrawListPage />}
                        />
                        <Route
                            path="option-draw/create"
                            element={<OptionDrawCreatePage />}
                        />
                        <Route
                            path="option-draw/:key"
                            element={<OptionDrawDetailPage />}
                        />
                        <Route
                            path="promise/category"
                            element={<PromiseCategoryListPage />}
                        />
                        <Route
                            path="promise/category/create"
                            element={<PromiseCategoryCreatePage />}
                        />
                        <Route
                            path="promise/category/:id"
                            element={<PromiseCategoryDetailPage />}
                        />
                        <Route path="promise" element={<PromiseListPage />} />
                        <Route
                            path="promise/create"
                            element={<PromiseCreatePage />}
                        />
                        <Route
                            path="promise/edit/:id"
                            element={<PromiseEditPage />}
                        />
                        <Route
                            path="promise/:id"
                            element={<PromiseDetailPage />}
                        />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
