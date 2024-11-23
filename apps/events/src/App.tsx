import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HeaderProvider } from './contexts/header-context';
import BaseLayout from './layouts/base/layout';
import NotFoundPage from './pages/404/page';
import IndexPage from './pages/index/page';
import LuckyNumberActivityPage from './pages/lucky-number/activity/page';
import LuckyNumberListPage from './pages/lucky-number/list/page';
import PromisePage from './pages/promise/page';

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
