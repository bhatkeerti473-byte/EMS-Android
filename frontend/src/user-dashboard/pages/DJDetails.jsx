import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Star, MapPin, Award, 
  ChevronLeft, ChevronRight, Check, Heart, Share2, Music, 
  Speaker, Zap, BatteryCharging, Headphones
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import "../styles/DJDetails.css";

const DJDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState(() => {
    return location.state?.selectedPackage || "Premium DJ Package";
  });
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("DJ Profile link copied to clipboard!");
  };
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = () => {
    setWishlist(prev => {
      const djId = "dj-sonic-beats";
      const isSaved = prev.some(item => item.id === djId);
      let newWishlist;
      if (isSaved) {
        newWishlist = prev.filter(item => item.id !== djId);
      } else {
        const wishlistItem = {
          id: djId,
          title: djData.name,
          category: "DJ / Sound",
          location: djData.location,
          price: 25000,
          image: djData.mainImg,
          status: "Upcoming"
        };
        newWishlist = [...prev, wishlistItem];
      }
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const djData = {
    name: "Sonic Beats DJ",
    verified: true,
    location: "Bangalore, Karnataka",
    rating: 4.9,
    reviews: 150,
    yearsExp: "8+",
    eventsCompleted: "250+",
    clientSatisfaction: "98%",
    award: "Best Wedding DJ 2024",
    desc: "Sonic Beats DJ is a team of passionate professionals who love creating energetic and unforgettable atmospheres. We specialize in weddings, engagements, corporate events, and private parties.",
    tags: [
      { label: "DJ / Music System", icon: Music },
      { label: "Sound System", icon: Speaker },
      { label: "Lighting", icon: Zap },
      { label: "Generator Backup", icon: BatteryCharging }
    ],
    mainImg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    thumbs: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80"
    ],
    packages: [
      {
        id: "Basic DJ Package", name: "Basic DJ Package", price: "12,000", guests: "Up to 100 Guests",
        img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=300&q=80",
        features: ["1 Professional DJ", "Basic Sound System", "2 Speakers", "4 LED Lights", "Up to 4 Hours"]
      },
      {
        id: "Standard DJ Package", name: "Standard DJ Package", price: "18,000", guests: "Up to 200 Guests",
        img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80",
        features: ["1 Professional DJ", "Quality Sound System", "4 Speakers & 2 Subwoofers", "6 LED Lights", "Up to 6 Hours"]
      },
      {
        id: "Premium DJ Package", name: "Premium DJ Package", price: "25,000", guests: "Up to 300 Guests", popular: true,
        img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80",
        features: ["1 Top DJ", "Premium Sound System", "6 Speakers & 2 Subwoofers", "12 LED Lights", "Smoke Machine", "Up to 8 Hours"]
      },
      {
        id: "Luxury DJ Package", name: "Luxury DJ Package", price: "35,000", guests: "Up to 500 Guests",
        img: "https://images.unsplash.com/photo-1520627914845-d85cff1c201d?auto=format&fit=crop&w=300&q=80",
        features: ["2 Professional DJs", "High End Sound System", "8 Speakers & 4 Subwoofers", "16 LED Lights + Moving Heads", "Smoke Machine", "Up to 10 Hours"]
      },
      {
        id: "Ultimate DJ Package", name: "Ultimate DJ Package", price: "50,000", guests: "500+ Guests",
        img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80",
        features: ["2 Top DJs", "Line Array Sound System", "12+ Speakers & 4 Subwoofers", "20+ LED Lights + Lasers", "Special Effects", "Up to 12 Hours"]
      }
    ],
    reviewsList: [
      { id: 1, name: "Rohan Mehta", date: "2 days ago", text: "Amazing team! They made our party unforgettable. The sound quality and lighting setup were just perfect.", rating: 5, img: "https://i.pravatar.cc/150?u=1" },
      { id: 2, name: "Priya Sharma", date: "1 week ago", text: "Highly professional and on-time service. Everyone enjoyed the music and ambiance.", rating: 5, img: "https://i.pravatar.cc/150?u=2" },
      { id: 3, name: "Ankit & Neha", date: "3 weeks ago", text: "Best DJ and sound system we could have asked for. Thank you for making our day special.", rating: 5, img: "https://i.pravatar.cc/150?u=3" }
    ]
  };

  const activePkg = djData.packages.find(p => p.id === selectedPackage) || djData.packages.find(p => p.name === selectedPackage) || djData.packages[2];

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          <div className="dj-details-page">
            <button className="dj-back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back to Additional Services
            </button>
            
            {/* Top Block */}
            <div className="dj-top-grid">
              
              <div className="dj-main-img-card">
                <img src={djData.thumbs[activeImageIdx]} alt="DJ" className="dj-main-img" />
                <div className="dj-thumbs-row">
                  <button 
                    className="sd-page-btn" 
                    style={{border: 'none', background: 'none', cursor: "pointer"}}
                    onClick={() => setActiveImageIdx(prev => prev === 0 ? djData.thumbs.length - 1 : prev - 1)}
                  >
                    <ChevronLeft size={16}/>
                  </button>
                  {djData.thumbs.map((img, i) => (
                    <img 
                      src={img.replace("w=800", "w=150")} 
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
                    onClick={() => setActiveImageIdx(prev => prev === djData.thumbs.length - 1 ? 0 : prev + 1)}
                  >
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="dj-info-card">
                <div className="dj-info-header">
                  <div>
                    <h2>
                      {djData.name}
                      {djData.verified && <span className="dj-verified-badge"><CheckCircle2 size={12} /> Verified</span>}
                    </h2>
                    <div className="dj-location"><MapPin size={14} /> {djData.location}</div>
                    <div className="dj-rating-row">
                      <Star size={16} className="stars" fill="currentColor" />
                      <span>{djData.rating}</span>
                      <span className="reviews">({djData.reviews} Reviews)</span>
                    </div>
                  </div>
                  <div className="dj-actions-row">
                    <button 
                      className="dj-btn-secondary" 
                      onClick={toggleWishlist}
                      style={{ color: wishlist.some(item => item.id === "dj-sonic-beats") ? "red" : "inherit" }}
                    >
                      <Heart 
                        size={16} 
                        fill={wishlist.some(item => item.id === "dj-sonic-beats") ? "red" : "none"} 
                      /> 
                      {wishlist.some(item => item.id === "dj-sonic-beats") ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                    <button className="dj-btn-secondary" onClick={handleShare}><Share2 size={16} /> Share</button>
                  </div>
                </div>

                <div className="dj-stats-grid">
                  <div className="dj-stat-item">
                    <strong>{djData.yearsExp}</strong>
                    <span>Years Experience</span>
                  </div>
                  <div className="dj-stat-item">
                    <strong>{djData.eventsCompleted}</strong>
                    <span>Events Completed</span>
                  </div>
                  <div className="dj-stat-item">
                    <strong>{djData.clientSatisfaction}</strong>
                    <span>Client Satisfaction</span>
                  </div>
                  <div className="dj-stat-item">
                    <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={18} /> Award</strong>
                    <span>{djData.award}</span>
                  </div>
                </div>

                <p className="dj-desc">{djData.desc}</p>

                <div className="dj-tags-row">
                  {djData.tags.map((t, i) => (
                    <div className="dj-tag" key={i}>
                      <t.icon size={14} className="icon" /> {t.label}
                    </div>
                  ))}
                </div>

                <div className="dj-contact-box" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h4>Get in Touch</h4>
                    <div className="dj-contact-item"><span style={{color: '#ea580c'}}>📞</span> +91 98765 43210</div>
                    <div className="dj-contact-item"><span style={{color: '#ea580c'}}>✉️</span> info@sonicbeats.com</div>
                    <div className="dj-contact-item"><span style={{color: '#ea580c'}}>🌐</span> www.sonicbeats.com</div>
                  </div>
                  <div>
                    <button className="dj-btn-primary" style={{padding: '12px 32px'}}>Contact Now</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Packages Carousel */}
            <div className="dj-packages-section">
              <div className="dj-packages-header">
                <h3>Our Packages</h3>
                <button className="dj-btn-compare"><Music size={14}/> Compare Packages</button>
              </div>

              <div className="dj-packages-carousel">
                {djData.packages.map(pkg => (
                  <div className={`dj-package-card ${pkg.popular ? 'popular' : ''}`} key={pkg.id}>
                    {pkg.popular && <div className="dj-pkg-badge">Most Popular</div>}
                    <img src={pkg.img} alt={pkg.name} className="dj-pkg-img" />
                    
                    <div className="dj-pkg-body">
                      <h4 className="dj-pkg-name">{pkg.name}</h4>
                      <div className="dj-pkg-price">₹ {pkg.price}</div>
                      <div className="dj-pkg-guests">{pkg.guests}</div>
                      
                      <div className="dj-pkg-features">
                        {pkg.features.map((f, idx) => (
                          <div className="dj-pkg-feature" key={idx}>
                            <Check size={14} className="check" strokeWidth={3} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>

                      <button 
                        className={`dj-btn-pkg-action ${selectedPackage === pkg.id ? 'popular-btn' : ''}`}
                        onClick={() => setSelectedPackage(pkg.id)}
                      >
                        {selectedPackage === pkg.id ? "Selected" : "View Details"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid Info Sections */}
            <div className="dj-info-grid">
              
              <div className="dj-box">
                <h4>Included in {activePkg.name}</h4>
                <div className="dj-inclusions-grid">
                  {activePkg.features.map((feat, idx) => (
                    <div className="dj-inclusion-item" key={idx}>
                      <div className="dj-inclusion-icon"><CheckCircle2 size={20} /></div>
                      <div className="dj-inclusion-text">
                        <h5>Feature {idx + 1}</h5>
                        <p>{feat}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dj-box">
                <h4>Studio Information</h4>
                <div className="dj-studio-info-list">
                  <div className="dj-info-row"><span>Established Year</span><span>2016</span></div>
                  <div className="dj-info-row"><span>Team Size</span><span>12 Members</span></div>
                  <div className="dj-info-row"><span>Service Areas</span><span>Bangalore & Nearby Cities</span></div>
                  <div className="dj-info-row"><span>Languages Known</span><span>English, Hindi, Kannada</span></div>
                  <div className="dj-info-row"><span>Payment Modes</span><span>Cash, UPI, Card, Net Banking</span></div>
                  <div className="dj-info-row"><span>Availability</span><span>Mon - Sun (24x7)</span></div>
                </div>
              </div>

              <div className="dj-box" style={{ background: '#f8fafc' }}>
                <h4>Why Choose Us?</h4>
                <div className="dj-reasons-list">
                  <div className="dj-reason-item"><CheckCircle2 size={14} color="#16a34a" /> Professional & Experienced Team</div>
                  <div className="dj-reason-item"><CheckCircle2 size={14} color="#16a34a" /> High Quality Equipment</div>
                  <div className="dj-reason-item"><CheckCircle2 size={14} color="#16a34a" /> Customizable Packages</div>
                  <div className="dj-reason-item"><CheckCircle2 size={14} color="#16a34a" /> On-time Delivery</div>
                  <div className="dj-reason-item"><CheckCircle2 size={14} color="#16a34a" /> 24/7 Customer Support</div>
                </div>
                
                <div className="dj-custom-pkg-box">
                  <h5><Zap size={14}/> Need Custom Package?</h5>
                  <p>We can create a custom package as per your requirements.</p>
                  <button className="dj-btn-custom">Request Custom Package</button>
                </div>
              </div>

            </div>

            {/* Bottom Grid */}
            <div className="dj-bottom-grid">
              <div className="dj-box">
                <h4>Customer Reviews & Ratings</h4>
                <div className="dj-reviews-layout">
                  <div className="dj-ratings-summary" style={{ flex: '0 0 150px' }}>
                    <h1>{djData.rating}</h1>
                    <div className="stars" style={{color: '#f59e0b', marginBottom: '8px'}}>
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'block', marginBottom: '24px' }}>({djData.reviews} Reviews)</span>
                    
                    <div className="sd-rating-bars">
                      {[
                        {s: 5, c: 132}, {s: 4, c: 12}, {s: 3, c: 4}, {s: 2, c: 1}, {s: 1, c: 1}
                      ].map(bar => (
                        <div className="sd-rating-bar-row" key={bar.s}>
                          <span style={{width: 12}}>{bar.s} <Star size={8} fill="currentColor"/></span>
                          <div className="sd-bar-track">
                            <div className="sd-bar-fill" style={{width: `${(bar.c/150)*100}%`}}></div>
                          </div>
                          <span style={{width: 20, textAlign: 'right'}}>{bar.c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    {djData.reviewsList.map(r => (
                      <div className="dj-review-item" key={r.id}>
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
                    <button style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                      View All Reviews →
                    </button>
                  </div>
                </div>
              </div>

              <div className="dj-box" style={{ background: '#f8fafc' }}>
                <h4>Have Questions?</h4>
                <div className="dj-form-row">
                  <div className="dj-form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input type="text" placeholder="Your Name" />
                  </div>
                  <div className="dj-form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <input type="text" placeholder="Phone Number" />
                  </div>
                </div>
                <div className="dj-form-group">
                  <input type="email" placeholder="Email Address" />
                </div>
                <div className="dj-form-group">
                  <textarea placeholder="Your Question / Message" rows="4"></textarea>
                </div>
                <button className="dj-btn-primary">Send Inquiry</button>
              </div>
            </div>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="dj-sticky-footer">
          <div className="dj-footer-left">
            <h4>Your Selected Services (4)</h4>
            <div className="dj-selected-services-row">
              <div className="dj-sel-svc-item">
                <div className="dj-sel-icon"><Headphones size={18} /></div>
                <div className="dj-sel-text"><h5>DJ / Music System</h5><p>{selectedPackage}</p></div>
              </div>
              <div className="dj-sel-svc-item">
                <div className="dj-sel-icon" style={{background: '#f1f5f9', color: '#64748b'}}><Speaker size={18} /></div>
                <div className="dj-sel-text"><h5>Sound System</h5><p>Included in Package</p></div>
              </div>
              <div className="dj-sel-svc-item">
                <div className="dj-sel-icon" style={{background: '#f1f5f9', color: '#64748b'}}><Zap size={18} /></div>
                <div className="dj-sel-text"><h5>Lighting</h5><p>Included in Package</p></div>
              </div>
              <div className="dj-sel-svc-item">
                <div className="dj-sel-icon" style={{background: '#f1f5f9', color: '#64748b'}}><BatteryCharging size={18} /></div>
                <div className="dj-sel-text"><h5>Generator Backup</h5><p>Included in Package</p></div>
              </div>
            </div>
          </div>
          
          <div className="dj-footer-right">
            <div className="dj-total-block">
              <p>Total Additional Services</p>
              <h3>₹ {activePkg.price}</h3>
              <span>(All Inclusive)</span>
            </div>
            <button className="dj-btn-book" onClick={() => {
              const priceNum = parseInt(activePkg.price.replace(/[^0-9]/g, ""), 10);
              localStorage.setItem("booking_dj_name", djData.name + " - " + activePkg.name);
              localStorage.setItem("booking_dj_price", priceNum);
              navigate('/client/transport-service');
            }}>
              Continue to Booking Summary <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DJDetails;
