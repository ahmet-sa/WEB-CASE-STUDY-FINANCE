import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DebtsPage from './pages/DebtsPage';
import PaymentPlanPage from './pages/PaymentPlanPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} /> {}
            <Route path="/debts" element={<DebtsPage />} /> {}
            <Route path="/payment-plan" element={<PaymentPlanPage />} /> {}
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
