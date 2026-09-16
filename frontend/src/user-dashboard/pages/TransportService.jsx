import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, User, Briefcase, Car, Bus, Users, Moon, Zap, UserCheck, ArrowRight as ArrowRightIcon, X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const TransportService = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [transportNotRequired, setTransportNotRequired] = useState(false);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const vehicleTypes = [
    {
      id: 'cars',
      name: 'Cars',
      desc: 'Comfortable cars for VIP & family travel',
      img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'buses',
      name: 'Buses',
      desc: 'Spacious buses for group transportation',
      img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'tempo',
      name: 'Mini Bus',
      desc: 'Perfect for medium group travel',
      img: '/images/media__1785136699758.png'
    }
  ];

  const getVehicles = () => {
    const stored = localStorage.getItem("admin_vehicles");
    const defaultVehicles = [
      { id: 'camry', name: 'Toyota Camry', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 12,000 - ₹ 15,000', popular: true, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'innova', name: 'Toyota Innova Crysta', seats: 6, luggage: 6, type: 'Premium MPV', price: '₹ 14,000 - ₹ 18,000', popular: false, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'benz', name: 'Mercedes Benz E-Class', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 18,000 - ₹ 25,000', popular: false, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'bmw', name: 'BMW 5 Series', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 20,000 - ₹ 28,000', popular: false, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'tempo-17', name: 'Mini Bus (17 Seater)', seats: 17, luggage: 10, type: 'Best for small groups', price: '₹ 7,000 - ₹ 9,000', img: '/images/media__1785136699758.png', category: 'Mini Bus', driver: true, availability: 'Available' },
      { id: 'mini-bus', name: 'Mini Bus (25 Seater)', seats: 25, luggage: 15, type: 'Ideal for medium groups', price: '₹ 9,000 - ₹ 12,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' },
      { id: 'deluxe', name: 'Shree Padma Deluxe Bus (35 Seater)', seats: 35, luggage: 20, type: 'Comfortable AC Bus', price: '₹ 13,000 - ₹ 16,000', img: '/images/media__1784298281855.png', category: 'Bus', driver: true, availability: 'Available' },
      { id: 'luxury-bus', name: 'Luxury Bus (45 Seater)', seats: 45, luggage: 30, type: 'Premium AC Bus', price: '₹ 17,000 - ₹ 22,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' }
    ];

    if (stored) {
      try {
        let parsed = JSON.parse(stored);
        let changed = false;
        parsed = parsed.map(v => {
          if (v.category === 'Tempo Traveller') {
            v.category = 'Mini Bus';
            changed = true;
          }
          if (v.name && v.name.includes('Tempo Traveller')) {
            v.name = v.name.replace('Tempo Traveller', 'Mini Bus');
            changed = true;
          }
          const matchedDefault = defaultVehicles.find(d => d.id === v.id);
          if (matchedDefault) {
            if (v.img !== matchedDefault.img || v.name !== matchedDefault.name || v.category !== matchedDefault.category) {
              v.img = matchedDefault.img;
              v.name = matchedDefault.name;
              v.category = matchedDefault.category;
              changed = true;
            }
          }
          return v;
        });
        if (changed) {
          localStorage.setItem("admin_vehicles", JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse admin_vehicles", e);
      }
    }

    localStorage.setItem("admin_vehicles", JSON.stringify(defaultVehicles));
    return defaultVehicles;
  };

  const allVehicles = getVehicles();
  const cars = allVehicles.filter(v => v.category === 'Car' && v.availability === 'Available');
  const buses = allVehicles.filter(v => v.category === 'Bus' && v.availability === 'Available');
  const minibuses = allVehicles.filter(v => v.category === 'Mini Bus' && v.availability === 'Available');

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          
          {/* Header & Stepper */}
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <button className="btn-back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back to Additional Services
            </button>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "16px 0 4px" }}>Travel & Transportation</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose the best vehicles for your guests and event needs</p>
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


          <div className="transport-container" style={{ padding: "0 32px 32px" }}>
            
            {/* Opt-out Option */}
            <div style={{
              background: transportNotRequired ? "#f8fafc" : "#fffbeb",
              border: transportNotRequired ? "1px dashed #cbd5e1" : "1px solid #fef3c7",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#78350f" }}>Do you require transportation services?</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#b45309" }}>If you don't need transport for guests, you can toggle this option to skip vehicle selection.</p>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", color: "#78350f", cursor: "pointer", background: "white", padding: "10px 16px", borderRadius: "10px", border: "1px solid #f59e0b", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <input 
                  type="checkbox" 
                  checked={transportNotRequired} 
                  onChange={(e) => {
                    setTransportNotRequired(e.target.checked);
                    if (e.target.checked) {
                      setSelectedTypes([]);
                    }
                  }} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                Transport not required
              </label>
            </div>

            <div style={{ opacity: transportNotRequired ? 0.5 : 1, pointerEvents: transportNotRequired ? "none" : "auto" }}>
              {/* 1. Select Vehicle Type */}
            <div className="services-layout-row">
              <div className="services-left-col">
                <div className="section-block mb-0">
                  <h3 className="section-title">1. Select Vehicle Type <span style={{fontSize: "12px", color: "#64748b", fontWeight: "normal"}}>(Choose one or more)</span></h3>
                  
                  <div className="vehicle-type-grid">
                    {vehicleTypes.map(vt => (
                      <div 
                        key={vt.id}
                        className={`vehicle-type-card ${selectedTypes.includes(vt.id) ? 'selected' : ''}`}
                        onClick={() => toggleType(vt.id)}
                      >
                        <div className="vt-img-wrapper">
                          <img src={vt.img} alt={vt.name} />
                          <div className={`checkbox-custom-tr ${selectedTypes.includes(vt.id) ? 'checked' : ''}`}>
                            {selectedTypes.includes(vt.id) && <Check size={14} strokeWidth={3} />}
                          </div>
                        </div>
                        <div className="vt-info">
                          <h4>{vt.name}</h4>
                          <p>{vt.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="info-banner-green mt-4">
                    <CheckCircle2 size={16} />
                    <span>Select any combination of vehicles as per your requirement.</span>
                  </div>
                </div>
              </div>

              <div className="services-right-col" style={{ marginTop: "36px" }}>
                <div className="selected-services-summary" style={{ height: "100%" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="m-0">Selected Vehicles ({selectedTypes.length})</h4>
                    <span className="text-red-500 text-xs font-bold cursor-pointer" onClick={() => setSelectedTypes([])}>Clear All</span>
                  </div>
                  <div className="selected-list">
                    {vehicleTypes.map(vt => selectedTypes.includes(vt.id) && (
                      <div key={vt.id} className="selected-vehicle-item">
                        <div className="sv-img"><img src={vt.img} alt={vt.name} /></div>
                        <div className="sv-text">
                          <span className="sv-name">{vt.name}</span>
                          <span className="sv-count">1 Selected</span>
                        </div>
                        <button className="sv-remove" onClick={() => toggleType(vt.id)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  {/* Button removed as requested */}
                </div>
              </div>
            </div>

            {/* Choose Your Car */}
            {selectedTypes.includes('cars') && (
              <div className="section-block mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-purple-700 bg-purple-light p-2 rounded-lg"><Car size={20} /></div>
                  <div>
                    <h3 className="section-title mb-1">Choose Your Car</h3>
                    <p className="section-subtitle mb-0">Select the perfect car for your VIP and special guests</p>
                  </div>
                </div>
                
                <div className="vehicle-models-grid">
                  {cars.map(car => (
                    <div key={car.id} className="vehicle-model-card">
                      {car.popular && <div className="popular-badge-alt">Popular</div>}
                      <div className="vm-img"><img src={car.img} alt={car.name} /></div>
                      <div className="vm-content">
                        <h4>{car.name}</h4>
                        <div className="vm-specs">
                          <div className="spec-item"><User size={12} className="text-gray-400"/> {car.seats} Seats</div>
                          <div className="spec-item"><Briefcase size={12} className="text-gray-400"/> {car.luggage} Luggage</div>
                        </div>
                        <div className="vm-type">{car.type}</div>
                        <div className="vm-price">{car.price}</div>
                        <div className="vm-price-label">Per Day</div>
                        <button 
                          className="btn-outline-orange w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/client/vehicle-details/car/${car.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Choose Your Bus */}
            {selectedTypes.includes('buses') && (
              <div className="section-block mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-purple-700 bg-purple-light p-2 rounded-lg"><Bus size={20} /></div>
                  <div>
                    <h3 className="section-title mb-1">Choose Your Bus</h3>
                    <p className="section-subtitle mb-0">Choose the right bus for your group size and comfort</p>
                  </div>
                </div>
                
                <div className="vehicle-models-grid">
                  {buses.map(bus => (
                    <div key={bus.id} className="vehicle-model-card">
                      <div className="vm-img"><img src={bus.img} alt={bus.name} /></div>
                      <div className="vm-content">
                        <h4>{bus.name}</h4>
                        <div className="vm-specs">
                          <div className="spec-item"><Users size={12} className="text-gray-400"/> {bus.seats} Seats</div>
                          <div className="spec-item"><Briefcase size={12} className="text-gray-400"/> {bus.luggage} Luggage</div>
                        </div>
                        <div className="vm-type">{bus.type}</div>
                        <div className="vm-price">{bus.price}</div>
                        <div className="vm-price-label">Per Day</div>
                        <button 
                          className="btn-outline-orange w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/client/vehicle-details/bus/${bus.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6">
                  <button className="btn-text-link">View More Buses <ArrowRightIcon size={16} /></button>
                </div>
              </div>
            )}

            {/* Choose Your Mini Bus */}
            {selectedTypes.includes('tempo') && (
              <div className="section-block mt-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-purple-700 bg-purple-light p-2 rounded-lg"><Bus size={20} /></div>
                  <div>
                    <h3 className="section-title mb-1">Choose Your Mini Bus</h3>
                    <p className="section-subtitle mb-0">Select the perfect Mini Bus for medium sized groups</p>
                  </div>
                </div>
                
                <div className="vehicle-models-grid">
                  {minibuses.map(bus => (
                    <div key={bus.id} className="vehicle-model-card">
                      <div className="vm-img"><img src={bus.img} alt={bus.name} /></div>
                      <div className="vm-content">
                        <h4>{bus.name}</h4>
                        <div className="vm-specs">
                          <div className="spec-item"><Users size={12} className="text-gray-400"/> {bus.seats} Seats</div>
                          <div className="spec-item"><Briefcase size={12} className="text-gray-400"/> {bus.luggage} Luggage</div>
                        </div>
                        <div className="vm-type">{bus.type}</div>
                        <div className="vm-price">{bus.price}</div>
                        <div className="vm-price-label">Per Day</div>
                        <button 
                          className="btn-outline-orange w-full mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/client/vehicle-details/bus/${bus.id}`);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}



            <EventSummaryFooter icon={Car} />

            <div className="bottom-navigation" style={{ marginTop: "20px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={() => navigate('/client/guest-rooms')}>
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

export default TransportService;
