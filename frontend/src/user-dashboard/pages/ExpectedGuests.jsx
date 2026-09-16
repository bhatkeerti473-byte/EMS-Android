import React, { useState, useEffect } from "react";
import { Users, Info, ChevronLeft, ArrowRight, CheckCircle2, HeadphonesIcon, Building, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const ExpectedGuests = () => {
  const navigate = useNavigate();

  const [guestCount, setGuestCount] = useState(150);
  const [eventType, setEventType] = useState("Wedding");
  const [eventDate, setEventDate] = useState("");
  const [customTitle, setCustomTitle] = useState("");

  const eventImages = {
    wedding: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    reception: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    engagement: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
    birthday: "https://images.unsplash.com/photo-1530103862676-de8892ebeea0?auto=format&fit=crop&w=800&q=80",
    anniversary: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80",
    corporate: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    other: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"
  };


  const [eventTypeTitle, setEventTypeTitle] = useState("");

  useEffect(() => {
    // Load previously saved guest count
    const savedCount = localStorage.getItem("booking_guest_count");
    if (savedCount) setGuestCount(Number(savedCount));

const savedType = localStorage.getItem("booking_event_type_id") || localStorage.getItem("booking_event_type");
    if (savedType) setEventType(savedType);

    const savedTypeTitle = localStorage.getItem("booking_event_type_title") || localStorage.getItem("booking_event_type");
    if (savedTypeTitle) setEventTypeTitle(savedTypeTitle);

    const savedTitle = localStorage.getItem("booking_custom_title");
    if (savedTitle) setCustomTitle(savedTitle);

    const savedDate = localStorage.getItem("booking_event_date") || localStorage.getItem("booking_date");
    if (savedDate) setEventDate(savedDate);
  }, []);

  const handleContinue = () => {
    localStorage.setItem("booking_guest_count", guestCount);
    navigate("/client/select-venue");
  };

  const decreaseGuests = () => {
    if (guestCount > 1) {
      setGuestCount(prev => prev - (prev > 100 ? 10 : (prev > 10 ? 5 : 1)));
    }
  };

  const increaseGuests = () => {
    setGuestCount(prev => prev + (prev >= 100 ? 10 : (prev >= 10 ? 5 : 1)));
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        
        <div className="content-inner">
          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "28.571428571428573%", background: '#ea580c' }}></div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>1</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>2</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>3</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Expected Guests</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">4</div>
              <div className="step-label">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">5</div>
              <div className="step-label">Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">6</div>
              <div className="step-label">Catering Options</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Booking Summary</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', margin: '30px 32px' }}>
            
            {/* Left Content */}
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Users size={28} style={{ color: '#2563eb' }} />
                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Expected Guests</h2>
              </div>
              <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '32px' }}>
                Tell us how many guests are expected at your event. This helps us suggest the right venues, catering packages and seating arrangements for your special day.
              </p>

              <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={30} style={{ color: '#4f46e5' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Number of Guests <span style={{ color: '#ef4444' }}>*</span>
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                      Enter the approximate number of guests attending your event.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', maxWidth: '300px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px', borderRadius: '100px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', width: '100%' }}>
                        <button 
                          onClick={decreaseGuests}
                          disabled={guestCount <= 1}
                          style={{ 
                            width: '44px', height: '44px', borderRadius: '50%', background: guestCount <= 1 ? '#f1f5f9' : '#e0e7ff', 
                            color: guestCount <= 1 ? '#94a3b8' : '#4f46e5', border: 'none', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', cursor: guestCount <= 1 ? 'not-allowed' : 'pointer', fontSize: '24px', fontWeight: '500' 
                          }}
                        >
                          -
                        </button>
                        
                        <input 
                          type="number" 
                          value={guestCount}
                          onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                          style={{ 
                            flex: 1, border: 'none', textAlign: 'center', fontSize: '28px', fontWeight: '800', color: '#0f172a', 
                            outline: 'none', background: 'transparent', width: '100%' 
                          }}
                        />
                        
                        <button 
                          onClick={increaseGuests}
                          style={{ 
                            width: '44px', height: '44px', borderRadius: '50%', background: '#4f46e5', 
                            color: 'white', border: 'none', display: 'flex', alignItems: 'center', 
                            justifyContent: 'center', cursor: 'pointer', fontSize: '24px', fontWeight: '500' 
                          }}
                        >
                          +
                        </button>
                      </div>
                      <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Minimum: 1 guest</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '24px', borderRadius: '16px' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '15px', fontWeight: '800', margin: '0 0 16px 0' }}>
                  <Info size={18} style={{ color: '#2563eb' }} /> Why do we ask for this?
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#166534', fontSize: '14px', fontWeight: '500' }}>Helps us match you with venues that have enough capacity.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#166534', fontSize: '14px', fontWeight: '500' }}>Ensures the right catering and seating arrangements.</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#166534', fontSize: '14px', fontWeight: '500' }}>Helps us provide accurate pricing and service recommendations.</span>
                  </div>
                </div>
              </div>

              <EventSummaryFooter icon={Users} overrides={{ guestCount }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <button 
                  type="button"
                  onClick={() => navigate("/client/event-type")}
                  style={{ padding: '14px 24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button 
                  type="button"
                  className="hover-button-highlight"
                  onClick={handleContinue}
                  style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: '#2563eb', color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>

            </div>

            {/* Right Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ height: '180px', overflow: 'hidden' }}>
                  <img 
                    src={eventImages[eventType?.toLowerCase()] || eventImages.other} 
                    alt="Event Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{ background: '#e0e7ff', padding: '10px', borderRadius: '12px', color: '#4f46e5' }}>
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                        {customTitle || eventTypeTitle || eventType || "Your Event"}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '13px' }}>
                        <Calendar size={14} />
                        {eventDate ? new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "Date Not Selected"}
                      </div>
                    </div>
                  </div>

                  <h5 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Booking Summary</h5>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <CheckCircle2 size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Event Type</div>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700', textTransform: 'capitalize' }}>{eventTypeTitle || eventType || "Not Selected"}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <Users size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Expected Guests</div>
                        <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>{guestCount} Guests</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flexShrink: 0 }}>
                  <HeadphonesIcon size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Need Help?</h4>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                    Our event specialists are here to assist you in choosing the perfect venue and services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpectedGuests;
