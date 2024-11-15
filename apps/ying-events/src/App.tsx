import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PromisePage from './pages/PromisePage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/promise" element={<PromisePage />} />
                <Route path="*" element={<Navigate to="/promise" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
