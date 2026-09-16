import React from 'react';

const Step1_ClientDetails = ({ data, updateData, nextStep }) => {
  const { client } = data;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateData({
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="step-wrapper">
      <h3>Booking Information</h3>
      
      <div className="form-group" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            name="useProfileInfo" 
            checked={client.useProfileInfo} 
            onChange={handleChange}
          />
          ☑ Use my profile information
        </label>
      </div>

      {!client.useProfileInfo && (
        <div className="manual-client-info">
          <div style={{ marginBottom: '15px' }}>
            <label>Name</label>
            <input 
              type="text" 
              name="name"
              value={client.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Enter contact name"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Phone</label>
            <input 
              type="text" 
              name="phone"
              value={client.phone}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Enter phone number"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input 
              type="email" 
              name="email"
              value={client.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              placeholder="Enter email address"
            />
          </div>
        </div>
      )}

      {client.useProfileInfo && (
        <div className="profile-info-display" style={{ padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px' }}>
          <p><strong>Name:</strong> From Profile</p>
          <p><strong>Phone:</strong> From Profile</p>
          <p><strong>Email:</strong> From Profile</p>
          <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', padding: 0, marginTop: '10px', cursor: 'pointer' }}>
            [ Edit Profile ]
          </button>
        </div>
      )}

      <div className="booking-for" style={{ marginTop: '30px' }}>
        <h4>Booking For</h4>
        <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
          {['Myself', 'Family Member', 'Organization / Company'].map(opt => (
            <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="bookingFor"
                value={opt}
                checked={client.bookingFor === opt}
                onChange={handleChange}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div className="step-actions" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-next" onClick={nextStep}>Continue</button>
      </div>
    </div>
  );
};

export default Step1_ClientDetails;
