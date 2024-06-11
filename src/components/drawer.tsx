import React from 'react';
import { Link } from 'react-router-dom';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    onClose(); 
  };

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link></li>
          <li><Link to="/debts" onClick={handleLinkClick}>Debts</Link></li>
          <li><Link to="/payment-plan" onClick={handleLinkClick}>Payment Plan</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
