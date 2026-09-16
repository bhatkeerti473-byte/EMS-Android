import React, { useState } from 'react';
import { Package, Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddPackage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    eventType: 'Wedding',
    offerPrice: 0,
    components: [],
    cateringDetails: { foodItems: [] },
    venueOptions: []
  });

  const handleSave = () => {
    console.log("Saving Package: ", formData);
    alert("Package saved successfully!");
    navigate('/admin/packages');
  };

  const addComponent = () => {
    setFormData({
      ...formData,
      components: [...formData.components, { name: '', category: 'Venue', basePrice: 0, isRequired: false }]
    });
  };

  const addFoodItem = () => {
    setFormData({
      ...formData,
      cateringDetails: {
        foodItems: [...formData.cateringDetails.foodItems, { name: '', type: 'Veg', category: 'Main Course', price: 0, isIncluded: false }]
      }
    });
  };

  const addVenueOption = () => {
    setFormData({
      ...formData,
      venueOptions: [...formData.venueOptions, { name: '', type: 'AC', price: 0 }]
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/packages')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
              <Package className="text-orange-500" />
              Add Offer Package
            </h1>
            <p className="text-slate-500 mt-1">Configure pricing, components, and optional services.</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Save size={18} /> Save Package
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Package Name</label>
              <input type="text" className="w-full p-2.5 border rounded-lg" placeholder="e.g. Grand Wedding Package" 
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Offer Base Price</label>
              <input type="number" className="w-full p-2.5 border rounded-lg" placeholder="e.g. 200000" 
                value={formData.offerPrice} onChange={e => setFormData({...formData, offerPrice: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* Components */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-slate-800">Package Components</h2>
            <button onClick={addComponent} className="text-orange-500 font-bold text-sm flex items-center gap-1 hover:bg-orange-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Add Component
            </button>
          </div>
          <div className="space-y-3">
            {formData.components.map((comp, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input type="text" placeholder="Component Name (e.g. Photography)" className="flex-1 p-2 border rounded-md" value={comp.name} 
                  onChange={e => { const newC = [...formData.components]; newC[idx].name = e.target.value; setFormData({...formData, components: newC})}} />
                <input type="number" placeholder="Base Price" className="w-32 p-2 border rounded-md" value={comp.basePrice} 
                  onChange={e => { const newC = [...formData.components]; newC[idx].basePrice = Number(e.target.value); setFormData({...formData, components: newC})}} />
                <label className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <input type="checkbox" checked={comp.isRequired} 
                    onChange={e => { const newC = [...formData.components]; newC[idx].isRequired = e.target.checked; setFormData({...formData, components: newC})}} />
                  Required?
                </label>
                <button onClick={() => { const newC = formData.components.filter((_, i) => i !== idx); setFormData({...formData, components: newC})}} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Catering Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-slate-800">Catering Menu Setup</h2>
            <button onClick={addFoodItem} className="text-orange-500 font-bold text-sm flex items-center gap-1 hover:bg-orange-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Add Food Item
            </button>
          </div>
          <div className="space-y-3">
            {formData.cateringDetails.foodItems.map((food, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-emerald-50/30 p-3 rounded-xl border border-emerald-100">
                <input type="text" placeholder="Food Name (e.g. Biryani)" className="flex-1 p-2 border rounded-md" value={food.name} 
                  onChange={e => { const newF = [...formData.cateringDetails.foodItems]; newF[idx].name = e.target.value; setFormData({...formData, cateringDetails: {foodItems: newF}})}} />
                <select className="p-2 border rounded-md" value={food.type} 
                  onChange={e => { const newF = [...formData.cateringDetails.foodItems]; newF[idx].type = e.target.value; setFormData({...formData, cateringDetails: {foodItems: newF}})}} >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
                <input type="number" placeholder="Price (+₹)" className="w-24 p-2 border rounded-md" value={food.price} 
                  onChange={e => { const newF = [...formData.cateringDetails.foodItems]; newF[idx].price = Number(e.target.value); setFormData({...formData, cateringDetails: {foodItems: newF}})}} />
                <label className="flex items-center gap-1 text-xs font-bold text-slate-600">
                  <input type="checkbox" checked={food.isIncluded} 
                    onChange={e => { const newF = [...formData.cateringDetails.foodItems]; newF[idx].isIncluded = e.target.checked; setFormData({...formData, cateringDetails: {foodItems: newF}})}} />
                  Included in Base?
                </label>
                <button onClick={() => { const newF = formData.cateringDetails.foodItems.filter((_, i) => i !== idx); setFormData({...formData, cateringDetails: {foodItems: newF}})}} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Venue Options */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-slate-800">Venue Options</h2>
            <button onClick={addVenueOption} className="text-orange-500 font-bold text-sm flex items-center gap-1 hover:bg-orange-50 px-3 py-1.5 rounded-lg">
              <Plus size={16} /> Add Venue Link
            </button>
          </div>
          <div className="space-y-3">
            {formData.venueOptions.map((venue, idx) => (
              <div key={idx} className="flex gap-3 items-center bg-blue-50/30 p-3 rounded-xl border border-blue-100">
                <input type="text" placeholder="Venue Name (e.g. AC Grand Hall)" className="flex-1 p-2 border rounded-md" value={venue.name} 
                  onChange={e => { const newV = [...formData.venueOptions]; newV[idx].name = e.target.value; setFormData({...formData, venueOptions: newV})}} />
                <select className="p-2 border rounded-md" value={venue.type} 
                  onChange={e => { const newV = [...formData.venueOptions]; newV[idx].type = e.target.value; setFormData({...formData, venueOptions: newV})}} >
                  <option value="AC">AC</option>
                  <option value="Non-AC">Non-AC</option>
                  <option value="Premium">Premium</option>
                </select>
                <input type="number" placeholder="Venue Base Value (₹)" className="w-40 p-2 border rounded-md" value={venue.price} 
                  onChange={e => { const newV = [...formData.venueOptions]; newV[idx].price = Number(e.target.value); setFormData({...formData, venueOptions: newV})}} />
                <button onClick={() => { const newV = formData.venueOptions.filter((_, i) => i !== idx); setFormData({...formData, venueOptions: newV})}} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddPackage;
