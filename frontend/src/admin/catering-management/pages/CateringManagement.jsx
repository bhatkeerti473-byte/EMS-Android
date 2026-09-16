import React from 'react';
import { Layout, ChefHat } from 'lucide-react';

export default function CateringManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <ChefHat size={24} className="text-primary" />
          <h1>Catering Management</h1>
        </div>
        <p className="admin-subtitle">Manage catering menus, packages, and extra food items.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>Catering packages and items configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
