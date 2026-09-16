import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "../styles/components/Topbar";
import Sidebar from "../styles/components/Sidebar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import { CheckCircle2, Package, MapPin, Sparkles, Utensils, Gift, FileText, CreditCard, Clock, ChevronRight, X } from "lucide-react";

// Countdown Hook
const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = countDownDate - new Date().getTime();
      setCountDown(remaining > 0 ? remaining : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
  return [days, hours, minutes, seconds];
};

const CountdownTimer = ({ targetDate, large = false }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const isExpired = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  if (isExpired) return <span className="font-bold text-red-500">Offer Expired</span>;

  if (large) {
    return (
      <div className="flex gap-4 items-center">
        <div className="bg-white/20 px-4 py-2 rounded-xl text-center backdrop-blur-sm border border-white/30">
          <div className="text-3xl font-black text-white leading-none">{days.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase font-bold text-white/80 mt-1 tracking-widest">Days</div>
        </div>
        <span className="text-2xl font-black text-white/50">:</span>
        <div className="bg-white/20 px-4 py-2 rounded-xl text-center backdrop-blur-sm border border-white/30">
          <div className="text-3xl font-black text-white leading-none">{hours.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase font-bold text-white/80 mt-1 tracking-widest">Hours</div>
        </div>
        <span className="text-2xl font-black text-white/50">:</span>
        <div className="bg-white/20 px-4 py-2 rounded-xl text-center backdrop-blur-sm border border-white/30">
          <div className="text-3xl font-black text-white leading-none">{minutes.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase font-bold text-white/80 mt-1 tracking-widest">Mins</div>
        </div>
        <span className="text-2xl font-black text-white/50">:</span>
        <div className="bg-white/20 px-4 py-2 rounded-xl text-center backdrop-blur-sm border border-white/30">
          <div className="text-3xl font-black text-white leading-none">{seconds.toString().padStart(2, '0')}</div>
          <div className="text-[10px] uppercase font-bold text-white/80 mt-1 tracking-widest">Secs</div>
        </div>
      </div>
    );
  }

  return (
    <span className="font-bold font-mono tracking-wider">
      {days}D {hours.toString().padStart(2, '0')}H {minutes.toString().padStart(2, '0')}M {seconds.toString().padStart(2, '0')}S
    </span>
  );
};

const PackageOverview = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    location: "",
    eventName: "",
    functionFor: "yours", // default
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/packages")
      .then(res => res.json())
      .then(data => {
        setPackages(data);
        if (data.length > 0) setSelectedPackage(data[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch packages", err);
        setLoading(false);
      });
  }, []);

  const handleBookNow = () => {
    if (!selectedPackage) return;
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("booking_selected_package", JSON.stringify(selectedPackage));
    localStorage.setItem("booking_selected_package_id", selectedPackage._id);
    localStorage.setItem("booking_event_details", JSON.stringify(bookingDetails));
    setShowBookingModal(false);
    navigate("/client/select-date");
  };

  const steps = [
    { label: "Package", icon: Package, active: true },
    { label: "Venue", icon: MapPin, active: false },
    { label: "Decoration", icon: Sparkles, active: false },
    { label: "Catering", icon: Utensils, active: false },
    { label: "Additional Services", icon: Gift, active: false },
    { label: "Review", icon: FileText, active: false },
    { label: "Payment", icon: CreditCard, active: false }
  ];

  const heroPackage = packages.find(p => p.countdownEnabled && p.status === "Active");

  return (
    <div className="flex h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              
              {/* LEFT COLUMN: Main Content */}
              <div className="flex-1 space-y-8">
                
                {/* HERO PROMOTIONAL BANNER */}
                {heroPackage && (
                  <div className="bg-gradient-to-r from-orange-600 to-rose-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-0 translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -z-0 -translate-x-1/2 translate-y-1/2"></div>
                    
                    <div className="relative z-10 text-center md:text-left">
                      <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/30 mb-4 shadow-lg flex items-center gap-2">
                        <span className="animate-pulse">🔥</span> Limited Time Wedding Offer
                      </div>
                      <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight">{heroPackage.name}</h1>
                      <p className="text-xl md:text-2xl font-bold text-orange-200 mb-6">Save ₹{(heroPackage.originalPrice - heroPackage.offerPrice).toLocaleString()}</p>
                      
                      <div className="mb-2 text-sm font-bold text-white/80 uppercase tracking-widest">Offer Ends In</div>
                      <CountdownTimer targetDate={heroPackage.offerEndDate} large={true} />
                    </div>
                    
                    <div className="relative z-10 w-full md:w-auto">
                      <button 
                        onClick={() => { setSelectedPackage(heroPackage); window.scrollTo({ top: document.getElementById('packages').offsetTop - 100, behavior: 'smooth' }); }}
                        className="w-full md:w-auto bg-white text-orange-600 hover:bg-orange-50 font-black text-lg px-10 py-5 rounded-2xl shadow-xl transition-transform hover:scale-105 active:scale-95"
                      >
                        View Package Details
                      </button>
                    </div>
                  </div>
                )}

                <div id="packages">
                  <h2 className="text-2xl font-black text-slate-900 mb-6">Available Packages</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => {
                      const isSelected = selectedPackage?._id === pkg._id;
                      
                      return (
                        <div 
                          key={pkg._id} 
                          onClick={() => setSelectedPackage(pkg)}
                          className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 flex flex-col ${isSelected ? 'border-orange-500 shadow-lg scale-[1.02]' : 'border-slate-100 hover:border-orange-300 hover:shadow-md'}`}
                        >
                          <div className="w-full h-48 relative overflow-hidden">
                            <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                            {pkg.offerBadge && (
                              <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg flex items-center gap-2">
                                {pkg.offerBadge}
                              </div>
                            )}
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-lg font-black text-slate-900 leading-tight">{pkg.name}</h3>
                              {isSelected && <div className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm shrink-0"><CheckCircle2 size={14} /></div>}
                            </div>
                            
                            <p className="text-slate-500 text-xs font-medium mb-4 line-clamp-2">{pkg.description}</p>
                            
                            <div className="flex flex-col gap-1.5 mb-4">
                              {pkg.venueIncluded && <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><CheckCircle2 size={14} className="text-green-500" /> Venue Included</div>}
                              {pkg.decorationIncluded && <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><CheckCircle2 size={14} className="text-green-500" /> Decoration Included</div>}
                              {pkg.cateringIncluded && <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><CheckCircle2 size={14} className="text-green-500" /> Catering Included</div>}
                              {pkg.photographyIncluded && <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><CheckCircle2 size={14} className="text-green-500" /> Photography Included</div>}
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {pkg.features.slice(0, 4).map((feature, idx) => (
                                <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                  {feature}
                                </span>
                              ))}
                            </div>

                            <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-3">
                              <div className="flex justify-between items-end">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-slate-400 line-through font-bold text-xs">₹{pkg.originalPrice.toLocaleString()}</span>
                                  </div>
                                  <div className="text-xl font-black text-orange-600 leading-none">₹{pkg.offerPrice.toLocaleString()}</div>
                                </div>
                                <span className="bg-green-100 text-green-700 text-[10px] uppercase tracking-wider font-black px-2 py-1 rounded-md">Save ₹{(pkg.originalPrice - pkg.offerPrice).toLocaleString()}</span>
                              </div>
                              
                              <div className="flex flex-col gap-2 w-full mt-1">
                                {pkg.countdownEnabled && pkg.status === "Active" && (
                                  <div className="flex items-center justify-center gap-1.5 text-orange-600 text-xs font-bold bg-orange-50 px-2 py-1.5 rounded-lg border border-orange-100">
                                    <Clock size={14} />
                                    <CountdownTimer targetDate={pkg.offerEndDate} />
                                  </div>
                                )}
                                <button className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors ${isSelected ? 'bg-orange-500 text-white shadow-md shadow-orange-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                                  {isSelected ? 'Selected' : 'Select Package'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Additional Info Cards for the selected package */}
                {selectedPackage && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in pt-4 pb-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                        <MapPin size={32} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">Venue Flexibility</h3>
                      <p className="text-slate-500 font-medium text-sm">Choose from our premium partner venues. Available dates will be confirmed in the next step.</p>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} />
                      </div>
                      <h3 className="text-xl font-black text-slate-900 mb-2">Availability</h3>
                      {selectedPackage.remainingSlots > 5 ? (
                        <p className="text-green-600 font-black text-lg bg-green-50 px-4 py-2 rounded-xl inline-block mt-1">✅ {selectedPackage.remainingSlots} Slots Left</p>
                      ) : selectedPackage.remainingSlots > 0 ? (
                        <p className="text-orange-500 font-black text-lg bg-orange-50 px-4 py-2 rounded-xl inline-block mt-1">⚠️ Only {selectedPackage.remainingSlots} Packages Left</p>
                      ) : (
                        <p className="text-red-500 font-black text-lg bg-red-50 px-4 py-2 rounded-xl inline-block mt-1">❌ Sold Out</p>
                      )}
                    </div>
                  </div>
                )}

                <EventSummaryFooter 
                  icon={Sparkles} 
                  overrides={{ packagePrice: selectedPackage ? (selectedPackage.offerPrice || selectedPackage.originalPrice || selectedPackage.price || 0) : 0 }}
                  customDetails={
                    selectedPackage ? (
                      <span>Selected Package: <strong style={{ fontWeight: "600", color: "#475569" }}>{selectedPackage.name} (₹{(selectedPackage.offerPrice || selectedPackage.originalPrice || selectedPackage.price || 0).toLocaleString()})</strong></span>
                    ) : null
                  }
                />
              </div>
              
              {/* RIGHT COLUMN: Sticky Sidebar */}
              <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
                <div className="lg:sticky lg:top-8 z-20 space-y-6 pb-20">
                  
                  {/* Progress Indicator */}
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-black text-slate-900 mb-6 text-lg">Booking Progress</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 rounded-full"></div>
                      <div className="space-y-6 relative">
                        {steps.map((step, idx) => {
                          const Icon = step.icon;
                          return (
                            <div key={idx} className="flex items-center gap-4">
                              <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-400'}`}>
                                <Icon size={14} />
                              </div>
                              <span className={`font-bold ${step.active ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-white rounded-3xl border-2 border-orange-500 shadow-[0_20px_50px_rgba(234,88,12,0.15)] overflow-hidden">
                    <div className="bg-orange-500 p-6 text-white text-center">
                      <h3 className="text-2xl font-black mb-1">Booking Summary</h3>
                      <p className="text-orange-100 font-medium text-sm">Secure your package now</p>
                    </div>
                    
                    <div className="p-6">
                      {selectedPackage ? (
                        <>
                          <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                              <span className="text-slate-500 font-bold">Selected Package</span>
                              <span className="text-slate-900 font-black text-right max-w-[150px] truncate">{selectedPackage.name}</span>
                            </div>
                            
                            {selectedPackage.countdownEnabled && (
                              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                                <span className="text-slate-500 font-bold">Offer Ends</span>
                                <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-md text-xs">
                                  <CountdownTimer targetDate={selectedPackage.offerEndDate} />
                                </span>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                              <span className="text-slate-500 font-bold">Offer Price</span>
                              <span className="text-slate-900 font-black">₹{selectedPackage.offerPrice.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pb-2">
                              <span className="text-slate-500 font-bold">Advance (30%)</span>
                              <span className="text-orange-600 font-black text-xl">₹{(selectedPackage.offerPrice * 0.3).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <button 
                            onClick={handleBookNow}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-200 transition-transform active:scale-95 flex items-center justify-center gap-2 text-lg"
                          >
                            Book Package Now <ChevronRight size={20} />
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <Package size={48} className="mx-auto text-slate-200 mb-4" />
                          <p className="text-slate-500 font-bold">Please select a package to view your summary and proceed.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
      {/* Booking Details Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black">Event Details</h3>
                <p className="text-orange-100 text-sm font-medium">Please provide details for your booking</p>
              </div>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location / Venue (if any)</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Grand Hotel, Mumbai"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                  value={bookingDetails.location}
                  onChange={(e) => setBookingDetails({...bookingDetails, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Event Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Rahul & Priya's Wedding"
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                  value={bookingDetails.eventName}
                  onChange={(e) => setBookingDetails({...bookingDetails, eventName: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Whose Function Is It?</label>
                <select 
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors font-medium text-slate-700"
                  value={bookingDetails.functionFor}
                  onChange={(e) => setBookingDetails({...bookingDetails, functionFor: e.target.value})}
                >
                  <option value="yours">My Own Function</option>
                  <option value="family">Family Member</option>
                  <option value="friend">Friend</option>
                  <option value="corporate">Corporate / Company</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="your@email.com"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                    value={bookingDetails.email}
                    onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="+91 9876543210"
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-orange-500 transition-colors"
                    value={bookingDetails.phoneNumber}
                    onChange={(e) => setBookingDetails({...bookingDetails, phoneNumber: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 transition-transform active:scale-95"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageOverview;
