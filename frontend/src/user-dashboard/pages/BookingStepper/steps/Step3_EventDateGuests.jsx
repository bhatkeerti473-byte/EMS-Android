import React from 'react';

const Step3_EventDateGuests = ({ data, updateData, nextStep, prevStep }) => {
  const { event, package: pkg } = data;

  const handleChange = (e) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="step-wrapper">
      <h3>Event Details</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        
        {/* Event Type */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>Event Type</label>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
              type="text"
              name="type"
              value={event.type}
              onChange={handleChange}
              disabled={!!pkg?.eventType}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '6px', 
                border: '1px solid #cbd5e1',
                background: pkg?.eventType ? '#f8fafc' : 'white',
                color: pkg?.eventType ? '#64748b' : '#0f172a'
              }}
            />
            {pkg?.eventType && <span style={{ color: '#10b981', fontSize: '1.2rem' }}>✓</span>}
          </div>
          {pkg?.eventType && (
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '5px' }}>Locked by package selection</p>
          )}
        </div>

        {/* Expected Guests */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>Expected Guests</label>
          <input 
            type="number"
            name="guests"
            value={event.guests}
            onChange={handleChange}
            placeholder="e.g. 300"
            min="1"
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        {/* Event Date */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>Event Date</label>
          <input 
            type="date"
            name="date"
            value={event.date}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          />
        </div>

        {/* Event Time */}
        <div className="form-group">
          <label style={{ display: 'block', marginBottom: '8px', color: '#475569', fontWeight: '500' }}>Event Time</label>
          <select 
            name="timeSlot"
            value={event.timeSlot}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          >
            <option value="">Select Time Slot</option>
            <option value="Morning (9 AM - 2 PM)">Morning (9 AM - 2 PM)</option>
            <option value="Evening (5 PM - 11 PM)">Evening (5 PM - 11 PM)</option>
            <option value="Full Day (9 AM - 11 PM)">Full Day (9 AM - 11 PM)</option>
          </select>
        </div>

      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button 
          className="btn-next" 
          onClick={nextStep}
          disabled={!event.date || !event.guests}
          style={{ opacity: (!event.date || !event.guests) ? 0.5 : 1 }}
        >
          Check Availability
        </button>
      </div>
    </div>
  );
};

export default Step3_EventDateGuests;
