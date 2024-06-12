import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authslice';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'; 

interface HeaderProps {
  toggleDrawer: () => void; 
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white text-white flex items-center justify-between px-4 !border-2 ">
      <div>
        <button onClick={toggleDrawer} className="text-primary bg-white hover:border-primary">
          <FontAwesomeIcon icon={faBars} /> 
        </button>
      </div>
      <div className='w-full flex justify-center text-primary'>
      <div className='w-full flex justify-center text-secondary text-25px'>
        {window.location.pathname === '/dashboard' ? 'Dashboard Page' :
        window.location.pathname === '/debts' ? 'Depts Page' :
        window.location.pathname === '/payment-plan' ? 'Payment Plan Page' : ''}
        </div>
        </div>
      <div>
        <button onClick={handleLogout} className=" !w-30 text-white bg-primary hover:border-primary">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;
