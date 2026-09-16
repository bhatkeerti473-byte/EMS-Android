import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Heart, Share2, Star, Calendar, 
  Award, Car, Users, Briefcase, Snowflake, CheckCircle2,
  Phone, Mail, MessageSquare
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import "../styles/VehicleDetails.css";
import "../styles/StudioDetails.css"; // Reuse rating bars

const VehicleDetails = () => {
  const navigate = useNavigate();
  const { type: urlType, id: urlId } = useParams();
  const [wishlist, setWishlist] = React.useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const allVehicles = React.useMemo(() => {
    const stored = localStorage.getItem("admin_vehicles");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: 'camry', name: 'Toyota Camry', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 12,000 - ₹ 15,000', popular: true, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'innova', name: 'Toyota Innova Crysta', seats: 6, luggage: 6, type: 'Premium MPV', price: '₹ 14,000 - ₹ 18,000', popular: false, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'benz', name: 'Mercedes Benz E-Class', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 18,000 - ₹ 25,000', popular: false, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'bmw', name: 'BMW 5 Series', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 20,000 - ₹ 28,000', popular: false, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
      { id: 'tempo-17', name: 'Tempo Traveller (17 Seater)', seats: 17, luggage: 10, type: 'Best for small groups', price: '₹ 7,000 - ₹ 9,000', img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=400&q=80', category: 'Tempo Traveller', driver: true, availability: 'Available' },
      { id: 'mini-bus', name: 'Mini Bus (25 Seater)', seats: 25, luggage: 15, type: 'Ideal for medium groups', price: '₹ 9,000 - ₹ 12,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' },
      { id: 'deluxe', name: 'Shree Padma Deluxe Bus (35 Seater)', seats: 35, luggage: 20, type: 'Comfortable AC Bus', price: '₹ 13,000 - ₹ 16,000', img: '/images/media__1784298281855.png', category: 'Bus', driver: true, availability: 'Available' },
      { id: 'luxury-bus', name: 'Luxury Bus (45 Seater)', seats: 45, luggage: 30, type: 'Premium AC Bus', price: '₹ 17,000 - ₹ 22,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' }
    ];
  }, []);

  const matchedVehicle = React.useMemo(() => {
    return allVehicles.find(v => v.id === urlId) || allVehicles[0];
  }, [allVehicles, urlId]);

  const carData = React.useMemo(() => {
    const brand = matchedVehicle.name.split(' ')[0] || "Toyota";
    const model = matchedVehicle.name.split(' ').slice(1).join(' ') || "Camry";
    
    // Extract numerical price or first price from range
    let displayPrice = "12,000";
    if (matchedVehicle.price) {
      const parts = matchedVehicle.price.replace(/[^\d\s-]/g, '').trim().split('-');
      if (parts[0]) {
        displayPrice = parseInt(parts[0].replace(/\s/g, '')).toLocaleString('en-IN');
      }
    }

    return {
      id: matchedVehicle.id,
      brand,
      model,
      type: matchedVehicle.type || "Luxury Sedan",
      rating: 4.8,
      bookings: "120+",
      years: "5",
      price: displayPrice,
      desc: `Travel in comfort and style with our premium ${matchedVehicle.type || 'vehicle'}. Ideal for VIPs, family travel and special guests. Well maintained, chauffeur driven with on-time pickup and drop.`,
      seats: matchedVehicle.seats || 4,
      luggage: matchedVehicle.luggage || 3,
      ac: true,
      chauffeur: matchedVehicle.driver !== false,
      year: "2022",
      fuel: "Petrol",
      transmission: "Automatic",
      insurance: "Comprehensive",
      regNo: "KA 01 AB 1234",
      mainImg: matchedVehicle.img,
      thumbs: [matchedVehicle.img],
      reviewsList: [
        { id: 1, name: "Rohan Mehta", date: "2 days ago", text: "Excellent service! The vehicle was clean and the driver was very professional and polite.", rating: 5, img: "https://i.pravatar.cc/150?u=1" },
        { id: 2, name: "Priya Sharma", date: "1 week ago", text: "Very comfortable ride. Reached on time. Highly recommended.", rating: 5, img: "https://i.pravatar.cc/150?u=2" },
        { id: 3, name: "Ankit & Neha", date: "3 weeks ago", text: "Great experience. Will definitely book again for our next event.", rating: 4, img: "https://i.pravatar.cc/150?u=3" }
      ]
    };
  }, [matchedVehicle]);

  const toggleWishlist = () => {
    setWishlist(prev => {
      const isSaved = prev.some(item => item.id === carData.id);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== carData.id);
      } else {
        const wishlistItem = {
          id: carData.id,
          title: `${carData.brand} ${carData.model}`,
          category: "Transport",
          location: "Regional Transport Agency",
          price: parseInt(carData.price.replace(/,/g, '')) || 8000,
          image: carData.mainImg,
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
    alert("Vehicle link copied to clipboard!");
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          <div className="vd-page">
            <button className="vd-back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back to Travel & Transportation
            </button>
            
            <div className="vd-title-row">
              <div>
                <h1>{matchedVehicle.category === 'Car' ? 'Car Details' : matchedVehicle.category === 'Bus' ? 'Bus Details' : 'Mini Bus Details'}</h1>
                <p>{carData.type} • {carData.brand} {carData.model}</p>
              </div>
              <div className="vd-actions">
                <button 
                  className="vd-btn-sec" 
                  onClick={toggleWishlist}
                  style={{ color: wishlist.some(item => item.id === carData.id) ? "red" : "inherit" }}
                >
                  <Heart 
                    size={16} 
                    fill={wishlist.some(item => item.id === carData.id) ? "red" : "none"} 
                  /> 
                  {wishlist.some(item => item.id === carData.id) ? "Wishlisted" : "Add to Wishlist"}
                </button>
                 <button className="vd-btn-sec" onClick={handleShare}><Share2 size={16} /> Share</button>
              </div>
            </div>

            {/* Top Grid */}
            <div className="vd-top-grid">
              
              <div className="vd-gallery-card">
                <img src={carData.mainImg} alt="Vehicle" className="vd-main-img" />
              </div>

              <div className="vd-info-card">
                <div className="vd-stats-row">
                  <div className="vd-stat-item">
                    <strong style={{color: '#ea580c'}}><Star size={18} fill="currentColor"/> {carData.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div className="vd-stat-item">
                    <strong style={{color: '#475569'}}><Calendar size={18}/> {carData.bookings}</strong>
                    <span>Bookings</span>
                  </div>
                  <div className="vd-stat-item">
                    <strong style={{color: '#8b5cf6'}}><Award size={18}/> {carData.years}</strong>
                    <span>Years in Service</span>
                  </div>
                </div>

                <p className="vd-desc">{carData.desc}</p>

                <div className="vd-features-row">
                  <div className="vd-feat-icon"><Car size={20} className="text-blue-600"/> {carData.type}</div>
                  <div className="vd-feat-icon"><Users size={20} className="text-blue-600"/> {carData.seats} Seats</div>
                  <div className="vd-feat-icon"><Briefcase size={20} className="text-blue-600"/> {carData.luggage} Luggage</div>
                  <div className="vd-feat-icon"><Snowflake size={20} className="text-blue-600"/> AC</div>
                  <div className="vd-feat-icon"><CheckCircle2 size={20} className="text-blue-600"/> Chauffeur Driven</div>
                </div>
              </div>

              <div className="vd-price-card">
                <div className="vd-price">₹ {carData.price}</div>
                <div className="vd-price-label">Per Day</div>
                
                <div className="vd-inclusions-list">
                  <div className="vd-inc-item"><CheckCircle2 size={16} className="check"/> Fuel Included</div>
                  <div className="vd-inc-item"><CheckCircle2 size={16} className="check"/> Toll & Parking Included</div>
                  <div className="vd-inc-item"><CheckCircle2 size={16} className="check"/> Driver Allowance Included</div>
                  <div className="vd-inc-item"><CheckCircle2 size={16} className="check"/> 24/7 Support</div>
                </div>

                <button className="vd-btn-primary">Select This Car</button>
              </div>

            </div>

            {/* Middle Grid */}
            <div className="vd-mid-grid">
              
              <div className="vd-box">
                <h3>{matchedVehicle.category === 'Car' ? 'Car Information' : matchedVehicle.category === 'Bus' ? 'Bus Information' : 'Mini Bus Information'}</h3>
                <div className="vd-table">
                  <div className="vd-table-row"><span>Brand</span><span>{carData.brand}</span></div>
                  <div className="vd-table-row"><span>Model</span><span>{carData.model}</span></div>
                  <div className="vd-table-row"><span>Vehicle Type</span><span>{carData.type}</span></div>
                  <div className="vd-table-row"><span>Year of Purchase</span><span>{carData.year}</span></div>
                  <div className="vd-table-row"><span>Seating Capacity</span><span>{carData.seats} Seater</span></div>
                  <div className="vd-table-row"><span>Luggage Capacity</span><span>{carData.luggage} Large Bags</span></div>
                  <div className="vd-table-row"><span>Fuel Type</span><span>{carData.fuel}</span></div>
                  <div className="vd-table-row"><span>Transmission</span><span>{carData.transmission}</span></div>
                  <div className="vd-table-row"><span>Air Conditioner</span><span>{carData.ac ? 'Yes' : 'No'}</span></div>
                  <div className="vd-table-row"><span>Music System</span><span>Premium</span></div>
                  <div className="vd-table-row"><span>Insurance</span><span>{carData.insurance}</span></div>
                  <div className="vd-table-row"><span>Registration No.</span><span>{carData.regNo}</span></div>
                  <div className="vd-table-row"><span>Included</span><span>Fuel, Toll, Parking, Driver Allowance</span></div>
                  <div className="vd-table-row"><span>Availability</span><span>Mon - Sun (24x7)</span></div>
                </div>
              </div>

              <div className="vd-box" style={{background: '#f0fdf4', borderColor: '#bbf7d0', padding: '24px'}}>
                <h3 style={{marginBottom: '16px'}}>Why Choose This Vehicle?</h3>
                <div className="vd-why-list">
                  <div className="vd-why-item"><CheckCircle2 size={16} className="check"/> Well maintained and cleaned before every trip</div>
                  <div className="vd-why-item"><CheckCircle2 size={16} className="check"/> Professional and experienced chauffeurs</div>
                  <div className="vd-why-item"><CheckCircle2 size={16} className="check"/> Punctual and reliable service</div>
                  <div className="vd-why-item"><CheckCircle2 size={16} className="check"/> Comfortable for short and long distances</div>
                  <div className="vd-why-item"><CheckCircle2 size={16} className="check"/> Perfect for VIPs and important guests</div>
                </div>
              </div>

            </div>

            {/* Bottom Grid */}
            <div className="vd-bot-grid">
              
              <div className="vd-box">
                <h3>Customer Reviews & Ratings</h3>
                <div style={{display: 'flex', gap: '32px'}}>
                  <div className="sd-ratings-summary" style={{ flex: '0 0 150px' }}>
                    <h1>{carData.rating}</h1>
                    <div className="stars" style={{color: '#f59e0b', marginBottom: '8px'}}>
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '24px' }}>({carData.bookings} Reviews)</span>
                    
                    <div className="sd-rating-bars">
                      {[
                        {s: 5, c: 96}, {s: 4, c: 18}, {s: 3, c: 4}, {s: 2, c: 1}, {s: 1, c: 1}
                      ].map(bar => (
                        <div className="sd-rating-bar-row" key={bar.s}>
                          <span style={{width: 12}}>{bar.s} <Star size={8} fill="currentColor"/></span>
                          <div className="sd-bar-track">
                            <div className="sd-bar-fill" style={{width: `${(bar.c/120)*100}%`, background: '#ea580c'}}></div>
                          </div>
                          <span style={{width: 20, textAlign: 'right'}}>{bar.c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    {carData.reviewsList.map(r => (
                      <div className="sd-review-item" key={r.id}>
                        <div className="sd-reviewer-header">
                          <div className="sd-reviewer-info">
                            <img src={r.img} alt={r.name} className="sd-reviewer-avatar" />
                            <div className="sd-reviewer-name">
                              <h5>{r.name}</h5>
                              <span>{r.date}</span>
                            </div>
                          </div>
                          <div className="stars" style={{color: '#f59e0b'}}>
                            {[...Array(r.rating)].map((_, i) => <Star size={12} fill="currentColor" key={i} />)}
                          </div>
                        </div>
                        <p className="sd-review-text" style={{marginTop: '8px'}}>{r.text}</p>
                      </div>
                    ))}
                    <button style={{ background: 'none', border: 'none', color: '#1d4ed8', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                      View All Reviews →
                    </button>
                  </div>
                </div>
              </div>

              <div className="vd-contact-box">
                <h3>Need Help?</h3>
                <p>Our travel experts are here to help you 24/7.</p>
                <div className="vd-contact-row text-orange-600"><Phone size={18} /> +91 98765 43210</div>
                <div className="vd-contact-row text-orange-600"><Mail size={18} /> travel@ems.com</div>
                <div className="vd-contact-row text-orange-600"><MessageSquare size={18} /> Live Chat Support</div>
                <div style={{textAlign: 'center', marginTop: '24px'}}>
                  {/* Fake illustration placeholder */}
                  <div style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '120px', height: '120px', background: '#e0e7ff', borderRadius: '50%', color: '#3730a3'}}>
                    <Phone size={48} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="vd-footer">
          <button className="vd-btn-back-foot" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Back</button>
          <button className="dj-btn-book" onClick={() => navigate('/client/guest-rooms')}>
            Continue to Booking Summary <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetails;
