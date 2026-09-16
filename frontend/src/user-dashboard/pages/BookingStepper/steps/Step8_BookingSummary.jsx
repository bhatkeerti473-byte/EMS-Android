import React, { useEffect } from 'react';

const Step8_BookingSummary = ({ data, nextStep, prevStep, setBookingData }) => {
  const { client, event, location, venue, pricing, additionalServices, package: pkg } = data;

  useEffect(() => {
    // Calculate totals whenever this step mounts or data changes
    const addonsTotal = additionalServices.reduce((acc, curr) => acc + curr.price, 0);
    const baseTotal = pkg ? Number(pkg.offerPrice || pkg.price || 0) : 0;
    const finalTotal = baseTotal + addonsTotal;
    const advanceAmount = finalTotal * 0.3; // 30% advance

    setBookingData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        addonsTotal,
        finalTotal,
        advanceAmount
      }
    }));
  }, [additionalServices, pkg, setBookingData]);

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Booking Summary</h3>

      <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: '#f8fafc', padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1e293b' }}>{pkg?.name || "Custom Event"}</h4>
          <p style={{ margin: 0, color: '#64748b' }}>{venue.isOwnVenue ? venue.selectedVenue.name : venue.selectedVenue?.name} • {new Date(event.date).toLocaleDateString()}</p>
        </div>

        <div style={{ padding: '20px' }}>
          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.85rem' }}>Client</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{client.useProfileInfo ? 'Ashwitha Naik (Profile)' : client.name}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.85rem' }}>Location</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{location.city}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.85rem' }}>Guests</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{event.guests}</p>
            </div>
            <div>
              <p style={{ margin: '0 0 5px 0', color: '#64748b', fontSize: '0.85rem' }}>Event Type</p>
              <p style={{ margin: 0, fontWeight: '500' }}>{event.type}</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '20px 0' }} />

          {/* Pricing Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#475569' }}>Package Price</span>
              <span style={{ fontWeight: '500' }}>₹{pricing.baseTotal.toLocaleString()}</span>
            </div>
            
            {additionalServices.length > 0 && (
              <div style={{ marginBottom: '10px' }}>
                <span style={{ color: '#475569', display: 'block', marginBottom: '5px' }}>Additional Services</span>
                {additionalServices.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#64748b', paddingLeft: '10px', marginBottom: '5px' }}>
                    <span>+ {s.name}</span>
                    <span>₹{s.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}

            <hr style={{ border: 'none', borderTop: '1px solid #cbd5e1', margin: '15px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ color: '#475569' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>₹{(pricing.baseTotal + pricing.addonsTotal).toLocaleString()}</span>
            </div>

            {pricing.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981', marginBottom: '10px' }}>
                <span>Discount</span>
                <span>- ₹{pricing.discount.toLocaleString()}</span>
              </div>
            )}
          </div>

          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Final Total</span>
              <span>₹{pricing.finalTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#3b82f6', fontWeight: '600' }}>
              <span>Advance Payment (30%)</span>
              <span>₹{pricing.advanceAmount.toLocaleString()}</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="terms" />
            <label htmlFor="terms" style={{ fontSize: '0.9rem', color: '#475569' }}>I agree to the booking terms & conditions</label>
          </div>

        </div>
      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button className="btn-next" onClick={nextStep} style={{ background: '#10b981' }}>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default Step8_BookingSummary;
