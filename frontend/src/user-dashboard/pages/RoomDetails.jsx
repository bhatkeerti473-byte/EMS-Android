import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Star, MapPin, Award, 
  ChevronLeft, ChevronRight, Check, Heart, Share2, 
  BedDouble, Users, Wifi, Wind, PhoneCall, ParkingCircle, 
  Droplets, UtensilsCrossed, ConciergeBell, CheckCircle2 
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import "../styles/DJDetails.css"; // Reuse details layouts

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [numRooms, setNumRooms] = useState(1);
  const [numNights, setNumNights] = useState(1);
  const [checkinDate, setCheckinDate] = useState("");
  const [checkinTime, setCheckinTime] = useState("");

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Mock database details for suggested rooms matching IDs
  const roomsData = {
    "hotel-grand": {
      name: "Hotel Grand Comfort",
      distance: "Near to Hall (0.5 km)",
      location: "Near Royal Palace Hall, Udupi",
      rating: 4.6,
      reviews: 125,
      price: "₹ 3,000",
      includes: "Includes Breakfast",
      desc: "Hotel Grand Comfort provides spacious air-conditioned rooms designed for family stays during events. Equipped with standard modern fittings, comfortable luxury beds, and quick room services.",
      images: [
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
      ]
    },
    "stay-inn": {
      name: "Stay Inn Suites",
      distance: "Near to Hall (0.8 km)",
      location: "Near Royal Palace Hall, Udupi",
      rating: 4.4,
      reviews: 98,
      price: "₹ 5,000",
      includes: "Includes Breakfast",
      desc: "Stay Inn Suites offers premium suite rooms featuring separate sitting halls, high-end wood decors, twin bed options, and complimentary luxury breakfasts for wedding guests.",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
      ]
    },
    "hall-stay": {
      name: "Hall Stay (Multi Bed)",
      distance: "In the Hall Premises",
      location: "Inside Royal Palace Hall Premises",
      rating: 4.2,
      reviews: 76,
      price: "₹ 1,500",
      includes: "Basic Amenities",
      desc: "An budget-friendly dorm style multi-bed layout set directly inside the venue premises. Best suited for large guest assemblies looking for convenient event stayovers.",
      images: [
        "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
      ]
    },
    "deluxe-suite": {
      name: "Deluxe Luxury Suite",
      distance: "Near to Hall (1.2 km)",
      location: "Near Royal Palace Hall, Udupi",
      rating: 4.7,
      reviews: 133,
      price: "₹ 6,000",
      includes: "Includes Breakfast & Dinner",
      desc: "Deluxe Luxury Suite is a high-end honeymoon and premium VIP suite. Features smart room integrations, deep bathtub designs, and panoramic balconies.",
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
      ]
    }
  };

  const room = roomsData[id] || roomsData["hotel-grand"];
  const pricePerNight = Number(room.price.replace(/[^\d]/g, "")) || 3000;
  const totalStayAmount = pricePerNight * numRooms * numNights;

  const toggleWishlist = () => {
    setWishlist(prev => {
      const roomWishlistId = `room-${id}`;
      const isSaved = prev.some(item => item.id === roomWishlistId);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== roomWishlistId);
      } else {
        const wishlistItem = {
          id: roomWishlistId,
          title: room.name,
          category: "Guest Rooms",
          location: room.location,
          price: Number(room.price.replace(/[^\d]/g, "")) || 3000,
          image: room.images[0],
          status: "Upcoming"
        };
        newWishlist = [...prev, wishlistItem];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Room detail link copied to clipboard!");
  };

  const handleSelectRoom = () => {
    if (!checkinDate || !checkinTime) {
      alert("Please select a valid Check-in Date and Time.");
      return;
    }
    localStorage.setItem("booking_selected_room", room.name);
    localStorage.setItem("booking_room_qty", numRooms);
    localStorage.setItem("booking_room_nights", numNights);
    localStorage.setItem("booking_room_price", pricePerNight);
    localStorage.setItem("booking_room_total", totalStayAmount);
    localStorage.setItem("booking_room_checkin_date", checkinDate);
    localStorage.setItem("booking_room_checkin_time", checkinTime);
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/stay-date-time");
    }, 1500);
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          <div className="dj-details-page">
            <button className="dj-back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back to Rooms List
            </button>
            
            <div className="dj-top-grid">
              
              <div className="dj-main-img-card">
                <img src={room.images[activeImageIdx]} alt={room.name} className="dj-main-img" />
                <div className="dj-thumbs-row">
                  <button 
                    className="sd-page-btn" 
                    style={{border: 'none', background: 'none', cursor: "pointer"}}
                    onClick={() => setActiveImageIdx(prev => prev === 0 ? room.images.length - 1 : prev - 1)}
                  >
                    <ChevronLeft size={16}/>
                  </button>
                  {room.images.map((img, i) => (
                    <img 
                      src={img} 
                      alt="thumb" 
                      key={i} 
                      className={`dj-thumb ${activeImageIdx === i ? 'active' : ''}`} 
                      onClick={() => setActiveImageIdx(i)}
                      style={{ cursor: "pointer" }}
                    />
                  ))}
                  <button 
                    className="sd-page-btn" 
                    style={{border: 'none', background: 'none', cursor: "pointer"}}
                    onClick={() => setActiveImageIdx(prev => prev === room.images.length - 1 ? 0 : prev + 1)}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="dj-info-card">
                <div className="dj-info-header">
                  <div>
                    <h2>
                      {room.name}
                      <span className="dj-verified-badge" style={{ background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", marginLeft: "8px" }}><CheckCircle2 size={10} style={{ display: "inline", marginRight: "4px" }} /> Prime Stay</span>
                    </h2>
                    <div className="dj-location" style={{ fontSize: "13px", color: "#64748b", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}><MapPin size={14} /> {room.location} ({room.distance})</div>
                    <div className="dj-rating-row" style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                      <Star size={14} className="stars" fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: "bold", color: "#0f172a" }}>{room.rating}</span>
                      <span className="reviews" style={{ color: "#64748b" }}>({room.reviews} Reviews)</span>
                    </div>
                  </div>
                  <div className="dj-actions-row" style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                    <button 
                      className="dj-btn-secondary" 
                      onClick={toggleWishlist}
                      style={{ color: wishlist.some(item => item.id === `room-${id}`) ? "red" : "inherit" }}
                    >
                      <Heart 
                        size={16} 
                        fill={wishlist.some(item => item.id === `room-${id}`) ? "red" : "none"} 
                      /> 
                      {wishlist.some(item => item.id === `room-${id}`) ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                    <button className="dj-btn-secondary" onClick={handleShare}><Share2 size={16} /> Share</button>
                  </div>
                </div>

                <div className="dj-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", background: "#f1f5f9", padding: "16px", borderRadius: "12px", marginTop: "24px" }}>
                  <div className="dj-stat-item" style={{ textAlign: "center" }}>
                    <strong style={{ fontSize: "16px" }}>Free</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Wi-Fi included</span>
                  </div>
                  <div className="dj-stat-item" style={{ textAlign: "center" }}>
                    <strong style={{ fontSize: "16px" }}>Yes</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Air Conditioning</span>
                  </div>
                  <div className="dj-stat-item" style={{ textAlign: "center" }}>
                    <strong style={{ fontSize: "16px" }}>24/7</strong>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>Front Desk</span>
                  </div>
                </div>

                <p className="dj-desc" style={{ marginTop: "20px", fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>{room.desc}</p>

                {/* Stay Selection Configuration */}
                <div style={{ marginTop: "24px", padding: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Select Quantity & Duration</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    
                    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Number of Rooms</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button 
                            type="button" 
                            onClick={() => setNumRooms(prev => Math.max(1, prev - 1))}
                            style={{ width: "32px", height: "32px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "15px", fontWeight: "700", minWidth: "24px", textAlign: "center" }}>{numRooms}</span>
                          <button 
                            type="button" 
                            onClick={() => setNumRooms(prev => prev + 1)}
                            style={{ width: "32px", height: "32px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Number of Nights</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button 
                            type="button" 
                            onClick={() => setNumNights(prev => Math.max(1, prev - 1))}
                            style={{ width: "32px", height: "32px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "15px", fontWeight: "700", minWidth: "24px", textAlign: "center" }}>{numNights}</span>
                          <button 
                            type="button" 
                            onClick={() => setNumNights(prev => prev + 1)}
                            style={{ width: "32px", height: "32px", border: "1px solid #cbd5e1", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "24px" }}>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Check-in Date</label>
                        <input 
                          type="date" 
                          value={checkinDate}
                          onChange={(e) => setCheckinDate(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", outline: "none", color: "#0f172a" }}
                          required
                        />
                      </div>
                      
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ fontSize: "12px", fontWeight: "600", color: "#475569" }}>Check-in Time</label>
                        <input 
                          type="time" 
                          value={checkinTime}
                          onChange={(e) => setCheckinTime(e.target.value)}
                          style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "6px", fontSize: "14px", outline: "none", color: "#0f172a" }}
                          required
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <div className="dj-info-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px", marginTop: "32px" }}>
              <div className="dj-box">
                <h4>Room Amenities & Benefits</h4>
                <div className="dj-inclusions-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
                  <div className="dj-inclusion-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="dj-inclusion-icon"><Wifi size={18} /></div>
                    <div className="dj-inclusion-text"><h5>High-Speed Wi-Fi</h5><p>Complimentary access throughout your stay</p></div>
                  </div>
                  <div className="dj-inclusion-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="dj-inclusion-icon"><Wind size={18} /></div>
                    <div className="dj-inclusion-text"><h5>Air Conditioning</h5><p>Individually controlled cool ventilation systems</p></div>
                  </div>
                  <div className="dj-inclusion-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="dj-inclusion-icon"><UtensilsCrossed size={18} /></div>
                    <div className="dj-inclusion-text"><h5>Room Service</h5><p>Fresh catering options delivered directly to suites</p></div>
                  </div>
                  <div className="dj-inclusion-item" style={{ display: "flex", gap: "12px" }}>
                    <div className="dj-inclusion-icon"><ConciergeBell size={18} /></div>
                    <div className="dj-inclusion-text"><h5>Housekeeping</h5><p>Daily cleaning and fresh sheets supply</p></div>
                  </div>
                </div>
              </div>

              <div className="dj-box" style={{ background: '#f8fafc' }}>
                <h4>Accommodation Guidelines</h4>
                <ul style={{ paddingLeft: "20px", fontSize: "13px", color: "#475569", lineHeight: "2" }}>
                  <li>Standard Check-in: 12:00 PM</li>
                  <li>Standard Check-out: 11:00 AM</li>
                  <li>Extra mattresses upon guest requests.</li>
                  <li>Identification sheets needed at check-in.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="dj-sticky-footer" style={{ position: "sticky", bottom: 0, background: "white", padding: "16px 32px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 100 }}>
          <div className="dj-footer-left">
            <h4 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>{room.name}</h4>
            <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#64748b" }}>{room.includes} • {numRooms} Room{numRooms > 1 ? 's' : ''} for {numNights} Night{numNights > 1 ? 's' : ''}</p>
          </div>
          
          <div className="dj-footer-right" style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div className="dj-total-block" style={{ textAlign: "right" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Calculated Total</p>
              <h3 style={{ margin: "2px 0 0", fontSize: "20px", fontWeight: "bold", color: "#ea580c" }}>₹ {totalStayAmount.toLocaleString('en-IN')}</h3>
            </div>
            <button className="dj-btn-book" onClick={handleSelectRoom} style={{ background: "#ea580c", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              Select This Room <ArrowRight size={18} />
            </button>
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
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Room selected successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
