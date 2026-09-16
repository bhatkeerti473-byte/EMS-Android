import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, Info, Star, ShieldCheck } from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const cakeDetailsData = {
  "cake-choc": {
    name: "Premium Chocolate Truffle (1.5 Kg)",
    price: 1200,
    baseWeight: 1.5,
    desc: "Rich Belgian chocolate layers with premium truffle frosting. Perfect for chocolate lovers, decorated with dark chocolate shavings and chocolate curls.",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Belgian Dark Chocolate", "Fresh Cream", "Dutch Cocoa Powder", "Organic Wheat Flour", "Butter", "Vanilla Extract"],
    tiers: "Single Tier",
    weight: "1.5 Kg",
    serves: "12 - 15 Guests",
    rating: 4.8,
    reviews: 142
  },
  "cake-red": {
    name: "Luxury Red Velvet (1.5 Kg)",
    price: 1500,
    baseWeight: 1.5,
    desc: "Classic velvety red velvet sponge base with vanilla cream cheese frosting. A luxurious cake that makes any celebration feel royal and premium.",
    img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Cream Cheese", "Vanilla Extract", "Cocoa Powder", "Buttermilk", "Organic Wheat Flour", "Natural Food Coloring"],
    tiers: "Single Tier",
    weight: "1.5 Kg",
    serves: "12 - 15 Guests",
    rating: 4.9,
    reviews: 118
  },
  "cake-butter": {
    name: "Butterscotch Caramel (2 Kg)",
    price: 1800,
    baseWeight: 2.0,
    desc: "Crunchy butterscotch praline base layered with rich caramel sauce and whipped cream. Sweet, buttery, and crunchily satisfying.",
    img: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Butterscotch Praline", "Caramel Drizzle", "Fresh Dairy Cream", "Unsalted Butter", "Wheat Flour", "Brown Sugar"],
    tiers: "Single Tier",
    weight: "2.0 Kg",
    serves: "16 - 20 Guests",
    rating: 4.7,
    reviews: 95
  },
  "cake-vanilla": {
    name: "Strawberry Vanilla Bliss (1.5 Kg)",
    price: 1000,
    baseWeight: 1.5,
    desc: "Fluffy vanilla sponge cake layered with fresh strawberry compote and whipped vanilla bean frosting. Light, refreshing, and clean tasting.",
    img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Fresh Strawberries", "Vanilla Bean Pods", "Eggless Cake Base Mix", "Fresh Dairy Cream", "Sugar", "Wheat Flour"],
    tiers: "Single Tier",
    weight: "1.5 Kg",
    serves: "12 - 15 Guests",
    rating: 4.6,
    reviews: 87
  },
  "cake-3tier": {
    name: "Royal 3-Tier Celebrations Cake (5 Kg)",
    price: 5000,
    baseWeight: 5.0,
    desc: "Stunning three-tiered custom design featuring vanilla strawberry and chocolate truffle layers. Designed specifically for weddings, anniversaries, and grand events.",
    img: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Belgian Dark Chocolate", "Vanilla Cream", "Strawberry Compote", "Fondant Accents", "Butter", "Premium Flours"],
    tiers: "3-Tier Setup",
    weight: "5.0 Kg",
    serves: "40 - 50 Guests",
    rating: 4.9,
    reviews: 210
  }
};

const CakeDetails = () => {
  const { cakeId } = useParams();
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const cake = cakeDetailsData[cakeId] || cakeDetailsData["cake-choc"];

  const [eggless, setEggless] = useState(() => {
    // If this cake matches the one saved in localStorage, load eggless preference
    const savedCakeName = localStorage.getItem("booking_cake_name");
    if (savedCakeName === cake.name) {
      return localStorage.getItem("booking_cake_eggless") === "Yes";
    }
    return false;
  });

  const [cakeText, setCakeText] = useState(() => {
    // If this cake matches the one saved in localStorage, load the text message
    const savedCakeName = localStorage.getItem("booking_cake_name");
    if (savedCakeName === cake.name) {
      return localStorage.getItem("booking_cake_text") || "";
    }
    return "";
  });

  const [cakeWeight, setCakeWeight] = useState(() => {
    const savedCakeName = localStorage.getItem("booking_cake_name");
    if (savedCakeName === cake.name) {
      const savedWeight = Number(localStorage.getItem("booking_cake_weight"));
      if (savedWeight > 0) return savedWeight;
    }
    return cake.baseWeight;
  });

  const pricePerKg = cake.price / cake.baseWeight;
  const finalPrice = Math.round((cakeWeight * pricePerKg) + (eggless ? 150 : 0));

  const handleSelectCake = () => {
    localStorage.setItem("booking_cake_name", cake.name);
    localStorage.setItem("booking_cake_price", finalPrice.toString());
    localStorage.setItem("booking_cake_text", cakeText);
    localStorage.setItem("booking_cake_eggless", eggless ? "Yes" : "No");
    localStorage.setItem("booking_cake_weight", cakeWeight.toString());

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/catering");
    }, 1500);
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc", padding: "32px" }}>
          
          <button 
            onClick={() => navigate("/client/catering")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "none",
              border: "none",
              color: "#64748b",
              fontWeight: "600",
              cursor: "pointer",
              fontSize: "14px",
              marginBottom: "24px",
              padding: 0
            }}
          >
            <ArrowLeft size={16} /> Back to Catering
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* Cake details grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "32px",
              background: "white",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)"
            }}>
              
              {/* Left Column: Image and Specs */}
              <div>
                <div style={{ width: "100%", height: "350px", overflow: "hidden", borderRadius: "16px", marginBottom: "24px" }}>
                  <img src={cake.img} alt={cake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                
                <div>
                  <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "16px" }}>🎂 Cake Specifications</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>Weight</span>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{cake.weight}</strong>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>Tiers</span>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{cake.tiers}</strong>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>Serves</span>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>{cake.serves}</strong>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "12px" }}>
                      <span style={{ fontSize: "11px", color: "#64748b", display: "block" }}>Eggless Optional</span>
                      <strong style={{ fontSize: "13px", color: "#0f172a" }}>Yes (+₹150)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customizations & Order */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                    <span style={{ background: "#ffedd5", color: "#ea580c", fontSize: "11px", fontWeight: "700", padding: "4px 8px", borderRadius: "6px" }}>CATERING SPECIAL</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                      <Star size={16} fill="#eab308" stroke="#eab308" /> {cake.rating} ({cake.reviews} reviews)
                    </div>
                  </div>

                  <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px 0" }}>{cake.name}</h2>
                  
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "20px" }}>
                    <span style={{ fontSize: "32px", fontWeight: "900", color: "#ea580c" }}>₹{finalPrice.toLocaleString()}</span>
                    {eggless && <span style={{ fontSize: "12px", color: "#64748b" }}>(Includes ₹150 Eggless Charge)</span>}
                  </div>

                  <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>{cake.desc}</p>
                  
                  <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "20px", marginBottom: "24px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "12px" }}>📋 Key Ingredients</h4>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {cake.ingredients.map((ing, i) => (
                        <span key={i} style={{ background: "#f1f5f9", color: "#475569", fontSize: "12px", fontWeight: "500", padding: "4px 10px", borderRadius: "20px" }}>
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Weight Selector */}
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                    gap: "16px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>⚖️ Customize Cake Weight (Kg)</h4>
                      <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
                        Base weight is {cake.baseWeight} Kg. Proportional price is ₹{Math.round(pricePerKg)} / Kg.
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <button 
                        onClick={() => setCakeWeight(w => Math.max(cake.baseWeight, w - 0.5))}
                        disabled={cakeWeight <= cake.baseWeight}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          background: cakeWeight <= cake.baseWeight ? "#f1f5f9" : "white",
                          color: "#475569",
                          fontSize: "18px",
                          fontWeight: "bold",
                          cursor: cakeWeight <= cake.baseWeight ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        -
                      </button>
                      <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", minWidth: "50px", textAlign: "center" }}>
                        {cakeWeight.toFixed(1)} Kg
                      </span>
                      <button 
                        onClick={() => setCakeWeight(w => Math.min(10.0, w + 0.5))}
                        disabled={cakeWeight >= 10.0}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          border: "1px solid #cbd5e1",
                          background: cakeWeight >= 10.0 ? "#f1f5f9" : "white",
                          color: "#475569",
                          fontSize: "18px",
                          fontWeight: "bold",
                          cursor: cakeWeight >= 10.0 ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Eggless Option */}
                  <div style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                    gap: "16px"
                  }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#16a34a", margin: "0 0 4px 0" }}>🟢 Make it Eggless (100% Veg)</h4>
                      <p style={{ margin: 0, fontSize: "11px", color: "#166534" }}>Opt for pure vegetarian egg-free cake baking. Adds ₹150 to total.</p>
                    </div>
                    <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                      <input 
                        type="checkbox" 
                        checked={eggless}
                        onChange={(e) => setEggless(e.target.checked)}
                        style={{
                          width: "22px",
                          height: "22px",
                          accentColor: "#16a34a",
                          cursor: "pointer"
                        }}
                      />
                    </label>
                  </div>

                  {/* Writing message input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
                    <label style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>🖋️ Text message on top of the Cake</label>
                    <input 
                      type="text" 
                      value={cakeText}
                      onChange={(e) => setCakeText(e.target.value)}
                      placeholder="e.g. Happy Birthday John! / Congrats!"
                      maxLength={50}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0f172a",
                        boxSizing: "border-box"
                      }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#64748b" }}>
                      <span>Limit: 50 characters</span>
                      <span>{cakeText.length} / 50</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "16px", marginTop: "24px" }}>
                  <button 
                    onClick={() => navigate("/client/catering")}
                    style={{
                      flex: 1,
                      padding: "14px 20px",
                      borderRadius: "12px",
                      border: "1px solid #cbd5e1",
                      background: "white",
                      color: "#475569",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSelectCake}
                    style={{
                      flex: 2,
                      padding: "14px 20px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#ea580c",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    Select & Save Cake
                  </button>
                </div>
              </div>

            </div>

            {/* Quality assurance box */}
            <div style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              gap: "16px",
              alignItems: "center"
            }}>
              <ShieldCheck size={32} className="text-blue-600" />
              <div>
                <h5 style={{ fontSize: "14px", fontWeight: "700", color: "#1e3a8a", margin: "0 0 4px 0" }}>Event Premium Quality Guarantee</h5>
                <p style={{ margin: 0, fontSize: "12px", color: "#1e40af", lineHeight: "1.5" }}>
                  All custom cakes are baked fresh on the day of the event by our elite certified pastry chef partners and delivered in refrigerated containers to maintain visual perfection.
                </p>
              </div>
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
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Saved!</h3>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Customized cake preferences successfully saved.</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default CakeDetails;
