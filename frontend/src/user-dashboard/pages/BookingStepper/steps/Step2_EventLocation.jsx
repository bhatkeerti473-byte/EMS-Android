import React from 'react';

const Step2_EventLocation = ({ data, updateData, nextStep, prevStep }) => {
  const { location } = data;

  const popularLocations = ["Mangaluru", "Udupi", "Kundapura", "Bengaluru", "Mysuru"];

  const handleCitySelect = (city) => {
    updateData({ city, useCurrentLocation: false });
  };

  const handleUseCurrentLocation = () => {
    updateData({ useCurrentLocation: true, city: 'Current Location' });
  };

  return (
    <div className="step-wrapper">
      <h3>Where is your event?</h3>
      
      <div className="search-bar" style={{ marginBottom: '30px' }}>
        <input 
          type="text" 
          placeholder="🔍 Search city" 
          value={location.useCurrentLocation ? '' : location.city}
          onChange={(e) => updateData({ city: e.target.value, useCurrentLocation: false })}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <button 
          onClick={handleUseCurrentLocation}
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: location.useCurrentLocation ? '#eff6ff' : 'white', 
            border: location.useCurrentLocation ? '1px solid #3b82f6' : '1px solid #e2e8f0',
            color: location.useCurrentLocation ? '#1d4ed8' : '#334155',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontWeight: '500'
          }}
        >
          📍 Use My Current Location
        </button>
      </div>

      <div className="popular-locations">
        <h4 style={{ color: '#64748b', marginBottom: '15px' }}>Popular Locations</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {popularLocations.map(city => (
            <button
              key={city}
              onClick={() => handleCitySelect(city)}
              style={{
                padding: '8px 16px',
                background: location.city === city && !location.useCurrentLocation ? '#3b82f6' : '#f1f5f9',
                color: location.city === city && !location.useCurrentLocation ? 'white' : '#475569',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📍 {city}
            </button>
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button 
          className="btn-next" 
          onClick={nextStep}
          disabled={!location.city}
          style={{ opacity: !location.city ? 0.5 : 1 }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step2_EventLocation;
