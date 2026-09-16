import React from 'react';
import './PremiumLogo.css';
import logoImg from './ems_logo_transparent.png';

const PremiumLogo = ({ className = '', style = {}, size = '200px' }) => {
  return (
    <div 
      className={`premium-logo-container ${className}`} 
      style={{ width: size, height: size, ...style }}
    >
      <div className="glow-ring"></div>
      <div className="glow-ring-inner"></div>
      <div className="particles"></div>
      <div className="flare-1"></div>
      <div className="flare-2"></div>
      <div className="image-wrapper">
        <img src={logoImg} alt="EMS - Event Management System" className="premium-logo-image" />
      </div>
    </div>
  );
};

export default PremiumLogo;
