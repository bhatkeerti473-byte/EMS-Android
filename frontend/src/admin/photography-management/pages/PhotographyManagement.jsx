import React from 'react';
import { Camera } from 'lucide-react';

export default function PhotographyManagement() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header-title">
          <Camera size={24} className="text-primary" />
          <h1>Photography & Videography</h1>
        </div>
        <p className="admin-subtitle">Manage photography packages, drone coverage, and video editing services.</p>
      </header>
      
      <div className="admin-content-section">
        <div className="empty-state">
          <p>Photography configuration will be added here.</p>
        </div>
      </div>
    </div>
  );
}
