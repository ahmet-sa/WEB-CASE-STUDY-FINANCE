import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authslice';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <div>
        <h1>Welcome to Dashboard!</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default DashboardPage;
