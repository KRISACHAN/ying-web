import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import IndexPage from './pages/index/page';
import PromisePage from './pages/promise/page';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/promise" element={<PromisePage />} />
                <Route path="/" element={<IndexPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
