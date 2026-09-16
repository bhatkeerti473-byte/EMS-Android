import React, { useState } from 'react';

const MOCK_SERVICES = {
  "Popular": [
    { id: 's1', name: 'Drone Photography', price: 8000, recommended: true },
    { id: 's2', name: 'Fireworks', price: 12000, recommended: true },
    { id: 's3', name: 'Welcome Board', price: 2000, recommended: true }
  ],
  "Decoration": [
    { id: 'd1', name: 'Entry Gate', price: 15000 },
    { id: 'd2', name: 'Balloon Decoration', price: 5000 },
    { id: 'd3', name: 'Flower Shower', price: 8000 }
  ],
  "Entertainment": [
    { id: 'e1', name: 'Live Band', price: 15000 },
    { id: 'e2', name: 'Dance Floor', price: 10000 }
  ]
};

const Step7_AdditionalServices = ({ data, updateData, nextStep, prevStep }) => {
  const { event } = data;
  const [selectedServices, setSelectedServices] = useState(data.additionalServices || []);

  const toggleService = (service) => {
    if (selectedServices.find(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleNext = () => {
    updateData(selectedServices);
    nextStep();
  };

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Additional Services</h3>
      
      {/* Smart Recommendations based on Guest count */}
      {event.guests >= 400 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
          <h4 style={{ color: '#d97706', margin: '0 0 10px 0' }}>✨ Recommended for your event</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#92400e' }}>Your guest count is high ({event.guests}). Consider adding extra capacity services:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '1px solid #fcd34d' }}>+ Extra Catering Counter</span>
            <span style={{ background: 'white', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '1px solid #fcd34d' }}>+ Additional Seating</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px' }}>
        {Object.entries(MOCK_SERVICES).map(([category, services]) => (
          <div key={category} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {category === 'Popular' && '🔥'} {category}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
              {services.map(service => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                return (
                  <div 
                    key={service.id}
                    onClick={() => toggleService(service)}
                    style={{ 
                      padding: '15px', 
                      border: isSelected ? '2px solid #f59e0b' : '1px solid #e2e8f0', 
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: isSelected ? '#fffbeb' : 'white',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <p style={{ margin: '0 0 5px 0', fontWeight: '500' }}>{service.name}</p>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>₹{service.price.toLocaleString()}</p>
                    </div>
                    <button style={{ 
                      background: isSelected ? '#f59e0b' : '#f1f5f9', 
                      color: isSelected ? 'white' : '#475569',
                      border: 'none',
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}>
                      {isSelected ? '✓' : '+'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button className="btn-next" onClick={handleNext}>Continue to Summary</button>
      </div>
    </div>
  );
};

export default Step7_AdditionalServices;
