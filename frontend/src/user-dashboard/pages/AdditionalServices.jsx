import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, Camera, Video, MapPin, CheckCircle2, Star, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const AdditionalServices = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [selectedVideoStudio, setSelectedVideoStudio] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleContinue = () => {
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate('/client/dj-service');
    }, 1500);
  };

  const toggleService = (service) => {
    setSelectedServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const getAllStudios = () => {
    const stored = localStorage.getItem("admin_studios");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse admin_studios", e);
      }
    }

    const defaultStudios = [
      {
        id: 'perfect-click',
        name: 'Perfect Click Studio',
        rating: 4.8,
        reviews: 120,
        location: 'Bangalore',
        services: ['Candid', 'Traditional', 'Pre-Wedding'],
        price: 25000,
        img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: true,
        isVideo: false,
        experience: '8+ Years',
        teamSize: '12',
        status: 'Available'
      },
      {
        id: 'memories-forever',
        name: 'Memories Forever',
        rating: 4.7,
        reviews: 98,
        location: 'Bangalore',
        services: ['Candid', 'Traditional', 'Cinematic'],
        price: 30000,
        img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: true,
        isVideo: true,
        experience: '6+ Years',
        teamSize: '10',
        status: 'Available'
      },
      {
        id: 'snappers-studio',
        name: "Snapper's Studio",
        rating: 4.6,
        reviews: 75,
        location: 'Bangalore',
        services: ['Candid', 'Cinematic', 'Traditional'],
        price: 28000,
        img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: true,
        isVideo: false,
        experience: '4+ Years',
        teamSize: '6',
        status: 'Available'
      },
      {
        id: 'the-frame-makers',
        name: 'The Frame Makers',
        rating: 4.9,
        reviews: 150,
        location: 'Bangalore',
        services: ['Candid', 'Traditional', 'Pre-Wedding'],
        price: 35000,
        img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80',
        popular: true,
        isPhoto: true,
        isVideo: false,
        experience: '10+ Years',
        teamSize: '15',
        status: 'Available'
      },
      {
        id: 'click-art',
        name: 'Click Art Studio',
        rating: 4.5,
        reviews: 60,
        location: 'Bangalore',
        services: ['Traditional', 'Candid', 'Cinematic'],
        price: 22000,
        img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: true,
        isVideo: true,
        experience: '5+ Years',
        teamSize: '8',
        status: 'Available'
      },
      {
        id: 'zoom-in',
        name: 'Zoom In Studio',
        rating: 4.6,
        reviews: 85,
        location: 'Bangalore',
        services: ['Candid', 'Pre-Wedding', 'Cinematic'],
        price: 27000,
        img: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: true,
        isVideo: false,
        experience: '5+ Years',
        teamSize: '7',
        status: 'Available'
      },
      {
        id: 'cinematic-films',
        name: 'Cinematic Films',
        rating: 4.9,
        reviews: 210,
        location: 'Hyderabad',
        services: ['Cinematic', 'Drone', '4K Video'],
        price: 45000,
        img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80',
        popular: true,
        isPhoto: false,
        isVideo: true,
        experience: '9+ Years',
        teamSize: '12',
        status: 'Available'
      },
      {
        id: 'epic-stories',
        name: 'Epic Stories Video',
        rating: 4.7,
        reviews: 135,
        location: 'Hyderabad',
        services: ['Traditional', 'Cinematic', 'Highlights'],
        price: 35000,
        img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: false,
        isVideo: true,
        experience: '7+ Years',
        teamSize: '10',
        status: 'Available'
      },
      {
        id: 'lens-magic',
        name: 'Lens Magic Creations',
        rating: 4.6,
        reviews: 90,
        location: 'Hyderabad',
        services: ['Documentary', 'Drone', 'Traditional'],
        price: 32000,
        img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80',
        popular: false,
        isPhoto: false,
        isVideo: true,
        experience: '6+ Years',
        teamSize: '8',
        status: 'Available'
      }
    ];

    localStorage.setItem("admin_studios", JSON.stringify(defaultStudios));
    return defaultStudios;
  };

  const allStudios = getAllStudios();
  const studios = allStudios.filter(s => s.isPhoto && s.status === 'Available');
  const videoStudios = allStudios.filter(s => s.isVideo && s.status === 'Available');

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "0 0 4px" }}>Additional Services</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose the best service providers for your event</p>
          </div>

          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "85.71428571428572%", background: '#ea580c' }}></div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>1</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>2</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>3</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Expected Guests</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>4</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>5</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>6</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Catering Options</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>7</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Booking Summary</div>
            </div>
          </div>

  

          <div className="services-container" style={{ padding: "0 32px 32px" }}>
            
            {/* 1. Select Service Category */}
            <div className="services-layout-row">
              <div className="services-left-col">
                <div className="section-block mb-0">
                  <h3 className="section-title">1. Select Service Category</h3>
                  <p className="section-subtitle">Choose the services you need for your event</p>
                  
                  <div className="service-category-grid">
                    <div 
                      className={`service-cat-card ${selectedServices.includes('photography') ? 'selected' : ''}`}
                      onClick={() => toggleService('photography')}
                    >
                      <div className="cat-icon-wrapper bg-purple-light text-purple-700">
                        <Camera size={28} />
                      </div>
                      <div className="cat-info">
                        <h4>Photography</h4>
                        <p>Capture your precious moments</p>
                      </div>
                      <div className={`checkbox-custom ${selectedServices.includes('photography') ? 'checked' : ''}`}>
                        {selectedServices.includes('photography') && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>

                    <div 
                      className={`service-cat-card ${selectedServices.includes('videography') ? 'selected' : ''}`}
                      onClick={() => toggleService('videography')}
                    >
                      <div className="cat-icon-wrapper bg-purple-light text-purple-700">
                        <Video size={28} />
                      </div>
                      <div className="cat-info">
                        <h4>Videography</h4>
                        <p>Relive your moments forever</p>
                      </div>
                      <div className={`checkbox-custom ${selectedServices.includes('videography') ? 'checked' : ''}`}>
                        {selectedServices.includes('videography') && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="services-right-col">
                <div className="selected-services-summary">
                  <h4>Selected Services ({selectedServices.length})</h4>
                  <div className="selected-list">
                    {selectedServices.includes('photography') && (
                      <div className="selected-item-row">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span>Photography</span>
                      </div>
                    )}
                    {selectedServices.includes('videography') && (
                      <div className="selected-item-row">
                        <CheckCircle2 size={16} className="text-green-600" />
                        <span>Videography</span>
                      </div>
                    )}
                    {selectedServices.length === 0 && (
                      <div className="text-gray-500 text-sm">No services selected.</div>
                    )}
                  </div>
                  {/* Button removed as requested */}
                </div>
              </div>
            </div>

            {/* 2. Choose Your Photography Studio */}
            {selectedServices.includes('photography') && (
              <div className="section-block mt-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="section-title">2. Choose Your Photography Studio</h3>
                    <p className="section-subtitle mb-0">Select the best photography studio that fits your style and budget</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleService('photography')}
                      className="btn-outline"
                      style={{ padding: "8px 16px", fontSize: "12px", background: "white", borderColor: "#fecaca", color: "#dc2626", fontWeight: "600", cursor: "pointer" }}
                    >
                      ✕ I don't want Photography
                    </button>
                  </div>
                </div>
                
                <div className="studios-grid">
                  {studios.map(s => (
                    <div 
                      key={s.id} 
                      className={`studio-card ${selectedStudio === s.id ? 'selected' : ''}`}
                      onClick={() => setSelectedStudio(s.id)}
                    >
                      <div className="studio-img-wrapper">
                        <img src={s.img} alt={s.name} />
                        {s.popular && <div className="popular-badge-alt">Popular</div>}
                        {selectedStudio === s.id && (
                          <div className="check-badge-corner-lg"><Check size={16} strokeWidth={3} /></div>
                        )}
                      </div>
                      
                      <div className="studio-content">
                        <h4 className="studio-name">{s.name}</h4>
                        
                        <div className="studio-rating-row">
                          <Star size={12} className="text-orange" fill="#f97316" stroke="none" />
                          <span className="rating-num">{s.rating}</span>
                          <span className="rating-count">({s.reviews} Reviews)</span>
                        </div>
                        
                        <div className="studio-location-row">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{s.location}</span>
                        </div>
                        
                        <div className="studio-tags-row">
                          {s.services.map((tag, idx) => (
                            <div key={idx} className="studio-tag">
                              <div className="tag-dot"></div>
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="studio-price-row mt-3">
                          <div className="price-val">₹ {s.price.toLocaleString()}</div>
                          <div className="price-label">Starting price</div>
                        </div>
                        
                        <button 
                          className="btn-studio-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/client/studio-details/photography/${s.id}`, { state: { selectedServices } });
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

            {/* 3. Choose Your Videography Studio */}
            {selectedServices.includes('videography') && (
              <div className="section-block mt-8">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="section-title">3. Choose Your Videography Studio</h3>
                    <p className="section-subtitle mb-0">Select the best videography studio to capture your event perfectly</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleService('videography')}
                      className="btn-outline"
                      style={{ padding: "8px 16px", fontSize: "12px", background: "white", borderColor: "#fecaca", color: "#dc2626", fontWeight: "600", cursor: "pointer" }}
                    >
                      ✕ I don't want Videography
                    </button>
                  </div>
                </div>
                
                <div className="studios-grid">
                  {videoStudios.map(s => (
                    <div 
                      key={s.id} 
                      className={`studio-card ${selectedVideoStudio === s.id ? 'selected' : ''}`}
                      onClick={() => setSelectedVideoStudio(s.id)}
                    >
                      <div className="studio-img-wrapper">
                        <img src={s.img} alt={s.name} />
                        {s.popular && <div className="popular-badge-alt">Popular</div>}
                        {selectedVideoStudio === s.id && (
                          <div className="check-badge-corner-lg"><Check size={16} strokeWidth={3} /></div>
                        )}
                      </div>
                      
                      <div className="studio-content">
                        <h4 className="studio-name">{s.name}</h4>
                        
                        <div className="studio-rating-row">
                          <Star size={12} className="text-orange" fill="#f97316" stroke="none" />
                          <span className="rating-num">{s.rating}</span>
                          <span className="rating-count">({s.reviews} Reviews)</span>
                        </div>
                        
                        <div className="studio-location-row">
                          <MapPin size={12} className="text-gray-400" />
                          <span>{s.location}</span>
                        </div>
                        
                        <div className="studio-tags-row">
                          {s.services.map((tag, idx) => (
                            <div key={idx} className="studio-tag">
                              <div className="tag-dot"></div>
                              <span>{tag}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="studio-price-row mt-3">
                          <div className="price-val">₹ {s.price.toLocaleString()}</div>
                          <div className="price-label">Starting price</div>
                        </div>
                        
                        <button 
                          className="btn-studio-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/client/studio-details/videography/${s.id}`, { state: { selectedServices } });
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

            <EventSummaryFooter icon={Camera} />

            <div className="bottom-navigation" style={{ marginTop: "20px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={handleContinue}>
                Next <ArrowRight size={20} />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            maxWidth: "380px",
            width: "90%",
            border: "1px solid rgba(255, 255, 255, 0.8)",
            color: "#0f172a"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#f0fdf4",
              border: "3px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              color: "#16a34a"
            }}>
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Success!</h3>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Additional services saved successfully!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdditionalServices;
