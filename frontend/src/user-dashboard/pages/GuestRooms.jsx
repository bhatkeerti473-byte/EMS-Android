import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, BedDouble, Users, User, ArrowDown, Wifi, Wind, PhoneCall, ParkingCircle, Droplets, UtensilsCrossed, ConciergeBell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const GuestRooms = () => {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [roomsNotRequired, setRoomsNotRequired] = useState(false);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const roomTypes = [
    { id: '1-bedroom', name: '1 Bedroom Room', desc: 'Perfect for couples or small families', beds: '1 Bed', icon: BedDouble },
    { id: '2-bedroom', name: '2 Bedroom Room', desc: 'Ideal for families or group stay', beds: '2 Beds', icon: BedDouble },
    { id: 'multi-bed', name: 'Multi Bed Hall', desc: 'Best for large groups and budget stay', beds: 'Multiple Beds', icon: Users },
    { id: 'deluxe', name: 'Deluxe Suite', desc: 'Premium comfort with extra space', beds: '1 King Bed', icon: BedDouble }
  ];

  const getRooms = () => {
    const stored = localStorage.getItem("admin_rooms");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse admin_rooms", e);
      }
    }

    const defaultRooms = [
      {
        id: 'hotel-grand',
        type: '1-bedroom',
        name: 'Hotel Grand Comfort',
        distance: 'Near to Hall (0.5 km)',
        location: 'Near Royal Palace Hall',
        rating: 4.6,
        reviews: 125,
        price: '₹ 3,000',
        includes: 'Includes Breakfast',
        img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80',
        tagType: 'near',
        facilities: ['WiFi', 'Breakfast', 'AC'],
        rooms: 15,
        availability: 'Available'
      },
      {
        id: 'stay-inn',
        type: '2-bedroom',
        name: 'Stay Inn Suites',
        distance: 'Near to Hall (0.8 km)',
        location: 'Near Royal Palace Hall',
        rating: 4.4,
        reviews: 98,
        price: '₹ 5,000',
        includes: 'Includes Breakfast',
        img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
        tagType: 'near',
        facilities: ['WiFi', 'Breakfast', 'AC', 'Parking'],
        rooms: 10,
        availability: 'Available'
      },
      {
        id: 'hall-stay',
        type: 'multi-bed',
        name: 'Hall Stay (Multi Bed)',
        distance: 'In the Hall Premises',
        location: 'Inside Royal Palace Hall',
        rating: 4.2,
        reviews: 76,
        price: '₹ 1,500',
        includes: 'Includes Breakfast',
        img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
        tagType: 'inside',
        facilities: ['WiFi', 'Breakfast'],
        rooms: 5,
        availability: 'Available'
      },
      {
        id: 'deluxe-suite',
        type: 'deluxe',
        name: 'Deluxe Luxury Suite',
        distance: 'Near to Hall (1.2 km)',
        location: 'Near Royal Palace Hall',
        rating: 4.7,
        reviews: 133,
        price: '₹ 6,000',
        includes: 'Includes Breakfast',
        img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
        tagType: 'near',
        facilities: ['WiFi', 'Breakfast', 'AC', 'Parking'],
        rooms: 8,
        availability: 'Available'
      }
    ];

    localStorage.setItem("admin_rooms", JSON.stringify(defaultRooms));
    return defaultRooms;
  };

  const getSpecsForRoomType = (type) => {
    switch (type) {
      case '1-bedroom':
        return [
          { icon: BedDouble, text: '1 Bedroom' },
          { icon: BedDouble, text: '1 Bed' },
          { icon: User, text: '2 Guests' }
        ];
      case '2-bedroom':
        return [
          { icon: BedDouble, text: '2 Bedroom' },
          { icon: BedDouble, text: '2 Beds' },
          { icon: User, text: '4 Guests' }
        ];
      case 'multi-bed':
        return [
          { icon: Users, text: 'Multi Bed' },
          { icon: BedDouble, text: '8 Beds' },
          { icon: User, text: '10 Guests' }
        ];
      case 'deluxe':
        return [
          { icon: BedDouble, text: '1 Bedroom' },
          { icon: BedDouble, text: '1 King Bed' },
          { icon: User, text: '2 Guests' }
        ];
      default:
        return [
          { icon: BedDouble, text: '1 Bedroom' },
          { icon: User, text: '2 Guests' }
        ];
    }
  };

  const allRooms = getRooms();
  const suggestedRooms = allRooms.map(room => ({
    ...room,
    specs: getSpecsForRoomType(room.type)
  }));

  const filteredRooms = selectedTypes.length > 0
    ? suggestedRooms.filter(room => selectedTypes.includes(room.type) && room.availability === 'Available')
    : suggestedRooms.filter(room => room.availability === 'Available');

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
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "16px 0 4px" }}>Guest Rooms</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose comfortable stay options for your guests</p>
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

  

          <div className="guest-rooms-container" style={{ padding: "0 32px 32px" }}>
            
            {/* Opt-out Option */}
            <div style={{
              background: roomsNotRequired ? "#f8fafc" : "#fffbeb",
              border: roomsNotRequired ? "1px dashed #cbd5e1" : "1px solid #fef3c7",
              borderRadius: "16px",
              padding: "20px 24px",
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div>
                <h4 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "700", color: "#78350f" }}>Do you require guest rooms?</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#b45309" }}>If you don't need accommodation for guests, you can toggle this option to skip.</p>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: "700", color: "#78350f", cursor: "pointer", background: "white", padding: "10px 16px", borderRadius: "10px", border: "1px solid #f59e0b", boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                <input 
                  type="checkbox" 
                  checked={roomsNotRequired} 
                  onChange={(e) => {
                    setRoomsNotRequired(e.target.checked);
                    if (e.target.checked) {
                      setSelectedTypes([]);
                      setSelectedRoom('');
                    }
                  }} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                Guest rooms not required
              </label>
            </div>

            <div style={{ opacity: roomsNotRequired ? 0.5 : 1, pointerEvents: roomsNotRequired ? "none" : "auto" }}>
              {/* 1. Select Room Type */}
            <div className="services-layout-row">
              <div className="services-left-col">
                <div className="section-block mb-0">
                  <h3 className="section-title">1. Select Room Type <span style={{fontSize: "12px", color: "#64748b", fontWeight: "normal"}}>(Choose one or more)</span></h3>
                  
                  <div className="room-type-grid">
                    {roomTypes.map(rt => (
                      <div 
                        key={rt.id}
                        className={`room-type-card ${selectedTypes.includes(rt.id) ? 'selected' : ''}`}
                        onClick={() => toggleType(rt.id)}
                      >
                        <div className={`checkbox-custom-tr ${selectedTypes.includes(rt.id) ? 'checked' : ''}`}>
                          {selectedTypes.includes(rt.id) && <Check size={14} strokeWidth={3} />}
                        </div>
                        <div className={`rt-icon ${selectedTypes.includes(rt.id) ? 'text-blue-600' : 'text-gray-400'}`}>
                          <rt.icon size={32} />
                        </div>
                        <h4 className="rt-name">{rt.name}</h4>
                        <p className="rt-desc">{rt.desc}</p>
                        <div className="rt-beds">{rt.beds}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="services-right-col" style={{ marginTop: "36px" }}>
                <div className="selected-services-summary" style={{ height: "100%" }}>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="m-0">Selected Room Types ({selectedTypes.length})</h4>
                    <span className="text-red-500 text-xs font-bold cursor-pointer" onClick={() => setSelectedTypes([])}>Clear All</span>
                  </div>
                  <div className="selected-list">
                    {roomTypes.map(rt => selectedTypes.includes(rt.id) && (
                      <div key={rt.id} className="selected-vehicle-item">
                        <div className="text-blue-600 bg-blue-50 p-2 rounded-lg mr-2"><rt.icon size={20}/></div>
                        <div className="sv-text">
                          <span className="sv-name">{rt.name}</span>
                          <span className="sv-count text-gray-500">{rt.beds}</span>
                        </div>
                        <button className="sv-remove" onClick={() => toggleType(rt.id)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                  {/* Button removed as requested */}
                </div>
              </div>
            </div>

            {/* 2. Suggested Rooms */}
            <div className="section-block mt-10">
              <h3 className="section-title mb-1">2. Suggested Rooms</h3>
              <p className="section-subtitle mb-6">We found the best options near your selected hall</p>
              
              <div className="suggested-rooms-grid">
                {filteredRooms.map(room => (
                  <div key={room.id} className="suggested-room-card">
                    <div className="sr-img-wrapper">
                      <img src={room.img} alt={room.name} />
                      <div className={`distance-badge ${room.tagType === 'inside' ? 'bg-indigo-600' : 'bg-blue-800'}`}>
                        {room.distance}
                      </div>
                    </div>
                    
                    <div className="sr-content">
                      <h4 className="sr-name">{room.name}</h4>
                      <div className="sr-location">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {room.location}
                      </div>
                      
                      <div className="studio-rating-row mt-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        <span className="rating-num text-green-600">{room.rating}</span>
                        <span className="rating-count">({room.reviews} Reviews)</span>
                      </div>
                      
                      <div className="sr-specs-row">
                        {room.specs.map((spec, idx) => (
                          <div key={idx} className="sr-spec-item">
                            <spec.icon size={12} className="text-gray-400"/> {spec.text}
                          </div>
                        ))}
                      </div>
                      
                      <div className="sr-price-row mt-3">
                        <div className="sr-price-val">{room.price} <span className="sr-price-label">/ Night</span></div>
                        <div className="sr-price-includes">{room.includes}</div>
                      </div>
                      
                      <button 
                        className="btn-solid-orange w-full mt-4"
                        onClick={() => navigate(`/client/room-details/${room.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* All Rooms Include */}
            <div className="section-block mt-8">
              <h3 className="section-title text-sm mb-4">All Rooms Include</h3>
              <div className="amenities-strip">
                <div className="amenity-item"><Wifi size={16} /> Free Wi-Fi</div>
                <div className="amenity-item"><Wind size={16} /> Air Conditioning</div>
                <div className="amenity-item"><PhoneCall size={16} /> 24x7 Support</div>
                <div className="amenity-item"><ParkingCircle size={16} /> Parking</div>
                <div className="amenity-item"><Droplets size={16} /> Hot Water</div>
                <div className="amenity-item"><UtensilsCrossed size={16} /> Room Service</div>
                <div className="amenity-item"><ConciergeBell size={16} /> Daily Housekeeping</div>
              </div>
            </div>

            <EventSummaryFooter icon={BedDouble} />

            <div className="bottom-navigation" style={{ marginTop: "20px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={() => {
                if (roomsNotRequired) {
                  localStorage.setItem("booking_selected_room", "None");
                  navigate('/client/seating-arrangement');
                } else {
                  navigate('/client/stay-date-time');
                }
              }}>
                Continue <ArrowRight size={20} />
              </button>
            </div>
            
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestRooms;
