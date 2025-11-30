import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { HeaderProvider } from './contexts/HeaderContext';
import BaseLayout from './layouts/Base/Layout';
import NotFoundPage from './pages/404/Page';
import IndexPage from './pages/Index/Page';
import LuckyNumberActivityPage from './pages/LuckyNumber/Activity/Page';
import LuckyNumberHistoryPage from './pages/LuckyNumber/History/Page';
import LuckyNumberListPage from './pages/LuckyNumber/List/Page';
import OptionDrawActivityPage from './pages/OptionDraw/Activity/Page';
import OptionDrawListPage from './pages/OptionDraw/List/Page';
import PromiseNewPage from './pages/Promise/New/Page';
import PromisePage from './pages/Promise/Page';
import { theme } from './theme';

import './styles/index.less';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <HeaderProvider>
                    <BaseLayout>
                    <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/promise" element={<PromisePage />} />
                        <Route
                            path="/promise-new"
                            element={<PromiseNewPage />}
                        />
                        <Route
                            path="/lucky-number/:activityKey"
                            element={<LuckyNumberListPage />}
                        />
                        <Route
                            path="/lucky-number/:activityKey/activity"
                            element={<LuckyNumberActivityPage />}
                        />
                        <Route
                            path="/lucky-number/:activityKey/history"
                            element={<LuckyNumberHistoryPage />}
                        />
                        <Route
                            path="/option-draw/:activityKey"
                            element={<OptionDrawListPage />}
                        />
                        <Route
                            path="/option-draw/:activityKey/activity"
                            element={<OptionDrawActivityPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                    </BaseLayout>
                </HeaderProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
