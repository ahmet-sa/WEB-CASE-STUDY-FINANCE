import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { RootState } from './store/store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import DebtsPage from './pages/DebtsPage';
import PaymentPlanPage from './pages/PaymentPlanPage';
import Header from './components/header';
import Drawer from './components/drawer'; 
import { useSelector } from 'react-redux';
import './App.css';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(prevState => !prevState);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <div className={`app-container pa-4 ${isDrawerOpen ? 'shifted' : ''}`}>
            {isAuthenticated && <Header toggleDrawer={toggleDrawer} />}
            {isAuthenticated && <Drawer isOpen={isDrawerOpen} onClose={toggleDrawer} />}
            <Routes >
              {isAuthenticated ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="/register" element={<Navigate to="/dashboard" />} />
                  <Route path="/login" element={<Navigate to="/dashboard" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<Navigate to="/login" />} />
                  <Route path="/debts" element={<Navigate to="/login" />} />
                  <Route path="/payment-plan" element={<Navigate to="/login" />} />
                </>
              )}
              {isAuthenticated && (
                <>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/debts" element={<DebtsPage />} />
                  <Route path="/payment-plan" element={<PaymentPlanPage />} />
                </>
              )}
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
