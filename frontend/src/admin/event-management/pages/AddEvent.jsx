import React, { useState, useRef } from 'react';
import { 
  CloudUpload, Bold, Italic, Underline, Strikethrough, 
  List, ListOrdered, AlignLeft, Link2, Info
} from 'lucide-react';

function AddEvent({ onCancel }) {
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    shortDescription: '',
    detailedDescription: '',
    startingPrice: '',
    maxPrice: '',
    status: true,
    duration: '',
    minGuest: '',
    maxGuest: '',
    displayOrder: '',
  });

  const [features, setFeatures] = useState({
    indoor: false,
    outdoor: false,
    acHall: false,
    nonAcHall: false,
    parking: false,
    catering: false,
    cateringAvailable: false,
    decorationAvailable: false,
    djAvailable: false,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleFeature = (key) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    console.log("Draft saved:", { formData, features, imagePreview });
    alert("Event saved as draft!");
  };

  const handlePublish = () => {
    console.log("Event published:", { formData, features, imagePreview });
    alert("Event published successfully!");
    onCancel();
  };

  const handleReset = () => {
    setFormData({
      eventName: '',
      category: '',
      shortDescription: '',
      detailedDescription: '',
      startingPrice: '',
      maxPrice: '',
      status: true,
      duration: '',
      minGuest: '',
      maxGuest: '',
      displayOrder: '',
    });
    setFeatures({
      indoor: false,
      outdoor: false,
      acHall: false,
      nonAcHall: false,
      parking: false,
      catering: false,
      cateringAvailable: false,
      decorationAvailable: false,
      djAvailable: false,
    });
    setImagePreview(null);
  };

  // Preview Data Fallbacks
  const previewCategory = formData.category || "Category";
  const previewName = formData.eventName || "Event Name";
  const previewDesc = formData.shortDescription || "Enter short description about the event to see preview.";
  const previewPrice = formData.startingPrice ? `₹ ${Number(formData.startingPrice).toLocaleString('en-IN')}` : "₹ 0";
  const defaultImg = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=400&fit=crop";

  return (
    <div className="flex flex-col gap-6 relative pb-24">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Event</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <span>Dashboard</span>
          <span>›</span>
          <span>Event Management</span>
          <span>›</span>
          <span className="text-gray-900 font-semibold">Add New Event</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (Forms) */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Event Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              Event Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Event Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="Enter event name" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-gray-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Select Category <span className="text-red-500">*</span></label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors text-gray-600 font-medium appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M6%209L12%2015L18%209%22%20stroke%3D%22%239CA3AF%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-no-repeat bg-[position:right_10px_center]"
                >
                  <option value="">Select event category</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Social">Social Gathering</option>
                </select>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Short Description <span className="text-red-500">*</span></label>
              <textarea 
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Enter short description about the event" 
                maxLength={150}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-gray-400 font-medium resize-none h-20"
              />
              <div className="text-right text-[11px] font-semibold text-gray-400 mt-1">{formData.shortDescription.length}/150</div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Detailed Description <span className="text-red-500">*</span></label>
              <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 transition-all">
                {/* Rich Text Toolbar Mock */}
                <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Bold size={16} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Italic size={16} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Underline size={16} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Strikethrough size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><List size={16} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><ListOrdered size={16} /></button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><AlignLeft size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"><Link2 size={16} /></button>
                </div>
                <textarea 
                  name="detailedDescription"
                  value={formData.detailedDescription}
                  onChange={handleInputChange}
                  placeholder="Enter detailed description about the event" 
                  maxLength={1000}
                  className="w-full px-4 py-3 bg-white border-0 text-[14px] focus:outline-none placeholder:text-gray-400 font-medium resize-none h-32"
                />
              </div>
              <div className="text-right text-[11px] font-semibold text-gray-400 mt-1">{formData.detailedDescription.length}/1000</div>
            </div>
          </div>

          {/* Pricing & Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-5">Pricing & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Starting Price (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  placeholder="Enter starting price" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-gray-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Maximum Price (₹)</label>
                <input 
                  type="number" 
                  name="maxPrice"
                  value={formData.maxPrice}
                  onChange={handleInputChange}
                  placeholder="Enter maximum price (optional)" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-[14px] focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors placeholder:text-gray-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">Status <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-3 h-[42px]">
                  <button 
                    onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.status ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-[14px] font-semibold text-gray-700">Enable this event</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-5">Additional Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-[12px] font-bold text-gray-900 mb-1.5">Event Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g. 4 Hours" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400 font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-900 mb-1.5 flex items-center gap-1">Min. Guest Count <Info size={12} className="text-gray-400" /></label>
                <input type="number" name="minGuest" value={formData.minGuest} onChange={handleInputChange} placeholder="e.g. 50" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400 font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-900 mb-1.5 flex items-center gap-1">Max. Guest Count <Info size={12} className="text-gray-400" /></label>
                <input type="number" name="maxGuest" value={formData.maxGuest} onChange={handleInputChange} placeholder="e.g. 1000" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400 font-medium" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-gray-900 mb-1.5 flex items-center gap-1">Display Order <Info size={12} className="text-gray-400" /></label>
                <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleInputChange} placeholder="e.g. 1" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-orange-500 transition-colors placeholder:text-gray-400 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-900 mb-3">Event Features (Select all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {Object.keys(features).map((key) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  return (
                    <label key={key} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${features[key] ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                      <input 
                        type="checkbox" 
                        checked={features[key]}
                        onChange={() => toggleFeature(key)}
                        className="w-3.5 h-3.5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="text-[12px] font-semibold">{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Media & Preview) */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          
          {/* Event Image */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Event Image</h3>
            <div 
              className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <CloudUpload size={40} className="text-blue-500 mb-3" />
              <p className="text-[14px] font-bold text-gray-900 mb-1">Drag & drop image here</p>
              <p className="text-[12px] font-semibold text-gray-500 mb-4">or</p>
              <button className="px-5 py-2 border border-blue-200 text-blue-600 bg-white rounded-lg text-[13px] font-bold hover:bg-blue-50 transition-colors">
                Browse Image
              </button>
            </div>
            <div className="text-center mt-4 text-[11px] font-medium text-gray-400">
              Recommended size: 1200 x 800 px (Max 5MB)<br/>
              Supported formats: JPG, PNG, WEBP
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-[16px] font-bold text-gray-900 mb-4">Live Preview</h3>
            
            <div className="rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full bg-white">
              <div className="w-full h-40 bg-gray-200 relative">
                <img 
                  src={imagePreview || defaultImg} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <span className="inline-block px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-bold w-fit border border-purple-100 mb-3">
                  {previewCategory}
                </span>
                <h4 className="text-[18px] font-black text-gray-900 mb-2">{previewName}</h4>
                <p className="text-[13px] font-medium text-gray-500 leading-relaxed mb-6 line-clamp-2">
                  {previewDesc}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-gray-500">Starting From</span>
                  <span className="text-[18px] font-black text-green-600">{previewPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors flex-1 sm:flex-none text-center"
          >
            Cancel
          </button>
          <button 
            onClick={handleReset}
            className="px-6 py-2.5 border border-orange-200 rounded-lg text-sm font-bold text-orange-500 hover:bg-orange-50 transition-colors flex-1 sm:flex-none text-center"
          >
            Reset
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleSaveDraft}
            className="px-6 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none text-center shadow-sm"
          >
            Save as Draft
          </button>
          <button 
            onClick={handlePublish}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold transition-colors flex-1 sm:flex-none text-center shadow-sm"
          >
            Publish Event
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEvent;
