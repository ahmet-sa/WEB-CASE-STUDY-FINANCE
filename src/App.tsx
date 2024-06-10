import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Routes eklendi
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        <Routes> {/* Routes bileşeni ekleniyor */}
          <Route exact path="/" element={<LoginPage />} /> {/* Route bileşenleri element prop'uyla değiştirildi */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
