import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, CheckCircle2, Star, MapPin, Award, 
  Camera, Video, ChevronLeft, ChevronRight, Check
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";
import "../styles/StudioDetails.css";

const StudioDetails = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedServices = location.state?.selectedServices || [];
  
  const [isSelected, setIsSelected] = useState(false);

  // Mock data fetching based on type
  const isPhoto = type === 'photography';
  
  const studioData = isPhoto ? {
    name: "The Frame Makers",
    verified: true,
    location: "Bangalore, Karnataka",
    rating: 4.9,
    reviews: 150,
    yearsExp: "8+",
    eventsCovered: "250+",
    clientSatisfaction: "98%",
    award: "Best Wedding Photographer 2024",
    desc: "The Frame Makers is a team of passionate photographers who love capturing real emotions and beautiful moments. We specialize in wedding, engagement, pre-wedding and candid photography.",
    tags: ["Candid Photography", "Traditional Photography", "Pre-Wedding Shoots", "Drone Photography"],
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80"
    ],
    reviewsList: [
      { id: 1, name: "Rohan Mehta", date: "14 May 2024", text: "Amazing team! They captured every moment so beautifully. Highly professional and...", rating: 5, img: "https://i.pravatar.cc/150?u=1" },
      { id: 2, name: "Priya Sharma", date: "02 May 2024", text: "The photos are beyond our expectations. Great work and on-time delivery!", rating: 5, img: "https://i.pravatar.cc/150?u=2" },
      { id: 3, name: "Ankit & Neha", date: "28 Apr 2024", text: "Best photography team we could have asked for. Thank you for making our day special.", rating: 5, img: "https://i.pravatar.cc/150?u=3" }
    ],
    packages: [
      { name: "Basic Package", price: "₹12,000", features: "4 Hours Coverage • 1 Photographer • Edited Photos" },
      { name: "Standard Package", price: "₹18,000", features: "6 Hours Coverage • 2 Photographers • Edited Photos" },
      { name: "Premium Package", price: "₹25,000", popular: true, features: "8 Hours Coverage • 2 Photographers • Drone • Album" },
      { name: "Luxury Package", price: "₹35,000", features: "10 Hours Coverage • 3 Photographers • Drone • Album" }
    ],
    mainImg: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80"
  } : {
    name: "Cine Magic Studio",
    verified: true,
    location: "Bangalore, Karnataka",
    rating: 4.8,
    reviews: 128,
    yearsExp: "7+",
    eventsCovered: "200+",
    clientSatisfaction: "95%",
    award: "Best Cinematography 2024",
    desc: "Cine Magic Studio captures your story in the most cinematic way. We create timeless wedding films with creativity and emotions.",
    tags: ["Cinematic Films", "Traditional Videos", "Teaser Videos", "Drone Videography"],
    photos: [
      "https://images.unsplash.com/photo-1533614767277-268e6fa39f5f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80"
    ],
    reviewsList: [
      { id: 1, name: "Karan Kapoor", date: "12 May 2024", text: "Cinematic quality videos! They perfectly captured every emotion.", rating: 5, img: "https://i.pravatar.cc/150?u=4" },
      { id: 2, name: "Sneha Iyer", date: "10 May 2024", text: "Very professional team and beautiful storytelling. Loved the teaser!", rating: 5, img: "https://i.pravatar.cc/150?u=5" },
      { id: 3, name: "Vikram & Aarti", date: "05 Apr 2024", text: "Our wedding film was like a movie. Highly recommended!", rating: 5, img: "https://i.pravatar.cc/150?u=6" }
    ],
    packages: [
      { name: "Basic Package", price: "₹15,000", features: "4 Hours Coverage • 1 Videographer • Highlight Video" },
      { name: "Standard Package", price: "₹22,000", features: "6 Hours Coverage • 1 Videographer • Teaser + Highlight" },
      { name: "Premium Package", price: "₹30,000", popular: true, features: "8 Hours Coverage • 2 Videographers • Teaser • Full Video" },
      { name: "Luxury Package", price: "₹45,000", features: "10 Hours Coverage • 2 Videographers • Drone • Full Film" }
    ],
    mainImg: "https://images.unsplash.com/photo-1516280440502-3c87dc5a164c?auto=format&fit=crop&w=400&q=80"
  };

  const handleContinue = () => {
    if (isSelected) {
      // Find the most popular package or fallback to the last package as a default price
      const popularPkg = studioData.packages.find(p => p.popular) || studioData.packages[studioData.packages.length - 1];
      const priceNum = parseInt(popularPkg.price.replace(/[^0-9]/g, ""), 10);
      
      if (isPhoto) {
        localStorage.setItem("booking_photography_name", studioData.name);
        localStorage.setItem("booking_photography_price", priceNum);
      } else {
        localStorage.setItem("booking_videography_name", studioData.name);
        localStorage.setItem("booking_videography_price", priceNum);
      }
    } else {
      // If not selected, clear it from localStorage
      if (isPhoto) {
        localStorage.removeItem("booking_photography_name");
        localStorage.removeItem("booking_photography_price");
      } else {
        localStorage.removeItem("booking_videography_name");
        localStorage.removeItem("booking_videography_price");
      }
    }

    if (isPhoto && selectedServices.includes('videography')) {
      // If they selected both, we return to the services grid so they can select a video studio
      navigate("/client/services");
    } else {
      // Otherwise proceed to DJ selection
      navigate("/client/dj-service");
    }
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          {/* Stepper omitted for brevity but would sit here */}

          <div className="studio-details-page">
            <button className="sd-back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back to {isPhoto ? "Photography" : "Videography"}
            </button>
            
            <h2 className="sd-header-title">{isPhoto ? "Photography Studio Details" : "Videography Studio Details"}</h2>

            <div className="sd-layout-grid">
              
              {/* Top Left: Info */}
              <div className="sd-card sd-info-card">
                <div className="sd-info-top">
                  <img src={studioData.mainImg} alt={studioData.name} className="sd-info-img" />
                  <div className="sd-info-details">
                    <h3>
                      {studioData.name}
                      {studioData.verified && <span className="sd-verified-badge"><CheckCircle2 size={12} /> Verified</span>}
                    </h3>
                    <div className="sd-location">
                      <MapPin size={14} /> {studioData.location}
                    </div>
                    <div className="sd-rating-row">
                      <Star size={16} className="stars" fill="currentColor" />
                      <span>{studioData.rating}</span>
                      <span className="reviews">({studioData.reviews} Reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="sd-stats-grid">
                  <div className="sd-stat-item">
                    <strong>{studioData.yearsExp}</strong>
                    <span>Years Experience</span>
                  </div>
                  <div className="sd-stat-item">
                    <strong>{studioData.eventsCovered}</strong>
                    <span>Events Covered</span>
                  </div>
                  <div className="sd-stat-item">
                    <strong>{studioData.clientSatisfaction}</strong>
                    <span>Client Satisfaction</span>
                  </div>
                  <div className="sd-stat-item" style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px' }}>
                    <Award size={20} color="#6d28d9" style={{marginBottom: 4}} />
                    <span style={{color: '#0f172a', fontWeight: 600}}>{studioData.award}</span>
                  </div>
                </div>

                <p className="sd-info-desc">{studioData.desc}</p>

                <div className="sd-tags-row">
                  {studioData.tags.map((t, i) => (
                    <div className="sd-tag" key={i}>
                      <CheckCircle2 size={14} color="#10b981" /> {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Right: Photos */}
              <div className="sd-card sd-photos-card">
                <div className="sd-photos-header">
                  <h4>Studio Photos</h4>
                  <div className="sd-pagination">
                    <span>2 / 10</span>
                    <button className="sd-page-btn"><ChevronLeft size={14}/></button>
                    <button className="sd-page-btn"><ChevronRight size={14}/></button>
                  </div>
                </div>
                <div className="sd-photos-grid">
                  <img src={studioData.photos[0]} alt="Studio work" className="sd-photo-item" />
                  <img src={studioData.photos[1]} alt="Studio work" className="sd-photo-item" />
                </div>
                <div className="sd-photo-dots">
                  <div className="sd-dot active"></div>
                  <div className="sd-dot"></div>
                  <div className="sd-dot"></div>
                </div>
              </div>

              {/* Bottom Left: Reviews */}
              <div className="sd-card sd-reviews-card">
                <h4>Reviews & Ratings</h4>
                <div className="sd-reviews-layout">
                  <div className="sd-ratings-summary">
                    <h1>{studioData.rating}</h1>
                    <div className="stars">
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                      <Star size={14} fill="currentColor" />
                    </div>
                    <span className="sub">Based on {studioData.reviews} Reviews</span>
                    
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
                  
                  <div className="sd-reviews-list">
                    {studioData.reviewsList.map(r => (
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
                        <p className="sd-review-text">{r.text}</p>
                      </div>
                    ))}
                    <button className="sd-view-all">View All Reviews <ArrowRight size={14}/></button>
                  </div>
                </div>
              </div>

              {/* Bottom Right: Packages */}
              <div className="sd-card sd-packages-card">
                <h4>{isPhoto ? "Photography Packages" : "Videography Packages"}</h4>
                <div className="sd-packages-list">
                  {studioData.packages.map((pkg, i) => (
                    <div className={`sd-package-item ${pkg.popular ? 'popular' : ''}`} key={i}>
                      <div className="sd-pkg-info">
                        <h5>{pkg.name} {pkg.popular && <span className="sd-pkg-popular">Most Popular</span>}</h5>
                        <div className="sd-pkg-features">{pkg.features}</div>
                      </div>
                      <div className="sd-pkg-price">{pkg.price}</div>
                    </div>
                  ))}
                </div>
                
                <button 
                  className={`sd-btn-select-studio ${isSelected ? 'selected' : ''}`}
                  onClick={() => setIsSelected(!isSelected)}
                >
                  {isSelected ? "Selected" : "Select This Studio"}
                </button>
              </div>

            </div>

            <div className="sd-bottom-actions">
              <button className="sd-btn-back" onClick={() => navigate(-1)}><ArrowLeft size={16}/> Back</button>
              
              <button className="sd-btn-continue" onClick={handleContinue}>
                {(isPhoto && selectedServices.includes('videography')) 
                  ? "Continue to Videography Selection" 
                  : "Continue to DJ / Music System Selection"} 
                <ArrowRight size={16}/>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioDetails;
