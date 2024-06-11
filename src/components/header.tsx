// Header.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authslice';

interface HeaderProps {
  toggleDrawer: () => void; 
}

const Header: React.FC<HeaderProps> = ({ toggleDrawer }) => { 
  const dispatch = useDispatch();

  const handleLogout = () => {

    dispatch(logout());
  };

  return (
    <header style={{ height: '80px', backgroundColor: '#333', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
      <div>
        <button onClick={toggleDrawer} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Open Drawer</button>
      </div>
      <div>
        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>Sign Out</button>
      </div>
    </header>
  );
};

export default Header;
