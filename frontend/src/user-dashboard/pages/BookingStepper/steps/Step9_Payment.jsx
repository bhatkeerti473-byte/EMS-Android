import React, { useState } from 'react';
import axios from 'axios';

const Step9_Payment = ({ data, prevStep, navigate }) => {
  const { pricing, client, location, event, venue, package: pkg, customizations, additionalServices } = data;
  const [paymentOption, setPaymentOption] = useState('advance');
  const [loading, setLoading] = useState(false);

  const amountToPay = paymentOption === 'advance' ? pricing.advanceAmount : pricing.finalTotal;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Mock payment payload
      const bookingPayload = {
        client_id: "user123", // Mock or from auth context
        phone_number: client.phone || "9876543210",
        clientName: client.name || "Ashwitha Naik",
        clientEmail: client.email || "ashwitha@example.com",
        event_type: event.type || "Wedding",
        event_date: event.date,
        time_slot: event.timeSlot || "Full Day (9 AM - 11 PM)",
        venue_id: venue.isOwnVenue ? "OWN_VENUE" : venue.selectedVenue._id,
        venueName: venue.isOwnVenue ? venue.selectedVenue.name : venue.selectedVenue.name,
        isOwnVenue: venue.isOwnVenue,
        ownVenueDetails: venue.isOwnVenue ? venue.selectedVenue : null,
        packageId: pkg?._id || "CUSTOM",
        total_cost: pricing.finalTotal,
        amount_paid: amountToPay,
        guests: event.guests,
        location: location.city,
        selectedServices: customizations,
        additionalServices: additionalServices
      };

      // Simulating API call for booking request
      const res = await axios.post('http://localhost:5000/api/bookings/check-and-reserve', bookingPayload);
      
      if (res.data.success) {
        // Success state
        navigate('/booking-success', { state: { bookingId: res.data.booking_id, amountPaid: amountToPay, instantBooking: res.data.instantBooking } });
      } else {
        alert("Booking failed: " + res.data.message);
      }
    } catch (error) {
      console.error("Booking Error", error);
      alert("Error submitting booking.");
    }
    setLoading(false);
  };

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Choose Payment Option</h3>

      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
          <label style={{ 
            border: paymentOption === 'advance' ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: paymentOption === 'advance' ? '#eff6ff' : 'white'
          }}>
            <input 
              type="radio" 
              name="payment" 
              value="advance" 
              checked={paymentOption === 'advance'}
              onChange={() => setPaymentOption('advance')}
              style={{ transform: 'scale(1.2)' }}
            />
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Pay Advance – 30%</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Secure your booking now. Pay the rest later.</p>
            </div>
            <div style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b' }}>
              ₹{pricing.advanceAmount.toLocaleString()}
            </div>
          </label>

          <label style={{ 
            border: paymentOption === 'full' ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
            borderRadius: '8px', 
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: paymentOption === 'full' ? '#eff6ff' : 'white'
          }}>
            <input 
              type="radio" 
              name="payment" 
              value="full" 
              checked={paymentOption === 'full'}
              onChange={() => setPaymentOption('full')}
              style={{ transform: 'scale(1.2)' }}
            />
            <div>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Pay Full Amount</p>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>No pending balances.</p>
            </div>
            <div style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '1.2rem', color: '#1e293b' }}>
              ₹{pricing.finalTotal.toLocaleString()}
            </div>
          </label>
        </div>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
          <h4 style={{ margin: '0 0 15px 0' }}>Payment Breakdown</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#475569' }}>Total Event Cost</span>
            <span style={{ fontWeight: '500' }}>₹{pricing.finalTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#3b82f6', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Amount to Pay Now</span>
            <span>₹{amountToPay.toLocaleString()}</span>
          </div>
          {paymentOption === 'advance' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #cbd5e1', paddingTop: '10px', marginTop: '10px' }}>
              <span style={{ color: '#64748b' }}>Remaining Balance</span>
              <span style={{ fontWeight: '500' }}>₹{(pricing.finalTotal - pricing.advanceAmount).toLocaleString()}</span>
            </div>
          )}
        </div>

      </div>

      <div className="step-actions" style={{ justifyContent: 'center', gap: '20px' }}>
        <button className="btn-prev" onClick={prevStep} disabled={loading}>Back</button>
        <button 
          className="btn-next" 
          onClick={handlePayment}
          disabled={loading}
          style={{ padding: '15px 40px', fontSize: '1.1rem', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          {loading ? "Processing..." : `Pay ₹${amountToPay.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
};

export default Step9_Payment;
