import React, { useState } from "react";
import { 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Send,
  ChevronLeft,
  ChevronRight,
  Heart,
  PartyPopper,
  Gift,
  Star,
  Users,
  Briefcase,
  Music,
  MonitorPlay,
  Sparkles,
  Award,
  MoreHorizontal,
  Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const EventType = () => {
  const navigate = useNavigate();
  const [selectedEventType, setSelectedEventType] = useState(() => localStorage.getItem("booking_event_type_id") || null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [brideName, setBrideName] = useState(() => localStorage.getItem("booking_bride_name") || "");
  const [groomName, setGroomName] = useState(() => localStorage.getItem("booking_groom_name") || "");
  const [celebrantName, setCelebrantName] = useState(() => localStorage.getItem("booking_celebrant_name") || "");
  const [turningAge, setTurningAge] = useState(() => localStorage.getItem("booking_turning_age") || "");
  const [coupleNames, setCoupleNames] = useState(() => localStorage.getItem("booking_couple_names") || "");
  const [companyName, setCompanyName] = useState(() => localStorage.getItem("booking_company_name") || "");
  const [contactName, setContactName] = useState(() => localStorage.getItem("booking_contact_name") || "");
  const [contactPhone, setContactPhone] = useState(() => localStorage.getItem("booking_contact_phone") || "");
  const [specialNotes, setSpecialNotes] = useState(() => localStorage.getItem("booking_special_notes") || "");

  const [phoneError, setPhoneError] = useState("");

  const validatePhone = (phone) => {
    if (!phone || phone.trim() === "") {
      setPhoneError("");
      return true;
    }
    const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, "");
    const isValid = /^[6-9]\d{9}$/.test(cleanPhone) || /^(91)?[6-9]\d{9}$/.test(cleanPhone);
    if (!isValid) {
      setPhoneError("Please enter a valid 10-digit mobile number starting with 6-9 (e.g. 9876543210)");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const handlePhoneChange = (val) => {
    setContactPhone(val);
    validatePhone(val);
  };

  const handleSelectEvent = (id) => {
    if (selectedEventType === id) {
      setSelectedEventType(null);
    } else {
      setSelectedEventType(id);
    }
  };

  const handleContinue = () => {
    if (!selectedEventType) {
      alert("Please select an Event Type to continue.");
      return;
    }

    if (contactPhone && !validatePhone(contactPhone)) {
      alert("Please enter a valid 10-digit mobile phone number before continuing.");
      return;
    }

    const eventObj = allEventsList.find(e => e.id === selectedEventType) || { title: selectedEventType };
    const eventTitle = eventObj.title;

    localStorage.setItem("booking_event_type_id", selectedEventType);
    localStorage.setItem("booking_event_type_title", eventTitle);
    localStorage.setItem("booking_bride_name", brideName);
    localStorage.setItem("booking_groom_name", groomName);
    localStorage.setItem("booking_celebrant_name", celebrantName);
    localStorage.setItem("booking_turning_age", turningAge);
    localStorage.setItem("booking_couple_names", coupleNames);
    localStorage.setItem("booking_company_name", companyName);
    localStorage.setItem("booking_contact_name", contactName);
    localStorage.setItem("booking_contact_phone", contactPhone);
    localStorage.setItem("booking_special_notes", specialNotes);

    let customTitle = eventTitle;
    if (selectedEventType === "wedding" || selectedEventType === "reception" || selectedEventType === "engagement") {
      if (brideName || groomName) {
        customTitle = `${eventTitle} (${brideName || "Bride"} & ${groomName || "Groom"})`;
      }
    } else if (selectedEventType === "birthday") {
      if (celebrantName) customTitle = `${celebrantName}'s ${turningAge ? turningAge + " " : ""}Birthday Party`;
    } else if (selectedEventType === "anniversary") {
      if (coupleNames) customTitle = `${coupleNames} ${eventTitle}`;
    } else if (companyName) {
      customTitle = `${companyName} - ${eventTitle}`;
    }

    localStorage.setItem("booking_custom_title", customTitle);

    try {
      const existing = JSON.parse(localStorage.getItem("client_bookings") || "[]");
      if (existing.length > 0) {
        existing[0].eventTitle = customTitle;
        existing[0].eventType = eventTitle;
        existing[0].brideName = brideName;
        existing[0].groomName = groomName;
        existing[0].celebrantName = celebrantName;
        existing[0].turningAge = turningAge;
        existing[0].contactName = contactName;
        existing[0].contactPhone = contactPhone;
        existing[0].specialNotes = specialNotes;
        localStorage.setItem("client_bookings", JSON.stringify(existing));
      }
    } catch(e) {}

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/expected-guests");
    }, 1500);
  };

  const [allEventsList, setAllEventsList] = useState([]);
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  React.useEffect(() => {
    // Dynamic import to avoid massive destructuring
    import('lucide-react').then(LucideIcons => {
      const saved = localStorage.getItem("admin_event_types");
      let storedEvents = [];
      if (saved) {
        storedEvents = JSON.parse(saved);
        // Migrate old baby shower image if present
        storedEvents = storedEvents.map(e => 
          e.id === "babyshower" && e.image && e.image.includes("unsplash") 
          ? { ...e, image: "/images/baby-shower-new.png" } 
          : e
        );
        processEvents(storedEvents, LucideIcons);
      } else {
        import('../../utils/eventTypesData').then(m => {
          storedEvents = m.defaultEventTypes;
          localStorage.setItem("admin_event_types", JSON.stringify(storedEvents));
          processEvents(storedEvents, LucideIcons);
        });
      }
    });
  }, []);

  const processEvents = (storedEvents, LucideIcons) => {
    // Filter only enabled events strictly
    const enabledEvents = storedEvents.filter(e => e.status === true || e.status === "true");
    
    // Map string icon names to actual Lucide components
    const processedEvents = enabledEvents.map(e => ({
      ...e,
      icon: LucideIcons[e.iconName] || LucideIcons.Star
    }));
    
    setAllEventsList(processedEvents);
    setTrendingEvents(processedEvents.filter(e => e.isTrending));
    setAllEvents(processedEvents.filter(e => !e.isTrending));
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          <div className="page-header" style={{ padding: "24px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "28px", fontWeight: "700", marginBottom: "4px" }}>Select Event Type</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Please select the type of event you are planning</p>
          </div>

          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "14.285714285714286%", background: '#ea580c' }}></div>
            <div className="step-point">
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>1</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>2</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">3</div>
              <div className="step-label">Expected Guests</div>
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


          <div className="event-type-container-new" style={{ padding: "0 32px 32px" }}>
            
            {/* Trending Event Types */}
            <div className="section-header-flex">
              <h3 className="section-title-new flex items-center gap-2">
                <span className="text-orange-500">🔥</span> Trending Event Types
              </h3>
              <button className="view-all-btn">View All <ArrowRight size={16} /></button>
            </div>
            
            <div className="trending-events-grid">
              {/* <button className="slider-btn left"><ChevronLeft size={20}/></button> */}
              {trendingEvents.map((event) => (
                <div className="t-event-card" key={event.id}>
                  <div className="t-event-img-wrap">
                    <img src={event.image} alt={event.title} />
                    <div className="t-badge"><Check size={12}/> Trending</div>
                  </div>
                  
                  <div className="t-event-content">
                    <div className="t-event-icon" style={{backgroundColor: event.iconBg, color: event.iconColor}}>
                      <event.icon size={24} />
                    </div>
                    <div className="t-event-text">
                      <h4>{event.title}</h4>
                      <p>{event.description}</p>
                    </div>
                    <div className="t-event-actions">
                      <button 
                        className="btn-solid-sm"
                        style={selectedEventType === event.id ? { backgroundColor: '#22c55e', borderColor: '#22c55e' } : {}}
                        onClick={() => handleSelectEvent(event.id)}
                      >
                        {selectedEventType === event.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {/* <button className="slider-btn right"><ChevronRight size={20}/></button> */}
            </div>

            {/* All Event Types */}
            <div className="section-header-flex mt-8">
              <h3 className="section-title-new flex items-center gap-2">
                <Sparkles size={18} className="text-orange-500" /> All Event Types
              </h3>
            </div>

            <div className="all-events-grid">
              {allEvents.map(event => (
                <div className="a-event-card" key={event.id}>
                  <div className="a-event-img-wrap">
                    <img src={event.image} alt={event.title} />
                  </div>
                  <div className="a-event-content">
                    <div className="a-event-icon-small" style={{backgroundColor: event.iconBg, color: event.iconColor}}>
                      <event.icon size={16} />
                    </div>
                    <h4 className="a-event-title">{event.title}</h4>
                    <div className="a-event-actions mt-auto">
                      <button 
                        className="btn-solid-xs"
                        style={selectedEventType === event.id ? { backgroundColor: '#22c55e', borderColor: '#22c55e' } : {}}
                        onClick={() => handleSelectEvent(event.id)}
                      >
                        {selectedEventType === event.id ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Banner */}
            <div className="custom-event-banner-new mt-8">
              <div className="banner-left flex gap-4 items-center">
                <div className="banner-icon-bg-new">
                  <Mail size={24} className="text-purple-600" />
                </div>
                <div>
                  <h4>Can't find your event type?</h4>
                  <p>If your event type is not listed above, you can send us a request and we'll get back to you with personalized options.</p>
                </div>
              </div>
              <button className="btn-outline-orange flex gap-2 items-center" onClick={() => navigate("/client/event-type-request")}>
                <Send size={16} /> Send Event Type Request
              </button>
            </div>

            {/* Event Specific Details Form */}
            {selectedEventType && (
              <div className="bg-white border-2 border-orange-200 rounded-2xl p-6 mt-8 shadow-sm space-y-4">
                <div className="border-b border-orange-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Sparkles size={20} className="text-orange-500" />
                      Event Details ({allEvents.find(e => e.id === selectedEventType)?.title || trendingEvents.find(e => e.id === selectedEventType)?.title || "Selected Event"})
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Please provide specific details for your celebration</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-black px-3 py-1 rounded-full uppercase">
                    Required Details
                  </span>
                </div>

                {/* Form Fields for Wedding / Reception / Engagement */}
                {(selectedEventType === "wedding" || selectedEventType === "reception" || selectedEventType === "engagement") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                        👰 Bride (Girl) Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Anjali Sharma"
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                        🤵 Groom (Boy) Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Rohan Verma"
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields for Birthday Party */}
                {selectedEventType === "birthday" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                        🎂 Birthday Person / Kid Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Riya Sharma"
                        value={celebrantName}
                        onChange={(e) => setCelebrantName(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                        🎈 Age / Turning Milestone
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5th Birthday / 21st Birthday"
                        value={turningAge}
                        onChange={(e) => setTurningAge(e.target.value)}
                        className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                      />
                    </div>
                  </div>
                )}

                {/* Form Fields for Anniversary */}
                {selectedEventType === "anniversary" && (
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                      💕 Couple Names <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ananya & Vikram"
                      value={coupleNames}
                      onChange={(e) => setCoupleNames(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                )}

                {/* Form Fields for Corporate / Other Events */}
                {(selectedEventType === "corporate" || selectedEventType === "conference" || selectedEventType === "product" || selectedEventType === "seminar" || selectedEventType === "concert") && (
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                      🏢 Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tech Corp Pvt Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>
                )}

                {/* Common Contact & Special Instructions Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                      👤 Family / Primary Contact Person
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. Suresh Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-slate-700 flex justify-between items-center mb-1.5">
                      <span>📞 Contact Phone Number</span>
                      {contactPhone && !phoneError && <span className="text-emerald-600 font-bold text-[11px]">✓ Valid</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9876543210"
                      value={contactPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full text-xs font-semibold p-3 border ${phoneError ? 'border-red-500 bg-red-50/50' : 'border-slate-200 bg-slate-50/50'} rounded-xl focus:outline-none focus:border-orange-500`}
                    />
                    {phoneError && (
                      <p className="text-[11px] font-bold text-red-500 mt-1">{phoneError}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-700 block mb-1.5">
                    📝 Special Event Rituals & Custom Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Traditional Mandap setup, Sangeet stage, Cake flavor & balloon decoration requirements"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full text-xs font-semibold p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500 bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            <EventSummaryFooter icon={PartyPopper} />

            {/* Bottom Nav */}
            <div className="bottom-navigation bg-white mt-4" style={{borderRadius: "12px"}}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={handleContinue}>
                Continue to Expected Guests <ArrowRight size={20} />
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
            border: "1px solid rgba(255, 255, 255, 0.8)"
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
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Event Type selected successfully!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventType;
