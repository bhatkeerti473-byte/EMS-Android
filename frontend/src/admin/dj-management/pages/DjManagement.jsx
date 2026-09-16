import React from 'react';
import { Music } from 'lucide-react';

export default function DjManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <Music size={24} className="text-primary" />
          <h1>DJ / Sound / Lighting</h1>
        </div>
        <p className="admin-subtitle">Manage DJ packages, sound systems, and lighting rentals.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>DJ and Sound configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
