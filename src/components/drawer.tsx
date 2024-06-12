import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faHandHoldingUsd, faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons'; 
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose }) => {
  const handleLinkClick = () => {
    onClose(); 
  };

  return (
    <div className={` bg-white   drawer  ${isOpen ? 'open' : ''}` }>
      <div className="drawer-content bg-primary-light rounded-10px h-full">
        <h2 className='text-white text-30px' >Study 
        Finance</h2>

        <div className='   rounded-10px bg-white w-full !items-center text-center' >
            <div className='pa-2 items-center '>
            <FontAwesomeIcon icon={faChartBar} className="text-primary mr-2" />
            <Link to="/dashboard" onClick={handleLinkClick} className="text-primary hover:text-primary-light text-18px">Dashboard</Link>
            </div>
        </div>

        <div className='rounded-10px mt-10px bg-white w-full !items-center text-center' >
            <div className='pa-2 items-center '>
            <FontAwesomeIcon icon={faHandHoldingUsd} className="text-primary mr-2" />
            <Link to="/debts" onClick={handleLinkClick} className="text-primary hover:text-primary-light text-18px">Debts</Link>
            </div>
        </div>

        <div className='rounded-10px mt-10px bg-white w-full !items-center text-center' >
            <div className='pa-2 items-center '>
            <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-primary mr-2" />
            <Link to="/payment-plan" onClick={handleLinkClick} className="text-primary hover:text-primary-light text-18px">Payment Plan</Link>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Drawer;
