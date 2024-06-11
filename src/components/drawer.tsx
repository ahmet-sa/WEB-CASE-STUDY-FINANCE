import React from 'react';
import { Link } from 'react-router-dom';

interface DrawerProps {
  isOpen: boolean;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen }) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-content">
        <h2>Menu</h2>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/debts">Debts</Link></li>
          <li><Link to="/payment-plan">Payment Plan</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Drawer;
