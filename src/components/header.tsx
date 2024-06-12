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
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white text-white flex items-center justify-between px-4  ">
      <div>
        <button onClick={toggleDrawer} className="text-primary bg-white hover:border-primary">
          <FontAwesomeIcon icon={faBars} /> 
        </button>
      </div>
      <div>
        <button onClick={handleLogout} className="text-white bg-primary-light hover:border-primary">Sign Out</button>
      </div>
    </header>
  );
};

export default Header;
