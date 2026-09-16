import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowLeft, ArrowRight, Download, Copy, CheckCircle2, Sliders, Type, MapPin, Calendar, Phone, RefreshCw, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import html2pdf from "html2pdf.js";
import "../styles/premium-dashboard.css";

const GuestListStep = () => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // Invitation Customization State
  const [guestCount, setGuestCount] = useState(150);
  const [hostName, setHostName] = useState("Host & Family");
  const [eventTitle, setEventTitle] = useState("Grand Event Celebration");
  const [greeting, setGreeting] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("royalGold");
  const [eventDate, setEventDate] = useState("2026-07-17");
  const [eventTime, setEventTime] = useState("Evening Session (06:00 PM - 11:00 PM)");
  const [venueName, setVenueName] = useState("Royal Celebration Hall, Banjara Hills");

  const [eventTypeId, setEventTypeId] = useState("wedding");
  const [brideName, setBrideName] = useState("");
  const [groomName, setGroomName] = useState("");
  const [celebrantName, setCelebrantName] = useState("");
  const [turningAge, setTurningAge] = useState("");
  const [coupleNames, setCoupleNames] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [blessingQuote, setBlessingQuote] = useState("");

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Card themes configuration styles (Classic Themes)
  const themes = {
    royalGold: {
      background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
      border: "3px double #eab308",
      titleColor: "#eab308",
      textColor: "#cbd5e1",
      accentColor: "#fef08a",
      label: "Royal Gold",
      fontFamily: "'Playfair Display', Georgia, serif"
    },
    floralGarden: {
      background: "linear-gradient(135deg, #fff7ed 0%, #fdf2f8 100%)",
      border: "3px solid #fbcfe8",
      titleColor: "#db2777",
      textColor: "#475569",
      accentColor: "#059669",
      label: "Floral Garden",
      fontFamily: "'Georgia', serif"
    },
    modernNeon: {
      background: "linear-gradient(135deg, #090d16 0%, #0c101d 100%)",
      border: "2px solid #06b6d4",
      boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
      titleColor: "#22d3ee",
      textColor: "#94a3b8",
      accentColor: "#e879f9",
      label: "Modern Neon",
      fontFamily: "'Inter', sans-serif"
    },
    minimalistWhite: {
      background: "#ffffff",
      border: "1px solid #cbd5e1",
      titleColor: "#0f172a",
      textColor: "#475569",
      accentColor: "#1e293b",
      label: "Minimalist White",
      fontFamily: "'Times New Roman', serif"
    }
  };

  // Helper dictionary to generate event-matched welcome notes & blessing quotes
  const getEventInvitationTemplate = (typeId, bName, gName, cName, tAge, cCouple, customTitle) => {
    const brideStr = bName || "Bride";
    const groomStr = gName || "Groom";
    const celStr = cName || "Our Celebrant";
    const ageStr = tAge ? ` (${tAge})` : "";
    const coupleStr = cCouple || (bName && gName ? `${bName} & ${gName}` : "Our Loving Couple");

    switch (typeId) {
      case "wedding":
        return {
          greeting: `Together with their families, ${brideStr} & ${groomStr} request the honor of your presence and blessings as they exchange wedding vows and begin their lifelong journey of love, harmony, and togetherness.`,
          quote: "“Two hearts, two souls, united forever in love and grace.”"
        };
      case "reception":
        return {
          greeting: `Please join us for a grand evening of dining, music, and celebration as we honor the newlyweds ${brideStr} & ${groomStr}!`,
          quote: "“May your journey together be blessed with endless laughter, warmth, and lifelong joy.”"
        };
      case "engagement":
        return {
          greeting: `We invite you to share in our happiness as ${brideStr} & ${groomStr} exchange rings and promise their hearts to one another in love.`,
          quote: "“Love is not about looking at each other, but looking together in the same direction.”"
        };
      case "birthday":
        return {
          greeting: `Hip Hip Hooray! You are warmly invited to celebrate ${celStr}'s${ageStr} Birthday Party for a fun-filled day of games, delicious cake, and magical memories!`,
          quote: "“Count your life by smiles, not tears. Count your age by friends, not years.”"
        };
      case "anniversary":
        return {
          greeting: `Love grows sweeter with every passing year! Join us as we toast to ${coupleStr} on their Anniversary celebration and honor their wonderful years of marriage.`,
          quote: "“Real love stories never have endings. Wishing you a lifetime of happiness together.”"
        };
      case "babyshower":
        return {
          greeting: `A little bundle of joy is on the way! Join us as we shower the mother-to-be with love, sweet laughter, and blessings for the new arrival.`,
          quote: "“Ten little fingers, ten little toes, love and happiness wherever baby goes.”"
        };
      case "naming":
        return {
          greeting: `We cordially invite you to join us for the auspicious Naming Ceremony of our precious little one. Your presence and blessings will make this day truly divine.`,
          quote: "“May your life be filled with wisdom, health, happiness, and peace.”"
        };
      case "corporate":
      case "conference":
      case "seminar":
      case "product":
      case "award":
        return {
          greeting: `You are cordially invited to join us for ${customTitle || "our Corporate Event"}. Connect, innovate, and celebrate professional excellence with industry leaders.`,
          quote: "“Innovation distinguishes between a leader and a follower.”"
        };
      case "concert":
      case "festival":
        return {
          greeting: `Get ready for an electrifying night of live music, sparkling lights, and celebration! Join us for ${customTitle || "this Grand Festival"} and experience an unforgettable evening.`,
          quote: "“Where words fail, music speaks.”"
        };
      default:
        return {
          greeting: `We request the honor of your presence to celebrate ${customTitle || "this special milestone"} with us. Your love, presence, and support mean the world to us.`,
          quote: "“Every moment is a fresh beginning filled with joy.”"
        };
    }
  };

  // Validate Phone Number
  const validatePhone = (phone) => {
    if (!phone || phone.trim() === "") {
      setPhoneError("");
      return true;
    }
    const cleanPhone = phone.replace(/[\s\-+()]/g, "");
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
    localStorage.setItem("booking_contact_phone", val);
    validatePhone(val);
  };

  const handleResetTemplateText = (typeId = eventTypeId) => {
    const template = getEventInvitationTemplate(typeId, brideName, groomName, celebrantName, turningAge, coupleNames, eventTitle);
    setGreeting(template.greeting);
    setBlessingQuote(template.quote);
    localStorage.setItem("booking_greeting_note", template.greeting);
    localStorage.setItem("booking_blessing_quote", template.quote);
    localStorage.setItem("booking_greeting_event_type", typeId);
  };

  const handleContinue = () => {
    if (contactPhone && !validatePhone(contactPhone)) {
      alert("Please fix the Phone Number validation error before continuing.");
      return;
    }

    localStorage.setItem("booking_bride_name", brideName);
    localStorage.setItem("booking_groom_name", groomName);
    localStorage.setItem("booking_celebrant_name", celebrantName);
    localStorage.setItem("booking_turning_age", turningAge);
    localStorage.setItem("booking_couple_names", coupleNames);
    localStorage.setItem("booking_contact_phone", contactPhone);
    localStorage.setItem("booking_greeting_note", greeting);
    localStorage.setItem("booking_blessing_quote", blessingQuote);
    localStorage.setItem("booking_greeting_event_type", eventTypeId);
    localStorage.setItem("booking_card_theme", selectedTheme);

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/catering");
    }, 1500);
  };

  // Load initial guest count and details from local storage dynamically
  useEffect(() => {
    const savedCount = localStorage.getItem("booking_guest_count");
    if (savedCount) setGuestCount(Number(savedCount));

    const typeId = localStorage.getItem("booking_event_type_id") || "wedding";
    setEventTypeId(typeId);

    const bName = localStorage.getItem("booking_bride_name") || "";
    const gName = localStorage.getItem("booking_groom_name") || "";
    const cName = localStorage.getItem("booking_celebrant_name") || "";
    const tAge = localStorage.getItem("booking_turning_age") || "";
    const cCouple = localStorage.getItem("booking_couple_names") || "";
    const cContact = localStorage.getItem("booking_contact_name") || "";
    const phone = localStorage.getItem("booking_contact_phone") || "";
    const savedTheme = localStorage.getItem("booking_card_theme");

    if (savedTheme && themes[savedTheme]) {
      setSelectedTheme(savedTheme);
    }

    setBrideName(bName);
    setGroomName(gName);
    setCelebrantName(cName);
    setTurningAge(tAge);
    setCoupleNames(cCouple);
    setContactPhone(phone);
    if (phone) validatePhone(phone);

    const customTitle = localStorage.getItem("booking_custom_title") || localStorage.getItem("booking_event_type_title") || "Grand Celebration";
    setEventTitle(customTitle);

    if (cContact) {
      setHostName(`${cContact} & Family`);
    } else if (bName && gName && (typeId === "wedding" || typeId === "reception" || typeId === "engagement")) {
      setHostName(`${bName} & ${gName} Family`);
    } else if (cName && typeId === "birthday") {
      setHostName(`${cName}'s Family`);
    } else if (cCouple && typeId === "anniversary") {
      setHostName(`${cCouple} Family`);
    }

    const savedVenue = localStorage.getItem("booking_venue_name") || localStorage.getItem("booking_venue_location");
    if (savedVenue) setVenueName(savedVenue);

    const savedDate = localStorage.getItem("booking_event_date");
    if (savedDate) setEventDate(savedDate);

    const savedTime = localStorage.getItem("booking_time_slot") || localStorage.getItem("booking_start_time");
    if (savedTime) setEventTime(savedTime);

    // Auto-generate event-matched welcome note & blessing quote!
    const template = getEventInvitationTemplate(typeId, bName, gName, cName, tAge, cCouple, customTitle);
    const savedGreeting = localStorage.getItem("booking_greeting_note");
    const savedQuote = localStorage.getItem("booking_blessing_quote");
    const savedGreetingType = localStorage.getItem("booking_greeting_event_type");

    const isWeddingType = typeId === "wedding" || typeId === "reception" || typeId === "engagement";
    const isStaleWeddingTextOnNonWedding = !isWeddingType && savedGreeting && (savedGreeting.includes("wedding vows") || savedGreeting.includes("exchange wedding"));

    if (!savedGreeting || savedGreetingType !== typeId || isStaleWeddingTextOnNonWedding) {
      setGreeting(template.greeting);
      setBlessingQuote(template.quote);
      localStorage.setItem("booking_greeting_note", template.greeting);
      localStorage.setItem("booking_blessing_quote", template.quote);
      localStorage.setItem("booking_greeting_event_type", typeId);
    } else {
      setGreeting(savedGreeting);
      setBlessingQuote(savedQuote || template.quote);
    }
  }, []);

  const handleGuestCountChange = (value) => {
    const count = Math.max(10, Math.min(10000, Number(value) || 0));
    setGuestCount(count);
    localStorage.setItem("booking_guest_count", count.toString());
  };

  const handleDownloadPDF = () => {
    if (!cardRef.current) return;
    setDownloading(true);

    const element = cardRef.current;
    const opt = {
      margin: 0.2,
      filename: `${eventTitle.replace(/\s+/g, "_")}_Invitation.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2.5, useCORS: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setDownloading(false);
      })
      .catch((err) => {
        console.error("PDF generation error:", err);
        setDownloading(false);
      });
  };

  const handleCopyLink = () => {
    const dummyLink = `${window.location.origin}/rsvp/mock-share-token`;
    navigator.clipboard.writeText(dummyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentTheme = themes[selectedTheme] || themes.royalGold;

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          {/* Stepper Area */}
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
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Guest List</div>
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

          {/* Main Layout Grid */}
          <div className="decoration-page" style={{ padding: "0 32px 32px" }}>
            <div className="dec-header" style={{ marginBottom: "24px" }}>
              <h2>Guests & Invitation Design</h2>
              <p>Specify the size of your gathering and draft a custom creative invitation</p>
            </div>

            <div className="dec-layout-wrapper" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "32px", alignItems: "start" }}>
              
              {/* Left Column: Input Form */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                
                {/* Guest Count Selector */}
                <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "16px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sliders size={18} className="text-orange-500" />
                    1. Expected Gathering Size
                  </h4>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" }}>Number of Guests</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <input
                        type="range"
                        min="10"
                        max="2000"
                        step="10"
                        value={guestCount}
                        onChange={(e) => handleGuestCountChange(e.target.value)}
                        style={{ flex: 1, accentColor: "#ea580c", cursor: "pointer" }}
                      />
                      <input
                        type="number"
                        min="10"
                        max="10000"
                        value={guestCount}
                        onChange={(e) => handleGuestCountChange(e.target.value)}
                        style={{ width: "90px", padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "14px", fontWeight: "bold", textAlign: "center" }}
                      />
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "11px", marginTop: "6px" }}>Catering plate requirements will default to this gathering size.</p>
                  </div>
                </div>

                {/* Card Builder Customization */}
                <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ fontWeight: 700, color: "#0f172a", marginBottom: "16px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Type size={18} className="text-indigo-500" />
                    2. Customize Digital Invitation Card
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    {/* Theme Selector */}
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "8px" }}>Card Design Theme</label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                        {Object.keys(themes).map((tKey) => (
                          <button
                            key={tKey}
                            type="button"
                            onClick={() => setSelectedTheme(tKey)}
                            style={{
                              padding: "10px 8px",
                              borderRadius: "8px",
                              fontSize: "11px",
                              fontWeight: "600",
                              cursor: "pointer",
                              border: selectedTheme === tKey ? "2px solid #ea580c" : "1px solid #cbd5e1",
                              background: selectedTheme === tKey ? "#fff7ed" : "white",
                              color: selectedTheme === tKey ? "#c2410c" : "#475569"
                            }}
                          >
                            {themes[tKey].label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Specific Name Inputs */}
                    {(eventTypeId === "wedding" || eventTypeId === "reception" || eventTypeId === "engagement") && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>👰 Bride (Girl) Name</label>
                          <input
                            type="text"
                            value={brideName}
                            onChange={(e) => {
                              setBrideName(e.target.value);
                              localStorage.setItem("booking_bride_name", e.target.value);
                            }}
                            placeholder="e.g. Anjali Sharma"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>🤵 Groom (Boy) Name</label>
                          <input
                            type="text"
                            value={groomName}
                            onChange={(e) => {
                              setGroomName(e.target.value);
                              localStorage.setItem("booking_groom_name", e.target.value);
                            }}
                            placeholder="e.g. Rohan Verma"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                      </div>
                    )}

                    {eventTypeId === "birthday" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>🎂 Birthday Person Name</label>
                          <input
                            type="text"
                            value={celebrantName}
                            onChange={(e) => {
                              setCelebrantName(e.target.value);
                              localStorage.setItem("booking_celebrant_name", e.target.value);
                            }}
                            placeholder="e.g. Riya Sharma"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>🎈 Turning Age</label>
                          <input
                            type="text"
                            value={turningAge}
                            onChange={(e) => {
                              setTurningAge(e.target.value);
                              localStorage.setItem("booking_turning_age", e.target.value);
                            }}
                            placeholder="e.g. 5th / 21st Birthday"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                      </div>
                    )}

                    {eventTypeId === "anniversary" && (
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>💕 Couple Names</label>
                        <input
                          type="text"
                          value={coupleNames}
                          onChange={(e) => {
                            setCoupleNames(e.target.value);
                            localStorage.setItem("booking_couple_names", e.target.value);
                          }}
                          placeholder="e.g. Ananya & Vikram"
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                        />
                      </div>
                    )}

                    {(eventTypeId === "babyshower" || eventTypeId === "naming") && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>👶 Celebrant / Baby Name</label>
                          <input
                            type="text"
                            value={celebrantName}
                            onChange={(e) => {
                              setCelebrantName(e.target.value);
                              localStorage.setItem("booking_celebrant_name", e.target.value);
                            }}
                            placeholder="e.g. Baby Aarav / Mother Name"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>✨ Sub-title / Note</label>
                          <input
                            type="text"
                            value={turningAge}
                            onChange={(e) => {
                              setTurningAge(e.target.value);
                              localStorage.setItem("booking_turning_age", e.target.value);
                            }}
                            placeholder="e.g. Grand Naming Ceremony"
                            style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Event Celebration Heading</label>
                      <input
                        type="text"
                        value={eventTitle}
                        onChange={(e) => {
                          setEventTitle(e.target.value);
                          localStorage.setItem("booking_custom_title", e.target.value);
                        }}
                        placeholder="e.g. Shree's Birthday Party"
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Event Date</label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => {
                            setEventDate(e.target.value);
                            localStorage.setItem("booking_event_date", e.target.value);
                          }}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Time / Slot</label>
                        <input
                          type="text"
                          value={eventTime}
                          onChange={(e) => {
                            setEventTime(e.target.value);
                            localStorage.setItem("booking_time_slot", e.target.value);
                          }}
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Host / Organizer Name</label>
                        <input
                          type="text"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                          placeholder="e.g. Shree & Family"
                          style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                        />
                      </div>

                      {/* Contact / RSVP Phone Number Input with Validation */}
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <span>📞 Contact Phone Number</span>
                          {contactPhone && !phoneError && <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: "700" }}>✓ Valid</span>}
                        </label>
                        <input
                          type="tel"
                          value={contactPhone}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder="e.g. 98765 43210"
                          style={{
                            width: "100%",
                            padding: "10px 12px",
                            border: phoneError ? "1.5px solid #ef4444" : "1px solid #cbd5e1",
                            borderRadius: "8px",
                            fontSize: "13px",
                            backgroundColor: phoneError ? "#fef2f2" : "white"
                          }}
                        />
                        {phoneError && (
                          <p style={{ color: "#ef4444", fontSize: "11px", margin: "4px 0 0", fontWeight: "600" }}>
                            {phoneError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>Venue Location Address</label>
                      <input
                        type="text"
                        value={venueName}
                        onChange={(e) => {
                          setVenueName(e.target.value);
                          localStorage.setItem("booking_venue_name", e.target.value);
                        }}
                        placeholder="e.g. Royal Palace Grand Hall"
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                      />
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>Invitation Welcome Note</label>
                        <button
                          type="button"
                          onClick={() => handleResetTemplateText()}
                          style={{
                            fontSize: "11px",
                            color: "#ea580c",
                            background: "#fff7ed",
                            border: "1px solid #ffedd5",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: "600"
                          }}
                        >
                          <RefreshCw size={11} /> Auto-fill {eventTypeId.toUpperCase()} Note
                        </button>
                      </div>
                      <textarea
                        rows="3"
                        value={greeting}
                        onChange={(e) => {
                          setGreeting(e.target.value);
                          localStorage.setItem("booking_greeting_note", e.target.value);
                        }}
                        placeholder="Welcome greeting details..."
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", resize: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", display: "block", marginBottom: "6px" }}>✨ Blessing Quote & Special Sub-heading</label>
                      <input
                        type="text"
                        value={blessingQuote}
                        onChange={(e) => {
                          setBlessingQuote(e.target.value);
                          localStorage.setItem("booking_blessing_quote", e.target.value);
                        }}
                        placeholder="e.g. Special quote for this celebration..."
                        style={{ width: "100%", padding: "10px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                      />
                    </div>

                  </div>
                </div>

                {/* Back / Next Navigation */}
                <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                  <button className="btn-nav-back" onClick={() => navigate("/client/event-type")}>
                    <ChevronLeft size={18} /> Back to Event Type
                  </button>
                  <button className="btn-nav-continue" onClick={handleContinue}>
                    Continue to Select Venue <ArrowRight size={20} />
                  </button>
                </div>

              </div>

              {/* Right Column: Live Creative Preview & PDF Generator */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "20px" }}>
                
                {/* Live Card Preview Box */}
                <div 
                  ref={cardRef}
                  style={{
                    background: currentTheme.background,
                    border: currentTheme.border,
                    boxShadow: currentTheme.boxShadow || "0 10px 25px -5px rgba(0,0,0,0.1)",
                    fontFamily: currentTheme.fontFamily,
                    padding: "36px",
                    borderRadius: "16px",
                    minHeight: "480px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    color: currentTheme.textColor,
                    transition: "all 0.3s ease",
                    textAlign: "center"
                  }}
                >
                  {/* Decorative Frame Corner Details */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: currentTheme.titleColor, opacity: 0.6 }}>
                    <span>✦</span>
                    <span>✦</span>
                  </div>

                  {/* Card Content body */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "14px" }}>
                    
                    <span style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: currentTheme.titleColor, fontWeight: "700" }}>
                      YOU ARE CORDIALLY INVITED TO CELEBRATE
                    </span>

                    {/* Wedding / Reception / Engagement Header */}
                    {(eventTypeId === "wedding" || eventTypeId === "reception" || eventTypeId === "engagement") && (
                      <h2 style={{ fontSize: "24px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0", letterSpacing: "0.5px" }}>
                        👰 {brideName || "Bride"} & 🤵 {groomName || "Groom"}
                      </h2>
                    )}

                    {/* Birthday Party Header */}
                    {eventTypeId === "birthday" && (
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        🎂 {celebrantName || "Birthday Star"} {turningAge ? `(${turningAge})` : ""}
                      </h2>
                    )}

                    {/* Anniversary Header */}
                    {eventTypeId === "anniversary" && (
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        💕 {coupleNames || "Happy Couple"}
                      </h2>
                    )}

                    {/* Baby Shower Header */}
                    {eventTypeId === "babyshower" && (
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        👶 {celebrantName || "Mother-to-be & Baby"}
                      </h2>
                    )}

                    {/* Naming Ceremony Header */}
                    {eventTypeId === "naming" && (
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        👶 {celebrantName || "Little One"}'s Naming Ceremony
                      </h2>
                    )}

                    {/* Corporate & Professional Events Header */}
                    {(eventTypeId === "corporate" || eventTypeId === "conference" || eventTypeId === "seminar" || eventTypeId === "product" || eventTypeId === "award") && (
                      <h2 style={{ fontSize: "20px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        🏢 {hostName || "Corporate Event"}
                      </h2>
                    )}

                    {/* Concert & Festival Header */}
                    {(eventTypeId === "concert" || eventTypeId === "festival") && (
                      <h2 style={{ fontSize: "22px", fontWeight: "900", color: currentTheme.accentColor, margin: "4px 0" }}>
                        🎵 {hostName || "Festival Celebration"}
                      </h2>
                    )}

                    <h1 style={{ fontSize: "19px", fontWeight: "bold", color: currentTheme.titleColor, margin: "2px 0", padding: "0 10px" }}>
                      {eventTitle || "Join the Celebration"}
                    </h1>

                    <p style={{ fontSize: "13px", fontStyle: "italic", lineHeight: "1.6", margin: "6px 0 2px", opacity: 0.9 }}>
                      {greeting || "Your invitation message details will print here..."}
                    </p>

                    {blessingQuote && (
                      <p style={{ fontSize: "12px", fontWeight: "700", color: currentTheme.accentColor, margin: "0 0 4px", opacity: 0.95, letterSpacing: "0.3px" }}>
                        {blessingQuote}
                      </p>
                    )}

                    {/* Schedule block */}
                    <div style={{ borderTop: `1px solid ${currentTheme.titleColor}33`, borderBottom: `1px solid ${currentTheme.titleColor}33`, padding: "12px 0", margin: "8px 0" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "13px", color: currentTheme.accentColor, fontWeight: "600" }}>
                        <Calendar size={14} />
                        {eventDate ? new Date(eventDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }) : "Date pending"}
                      </div>
                      {eventTime && (
                        <p style={{ fontSize: "11px", margin: "4px 0 0", color: currentTheme.textColor }}>
                          Celebration commences at {eventTime}
                        </p>
                      )}
                    </div>

                    {/* Location Block */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <span style={{ fontSize: "10px", color: currentTheme.titleColor, fontWeight: "600", letterSpacing: "1px" }}>VENUE</span>
                      <p style={{ fontSize: "13px", fontWeight: "bold", color: currentTheme.accentColor, margin: 0, display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={14} />
                        {venueName || "Venue Address"}
                      </p>
                    </div>

                    {/* RSVP Contact Phone Number Display */}
                    {contactPhone && (
                      <div style={{ marginTop: "4px", fontSize: "12px", color: currentTheme.accentColor, fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                        <Phone size={13} /> RSVP / Contact: {contactPhone}
                      </div>
                    )}

                  </div>

                  {/* Card footer details */}
                  <div style={{ marginTop: "16px" }}>
                    <div style={{ fontSize: "10px", color: currentTheme.titleColor, fontWeight: "600" }}>WITH BEST COMPLIMENTS FROM</div>
                    <h4 style={{ fontSize: "14px", fontWeight: "bold", margin: "4px 0 0", color: currentTheme.accentColor }}>{hostName || "Host Details"}</h4>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: currentTheme.titleColor, opacity: 0.6, marginTop: "12px" }}>
                    <span>✦</span>
                    <span>✦</span>
                  </div>

                </div>

                {/* Print/Download Button Panel */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={downloading}
                    className="btn-solid-orange"
                    style={{ flex: 1, padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px" }}
                  >
                    {downloading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download Invitation PDF
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCopyLink}
                    style={{
                      backgroundColor: "white",
                      color: "#4f46e5",
                      border: "1px solid #e2e8f0",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      fontSize: "14px"
                    }}
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? "Link Copied!" : "Copy Share Link"}
                  </button>
                </div>

                <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "16px", borderRadius: "12px" }}>
                  <h4 style={{ fontWeight: 700, color: "#1e3a8a", marginBottom: "4px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 size={15} /> Stepper sync</h4>
                  <p style={{ color: "#1e40af", fontSize: "11px", lineHeight: "1.4" }}>
                    The gathering size (<strong>{guestCount} guests</strong>) is saved. When you proceed to the next step, Catering services will adapt to this guest size.
                  </p>
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
                <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Guest List & Invitation setup complete!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default GuestListStep;
