import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/setAvatar" element={<SetAvatar />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
