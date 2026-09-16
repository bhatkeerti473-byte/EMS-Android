import React from 'react';
import { Layout, Paintbrush } from 'lucide-react';

export default function DecorationManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <Paintbrush size={24} className="text-primary" />
          <h1>Decoration Management</h1>
        </div>
        <p className="admin-subtitle">Manage decoration packages, themes, and inventory.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>Decoration packages configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
