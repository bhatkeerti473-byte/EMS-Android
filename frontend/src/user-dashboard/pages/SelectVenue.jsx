import React, { useState, useEffect, useMemo } from "react";
import { Check, ArrowLeft, ArrowRight, Search, Heart, Star, Users, Home, MapPin, Snowflake, Wind } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";
import { getVenues } from "../services/userApi";
import axios from "axios";

const SelectVenue = () => {
  const navigate = useNavigate();
  const [selectedVenueType, setSelectedVenueType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("All Locations");
  const [filterCapacity, setFilterCapacity] = useState("All Capacity");
  const [filterAC, setFilterAC] = useState("All");
  const [selectedVenueId, setSelectedVenueId] = useState(() => localStorage.getItem("booking_venue_id"));
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const handleContinue = async () => {
    setAvailabilityError("");
    
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_title") || localStorage.getItem("booking_event_type_name");
    
    if (!eventDate || !eventType) {
      setAvailabilityError("✕ Please select an Event Date and Event Type first to proceed with booking.");
      return;
    }

    if (!selectedVenueId) {
      navigate("/client/decoration");
      return;
    }
    
    setIsChecking(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/availability?venueId=${selectedVenueId}&date=${eventDate}`);
      if (!response.data.available) {
        setAvailabilityError("✕ This venue is already booked for your selected date. Please choose another venue or date.");
        setIsChecking(false);
        return;
      }
    } catch (error) {
      setAvailabilityError("Unable to verify venue availability. Please try again.");
      setIsChecking(false);
      return;
    }
    setIsChecking(false);
    
    navigate("/client/decoration");
  };

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const handleSelectVenue = (venueId) => {
    if (selectedVenueId === venueId) {
      setSelectedVenueId(null);
    } else {
      setSelectedVenueId(venueId);
      const chosen = venues.find(v => v.id === venueId);
      if (chosen) {
        localStorage.setItem("booking_venue_id", chosen.id);
        localStorage.setItem("booking_venue_name", chosen.name);
        localStorage.setItem("booking_venue_location", chosen.location);
        localStorage.setItem("booking_venue_image", chosen.image);
        localStorage.setItem("booking_venue_price", chosen.acCost);

        try {
          const existing = JSON.parse(localStorage.getItem("client_bookings") || "[]");
          if (existing.length > 0) {
            existing[0].venueName = chosen.name;
            existing[0].location = chosen.location;
            existing[0].venueImg = chosen.image;
            localStorage.setItem("client_bookings", JSON.stringify(existing));
          }
        } catch (e) {}
      }
    }
  };

  const toggleWishlist = (venueObj) => {
    setWishlist(prev => {
      const isSaved = prev.some(item => item.id === venueObj.id);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== venueObj.id);
      } else {
        const wishlistItem = {
          id: venueObj.id,
          title: venueObj.name,
          category: "Venue",
          location: venueObj.location,
          image: venueObj.image,
          date: "Oct 25",
          time: "Flexible",
          status: "Available",
          price: parseInt(venueObj.acCost.replace(/,/g, '')) || 0
        };
        newWishlist = [...prev, wishlistItem];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenues = async () => {
        let data = [];
        try {
          data = await getVenues();
        } catch (error) {
          console.error("Failed to fetch venues, using fallbacks:", error);
        }
        
        if (!data || data.length === 0) {
          // Fallback dummy venues if DB is empty or API fails
          data = [
            {
              id: "v1", name: "Royal Palace Banquet", type: "AC Hall", location: "Mumbai, Maharashtra",
              capacity: 500, price: 150000, facilities: ["AC", "Catering", "Parking"],
              images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"]
            },
            {
              id: "v2", name: "Sunset Gardens", type: "Outdoor Lawn", location: "Pune, Maharashtra",
              capacity: 1000, price: 85000, facilities: ["Outdoor", "Stage", "Valet"],
              images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"]
            },
            {
              id: "v3", name: "Grand Imperial", type: "Banquet Hall", location: "Delhi, NCR",
              capacity: 300, price: 75000, facilities: ["AC", "Decor", "WiFi"],
              images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"]
            },
            {
              id: "v4", name: "Breeze Resort", type: "Non-AC Hall", location: "Goa",
              capacity: 200, price: 40000, facilities: ["Pool", "Rooms", "Bar"],
              images: ["https://images.unsplash.com/photo-1582719478250-c89400652026?auto=format&fit=crop&w=800&q=80"]
            }
          ];
        }

        const formattedVenues = data.map(v => ({
          id: v._id || v.id,
          name: v.name || "Unnamed Venue",
          rating: 4.5, // Mock rating as backend doesn't have it
          reviews: Math.floor(Math.random() * 100) + 50,
          location: v.location || "Unknown Location",
          capacity: v.capacity ? `${v.capacity} Guests` : "Flexible Capacity",
          ac: (v.type || "").toLowerCase().includes("ac") || 
              (v.type || "").toLowerCase().includes("hall") || 
              (v.type || "").toLowerCase().includes("banquet") || 
              (v.type || "").toLowerCase().includes("indoor") || 
              (v.facilities || []).some(f => f.toLowerCase().includes("ac") || f.toLowerCase().includes("air")) || 
              (!(v.type || "").toLowerCase().includes("outdoor") && !(v.type || "").toLowerCase().includes("lawn") && !(v.type || "").toLowerCase().includes("garden")),
          acCost: v.price ? v.price.toLocaleString() : "Contact for price",
          nonAcCost: v.price ? Math.floor(v.price * 0.7).toLocaleString() : "Contact for price",
          image: v.images && v.images.length > 0 
            ? v.images[0] 
            : "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
          outdoor: (v.type || "").toLowerCase().includes("outdoor") || 
                   (v.type || "").toLowerCase().includes("lawn") || 
                   (v.type || "").toLowerCase().includes("garden") || 
                   (v.facilities || []).some(f => f.toLowerCase().includes("outdoor") || f.toLowerCase().includes("lawn")),
        }));
        setVenues(formattedVenues);
        setLoading(false);
    };

    fetchVenues();
  }, []);
  const filteredVenues = useMemo(() => {
    let result = venues;
    
    // Type selected from top row
    if (selectedVenueType === 'ac') {
      const acVenues = result.filter(v => v.ac);
      result = acVenues.length > 0 ? acVenues : result; // Fallback to all if none found
    }
    if (selectedVenueType === 'non-ac') {
      // For Non-AC, we typically want indoor venues but we can show all if none strictly match non-ac
      const nonAcVenues = result.filter(v => !v.ac && !v.outdoor);
      result = nonAcVenues.length > 0 ? nonAcVenues : result; // Fallback to all if none found
    }
    if (selectedVenueType === 'outdoor') {
      const outdoorVenues = result.filter(v => v.outdoor);
      result = outdoorVenues.length > 0 ? outdoorVenues : result; // Fallback to all if none found
    }

    // Search term
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(v => v.name.toLowerCase().includes(lower) || v.location.toLowerCase().includes(lower));
    }

    // Location
    if (filterLocation !== "All Locations") {
      result = result.filter(v => v.location.includes(filterLocation));
    }

    // Capacity
    if (filterCapacity !== "All Capacity") {
      result = result.filter(v => v.capacity === filterCapacity);
    }

    // AC Type
    if (filterAC !== "All") {
      result = result.filter(v => filterAC === "AC" ? v.ac : !v.ac);
    }

    return result;
  }, [venues, selectedVenueType, searchTerm, filterLocation, filterCapacity, filterAC]);

  const uniqueLocations = ["All Locations", ...new Set(venues.map(v => v.location.split(',')[0].trim()))];
  const uniqueCapacities = ["All Capacity", ...new Set(venues.map(v => v.capacity))];

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterLocation("All Locations");
    setFilterCapacity("All Capacity");
    setFilterAC("All");
    setSelectedVenueType(null);
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "4px" }}>Select Venue</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Choose the perfect venue for your event</p>
          </div>

          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "42.85714285714286%", background: '#ea580c' }}></div>
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
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>4</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Select Venue</div>
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


          <div className="venue-container px-2 sm:px-8 pb-8">
            
            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="search-wrapper">
                <input 
                  type="text" 
                  placeholder="Search venues by name or location..." 
                  className="search-input" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="search-icon" size={18} />
              </div>
              <div className="filter-dropdowns">
                <div className="filter-group">
                  <label>Location</label>
                  <select value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>Capacity</label>
                  <select value={filterCapacity} onChange={e => setFilterCapacity(e.target.value)}>
                    {uniqueCapacities.map(cap => <option key={cap} value={cap}>{cap}</option>)}
                  </select>
                </div>
                <div className="filter-group">
                  <label>AC Type</label>
                  <select value={filterAC} onChange={e => setFilterAC(e.target.value)}>
                    <option value="All">All (AC/Non-AC)</option>
                    <option value="AC">AC Hall</option>
                    <option value="Non-AC">Non-AC Hall</option>
                  </select>
                </div>
                <button className="btn-reset" onClick={handleResetFilters}>Reset</button>
              </div>
            </div>

            {/* Extra Options Row */}
            <div className="section-title" style={{ marginTop: '10px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>Choose How You Want to Host Your Event</h3>
            </div>
            
            <div className="extra-options-row">
              <div className="option-card">
                <div className="option-icon-bg"><Home size={32} className="option-icon-orange" /></div>
                <div className="option-content">
                  <h5>Function at Home</h5>
                  <p>Having the function at your home? No venue booking required.</p>
                  <button className="btn-solid" onClick={() => navigate("/client/home-function")}>Select Home Function</button>
                </div>
              </div>

              <div 
                className="option-card small-card" 
                style={selectedVenueType === 'ac' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('ac')}
              >
                <Snowflake size={32} className="text-blue" />
                <div className="option-content">
                  <h5>AC Hall</h5>
                  <p>Comfortable with Air Conditioning</p>
                  <div className="starting-from blue-bg">
                    <span>Starting from</span>
                    <strong>₹45,000</strong>
                  </div>
                </div>
              </div>

              <div 
                className="option-card small-card" 
                style={selectedVenueType === 'non-ac' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('non-ac')}
              >
                <Wind size={32} className="text-green" />
                <div className="option-content">
                  <h5>Non-AC Hall</h5>
                  <p>Well-ventilated and budget friendly</p>
                  <div className="starting-from green-bg">
                    <span>Starting from</span>
                    <strong>₹25,000</strong>
                  </div>
                </div>
              </div>

              <div 
                className="option-card small-card" 
                style={selectedVenueType === 'outdoor' ? { border: '2px solid #ea580c', transform: 'translateY(-2px)' } : { cursor: 'pointer' }}
                onClick={() => setSelectedVenueType('outdoor')}
              >
                <div className="icon-wrapper purple-bg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7c0-2.8 2.2-5 5-5s5 2.2 5 5-2.2 5-5 5-5-2.2-5-5z"/><path d="M12 17c-2.8 0-5-2.2-5-5 0-2.8 2.2-5 5-5"/></svg>
                </div>
                <div className="option-content">
                  <h5>Outdoor Venue</h5>
                  <p>Garden, lawn, resort and more</p>
                  <div className="starting-from purple-bg-light">
                    <span>Starting from</span>
                    <strong>₹30,000</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="results-header">
              <span className="results-count">{filteredVenues.length} Venues Found</span>
              <div className="sort-wrapper">
                <label>Sort by:</label>
                <select><option>Popularity</option></select>
              </div>
            </div>

            {/* Venue Grid */}
            <div className="venue-grid">
              {filteredVenues.map(venue => (
                <div className="venue-card" key={venue.id}>
                  <div className="venue-image-wrapper">
                    <img src={venue.image} alt={venue.name} />
                    <button 
                      className="btn-wishlist"
                      onClick={() => toggleWishlist(venue)}
                    >
                      <Heart 
                        size={18} 
                        color={wishlist.some(item => item.id === venue.id) ? "red" : "currentColor"} 
                        fill={wishlist.some(item => item.id === venue.id) ? "red" : "none"} 
                      />
                    </button>
                  </div>
                  <div className="venue-info">
                    <div className="venue-title-row">
                      <h4>{venue.name}</h4>
                      <div className="rating">
                        <Star size={14} className="star-icon" fill="currentColor" /> {venue.rating} <span>({venue.reviews})</span>
                      </div>
                    </div>
                    <div className="venue-location">
                      {venue.location}
                    </div>
                    
                    <div className="venue-features">
                      <div className="feature"><Users size={14} /> {venue.capacity}</div>
                      <div className="feature">
                        {venue.ac ? <Snowflake size={14} className="ac-icon" /> : <Wind size={14} className="non-ac-icon" />} 
                        {venue.ac ? "AC Hall" : "Non-AC Hall"}
                      </div>
                    </div>

                    <div className="venue-price-split">
                      {venue.ac && !venue.outdoor ? (
                        <div className="price-item" style={{ width: '100%' }}>
                          <div className="price-label">AC Hall Cost</div>
                          <div className="price">₹{venue.acCost}</div>
                        </div>
                      ) : null}
                      
                      {!venue.ac && !venue.outdoor ? (
                        <div className="price-item" style={{ width: '100%' }}>
                          <div className="price-label">Non-AC Hall Cost</div>
                          <div className="price">₹{venue.nonAcCost}</div>
                        </div>
                      ) : null}

                      {venue.outdoor ? (
                        <div className="price-item" style={{ width: '100%' }}>
                          <div className="price-label">Venue Cost</div>
                          <div className="price">₹{venue.acCost}</div>
                        </div>
                      ) : null}
                    </div>

                    <div className="venue-actions">
                      <button className="btn-outline-light-orange" onClick={() => navigate(`/client/venue-details/${venue.id}`)}>View Details</button>
                      <button 
                        className="btn-solid" 
                        style={{ backgroundColor: selectedVenueId === venue.id ? '#16a34a' : '' }}
                        onClick={() => handleSelectVenue(venue.id)}
                      >
                        {selectedVenueId === venue.id ? "Selected" : "Select Venue"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>



            {availabilityError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium w-full text-center" style={{ marginTop: "20px" }}>
                {availabilityError}
              </div>
            )}
            
            {(() => {
              const selectedVenueObj = venues.find(v => v.id === selectedVenueId);
              const currentVenuePrice = selectedVenueObj ? (selectedVenueObj.acCost || selectedVenueObj.price || 0) : 0;
              return (
                <EventSummaryFooter
                  icon={MapPin}
                  overrides={{ venuePrice: currentVenuePrice }}
                  customDetails={
                    selectedVenueObj ? (
                      <span>Selected Venue: <strong style={{ fontWeight: "600", color: "#475569" }}>{selectedVenueObj.name} (₹{(selectedVenueObj.acCost || selectedVenueObj.price || 0).toLocaleString()})</strong></span>
                    ) : null
                  }
                />
              );
            })()}

            <div className="bottom-navigation" style={{ marginTop: availabilityError ? "10px" : "20px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button 
                className="btn-nav-continue" 
                onClick={handleContinue}
                disabled={isChecking}
                style={{ opacity: isChecking ? 0.7 : 1, cursor: isChecking ? 'not-allowed' : 'pointer' }}
              >
                {isChecking ? "Checking Availability..." : <>Continue to Decoration & Catering <ArrowRight size={20} /></>}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectVenue;
