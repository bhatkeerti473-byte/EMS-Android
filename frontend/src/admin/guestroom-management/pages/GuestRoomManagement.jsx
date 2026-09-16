import React from 'react';
import { Hotel } from 'lucide-react';

export default function GuestRoomManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <Hotel size={24} className="text-primary" />
          <h1>Guest Room Management</h1>
        </div>
        <p className="admin-subtitle">Manage guest accommodations and room blocks.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>Guest room configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
