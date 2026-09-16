import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, ArrowRight, CheckCircle2, Music, Speaker, Lightbulb, Zap, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const DJService = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [djNotRequired, setDjNotRequired] = useState(false);

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const djServices = [
    {
      id: 'dj',
      name: 'DJ / Music System',
      desc: 'Professional DJs for a memorable party',
      icon: Music,
      img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'sound',
      name: 'Sound System',
      desc: 'High quality sound for clear & powerful audio',
      icon: Speaker,
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'lighting',
      name: 'Lighting',
      desc: 'Stage & mood lighting to set the vibe',
      icon: Lightbulb,
      img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'generator',
      name: 'Generator Backup',
      desc: 'Power backup for uninterrupted events',
      icon: Zap,
      img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const getPackages = () => {
    const stored = localStorage.getItem("admin_djs");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse admin_djs", e);
      }
    }

    const defaultPackages = [
      {
        id: 'basic',
        name: 'Basic DJ Package',
        price: 12000,
        guests: 'Up to 100 Guests',
        features: ['1 Professional DJ', 'Basic Sound System', '2 Speakers', '4 LED Lights', 'Up to 4 Hours'],
        img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
        popular: false,
        proDj: '1 Professional DJ',
        sound: 'Basic Sound System',
        lighting: '4 LED Lights',
        smoke: false,
        generator: false,
        hours: 4
      },
      {
        id: 'standard',
        name: 'Standard DJ Package',
        price: 18000,
        guests: 'Up to 200 Guests',
        features: ['1 Professional DJ', 'Quality Sound System', '4 Speakers & 2 Subwoofers', '6 LED Lights', 'Up to 6 Hours'],
        img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
        popular: false,
        proDj: '1 Professional DJ',
        sound: 'Quality Sound System',
        lighting: '6 LED Lights',
        smoke: false,
        generator: false,
        hours: 6
      },
      {
        id: 'premium',
        name: 'Premium DJ Package',
        price: 25000,
        guests: 'Up to 300 Guests',
        features: ['1 Top DJ', 'Premium Sound System', '6 Speakers & 2 Subwoofers', '12 LED Lights', 'Smoke Machine', 'Up to 8 Hours'],
        img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=400&q=80',
        popular: true,
        proDj: '1 Top DJ',
        sound: 'Premium Sound System',
        lighting: '12 LED Lights',
        smoke: true,
        generator: false,
        hours: 8
      },
      {
        id: 'luxury',
        name: 'Luxury DJ Package',
        price: 35000,
        guests: 'Up to 500 Guests',
        features: ['2 Professional DJs', 'High End Sound System', '8 Speakers & 4 Subwoofers', '16 LED Lights + Moving Heads', 'Smoke Machine', 'Up to 10 Hours'],
        img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&q=80',
        popular: false,
        proDj: '2 Professional DJs',
        sound: 'High End Sound System',
        lighting: '16 LED Lights + Moving Heads',
        smoke: true,
        generator: false,
        hours: 10
      },
      {
        id: 'ultimate',
        name: 'Ultimate DJ Package',
        price: 50000,
        guests: '500+ Guests',
        features: ['2 Top DJs', 'Line Array Sound System', '12+ Speakers & 4 Subwoofers', '20+ LED Lights + Lasers', 'Special Effects & CO2 Jets', 'Up to 12 Hours'],
        img: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=400&q=80',
        popular: false,
        proDj: '2 Top DJs',
        sound: 'Line Array Sound System',
        lighting: '20+ LED Lights + Lasers',
        smoke: true,
        generator: true,
        hours: 12
      }
    ];

    localStorage.setItem("admin_djs", JSON.stringify(defaultPackages));
    return defaultPackages;
  };

  const packages = getPackages();

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          
          {/* Header & Stepper */}
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <button className="btn-back-link" onClick={() => navigate('/client/services')}>
              <ArrowLeft size={16} /> Back to Additional Services
            </button>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "16px 0 4px" }}>DJ / Sound & Lighting Services</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose the services you need for your event</p>
          </div>

          <div className="stepper-wrapper">
            <div className="stepper-line-bg"></div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Decoration & Catering</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Hall Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle active">6</div>
              <div className="step-label active">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Booking Summary</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">9</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>


          <div className="dj-container" style={{ padding: "0 32px 32px" }}>
            
            {/* Opt-out Option */}
            <div style={{
              background: djNotRequired ? "#f8fafc" : "#fffbeb",
              border: djNotRequired ? "1px dashed #cbd5e1" : "1px solid #fef3c7",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#78350f" }}>Do you require DJ or Music systems?</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#b45309" }}>If you don't want audio/lighting systems, you can toggle this option to skip.</p>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", color: "#78350f", cursor: "pointer", background: "white", padding: "10px 16px", borderRadius: "10px", border: "1px solid #f59e0b", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <input 
                  type="checkbox" 
                  checked={djNotRequired} 
                  onChange={(e) => {
                    setDjNotRequired(e.target.checked);
                    if (e.target.checked) {
                      setSelectedServices([]);
                      setSelectedPackage('');
                    }
                  }} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                DJ not required
              </label>
            </div>

            <div style={{ opacity: djNotRequired ? 0.5 : 1, pointerEvents: djNotRequired ? "none" : "auto" }}>
              {/* 1. Select Services */}
            <div className="services-layout-row">
              <div className="services-left-col">
                <div className="section-block mb-0">
                  <h3 className="section-title">1. Select Services <span style={{fontSize: "12px", color: "#64748b", fontWeight: "normal"}}>(Choose one or more)</span></h3>
                  
                  <div className="service-img-grid">
                    {djServices.map(svc => (
                      <div 
                        key={svc.id}
                        className={`service-img-card ${selectedServices.includes(svc.id) ? 'selected' : ''}`}
                        onClick={() => toggleService(svc.id)}
                      >
                        <div className="img-wrapper">
                          <img src={svc.img} alt={svc.name} />
                          <div className={`checkbox-custom-tr ${selectedServices.includes(svc.id) ? 'checked' : ''}`}>
                            {selectedServices.includes(svc.id) && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className="svc-info">
                          <div className="svc-icon bg-purple-light text-purple-700">
                            <svc.icon size={16} />
                          </div>
                          <div className="svc-text">
                            <h4>{svc.name}</h4>
                            <p>{svc.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="services-right-col" style={{ marginTop: "36px" }}>
                <div className="selected-services-summary" style={{ height: "100%" }}>
                  <h4>Selected Services ({selectedServices.length})</h4>
                  <div className="selected-list">
                    {djServices.map(svc => selectedServices.includes(svc.id) && (
                      <div key={svc.id} className="selected-item-row">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span>{svc.name}</span>
                      </div>
                    ))}
                  </div>
                  {/* Button removed as requested */}
                </div>
              </div>
            </div>

            {/* 2. Choose Your Package */}
            <div className="section-block mt-12">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="section-title">2. Choose Your Package</h3>
                  <p className="section-subtitle mb-0">Explore our best DJ, Sound & Lighting packages</p>
                </div>
                <button className="btn-outline flex items-center gap-2" style={{ padding: "8px 16px", fontSize: "12px", background: "white" }}>
                  <CheckSquare size={16} /> Compare Packages
                </button>
              </div>
              
              <div className="packages-scroll-grid">
                {packages.map(pkg => (
                  <div 
                    key={pkg.id} 
                    className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {pkg.popular && <div className="popular-badge-top">Most Popular</div>}
                    <div className="pkg-img">
                      <img src={pkg.img} alt={pkg.name} />
                      {selectedPackage === pkg.id && (
                        <div className="check-badge-corner-lg"><Check size={16} strokeWidth={3} /></div>
                      )}
                    </div>
                    
                    <div className="pkg-content">
                      <h4 className="pkg-name text-purple-900">{pkg.name}</h4>
                      <div className="pkg-price text-purple-700">₹ {pkg.price.toLocaleString()}</div>
                      
                      <div className="pkg-guests">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        {pkg.guests}
                      </div>
                      
                      <div className="pkg-features-list">
                        {pkg.features.map((feature, idx) => (
                          <div key={idx} className="pkg-feature-item">
                            <Check size={12} className="text-orange" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className={`btn-pkg-action ${selectedPackage === pkg.id ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/client/dj-details/sonic-beats`, { state: { selectedPackage: pkg.name } });
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Details Panel */}
            {selectedPackage === 'premium' && (
              <div className="package-details-panel">
                <h3 className="panel-title">Package Details - Premium DJ Package</h3>
                <div className="panel-layout">
                  <div className="panel-img">
                    <img src="https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=600&q=80" alt="Premium DJ" />
                  </div>
                  
                  <div className="panel-columns">
                    <div className="feature-col">
                      <h4>DJ & Music</h4>
                      <ul>
                        <li><CheckCircle2 size={12} className="text-green-600"/> 1 Top Professional DJ</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Full Music Library</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> MC / Host (On Request)</li>
                      </ul>
                    </div>
                    <div className="feature-col">
                      <h4>Sound System</h4>
                      <ul>
                        <li><CheckCircle2 size={12} className="text-green-600"/> 6 Speakers</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> 2 Subwoofers</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Sound Mixer</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Wireless Microphone</li>
                      </ul>
                    </div>
                    <div className="feature-col">
                      <h4>Lighting</h4>
                      <ul>
                        <li><CheckCircle2 size={12} className="text-green-600"/> 12 LED Lights</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> 4 Moving Head Lights</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Stage Wash Lights</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Disco Lights</li>
                      </ul>
                    </div>
                    <div className="feature-col">
                      <h4>Special Effects</h4>
                      <ul>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Smoke Machine</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Bubble Machine</li>
                        <li><CheckCircle2 size={12} className="text-green-600"/> Confetti (On Request)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="panel-price-box">
                    <div className="panel-price-val text-purple-800">₹ 25,000</div>
                    <div className="panel-price-label">All Inclusive</div>
                    <ul className="included-perks">
                      <li><Check size={12} className="text-green-600"/> Setup & Installation</li>
                      <li><Check size={12} className="text-green-600"/> Technician Support</li>
                      <li><Check size={12} className="text-green-600"/> Transportation</li>
                      <li><Check size={12} className="text-green-600"/> Dismantling</li>
                    </ul>
                    <button className="btn-solid-purple w-full">Select Package</button>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Services Summary Footer */}
            {(() => {
              const selectedPkgObj = packages.find(p => p.id === selectedPackage);
              const currentDjPrice = selectedPkgObj ? selectedPkgObj.price : (djNotRequired ? 0 : (localStorage.getItem("booking_dj_price") ? Number(localStorage.getItem("booking_dj_price")) : 0));
              return (
                <EventSummaryFooter
                  icon={Music}
                  overrides={{ djPrice: currentDjPrice }}
                  customDetails={
                    selectedPkgObj ? (
                      <span>DJ Package: <strong style={{ fontWeight: "600", color: "#475569" }}>{selectedPkgObj.name} (₹{selectedPkgObj.price.toLocaleString()})</strong></span>
                    ) : djNotRequired ? (
                      <span>DJ Service: <strong style={{ fontWeight: "600", color: "#475569" }}>Not Required</strong></span>
                    ) : null
                  }
                />
              );
            })()}

            <div className="bottom-navigation" style={{ marginTop: "40px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={() => navigate('/client/transport-service')}>
                Next <ArrowRight size={20} />
              </button>
            </div>
            
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DJService;
