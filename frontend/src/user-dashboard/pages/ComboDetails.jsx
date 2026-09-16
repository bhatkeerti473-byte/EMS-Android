import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Utensils, IndianRupee, Layers, ListChecks } from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const ComboDetails = () => {
  const navigate = useNavigate();
  const { comboId } = useParams();

  const combosData = {
    premium: {
      name: "Premium Combo",
      price: 250,
      description: "A delightful selection of popular favorites, perfect for cozy gatherings and celebrations.",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
      menu: {
        "Starters": [
          { name: "Veg Spring Roll", desc: "Crispy rolls stuffed with fresh spiced vegetables" },
          { name: "Hara Bhara Kabab", desc: "Healthy & delicious green vegetable patty kebab" },
          { name: "Cheese Corn Ball", desc: "Crispy outer layer with cheesy corn filling" },
          { name: "Pickle", desc: "Traditional mixed pickle with authentic taste" }
        ],
        "Main Course": [
          { name: "Paneer Butter Masala", desc: "Soft cottage cheese in rich, creamy tomato gravy" },
          { name: "Veg Kadai", desc: "Fresh mixed vegetables cooked in wok with spices" },
          { name: "Dal Makhani", desc: "Slow-cooked black lentils with cream & butter" }
        ],
        "Breads & Rice": [
          { name: "Butter Naan", desc: "Soft, leavened flatbread glazed with premium butter" },
          { name: "Jeera Rice", desc: "Aromatic basmati rice tempered with cumin seeds" }
        ],
        "Desserts & Drinks": [
          { name: "Gulab Jamun", desc: "Sweet, warm milk-solid dumplings in rose-scented syrup" },
          { name: "Vanilla Ice Cream", desc: "Classic premium vanilla bean ice cream" },
          { name: "Fresh Lime Soda", desc: "Refreshing sweet and salty lemon carbonated drink" }
        ]
      }
    },
    deluxe: {
      name: "Deluxe Combo",
      price: 350,
      description: "An enhanced menu spread offering more variety, catering to classic tastes with a touch of elegance.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
      menu: {
        "Starters": [
          { name: "Veg Spring Roll", desc: "Crispy rolls stuffed with fresh spiced vegetables" },
          { name: "Paneer Tikka", desc: "Cottage cheese cubes marinated in yogurt and grilled" },
          { name: "Hara Bhara Kabab", desc: "Healthy & delicious green vegetable patty kebab" },
          { name: "Cheese Corn Ball", desc: "Crispy outer layer with cheesy corn filling" },
          { name: "Veg Manchurian Dry", desc: "Indo-Chinese style vegetable dumplings tossed dry" },
          { name: "Pickle", desc: "Traditional mixed pickle with authentic taste" }
        ],
        "Main Course": [
          { name: "Paneer Butter Masala", desc: "Soft cottage cheese in rich, creamy tomato gravy" },
          { name: "Veg Kadai", desc: "Fresh mixed vegetables cooked in wok with spices" },
          { name: "Dal Makhani", desc: "Slow-cooked black lentils with cream & butter" },
          { name: "Mix Veg Curry", desc: "Assorted seasonal vegetables in onion gravy" }
        ],
        "Breads & Rice": [
          { name: "Butter Naan", desc: "Soft, leavened flatbread glazed with premium butter" },
          { name: "Tandoori Roti", desc: "Whole wheat round bread baked in clay oven" },
          { name: "Jeera Rice", desc: "Aromatic basmati rice tempered with cumin seeds" },
          { name: "Veg Pulav", desc: "Fragrant rice cooked with colorful seasonal vegetables" }
        ],
        "Desserts & Drinks": [
          { name: "Gulab Jamun", desc: "Sweet, warm milk-solid dumplings in rose-scented syrup" },
          { name: "Vanilla Ice Cream", desc: "Classic premium vanilla bean ice cream" },
          { name: "Rasgulla", desc: "Spongy cottage cheese balls soaked in light sugar syrup" },
          { name: "Fresh Lime Soda", desc: "Refreshing sweet and salty lemon carbonated drink" },
          { name: "Blue Lagoon Mocktail", desc: "Vibrant sweet and sour blue citrus mocktail" }
        ]
      }
    },
    royal: {
      name: "Royal Combo",
      price: 450,
      description: "A majestic feast featuring rich signature recipes and premium hospitality elements fit for royalty.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
      menu: {
        "Starters": [
          { name: "Paneer Tikka", desc: "Cottage cheese cubes marinated in yogurt and grilled" },
          { name: "Hara Bhara Kabab", desc: "Healthy & delicious green vegetable patty kebab" },
          { name: "Cheese Corn Ball", desc: "Crispy outer layer with cheesy corn filling" },
          { name: "Babycorn Satay", desc: "Skewered babycorn grilled and served with peanut dip" },
          { name: "Mushroom Tikka", desc: "Marinated mushrooms roasted in tandoor clay oven" },
          { name: "Pickle", desc: "Traditional mixed pickle with authentic taste" }
        ],
        "Main Course": [
          { name: "Shahi Paneer", desc: "Royal paneer dish in sweet, nutty white gravy" },
          { name: "Veg Kadai", desc: "Fresh mixed vegetables cooked in wok with spices" },
          { name: "Dal Makhani", desc: "Slow-cooked black lentils with cream & butter" },
          { name: "Malai Kofta", desc: "Fried paneer dumplings in rich creamy cashew sauce" },
          { name: "Veg Jalfrezi", desc: "Tangy stir-fried vegetables with capsicum and spices" }
        ],
        "Breads & Rice": [
          { name: "Butter Naan", desc: "Soft, leavened flatbread glazed with premium butter" },
          { name: "Garlic Naan", desc: "Naan topped with chopped garlic and coriander" },
          { name: "Butter Kulcha", desc: "Leavened flatbread stuffed with light potato spices" },
          { name: "Jeera Rice", desc: "Aromatic basmati rice tempered with cumin seeds" },
          { name: "Veg Biryani", desc: "Fragrant basmati rice slow-cooked with spices & herbs" }
        ],
        "Desserts & Drinks": [
          { name: "Gulab Jamun", desc: "Sweet, warm milk-solid dumplings in rose-scented syrup" },
          { name: "Rasmalai", desc: "Cottage cheese patties soaked in saffron milk syrup" },
          { name: "Vanilla Ice Cream", desc: "Classic premium vanilla bean ice cream" },
          { name: "Gajar Halwa", desc: "Slow-cooked sweet grated carrot pudding" },
          { name: "Fresh Lime Soda", desc: "Refreshing sweet and salty lemon carbonated drink" },
          { name: "Blue Lagoon Mocktail", desc: "Vibrant sweet and sour blue citrus mocktail" }
        ]
      }
    },
    luxury: {
      name: "Luxury Combo",
      price: 600,
      description: "The ultimate culinary extravaganza. Exquisite dishes, premium ingredients, and unlimited servings.",
      image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80",
      menu: {
        "Starters": [
          { name: "Special Paneer Tikka", desc: "Premium cottage cheese cubes with stuffed cheese, grilled" },
          { name: "Veg Spring Roll", desc: "Crispy rolls stuffed with fresh spiced vegetables" },
          { name: "Hara Bhara Kabab", desc: "Healthy & delicious green vegetable patty kebab" },
          { name: "Cheese Corn Ball", desc: "Crispy outer layer with cheesy corn filling" },
          { name: "Mushroom Tikka", desc: "Marinated mushrooms roasted in tandoor clay oven" },
          { name: "Veg Manchurian Dry", desc: "Indo-Chinese style vegetable dumplings tossed dry" },
          { name: "Paneer Malai Tikka", desc: "Mildly spiced grilled cottage cheese in cashew cream" },
          { name: "Pickle", desc: "Traditional mixed pickle with authentic taste" }
        ],
        "Main Course": [
          { name: "Paneer Tikka Masala", desc: "Tandoori paneer tikka tossed in spicy onion-tomato masala" },
          { name: "Veg Kadai", desc: "Fresh mixed vegetables cooked in wok with spices" },
          { name: "Dal Makhani", desc: "Slow-cooked black lentils with cream & butter" },
          { name: "Malai Kofta", desc: "Fried paneer dumplings in rich creamy cashew sauce" },
          { name: "Mix Veg Curry", desc: "Assorted seasonal vegetables in onion gravy" },
          { name: "Dum Aloo Kashmiri", desc: "Potato curry cooked in rich Kashmiri spices" }
        ],
        "Breads & Rice": [
          { name: "Butter Naan", desc: "Soft, leavened flatbread glazed with premium butter" },
          { name: "Garlic Naan", desc: "Naan topped with chopped garlic and coriander" },
          { name: "Missi Roti", desc: "Healthy chickpea flour flatbread with dry spices" },
          { name: "Laccha Paratha", desc: "Multi-layered crispy whole wheat flatbread" },
          { name: "Jeera Rice", desc: "Aromatic basmati rice tempered with cumin seeds" },
          { name: "Special Kashmiri Pulav", desc: "Sweet rice cooked with dry fruits and saffron" },
          { name: "Veg Biryani", desc: "Fragrant basmati rice slow-cooked with spices & herbs" }
        ],
        "Desserts & Drinks": [
          { name: "Gulab Jamun", desc: "Sweet, warm milk-solid dumplings in rose-scented syrup" },
          { name: "Rasgulla", desc: "Spongy cottage cheese balls soaked in light sugar syrup" },
          { name: "Vanilla Ice Cream", desc: "Classic premium vanilla bean ice cream" },
          { name: "Gajar Halwa", desc: "Slow-cooked sweet grated carrot pudding" },
          { name: "Premium Kulfi", desc: "Rich, dense traditional Indian frozen milk dessert" },
          { name: "Fresh Lime Soda", desc: "Refreshing sweet and salty lemon carbonated drink" },
          { name: "Blue Lagoon Mocktail", desc: "Vibrant sweet and sour blue citrus mocktail" }
        ]
      }
    },
    custom: {
      name: "Your Custom Menu Details",
      price: "Based on Selection",
      description: "A tailored selection of food items curated by you for your specific preferences. The final price varies dynamically based on the exact quantity and items selected.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
      menu: {
        "Starters": [
          { name: "Selected Starters", desc: "A customized assortment of appetizers and starter snacks" }
        ],
        "Main Course": [
          { name: "Selected Main Courses", desc: "A customized assortment of curries, lentils, rice and breads" }
        ],
        "Desserts & Drinks": [
          { name: "Selected Desserts & Drinks", desc: "A customized assortment of sweet treats, beverages, and mocktails" }
        ]
      }
    }
  };

  const getComboFromStored = () => {
    try {
      const stored = localStorage.getItem("admin_catering_packages");
      if (stored) {
        const parsed = JSON.parse(stored);
        const found = parsed.find(c => c.id === comboId);
        if (found) {
          return {
            name: found.name,
            price: found.price,
            type: found.type,
            description: found.description || found.desc || "Exquisite catering combo selection.",
            image: found.img || found.image || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
            menu: found.menu || {
              "Starters": [{ name: "Veg Spring Roll", desc: "Crispy rolls stuffed with vegetables" }, { name: "Paneer Tikka", desc: "Marinated cottage cheese grilled" }],
              "Main Course": [{ name: "Paneer Butter Masala", desc: "Soft cottage cheese in rich curry" }, { name: "Dal Makhani", desc: "Slow-cooked black lentils" }],
              "Breads & Rice": [{ name: "Butter Naan", desc: "Soft flatbread with butter" }, { name: "Jeera Rice", desc: "Aromatic cumin rice" }],
              "Desserts & Drinks": [{ name: "Gulab Jamun", desc: "Milk-solid dumplings in sweet syrup" }, { name: "Fresh Lime Soda", desc: "Refreshing lemon soda" }]
            }
          };
        }
      }
    } catch (e) {
      console.error(e);
    }
    const fallback = combosData[comboId || "premium"] || combosData.premium;
    if (fallback) {
      if (comboId === 'classic_veg' || comboId === 'grand_veg' || comboId === 'premium') {
        fallback.type = "Vegetarian";
      } else if (comboId === 'classic_nonveg' || comboId === 'grand_nonveg' || comboId === 'deluxe') {
        fallback.type = "Non-Vegetarian";
      } else {
        fallback.type = "Both";
      }
    }
    return fallback;
  };

  const combo = getComboFromStored();

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />
        
        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc" }}>
          
          <div className="back-nav-wrapper" style={{ padding: "20px 32px 0" }}>
            <button className="btn-nav-back" style={{ border: "none", background: "transparent", color: "#ea580c", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }} onClick={() => navigate("/client/catering")}>
              <ArrowLeft size={16} /> Back to Catering
            </button>
          </div>

          <div className="combo-detail-hero" style={{ padding: "20px 32px 32px", display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div className="combo-hero-img-box" style={{ flex: "1", minWidth: "300px", height: "300px", borderRadius: "16px", overflow: "hidden", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", position: "relative" }}>
              <img src={combo.image} alt={combo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {/* Veg / Non-Veg Symbol */}
              {combo.type === 'Vegetarian' && (
                <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10, border: "2px solid #16a34a", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "18px", height: "18px" }} title="Vegetarian">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#16a34a" }}></div>
                </div>
              )}
              {combo.type === 'Non-Vegetarian' && (
                <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10, border: "2px solid #dc2626", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "18px", height: "18px" }} title="Non-Vegetarian">
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#dc2626" }}></div>
                </div>
              )}
            </div>
            
            <div className="combo-hero-info-box" style={{ flex: "1.5", minWidth: "300px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px" }}>{combo.name}</h2>
              <div className="price-tag-badge" style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fff7ed", border: "1px solid #ffedd5", padding: "8px 16px", borderRadius: "8px", width: "max-content", margin: "0 0 16px" }}>
                <IndianRupee size={18} className="text-orange" style={{ color: "#ea580c" }} />
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#ea580c" }}>{combo.price}</span>
                <span style={{ fontSize: "13px", color: "#64748b" }}>/ Plate</span>
              </div>
              <p style={{ fontSize: "15px", color: "#475569", lineHeight: "1.6", margin: "0 0 24px" }}>{combo.description}</p>
              
              <div className="combo-quick-stats" style={{ display: "flex", gap: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={18} style={{ color: "#7e22ce" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>{Object.keys(combo.menu).length} Course Sections</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ListChecks size={18} style={{ color: "#16a34a" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    {Object.values(combo.menu).reduce((total, items) => total + items.length, 0)} Total Dishes
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="combo-menu-sections" style={{ padding: "0 32px 60px" }}>
            <h3 style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", margin: "0 0 24px", borderBottom: "2px solid #e2e8f0", paddingBottom: "12px" }}>
              Complete Course Menu Breakdown
            </h3>

            <div className="course-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
              {Object.entries(combo.menu).map(([courseName, items]) => (
                <div key={courseName} className="course-section-card" style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02)" }}>
                  <div className="course-header" style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                    <div style={{ background: "#f3e8ff", color: "#7e22ce", width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyCenter: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Utensils size={16} />
                    </div>
                    <h4 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0" }}>{courseName}</h4>
                    <span style={{ fontSize: "11px", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "20px", marginLeft: "auto", fontWeight: "600" }}>{items.length} Items</span>
                  </div>

                  <div className="course-items-list" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {items.map((item, idx) => (
                      <div key={idx} className="course-item" style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <CheckCircle2 size={16} style={{ color: "#16a34a", marginTop: "2px", flexShrink: "0" }} />
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{item.name}</div>
                          <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ComboDetails;
