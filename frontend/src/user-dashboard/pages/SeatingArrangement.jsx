import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const SeatingArrangement = () => {
  const navigate = useNavigate();
  
  // State for selections
  const [seatingType, setSeatingType] = useState("round");
  const [diningSetup, setDiningSetup] = useState("buffet");
  const [addons, setAddons] = useState({
    extraChairs: 20,
    highChairs: 5,
    childrenChairs: 10,
    vipSofa: 2,
  });

  const updateAddon = (item, delta) => {
    setAddons(prev => ({
      ...prev,
      [item]: Math.max(0, prev[item] + delta)
    }));
  };

  const seatingOptions = [
    { id: "round", title: "Round Table", desc: "Classic setup with round tables", extra: "10 Seats per table" },
    { id: "rows", title: "Simple Chair (Rows)", desc: "Traditional row seating", extra: "250 Chairs" },
    { id: "mixed", title: "Mixed (Round + Rows)", desc: "Combination of both setups", extra: "Customizable" },
    { id: "ushape", title: "U Shape / Conference", desc: "For meetings & conferences", extra: "Customizable" },
  ];

  const diningOptions = [
    { id: "buffet", title: "Buffet System", desc: "Guests serve themselves", extra: "Ideal for large gatherings" },
    { id: "plated", title: "Plated / Table Service", desc: "Food served to each table", extra: "Formal dining experience" },
    { id: "both", title: "Both (Buffet + Live Counter)", desc: "Buffet with live counters", extra: "Best of both worlds" },
  ];

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Seating Arrangements" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          {/* Header */}
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "16px 0 4px", fontWeight: "bold" }}>Seating Arrangements</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose your preferred seating and dining options</p>
          </div>

          {/* Stepper (Matching the screenshot: 9 steps total, we are at 6) */}
          <div className="stepper-wrapper" style={{ margin: "24px 32px" }}>
            <div className="stepper-line-bg"></div>
            {[
              { label: "Select Date", status: "completed" },
              { label: "Event Type", status: "completed" },
              { label: "Select Venue", status: "completed" },
              { label: "Decoration & Catering", status: "completed" },
              { label: "Additional Services", status: "completed" },
              { label: "Seating Arrangements", status: "active", num: 6 },
              { label: "Booking Summary", status: "pending", num: 7 },
              { label: "Payment", status: "pending", num: 8 },
              { label: "Confirmation", status: "pending", num: 9 },
            ].map((step, idx) => (
              <div className="step-point" key={idx}>
                <div className={`step-circle ${step.status === 'completed' ? 'completed' : step.status === 'active' ? 'active' : ''}`}>
                  {step.status === 'completed' ? <Check size={16} /> : (step.num || idx + 1)}
                </div>
                <div className={`step-label ${step.status === 'pending' ? '' : 'active'}`}>{step.label}</div>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mx-8 mb-6 flex bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Selected Venue</div>
                  <div className="font-bold text-gray-900">Royal Palace Hall</div>
                  <div className="text-xs text-gray-400">Bangalore, Karnataka</div>
                </div>
             </div>
             
             <div className="flex flex-col border-l border-gray-100 pl-6">
                <div className="text-xs text-gray-500">Hall Capacity</div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  500 Guests
                </div>
             </div>

             <div className="flex flex-col border-l border-gray-100 pl-6">
                <div className="text-xs text-gray-500">Expected Guests</div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                  250 Guests
                </div>
             </div>

             <div className="flex flex-col border-l border-gray-100 pl-6">
                <div className="text-xs text-gray-500">Arrangement Style</div>
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg>
                  Round Table
                </div>
             </div>

             <div className="flex flex-col border-l border-gray-100 pl-6 pr-4 bg-green-50 rounded-lg p-2">
                <div className="text-xs text-green-700 flex items-center gap-1 font-medium">
                  <Save size={14} /> Save Progress
                </div>
                <div className="text-[10px] text-green-600 mt-1">Last saved: 2 mins ago</div>
             </div>
          </div>

          <div className="flex mx-8 border-b border-gray-200 mb-6">
            <button className="px-4 py-2 border-b-2 border-orange-500 text-orange-600 font-medium">Seating Type</button>
            <button className="px-4 py-2 text-gray-500 font-medium">Hall Layout (Preview)</button>
            <button className="px-4 py-2 text-gray-500 font-medium">Food & Dining Setup</button>
            <button className="px-4 py-2 text-gray-500 font-medium">Add-ons</button>
          </div>

          {/* Main Layout */}
          <div className="flex gap-8 px-8 pb-10">
            
            {/* Left Content */}
            <div className="flex-1 space-y-8">
              
              {/* 1. Seating Type */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-1">1. Choose Seating Type</h3>
                <p className="text-sm text-gray-500 mb-4">Select the seating arrangement you prefer for your event.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {seatingOptions.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setSeatingType(opt.id)}
                      className={`relative border rounded-xl p-4 cursor-pointer flex flex-col items-center text-center transition-all ${
                        seatingType === opt.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {seatingType === opt.id && (
                        <div className="absolute top-2 right-2 text-orange-500">
                          <CheckCircle2 size={18} fill="#f97316" color="white" />
                        </div>
                      )}
                      
                      {/* Simple CSS Icons to replace actual images since we don't have assets */}
                      <div className="h-16 w-16 mb-4 flex items-center justify-center text-orange-400">
                        {opt.id === 'round' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="3" r="1.5"/><circle cx="12" cy="21" r="1.5"/><circle cx="3" cy="12" r="1.5"/><circle cx="21" cy="12" r="1.5"/></svg>}
                        {opt.id === 'rows' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="4" y="4" width="4" height="4"/><rect x="10" y="4" width="4" height="4"/><rect x="16" y="4" width="4" height="4"/><rect x="4" y="10" width="4" height="4"/><rect x="10" y="10" width="4" height="4"/><rect x="16" y="10" width="4" height="4"/></svg>}
                        {opt.id === 'mixed' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="6" cy="6" r="3"/><rect x="12" y="4" width="4" height="4"/><rect x="18" y="4" width="4" height="4"/></svg>}
                        {opt.id === 'ushape' && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 6v12h12V6"/></svg>}
                      </div>

                      <h4 className="font-bold text-sm text-gray-900">{opt.title}</h4>
                      <p className="text-xs text-gray-500 my-1">{opt.desc}</p>
                      <div className="text-xs text-blue-600 mt-auto">{opt.extra}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Food & Dining Setup */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-1">2. Food & Dining Setup</h3>
                <p className="text-sm text-gray-500 mb-4">Choose how you would like your food to be served.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {diningOptions.map(opt => (
                    <div 
                      key={opt.id}
                      onClick={() => setDiningSetup(opt.id)}
                      className={`relative border rounded-xl p-4 cursor-pointer flex items-center gap-4 transition-all ${
                        diningSetup === opt.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      {diningSetup === opt.id && (
                        <div className="absolute top-2 left-2 text-orange-500">
                          <CheckCircle2 size={16} fill="#f97316" color="white" />
                        </div>
                      )}
                      
                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{opt.title}</h4>
                        <p className="text-xs text-gray-500 mb-1">{opt.desc}</p>
                        <div className="text-[10px] text-blue-600 font-medium">{opt.extra}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Additional Requirements */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg text-gray-900 mb-1">3. Additional Requirements</h3>
                <p className="text-sm text-gray-500 mb-4">Add extra items if required.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-orange-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 9V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M5 9h14M5 9l-2 13M19 9l2 13M3 13h18"/></svg></div>
                      <div>
                        <div className="font-bold text-sm">Extra Chairs</div>
                        <div className="text-xs text-gray-500">₹150 / Chair</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 mt-auto">
                      <button onClick={() => updateAddon('extraChairs', -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">-</button>
                      <span className="w-10 text-center font-bold text-sm">{addons.extraChairs}</span>
                      <button onClick={() => updateAddon('extraChairs', 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">+</button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-yellow-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg></div>
                      <div>
                        <div className="font-bold text-sm">High Chairs</div>
                        <div className="text-xs text-gray-500">₹200 / Chair</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 mt-auto">
                      <button onClick={() => updateAddon('highChairs', -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">-</button>
                      <span className="w-10 text-center font-bold text-sm">{addons.highChairs}</span>
                      <button onClick={() => updateAddon('highChairs', 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">+</button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-green-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg></div>
                      <div>
                        <div className="font-bold text-sm">Children Chairs</div>
                        <div className="text-xs text-gray-500">₹100 / Chair</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 mt-auto">
                      <button onClick={() => updateAddon('childrenChairs', -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">-</button>
                      <span className="w-10 text-center font-bold text-sm">{addons.childrenChairs}</span>
                      <button onClick={() => updateAddon('childrenChairs', 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">+</button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-blue-500"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                      <div>
                        <div className="font-bold text-sm">VIP Sofa</div>
                        <div className="text-xs text-gray-500">₹1,000 / Sofa</div>
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1 mt-auto">
                      <button onClick={() => updateAddon('vipSofa', -1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">-</button>
                      <span className="w-10 text-center font-bold text-sm">{addons.vipSofa}</span>
                      <button onClick={() => updateAddon('vipSofa', 1)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-200 rounded">+</button>
                    </div>
                  </div>

                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 text-gray-700 bg-white">
                  <ArrowLeft size={18} /> Back
                </button>
              </div>
              
            </div>

            {/* Right Sidebar (Summary) */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-900 mb-6">Your Selection Summary</h3>
                
                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Seating Type</div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="font-medium text-gray-900">{seatingOptions.find(o=>o.id === seatingType)?.title}</div>
                    <div className="text-gray-500 text-xs">{seatingType === 'round' ? '10 Seats per table' : ''}</div>
                  </div>
                  {seatingType === 'round' && (
                    <div className="flex justify-between items-center text-sm mt-2 text-gray-600">
                      <div>Total Table Required</div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">25 Tables</div>
                        <div className="text-xs">(250 Guests)</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <div className="text-xs text-gray-500 mb-2 font-medium">Food & Dining Setup</div>
                  <div className="font-medium text-gray-900 text-sm">{diningOptions.find(o=>o.id === diningSetup)?.title}</div>
                </div>

                <div className="mb-6 pb-6 border-b border-orange-200">
                  <div className="text-xs text-gray-500 mb-3 font-medium">Additional Requirements</div>
                  <div className="space-y-2">
                    {addons.extraChairs > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Extra Chairs</span>
                        <span className="font-medium text-gray-900">{addons.extraChairs}</span>
                      </div>
                    )}
                    {addons.highChairs > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">High Chairs</span>
                        <span className="font-medium text-gray-900">{addons.highChairs}</span>
                      </div>
                    )}
                    {addons.childrenChairs > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Children Chairs</span>
                        <span className="font-medium text-gray-900">{addons.childrenChairs}</span>
                      </div>
                    )}
                    {addons.vipSofa > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">VIP Sofa</span>
                        <span className="font-medium text-gray-900">{addons.vipSofa}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-orange-800 font-bold mb-3 text-sm">Estimated Cost</div>
                  <div className="flex justify-between text-sm mb-2 text-gray-700">
                    <span>Seating Arrangement</span>
                    <span className="font-medium text-gray-900">₹ 37,500</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2 text-gray-700">
                    <span>Dining Setup</span>
                    <span className="font-medium text-gray-900">₹ 62,500</span>
                  </div>
                  <div className="flex justify-between text-sm mb-4 text-gray-700">
                    <span>Additional Items</span>
                    <span className="font-medium text-gray-900">₹ 5,500</span>
                  </div>
                  <div className="flex justify-between items-center font-bold border-t border-orange-200 pt-4">
                    <span className="text-gray-900">Total</span>
                    <span className="text-xl text-gray-900">₹ 1,05,500</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-green-700 mb-6 bg-green-50 p-2 rounded-lg border border-green-100">
                  <CheckCircle2 size={14} className="text-green-600" /> All prices are inclusive of taxes
                </div>

                <button 
                  onClick={() => navigate('/client/booking-summary')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors border-none cursor-pointer"
                >
                  Save & Continue to Summary <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangement;
