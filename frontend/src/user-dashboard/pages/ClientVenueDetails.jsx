import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getVenueById } from "../services/userApi";
import {
  ChevronRight,
  Heart,
  Share2,
  Star,
  Users,
  LayoutGrid,
  Car,
  Maximize,
  ChevronLeft,
  Calendar,
  Clock,
  Info,
  Phone,
  ShieldCheck,
  Play,
  Check,
  Image as ImageIcon
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import "../styles/ClientVenueDetails.css";

const ClientVenueDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Custom gallery & booking states
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [bookingType, setBookingType] = useState("fullDay");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("21:00");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = () => {
    setWishlist(prev => {
      const isSaved = prev.some(item => item.id === venue.id);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== venue.id);
      } else {
        const wishlistItem = {
          id: venue.id,
          title: venue.name,
          category: "Venue",
          location: venue.location,
          price: 125000,
          image: venue.images[0],
          status: "Upcoming"
        };
        newWishlist = [...prev, wishlistItem];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const savedDate = localStorage.getItem("booking_event_date");

  const handlePrevImage = () => {
    setActiveImageIdx(prev => (prev === 0 ? venue.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx(prev => (prev === venue.images.length - 1 ? 0 : prev + 1));
  };

  const handleProceed = () => {
    localStorage.setItem("booking_venue_name", venue.name);
    localStorage.setItem("booking_venue_location", venue.location);
    localStorage.setItem("booking_venue_image", venue.images[0]);
    localStorage.setItem("booking_venue_price", venue.startingPrice);

    try {
      const existing = JSON.parse(localStorage.getItem("client_bookings") || "[]");
      if (existing.length > 0) {
        existing[0].venueName = venue.name;
        existing[0].location = venue.location;
        existing[0].venueImg = venue.images[0];
        localStorage.setItem("client_bookings", JSON.stringify(existing));
      }
    } catch(e) {}

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/decoration");
    }, 1500);
  };

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        const data = await getVenueById(id);
        setVenue({
          id: data._id,
          name: data.name || "Unnamed Venue",
          location: data.location || "Unknown Location",
          rating: 4.5,
          reviews: Math.floor(Math.random() * 100) + 50,
          type: data.type || "Event Hall",
          description: data.description || "No description provided.",
          capacity: data.capacity ? `${data.capacity} Guests` : "Flexible",
          parking: data.facilities?.includes("Parking") ? "Available" : "Limited",
          area: "N/A",
          priceRange: data.price ? `₹${data.price.toLocaleString()}` : "Contact for price",
          startingPrice: data.price ? `₹${data.price.toLocaleString()}` : "Contact for price",
          images: data.images?.length > 0 ? data.images : [
            "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80"
          ],
          video: data.video || null,
          amenities: data.facilities?.map(f => ({ name: f })) || [
            { name: "Air Conditioning" },
            { name: "Power Backup" },
            { name: "Wi-Fi" }
          ]
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  if (loading) return <div className="premium-dashboard"><Sidebar /><div className="premium-main"><Topbar title="Venue Details" /><div style={{padding: "2rem"}}>Loading venue details...</div></div></div>;
  if (error || !venue) return <div className="premium-dashboard"><Sidebar /><div className="premium-main"><Topbar title="Venue Details" /><div style={{padding: "2rem"}}>{error || "Venue not found"}</div></div></div>;

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Venue Details" />

        <div className="premium-content-scroll venue-details-page">
          
          {/* Breadcrumbs */}
          <div className="vd-breadcrumbs">
            <span onClick={() => navigate("/client/dashboard")} style={{cursor: "pointer"}}>Home</span>
            <ChevronRight size={14} />
            <span onClick={() => navigate("/client/event-type")} style={{cursor: "pointer"}}>Select Event Type</span>
            <ChevronRight size={14} />
            <span onClick={() => navigate("/client/select-venue")} style={{cursor: "pointer"}}>Select Venue</span>
            <ChevronRight size={14} />
            <span className="active">Venue Details</span>
          </div>

          <div className="vd-layout">
            
            {/* ---------------- LEFT COLUMN ---------------- */}
            <div className="vd-main-content">
              
              {/* Gallery */}
              <div className="vd-gallery">
                <div className="vd-main-img-container">
                  <div className="vd-featured-badge">Featured</div>
                  <img src={venue.images[activeImageIdx]} alt={venue.name} className="vd-main-img" />
                  <button className="vd-gallery-nav left" onClick={handlePrevImage}><ChevronLeft size={20} /></button>
                  <button className="vd-gallery-nav right" onClick={handleNextImage}><ChevronRight size={20} /></button>
                  <div className="vd-view-all-btn" onClick={() => setIsLightboxOpen(true)} style={{ cursor: "pointer" }}>
                    <ImageIcon size={14} /> View All Photos
                  </div>
                </div>
                <div className="vd-thumbnails">
                  {venue.images.map((img, idx) => (
                    <div 
                      className={`vd-thumbnail-wrap ${activeImageIdx === idx ? 'active-thumbnail' : ''}`} 
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      style={{ cursor: "pointer", border: activeImageIdx === idx ? "2px solid #ea580c" : "none", borderRadius: "6px" }}
                    >
                      <img src={img} alt="Thumbnail" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Section */}
              {venue.video && (
                <div className="vd-video-section">
                  <h3>Venue Walkthrough Video</h3>
                  <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-black mt-4">
                    <video src={venue.video} controls className="w-full h-full object-contain" />
                  </div>
                </div>
              )}

              {/* Tabs Container */}
              <div className="vd-tabs-container">
                <div className="vd-tabs">
                  <div className={`vd-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</div>
                  <div className={`vd-tab ${activeTab === 'amenities' ? 'active' : ''}`} onClick={() => setActiveTab('amenities')}>Amenities</div>
                  <div className={`vd-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Gallery</div>
                  <div className={`vd-tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>Reviews</div>
                  <div className={`vd-tab ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}>Location</div>
                  <div className={`vd-tab ${activeTab === 'policies' ? 'active' : ''}`} onClick={() => setActiveTab('policies')}>Policies</div>
                </div>

                {/* Details Content */}
                <div className="vd-details-row">
                  <div className="vd-about">
                    <h3>About Venue</h3>
                    <p>{venue.name} is designed to make your special occasions truly memorable. With a blend of elegance, comfort, and luxury, we provide the perfect setting for weddings, receptions, and other important events.</p>
                    <div className="vd-feature-list">
                      <div className="vd-feature-item"><Check size={14} className="check" /> Spacious and elegant interiors</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Dedicated event manager</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Air-conditioned hall</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Catering and decoration services</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Ample parking space</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Power backup</div>
                      <div className="vd-feature-item"><Check size={14} className="check" /> Modern lighting & sound system</div>
                    </div>
                  </div>
                  <div className="vd-amenities-section">
                    <h3>Amenities</h3>
                    <div className="vd-amenities-grid">
                      {venue.amenities.map((item, i) => (
                        <div className="vd-amenity" key={i}>
                          <Info size={16} /> {item.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- RIGHT COLUMN ---------------- */}
            <div className="vd-sidebar">
              
              {/* Header Info */}
              <div className="vd-header">
                <div className="vd-title-section">
                  <h1>{venue.name}</h1>
                </div>
                <div className="vd-actions">
                  <button 
                    className="vd-icon-btn" 
                    onClick={toggleWishlist}
                    style={{ color: wishlist.some(item => item.id === venue.id) ? "red" : "currentColor" }}
                  >
                    <Heart 
                      size={18} 
                      fill={wishlist.some(item => item.id === venue.id) ? "red" : "none"} 
                    />
                  </button>
                  <button className="vd-icon-btn"><Share2 size={18} /></button>
                </div>
              </div>
              
              <div className="vd-location">
                <Info size={14} color="#6366f1" /> {venue.location}
              </div>
              
              <div className="vd-badges">
                <div className="vd-rating">
                  <Star size={14} className="vd-rating-star" fill="currentColor" />
                  {venue.rating} <span>({venue.reviews} Reviews)</span>
                </div>
                <div className="vd-ac-badge">{venue.type}</div>
              </div>

              <p className="vd-description">{venue.description}</p>

              {/* Specs Grid */}
              <div className="vd-specs-grid">
                <div className="vd-spec-card">
                  <div className="vd-spec-icon"><Users size={20} /></div>
                  <div className="vd-spec-label">Capacity</div>
                  <div className="vd-spec-val">{venue.capacity}</div>
                  <div className="vd-spec-sub">Guests</div>
                </div>
                <div className="vd-spec-card">
                  <div className="vd-spec-icon"><LayoutGrid size={20} /></div>
                  <div className="vd-spec-label">Hall Type</div>
                  <div className="vd-spec-val">{venue.type}</div>
                </div>
                <div className="vd-spec-card">
                  <div className="vd-spec-icon"><Car size={20} /></div>
                  <div className="vd-spec-label">Parking</div>
                  <div className="vd-spec-val">{venue.parking}</div>
                  <div className="vd-spec-sub">Cars</div>
                </div>
                <div className="vd-spec-card">
                  <div className="vd-spec-icon"><Maximize size={20} /></div>
                  <div className="vd-spec-label">Area</div>
                  <div className="vd-spec-val">{venue.area}</div>
                  <div className="vd-spec-sub">Sq. Ft.</div>
                </div>
              </div>

              {/* Check Availability Widget */}
              <div className="vd-widget">
                <div className="vd-widget-title">
                  <Calendar size={20} color="#7c3aed" /> Check Availability
                </div>
                <div className="vd-input-group">
                  <label>Selected Date</label>
                  <div className="vd-input-wrap" style={{ background: "#f8fafc", color: "#64748b" }}>
                    <input type="text" value={savedDate || "No date selected"} readOnly style={{ background: "transparent", cursor: "not-allowed" }} />
                    <Calendar size={16} className="vd-input-icon" />
                  </div>
                  {savedDate && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#16a34a", fontSize: "12px", fontWeight: "600", marginTop: "6px" }}>
                      <Check size={14} /> Date is Available! (Auto-checked)
                    </div>
                  )}
                </div>
                
                <div className="vd-input-group" style={{ marginBottom: "16px" }}>
                  <label>Booking Duration Type</label>
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setBookingType("fullDay")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        border: bookingType === "fullDay" ? "2px solid #ea580c" : "1px solid #cbd5e1",
                        background: bookingType === "fullDay" ? "#fff7ed" : "white",
                        color: bookingType === "fullDay" ? "#c2410c" : "#475569"
                      }}
                    >
                      Full Day
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType("customSlot")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                        border: bookingType === "customSlot" ? "2px solid #ea580c" : "1px solid #cbd5e1",
                        background: bookingType === "customSlot" ? "#fff7ed" : "white",
                        color: bookingType === "customSlot" ? "#c2410c" : "#475569"
                      }}
                    >
                      Custom Slot
                    </button>
                  </div>
                </div>

                {bookingType === "fullDay" ? (
                  <div className="vd-input-group" style={{ marginBottom: "24px" }}>
                    <label>Timing Slot</label>
                    <div className="vd-input-wrap" style={{ background: "#f8fafc", color: "#64748b" }}>
                      <input type="text" value="Full Day (9:00 AM - 11:30 PM)" readOnly style={{ background: "transparent", cursor: "not-allowed" }} />
                      <Clock size={16} className="vd-input-icon" />
                    </div>
                  </div>
                ) : (
                  <div className="vd-input-group" style={{ marginBottom: "24px" }}>
                    <label>Custom Time Range</label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div className="vd-input-wrap" style={{ flex: 1 }}>
                        <input 
                          type="time" 
                          value={startTime} 
                          onChange={(e) => setStartTime(e.target.value)} 
                          style={{ padding: "8px", border: "none", fontSize: "13px" }}
                        />
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b" }}>to</span>
                      <div className="vd-input-wrap" style={{ flex: 1 }}>
                        <input 
                          type="time" 
                          value={endTime} 
                          onChange={(e) => setEndTime(e.target.value)} 
                          style={{ padding: "8px", border: "none", fontSize: "13px" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="vd-price-range">
                  <Info size={18} className="vd-price-icon" />
                  <div className="vd-price-text">
                    <h4>Price Range</h4>
                    <div className="vd-price-val">{venue.priceRange}</div>
                    <div className="vd-price-sub">(Depending on date & event type)</div>
                  </div>
                </div>
                <button className="vd-btn-primary" onClick={handleProceed}>Proceed with This Venue</button>
              </div>



              {/* Safe Booking */}
              <div className="vd-secure-badge">
                <ShieldCheck size={24} className="vd-secure-icon" />
                <div className="vd-secure-text">
                  <h5>100% Secure Booking</h5>
                  <p>Your information is safe with us.</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="vd-bottom-bar">
        <button className="vd-back-btn" onClick={() => navigate("/client/select-venue")}><ChevronLeft size={16} /> Back to Venues</button>
        <div className="vd-bar-stats">
          <div className="vd-bar-stat">
            <h5>Starting Price</h5>
            <p>{venue.startingPrice}</p>
            <span className="sub">(Taxes extra)</span>
          </div>
          <div className="vd-bar-stat">
            <h5>Capacity</h5>
            <p>{venue.capacity}</p>
            <span className="sub">Guests</span>
          </div>
          <div className="vd-bar-stat">
            <h5>Hall Type</h5>
            <p>{venue.type}</p>
          </div>
          <button className="vd-btn-primary-large" onClick={handleProceed}>
            <Check size={18} /> Select This Venue
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px"
          }}
        >
          {/* Close button */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px"
            }}
          >
            ✕ Close Gallery
          </button>

          {/* Grid of all photos */}
          <div style={{ width: "100%", maxWidth: "1000px", textAlign: "center" }}>
            <h3 style={{ color: "white", marginBottom: "24px", fontSize: "22px", fontWeight: "700" }}>{venue.name} Gallery</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", maxHeight: "70vh", overflowY: "auto", padding: "10px" }}>
              {venue.images.map((img, idx) => (
                <div key={idx} style={{ borderRadius: "12px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", cursor: "pointer" }} onClick={() => { setActiveImageIdx(idx); setIsLightboxOpen(false); }}>
                  <img src={img} alt={`Gallery ${idx}`} style={{ width: "100%", height: "200px", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Venue selected successfully!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientVenueDetails;
