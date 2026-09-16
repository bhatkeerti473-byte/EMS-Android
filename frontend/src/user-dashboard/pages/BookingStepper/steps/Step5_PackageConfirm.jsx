import React from 'react';

const Step5_PackageConfirm = ({ data, nextStep, prevStep }) => {
  const { package: pkg, venue, event, location } = data;

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Package Overview</h3>

      <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '0 auto' }}>
        
        <div style={{ borderBottom: '1px solid #cbd5e1', paddingBottom: '20px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>{pkg ? (pkg.name || pkg.title) : 'Custom Event'}</h3>
          {pkg && <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', margin: 0 }}>₹{Number(pkg.offerPrice || pkg.price || 0).toLocaleString()}</p>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          <div>
            <p style={{ color: '#64748b', margin: '0 0 5px 0', fontSize: '0.9rem' }}>Venue</p>
            <p style={{ fontWeight: '500', margin: 0 }}>{venue.isOwnVenue ? venue.selectedVenue.name : venue.selectedVenue?.name}</p>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{venue.isOwnVenue ? venue.selectedVenue.address : venue.selectedVenue?.location}</p>
          </div>
          <div>
            <p style={{ color: '#64748b', margin: '0 0 5px 0', fontSize: '0.9rem' }}>Date & Guests</p>
            <p style={{ fontWeight: '500', margin: 0 }}>{new Date(event.date).toLocaleDateString()}</p>
            <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{event.guests} Guests</p>
          </div>
        </div>

        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#334155' }}>Included Services</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '500' }}>✓ Decoration</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '500' }}>✓ Catering</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '500' }}>✓ Photography</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '500' }}>✓ DJ</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '500' }}>✓ Stage Setup</span>
          </div>
        </div>

      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <h4 style={{ marginBottom: '20px' }}>Would you like to customize your package?</h4>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button 
            className="btn-next" 
            onClick={nextStep}
            style={{ padding: '12px 30px', background: '#3b82f6', borderRadius: '30px', fontWeight: 'bold' }}
          >
            Customize Package
          </button>
          <button 
            onClick={() => {
              // Skip customization step and go straight to Add-ons (Step 7)
              // We'll just trigger nextStep twice or rely on the container logic.
              nextStep();
            }}
            style={{ padding: '12px 30px', background: 'white', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '30px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Continue as Included
          </button>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
      </div>
    </div>
  );
};

export default Step5_PackageConfirm;
