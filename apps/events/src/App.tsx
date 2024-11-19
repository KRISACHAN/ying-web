import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import BaseLayout from './layouts/base/layout';
import IndexPage from './pages/index/page';
import PromisePage from './pages/promise/page';
import LuckyNumberListPage from './pages/lucky-number/list/page';
import LuckyNumberActivityPage from './pages/lucky-number/activity/page';
import NotFoundPage from './pages/404/page';

function App() {
    return (
        <BrowserRouter>
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
        </BrowserRouter>
    );
}

export default App;
