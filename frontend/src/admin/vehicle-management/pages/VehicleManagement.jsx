import React from 'react';
import { Truck } from 'lucide-react';

export default function VehicleManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <Truck size={24} className="text-primary" />
          <h1>Vehicle Management</h1>
        </div>
        <p className="admin-subtitle">Manage transport services, luxury cars, and shuttle buses.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>Vehicle configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
