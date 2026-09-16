import React from 'react';

const Step6_CustomizeIncluded = ({ data, updateData, nextStep, prevStep }) => {
  const { customizations } = data;

  const handleChange = (category, field, value) => {
    updateData({
      [category]: {
        ...customizations[category],
        [field]: value
      }
    });
  };

  return (
    <div className="step-wrapper">
      <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Customize Included Services</h3>

      <div style={{ display: 'grid', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Decoration */}
        <div style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Decoration</h4>
            <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>Included</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '500', margin: '0 0 10px 0' }}>Decoration Theme</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Classic', 'Royal', 'Floral', 'Modern'].map(theme => (
                <label key={theme} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="radio" name="decor_theme" checked={customizations.decoration?.theme === theme} onChange={() => handleChange('decoration', 'theme', theme)} />
                  {theme}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontWeight: '500', margin: '0 0 10px 0' }}>Flower Type</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Fresh', 'Artificial', 'Mixed'].map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="radio" name="flower_type" checked={customizations.decoration?.flowerType === type} onChange={() => handleChange('decoration', 'flowerType', type)} />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Catering */}
        <div style={{ padding: '25px', border: '1px solid #e2e8f0', borderRadius: '12px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b' }}>Catering</h4>
            <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' }}>Included</span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '500', margin: '0 0 10px 0' }}>Cuisine Preference</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['North Indian', 'South Indian', 'Chinese', 'Continental'].map(cuisine => {
                const cuisines = customizations.catering?.cuisines || [];
                return (
                  <label key={cuisine} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={cuisines.includes(cuisine)} 
                      onChange={(e) => {
                        let newCuisines = e.target.checked ? [...cuisines, cuisine] : cuisines.filter(c => c !== cuisine);
                        handleChange('catering', 'cuisines', newCuisines);
                      }} 
                    />
                    {cuisine}
                  </label>
                )
              })}
            </div>
          </div>
          
          <div>
            <p style={{ fontWeight: '500', margin: '0 0 10px 0' }}>Meal Timing</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Lunch', 'Dinner'].map(meal => (
                <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input type="radio" name="meal_timing" checked={customizations.catering?.mealTiming === meal} onChange={() => handleChange('catering', 'mealTiming', meal)} />
                  {meal}
                </label>
              ))}
            </div>
          </div>
        </div>

      </div>

      <div className="step-actions">
        <button className="btn-prev" onClick={prevStep}>Back</button>
        <button className="btn-next" onClick={nextStep}>Continue to Add-ons</button>
      </div>
    </div>
  );
};

export default Step6_CustomizeIncluded;
