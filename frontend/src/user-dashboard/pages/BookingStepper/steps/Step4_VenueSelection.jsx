import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Step4_VenueSelection = ({ data, updateData, nextStep, prevStep }) => {
  const { event, location, venue } = data;
  const [activeTab, setActiveTab] = useState('ems'); // 'ems' or 'own'
  const [availableVenues, setAvailableVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Own venue state
  const [ownVenueDetails, setOwnVenueDetails] = useState({
    name: '',
    address: '',
    capacity: '',
    contactPerson: '',
    phone: ''
  });

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/venues/available`, {
          params: {
            city: location.city,
            date: event.date,
            guests: event.guests
          }
        });
        if (res.data.success) {
          setAvailableVenues(res.data.venues);
        }
      } catch (error) {
        console.error("Error fetching venues", error);
      }
      setLoading(false);
    };

    if (activeTab === 'ems') {
      fetchVenues();
    }
  }, [location.city, event.date, event.guests, activeTab]);

  const handleSelectEMSVenue = (selected) => {
    updateData({
      selectedVenue: selected,
      isOwnVenue: false
    });
  };

  const handleOwnVenueChange = (e) => {
    setOwnVenueDetails({
      ...ownVenueDetails,
      [e.target.name]: e.target.value
    });
  };

  const submitOwnVenue = () => {
    updateData({
      selectedVenue: ownVenueDetails,
      isOwnVenue: true
    });
  };

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Where would you like to host your event?</h3>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => setActiveTab('ems')}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '30px', 
            border: '1px solid #3b82f6',
            background: activeTab === 'ems' ? '#3b82f6' : 'transparent',
            color: activeTab === 'ems' ? 'white' : '#3b82f6',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ● Select from EMS Venues
        </button>
        <button 
          onClick={() => setActiveTab('own')}
          style={{ 
            padding: '12px 24px', 
            borderRadius: '30px', 
            border: '1px solid #64748b',
            background: activeTab === 'own' ? '#64748b' : 'transparent',
            color: activeTab === 'own' ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ○ I already have my own venue
        </button>
      </div>

      {activeTab === 'ems' && (
        <div className="ems-venues">
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Available Venues in {location.city} | {new Date(event.date).toLocaleDateString()} | {event.guests} Guests
          </p>

          {loading ? (
            <p>Loading available venues...</p>
          ) : availableVenues.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px' }}>
              <p>No EMS venues available matching your criteria.</p>
              <button onClick={() => prevStep()} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Change date or location</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {availableVenues.map(v => (
                <div key={v._id} style={{ 
                  border: venue.selectedVenue?._id === v._id ? '2px solid #3b82f6' : '1px solid #e2e8f0', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  transform: venue.selectedVenue?._id === v._id ? 'translateY(-4px)' : 'none',
                  boxShadow: venue.selectedVenue?._id === v._id ? '0 10px 25px rgba(59, 130, 246, 0.2)' : 'none'
                }}
                onClick={() => handleSelectEMSVenue(v)}
                >
                  <div style={{ height: '150px', background: '#e2e8f0', backgroundImage: `url(${v.images?.[0] || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>{v.name}</h4>
                    <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '0.9rem' }}>📍 {v.location}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.85rem' }}>
                      <span>👥 Capacity: {v.capacity}</span>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Available</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{v.price?.toLocaleString()}</span>
                      <button 
                        style={{ 
                          background: venue.selectedVenue?._id === v._id ? '#3b82f6' : '#f1f5f9', 
                          color: venue.selectedVenue?._id === v._id ? 'white' : '#334155',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        {venue.selectedVenue?._id === v._id ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'own' && (
        <div className="own-venue" style={{ maxWidth: '600px', margin: '0 auto', background: '#f8fafc', padding: '30px', borderRadius: '12px' }}>
          <h4 style={{ margin: '0 0 20px 0' }}>My Own Venue Details</h4>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <input name="name" value={ownVenueDetails.name} onChange={handleOwnVenueChange} placeholder="Venue Name" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input name="address" value={ownVenueDetails.address} onChange={handleOwnVenueChange} placeholder="Full Address" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input name="capacity" type="number" value={ownVenueDetails.capacity} onChange={handleOwnVenueChange} placeholder="Approx Capacity" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <input name="contactPerson" value={ownVenueDetails.contactPerson} onChange={handleOwnVenueChange} placeholder="Contact Person" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input name="phone" value={ownVenueDetails.phone} onChange={handleOwnVenueChange} placeholder="Phone Number" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>

            <div style={{ marginTop: '20px', padding: '15px', background: '#fffbeb', color: '#d97706', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>⏳</span>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Venue Verification Required</strong><br/>Our team will verify this venue before booking confirmation.</p>
            </div>

            <button 
              onClick={submitOwnVenue}
              style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }}
            >
              Save Own Venue
            </button>
          </div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button 
          className="btn-next" 
          onClick={nextStep}
          disabled={!venue.selectedVenue}
          style={{ opacity: !venue.selectedVenue ? 0.5 : 1 }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step4_VenueSelection;
