import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HeaderProvider } from './contexts/HeaderContext';
import BaseLayout from './layouts/Base/Layout';
import NotFoundPage from './pages/404/Page';
import IndexPage from './pages/Index/Page';
import LuckyNumberActivityPage from './pages/LuckyNumber/Activity/Page';
import LuckyNumberListPage from './pages/LuckyNumber/List/Page';
import PromisePage from './pages/promise/Page';

function App() {
    return (
        <BrowserRouter>
            <HeaderProvider>
                <BaseLayout>
                    <Routes>
                        <Route path="/promise" element={<PromisePage />} />
                        <Route path="/" element={<IndexPage />} />
                        <Route
                            path="/lucky-number/:activityKey"
                            element={<LuckyNumberListPage />}
                        />
                        <Route
                            path="/lucky-number/:activityKey/activity"
                            element={<LuckyNumberActivityPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BaseLayout>
            </HeaderProvider>
        </BrowserRouter>
    );
}

export default App;
