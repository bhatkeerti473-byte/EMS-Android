import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, ArrowRight, X, Heart, Sparkles, Calendar, MapPin, Users, Building, Info, CheckCircle2, ShieldCheck, Sliders, Layers, Package, Settings2, Flower2, Gift, Filter, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";
import "../styles/Decoration.css";

const Decoration = () => {
  const navigate = useNavigate();

  // Top Summary Bar State (Loaded from localStorage with defaults)
  const [summaryData, setSummaryData] = useState({
    eventType: "Wedding",
    venueName: "Royal Grand Palace",
    hallType: "AC Hall",
    eventDate: "30 July 2026",
    guests: "300"
  });

  // Booking Mode: 'package' (Package First) or 'custom' (A-La-Carte selection)
  const [bookingMode, setBookingMode] = useState("package");

  // Package Flower Filter State: 'all', 'real', 'mixed'
  const [packageFlowerFilter, setPackageFlowerFilter] = useState("all");

  // Selected Package ID: 'classic', 'premium', 'royal', 'luxury', or null
  const [selectedPackage, setSelectedPackage] = useState("royal");

  // Option to expand individual options even when in package mode
  const [customizePackage, setCustomizePackage] = useState(false);

  // Section 1: Choose Flower Type (Required)
  const [flowerType, setFlowerType] = useState("real");

  // Section 2: Choose Decoration Theme
  const [selectedTheme, setSelectedTheme] = useState("royal");

  // Section 4: Stage Decoration Style
  const [stageStyle, setStageStyle] = useState("Royal Stage");

  // Section 5: Entrance Decoration
  const [entranceStyle, setEntranceStyle] = useState("Royal Gate");

  // Section 6: Backdrop Design
  const [backdropStyle, setBackdropStyle] = useState("LED Wall");

  // Section 7: Lighting Decoration (Multi-select)
  const [selectedLighting, setSelectedLighting] = useState(["Warm Lights", "Fairy Lights", "Spot Lights"]);

  // Section 8: Table Decoration
  const [tableStyle, setTableStyle] = useState("Candle Decoration");

  // Section 9: Ceiling Decoration
  const [ceilingStyle, setCeilingStyle] = useState("Crystal Decoration");

  // Section 10: Additional Decoration Items (Only active in Custom Mode or when customizing)
  const [selectedExtraItems, setSelectedExtraItems] = useState([]);

  // NEW: Wedding Specific Varmala / Garland Selection
  const [selectedVarmala, setSelectedVarmala] = useState("none");

  // NEW: Wedding Specific Bouquet Selection
  const [selectedBouquet, setSelectedBouquet] = useState("none");

  // Section 11: Decoration Notes
  const [notes, setNotes] = useState("• Use white & pink roses only\n• Add couple initials on stage\n• Theme color: Gold & Blush Pink");

  // Package Details Modal view state
  const [viewingPackageDetails, setViewingPackageDetails] = useState(null);

  // Modal / Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Load Initial Booking Summary Data from LocalStorage
  useEffect(() => {
    const savedEventType = localStorage.getItem("booking_event_type_title") || localStorage.getItem("booking_event_type_id") || "Wedding";
    const savedVenue = localStorage.getItem("booking_venue_name") || "Royal Grand Palace";
    const savedHall = localStorage.getItem("booking_hall_type") || "AC Hall";
    const savedDate = localStorage.getItem("booking_event_date") || "2026-07-30";
    const savedGuests = localStorage.getItem("booking_guest_count") || "300";

    let formattedDate = "30 July 2026";
    if (savedDate) {
      try {
        const d = new Date(savedDate + "T00:00:00");
        formattedDate = d.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
      } catch (e) {
        formattedDate = savedDate;
      }
    }

    setSummaryData({
      eventType: savedEventType.charAt(0).toUpperCase() + savedEventType.slice(1),
      venueName: savedVenue,
      hallType: savedHall,
      eventDate: formattedDate,
      guests: savedGuests
    });
  }, []);

  // Price Tables for Custom Build Mode
  const themePrices = {
    traditional: 35000,
    royal: 60000,
    classic: 30000,
    luxury: 80000,
    modern: 40000,
    floral_garden: 45000,
    vintage: 38000,
    minimal: 25000,
    outdoor_garden: 55000,
    premium_stage: 75000
  };

  const stagePrices = {
    "Round Stage": 15000,
    "Royal Stage": 25000,
    "Traditional Stage": 12000,
    "Floral Stage": 20000,
    "LED Stage": 30000,
    "Modern Stage": 18000
  };

  const entrancePrices = {
    "Flower Arch": 8000,
    "Balloon Arch": 5000,
    "Royal Gate": 15000,
    "LED Entrance": 12000,
    "Floral Tunnel": 18000
  };

  const backdropPrices = {
    "Flower Wall": 15000,
    "LED Wall": 20000,
    "Fabric Curtain": 8000,
    "Wooden Theme": 12000,
    "Printed Theme": 10000
  };

  const lightingPrices = {
    "Warm Lights": 3000,
    "Fairy Lights": 3000,
    "LED Lights": 4000,
    "Spot Lights": 4000,
    "Decorative Lamps": 5000
  };

  const tablePrices = {
    "Fresh Flowers": 6000,
    "Artificial Flowers": 3000,
    "Candle Decoration": 5000,
    "Glass Vase": 4000,
    "Premium Centerpiece": 8000
  };

  const ceilingPrices = {
    "Hanging Flowers": 12000,
    "Fabric Drapes": 6000,
    "Crystal Decoration": 18000,
    "Balloon Ceiling": 5000,
    "Fairy Lights": 8000
  };

  // Varmala / Garland Options
  const varmalaOptions = [
    { id: "rose_jasmine", name: "Rose & Jasmine Varmala (Jaimala Pair)", price: 3000, priceStr: "+₹3,000", desc: "Fresh red rose petals with fragrant white jasmine" },
    { id: "orchid_carnation", name: "Orchid & Carnation Royal Varmala", price: 4500, priceStr: "+₹4,500", desc: "Exotic purple orchids with white carnations" },
    { id: "pearl_redrose", name: "Pearl & Red Rose Royal Varmala", price: 6000, priceStr: "+₹6,000", desc: "Premium red roses interwoven with artificial pearl strings" },
    { id: "none", name: "No Varmala Needed", price: 0, priceStr: "₹0", desc: "Skip garland selection" }
  ];

  // Bridal Bouquet Options
  const bouquetOptions = [
    { id: "fresh_rose", name: "Fresh Red Rose Hand Bouquet", price: 1500, priceStr: "+₹1,500", desc: "Classic fresh red rose bouquet with baby breath fillers" },
    { id: "lily_orchid", name: "Exotic Lily & Orchid Bridal Bouquet", price: 2500, priceStr: "+₹2,500", desc: "Elegant white lilies and pink orchids" },
    { id: "royal_satin", name: "Royal Golden Satin Ribbon Bouquet", price: 3500, priceStr: "+₹3,500", desc: "Luxurious satin ribbon wrapped rose bouquet" },
    { id: "none", name: "No Bouquet Needed", price: 0, priceStr: "₹0", desc: "Skip bouquet selection" }
  ];

  // Preset configuration map when a Package is selected (resets extra items so ONLY package is selected)
  const applyPackagePresets = (pkgId) => {
    setSelectedPackage(pkgId);
    setBookingMode("package");
    setCustomizePackage(false);
    setSelectedExtraItems([]); // Clear extra items so package is standalone

    if (pkgId === "classic") {
      setFlowerType("mixed");
      setSelectedTheme("classic");
      setStageStyle("Traditional Stage");
      setEntranceStyle("Flower Arch");
      setBackdropStyle("Fabric Curtain");
      setSelectedLighting(["Warm Lights"]);
      setTableStyle("Fresh Flowers");
      setCeilingStyle("Fabric Drapes");
    } else if (pkgId === "premium") {
      setFlowerType("real");
      setSelectedTheme("floral_garden");
      setStageStyle("Floral Stage");
      setEntranceStyle("Floral Tunnel");
      setBackdropStyle("Flower Wall");
      setSelectedLighting(["Warm Lights", "LED Lights"]);
      setTableStyle("Premium Centerpiece");
      setCeilingStyle("Hanging Flowers");
    } else if (pkgId === "royal") {
      setFlowerType("real");
      setSelectedTheme("royal");
      setStageStyle("Royal Stage");
      setEntranceStyle("Royal Gate");
      setBackdropStyle("LED Wall");
      setSelectedLighting(["Warm Lights", "Fairy Lights", "Spot Lights"]);
      setTableStyle("Candle Decoration");
      setCeilingStyle("Crystal Decoration");
    } else if (pkgId === "luxury") {
      setFlowerType("real");
      setSelectedTheme("luxury");
      setStageStyle("LED Stage");
      setEntranceStyle("LED Entrance");
      setBackdropStyle("Flower Wall");
      setSelectedLighting(["Warm Lights", "Fairy Lights", "LED Lights", "Spot Lights", "Decorative Lamps"]);
      setTableStyle("Glass Vase");
      setCeilingStyle("Hanging Flowers");
    }
  };

  // Switch to Custom Build Mode
  const enableCustomBuildMode = () => {
    setBookingMode("custom");
    setSelectedPackage(null);
    setCustomizePackage(true);
    if (selectedExtraItems.length === 0) {
      setSelectedExtraItems(["Welcome Board", "Selfie Point"]);
    }
  };

  // Flower Type Options (Section 1)
  const flowerOptions = [
    {
      id: "real",
      name: "Real Flowers",
      badge: "100% Fresh 🌹",
      desc: "Fresh, aromatic real flower arrangements",
      price: 10000,
      img: "/decorations/decor_floral_pink.png"
    },
    {
      id: "artificial",
      name: "Artificial Flowers",
      badge: "Budget Friendly 🌸",
      desc: "High quality silk & synthetic floral decor",
      price: 4000,
      img: "/decorations/decor_greenery_sofa.png"
    },
    {
      id: "mixed",
      name: "Mixed (Real + Artificial)",
      badge: "Most Popular 🌼",
      desc: "Fresh stage flowers with durable backdrop decor",
      price: 7000,
      img: "/decorations/decor_luxury_table.jpg"
    }
  ];

  // Theme Cards Data (Section 2)
  const themeCards = [
    { id: "traditional", name: "Traditional", events: ["Wedding", "Engagement", "Anniversary"], desc: "Classic traditional look with marigolds and drapes", price: "₹35,000", img: "/decorations/decor_temple_mandap.png" },
    { id: "royal", name: "Royal", events: ["Wedding", "Engagement"], desc: "Grand royal palace theme with chandeliers & velvet", price: "₹60,000", img: "/decorations/decor_royal_gold.jpg" },
    { id: "classic", name: "Classic", events: ["Wedding", "Corporate", "Anniversary"], desc: "Timeless elegant styling with crisp drapes & warmth", price: "₹30,000", img: "/decorations/decor_greenery_sofa.png" },
    { id: "luxury", name: "Luxury", events: ["Wedding", "Engagement", "Corporate", "Anniversary"], desc: "Exotic imported flora, crystal, and designer accents", price: "₹80,000", img: "/decorations/decor_luxury_table.jpg" },
    { id: "modern", name: "Modern", events: ["Corporate", "Wedding", "Birthday", "Engagement", "Anniversary"], desc: "Geometric arches, neon accents & chic aesthetic", price: "₹40,000", img: "/decorations/decor_fairy_curtain.jpg" },
    { id: "floral_garden", name: "Floral Garden", events: ["Wedding", "Baby Shower", "Anniversary"], desc: "Lush botanical foliage, garden arches & blossoms", price: "₹45,000", img: "/decorations/decor_floral_pink.png" },
    { id: "cartoon", name: "Cartoon Theme", events: ["Birthday", "Baby Shower"], desc: "Fun cartoon themed balloon decor & selfie point", price: "₹25,000", img: "/decorations/decor_greenery_sofa.png" },
    { id: "company_branding", name: "Company Branding", events: ["Corporate"], desc: "Professional corporate stage and LED setup", price: "₹40,000", img: "/decorations/decor_grand_ballroom.jpg" },
    { id: "teddy_bear", name: "Teddy Bear Theme", events: ["Baby Shower", "Birthday"], desc: "Cute pastel teddy bear props and balloons", price: "₹30,000", img: "/decorations/decor_fairy_curtain.jpg" },
    { id: "romantic", name: "Romantic Theme", events: ["Anniversary", "Engagement"], desc: "Red roses, candles and romantic lighting", price: "₹35,000", img: "/decorations/decor_rustic_lanterns.jpg" }
  ].filter(theme => theme.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase())));

  // Package Cards Data with Prominently Highlighted Flower Badges & Colors
  const packageCards = [
    {
      id: "classic",
      name: "Classic Package",
      price: 25000,
      priceStr: "₹25,000",
      flowerCategory: "mixed",
      flowerBadge: "🌼 Mixed (Real + Artificial)",
      flowerBadgeBg: "#fef3c7",
      flowerBadgeColor: "#b45309",
      img: "/decorations/decor_greenery_sofa.png",
      desc: "Essential elegant venue decoration with mixed durable & fresh florals",
      stageDetail: "Traditional 20ft stage with fabric drapes & dual flower stands",
      entranceDetail: "Floral Arch welcome gate with mixed roses & marigolds",
      flowerComposition: "Mixed Flowers (Fresh Marigolds + High-grade Silk Roses)",
      included: ["Entrance Decoration", "Stage Decoration", "Basic Lighting", "Flower Stand", "Basic Backdrop"]
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 45000,
      priceStr: "₹45,000",
      flowerCategory: "real",
      flowerBadge: "🌹 100% Fresh Real Flowers",
      flowerBadgeBg: "#dcfce7",
      flowerBadgeColor: "#15803d",
      img: "/decorations/decor_rustic_lanterns.jpg",
      desc: "Upgraded 100% fresh real floral stage setup with welcome arch",
      stageDetail: "Floral Stage with 100% fresh flower pillars & wooden mandap",
      entranceDetail: "Floral Tunnel Entrance with fairy string lighting",
      flowerComposition: "100% Real Flowers (Red Roses, White Lilies & Carnations)",
      included: ["Premium Stage", "Fresh Flowers", "LED Lighting", "Welcome Arch", "Table Decoration"]
    },
    {
      id: "royal",
      name: "Royal Package",
      price: 75000,
      priceStr: "₹75,000",
      badge: "Popular ⭐",
      flowerCategory: "real",
      flowerBadge: "🌹 100% Fresh Real Flowers",
      flowerBadgeBg: "#dcfce7",
      flowerBadgeColor: "#15803d",
      img: "/decorations/decor_royal_gold.jpg",
      desc: "Regal palace theme with 100% fresh real flower ceiling & crystal decor",
      stageDetail: "Grand Royal Stage with multi-tier crystal chandeliers & golden sofa throne",
      entranceDetail: "Royal Carved Wooden Gate with ambient floodlights & welcome board",
      flowerComposition: "100% Fresh Real Flowers (Imported Orchids, Red Roses & Jasmine Garlands)",
      included: ["Royal Entrance", "Premium Stage", "Crystal Decoration", "Luxury Sofa", "Fresh Flower Ceiling", "Premium Lighting"]
    },
    {
      id: "luxury",
      name: "Luxury Package",
      price: 120000,
      priceStr: "₹1,20,000",
      flowerCategory: "real",
      flowerBadge: "🌹 100% Imported Fresh Flowers",
      flowerBadgeBg: "#fee2e2",
      flowerBadgeColor: "#b91c1c",
      img: "/decorations/decor_grand_ballroom.jpg",
      desc: "All-inclusive grand Victorian stage with imported fresh flora & LED wall",
      stageDetail: "Palatial Victorian Stage with high-res LED video wall & smoke machine",
      entranceDetail: "LED Illuminated Entrance Tunnel with fresh orchid floral arch",
      flowerComposition: "Exotic 100% Imported Fresh Flowers (Dutch Roses, Lilies, Orchids & Tulips)",
      included: ["Grand Entrance", "Imported Flowers", "Luxury Stage", "LED Wall", "Chandeliers", "Smoke Effects", "Premium Seating Decor"],
      events: ["Wedding", "Corporate", "Anniversary", "Engagement"]
    },
    {
      id: "kids_birthday",
      name: "Kids Birthday Package",
      price: 25000,
      priceStr: "₹25,000",
      flowerCategory: "artificial",
      flowerBadge: "🎈 Premium Balloons",
      flowerBadgeBg: "#fef3c7",
      flowerBadgeColor: "#b45309",
      img: "/decorations/decor_greenery_sofa.png",
      desc: "Complete birthday setup with balloons, cake table & selfie point",
      stageDetail: "Balloon Arch Stage with neon 'Happy Birthday' sign",
      entranceDetail: "Theme Balloon Entrance Gate",
      flowerComposition: "High quality latex & foil balloons",
      included: ["Balloon Entrance", "Cake Table", "Selfie Booth", "Confetti Machine"],
      events: ["Birthday"]
    },
    {
      id: "corporate_pro",
      name: "Corporate Pro Package",
      price: 45000,
      priceStr: "₹45,000",
      flowerCategory: "artificial",
      flowerBadge: "👔 Professional Decor",
      flowerBadgeBg: "#e0f2fe",
      flowerBadgeColor: "#0369a1",
      img: "/decorations/decor_grand_ballroom.jpg",
      desc: "Sleek professional setup with branding, podium & LED screens",
      stageDetail: "Minimalist Stage with LED Backdrop & Company Branding",
      entranceDetail: "Branded Welcome Standees & Registration Desk",
      flowerComposition: "Elegant artificial greens & minimal white florals",
      included: ["LED Screen", "Podium", "Registration Desk", "Professional Lighting"],
      events: ["Corporate"]
    }
  ].filter(pkg => pkg.events ? pkg.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase())) : true);

  // Options
  const stageOptions = [
    { name: "Round Stage", events: ["Wedding", "Anniversary"] },
    { name: "Royal Stage", events: ["Wedding", "Engagement"] },
    { name: "Traditional Stage", events: ["Wedding", "Anniversary"] },
    { name: "Floral Stage", events: ["Wedding", "Engagement", "Baby Shower"] },
    { name: "LED Stage", events: ["Wedding", "Corporate", "Birthday", "Anniversary", "Engagement"] },
    { name: "Modern Stage", events: ["Corporate", "Anniversary", "Engagement"] },
    { name: "Balloon Backdrop", events: ["Birthday", "Baby Shower"] },
    { name: "Neon Birthday Stage", events: ["Birthday"] },
    { name: "Professional Podium", events: ["Corporate"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase()))).map(opt => opt.name);

  const entranceOptions = [
    { name: "Flower Arch", events: ["Wedding", "Engagement", "Anniversary"] },
    { name: "Balloon Arch", events: ["Birthday", "Baby Shower"] },
    { name: "Royal Gate", events: ["Wedding"] },
    { name: "LED Entrance", events: ["Wedding", "Corporate", "Birthday"] },
    { name: "Floral Tunnel", events: ["Wedding", "Engagement"] },
    { name: "Theme Gate", events: ["Birthday", "Baby Shower"] },
    { name: "Welcome Standee", events: ["Corporate"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase()))).map(opt => opt.name);

  const backdropOptions = [
    { name: "Flower Wall", events: ["Wedding", "Engagement", "Baby Shower"] },
    { name: "LED Wall", events: ["Wedding", "Corporate", "Engagement", "Birthday"] },
    { name: "Fabric Curtain", events: ["Wedding", "Birthday", "Anniversary"] },
    { name: "Company Branding", events: ["Corporate"] },
    { name: "Happy Birthday Board", events: ["Birthday"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase()))).map(opt => opt.name);

  const lightingOptions = ["Warm Lights", "Fairy Lights", "LED Lights", "Spot Lights", "Decorative Lamps"];
  
  const tableOptions = [
    { name: "Fresh Flowers", events: ["Wedding", "Engagement", "Corporate", "Anniversary"] },
    { name: "Artificial Flowers", events: ["Wedding", "Corporate", "Birthday"] },
    { name: "Candle Decoration", events: ["Wedding", "Anniversary", "Engagement"] },
    { name: "Cake Table", events: ["Birthday", "Anniversary", "Baby Shower"] },
    { name: "Balloon Centerpieces", events: ["Birthday", "Baby Shower"] },
    { name: "Premium Centerpiece", events: ["Wedding", "Corporate"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase()))).map(opt => opt.name);

  const ceilingOptions = [
    { name: "Hanging Flowers", events: ["Wedding", "Engagement"] },
    { name: "Fabric Drapes", events: ["Wedding", "Anniversary", "Corporate"] },
    { name: "Crystal Decoration", events: ["Wedding", "Engagement"] },
    { name: "Balloon Ceiling", events: ["Birthday", "Baby Shower"] },
    { name: "Fairy Lights", events: ["Wedding", "Anniversary", "Birthday"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase()))).map(opt => opt.name);

  const extraItemsOptions = [
    { name: "Welcome Board", price: 1500, events: ["Wedding", "Engagement", "Baby Shower", "Birthday"] },
    { name: "Registration Desk", price: 3000, events: ["Corporate"] },
    { name: "Selfie Point", price: 3000, events: ["Wedding", "Birthday", "Engagement", "Anniversary"] },
    { name: "Photo Booth", price: 4000, events: ["Wedding", "Birthday", "Corporate"] },
    { name: "Flower Pathway", price: 3500, events: ["Wedding", "Engagement"] },
    { name: "Bride/Groom Sofa", price: 4000, events: ["Wedding", "Engagement"] },
    { name: "Cake Stand", price: 1000, events: ["Birthday", "Anniversary", "Baby Shower"] },
    { name: "Confetti Machine", price: 2000, events: ["Wedding", "Birthday"] },
    { name: "Smoke Machine", price: 3500, events: ["Wedding", "Corporate"] },
    { name: "Bubble Machine", price: 2500, events: ["Birthday", "Baby Shower"] }
  ].filter(opt => opt.events.some(e => summaryData.eventType.toLowerCase().includes(e.toLowerCase())));

  const toggleLighting = (item) => {
    if (selectedLighting.includes(item)) {
      setSelectedLighting(selectedLighting.filter(i => i !== item));
    } else {
      setSelectedLighting([...selectedLighting, item]);
    }
  };

  const toggleExtraItem = (itemName) => {
    if (selectedExtraItems.includes(itemName)) {
      setSelectedExtraItems(selectedExtraItems.filter(i => i !== itemName));
    } else {
      setSelectedExtraItems([...selectedExtraItems, itemName]);
    }
  };

  // Accurate Itemized Cost Helper Functions
  const getPackageCost = () => {
    if (bookingMode === "package" && selectedPackage) {
      const found = packageCards.find(p => p.id === selectedPackage);
      return found ? found.price : 75000;
    }
    return 0;
  };

  const getThemeCost = () => themePrices[selectedTheme] || 35000;
  const getFlowerCost = () => {
    const found = flowerOptions.find(f => f.id === flowerType);
    return found ? found.price : 10000;
  };
  const getStageCost = () => stagePrices[stageStyle] || 25000;
  const getEntranceCost = () => entrancePrices[entranceStyle] || 15000;
  const getBackdropCost = () => backdropPrices[backdropStyle] || 20000;
  const getLightingCost = () => selectedLighting.reduce((acc, item) => acc + (lightingPrices[item] || 3000), 0);
  const getTableCost = () => tablePrices[tableStyle] || 5000;
  const getCeilingCost = () => ceilingPrices[ceilingStyle] || 18000;

  const getVarmalaCost = () => {
    const found = varmalaOptions.find(v => v.id === selectedVarmala);
    return found ? found.price : 0;
  };

  const getBouquetCost = () => {
    const found = bouquetOptions.find(b => b.id === selectedBouquet);
    return found ? found.price : 0;
  };

  const getExtraItemsCost = () => {
    return selectedExtraItems.reduce((acc, itemName) => {
      const found = extraItemsOptions.find(opt => opt.name === itemName);
      return acc + (found ? found.price : 1500);
    }, 0);
  };

  // Grand Total Calculation: Accurately Sum ONLY Selected Items
  const decorationTotal = bookingMode === "package" && selectedPackage
    ? getPackageCost() + (customizePackage ? getExtraItemsCost() : 0) + getVarmalaCost() + getBouquetCost()
    : getThemeCost() + getFlowerCost() + getStageCost() + getEntranceCost() + getBackdropCost() + getLightingCost() + getTableCost() + getCeilingCost() + getVarmalaCost() + getBouquetCost() + getExtraItemsCost();

  const handleContinue = () => {
    localStorage.setItem("booking_decoration_mode", bookingMode);
    localStorage.setItem("booking_decoration_package", selectedPackage || "custom");
    localStorage.setItem("booking_flower_type", flowerType);
    localStorage.setItem("booking_decoration_theme", selectedTheme);
    localStorage.setItem("booking_stage_style", stageStyle);
    localStorage.setItem("booking_entrance_style", entranceStyle);
    localStorage.setItem("booking_backdrop_style", backdropStyle);
    localStorage.setItem("booking_lighting_styles", JSON.stringify(selectedLighting));
    localStorage.setItem("booking_table_style", tableStyle);
    localStorage.setItem("booking_ceiling_style", ceilingStyle);
    localStorage.setItem("booking_extra_items", JSON.stringify(bookingMode === "package" && !customizePackage ? [] : selectedExtraItems));
    localStorage.setItem("booking_varmala", selectedVarmala);
    localStorage.setItem("booking_bouquet", selectedBouquet);
    localStorage.setItem("booking_varmala_cost", getVarmalaCost().toString());
    localStorage.setItem("booking_bouquet_cost", getBouquetCost().toString());
    localStorage.setItem("booking_decoration_notes", notes);
    localStorage.setItem("booking_decoration_total", decorationTotal.toString());

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/catering");
    }, 1500);
  };

  const isWeddingEvent = summaryData.eventType.toLowerCase().includes("wedding") || summaryData.eventType.toLowerCase().includes("reception");

  const filteredPackageCards = packageCards.filter(pkg => {
    if (packageFlowerFilter === "all") return true;
    return pkg.flowerCategory === packageFlowerFilter;
  });

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Decoration Style" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#f8fafc", paddingBottom: "80px" }}>
          
          {/* Stepper Header Area */}
          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "57.142857142857146%", background: '#ea580c' }}></div>
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
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>4</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>5</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Decoration Style</div>
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

          <div className="decoration-page px-2 sm:px-8 pb-10">
            
            {/* TOP SUMMARY BAR */}
            <div style={{
              background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
              color: "white",
              padding: "18px 24px",
              borderRadius: "16px",
              boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.2)",
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "16px",
              marginBottom: "28px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Sparkles size={13} className="text-amber-400" /> Event
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "14px", color: "#f8fafc" }}>{summaryData.eventType}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Building size={13} className="text-sky-400" /> Venue
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "14px", color: "#f8fafc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{summaryData.venueName}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <ShieldCheck size={13} className="text-emerald-400" /> Hall Type
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "14px", color: "#f8fafc" }}>{summaryData.hallType}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={13} className="text-orange-400" /> Event Date
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "14px", color: "#f8fafc" }}>{summaryData.eventDate}</p>
              </div>
              <div>
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Users size={13} className="text-indigo-400" /> Guests
                </span>
                <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "14px", color: "#f8fafc" }}>{summaryData.guests} Guests</p>
              </div>
            </div>

            {/* Page Header */}
            <div className="dec-header" style={{ marginBottom: "20px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>Decoration Style & Package Selection</h2>
              <p style={{ fontSize: "14px", color: "#64748b" }}>Choose an all-inclusive Bundled Package or customize your decoration step-by-step</p>
            </div>

            {/* MODE SWITCHER TABS (PACKAGE FIRST VS CUSTOM BUILD) */}
            <div style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              background: "white",
              padding: "6px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              width: "fit-content"
            }}>
              <button
                type="button"
                className="hover-button-highlight"
                onClick={() => {
                  setBookingMode("package");
                  if (!selectedPackage) applyPackagePresets("royal");
                  else setCustomizePackage(false);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: bookingMode === "package" ? "#ea580c" : "transparent",
                  color: bookingMode === "package" ? "white" : "#475569",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Package size={16} /> Select Bundled Package (All Included)
              </button>
              <button
                type="button"
                className="hover-button-highlight"
                onClick={enableCustomBuildMode}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  border: "none",
                  background: bookingMode === "custom" ? "#ea580c" : "transparent",
                  color: bookingMode === "custom" ? "white" : "#475569",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <Settings2 size={16} /> Custom Build (Select Options Manually)
              </button>
            </div>

            {/* MAIN CONTENT LAYOUT GRID: Left Column Expanded (1fr), Right Cost Summary Sidebar Compact (340px) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "28px", alignItems: "start" }}>
              
              {/* Left Column (Expanded to give maximum width for decoration cards) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                
                {/* 1. DECORATION PACKAGE SELECTION (ONLY SHOWN IN BUNDLED PACKAGE MODE) */}
                {bookingMode === "package" && (
                  <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                      <div>
                        <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                          <Package className="text-orange-500" size={18} />
                          1. Decoration Packages
                        </h3>
                        <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0" }}>Highlighting 100% Real Fresh Flowers 🌹 and Mixed Flower Options 🌼</p>
                      </div>

                      {/* Flower Type Filter Pills */}
                      <div style={{ display: "flex", gap: "6px" }}>
                        {[
                          { id: "all", label: "All Packages" },
                          { id: "real", label: "🌹 Real Flowers" },
                          { id: "mixed", label: "🌼 Mixed Flowers" }
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            className="hover-button-highlight"
                            onClick={() => setPackageFlowerFilter(f.id)}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "14px",
                              fontSize: "11px",
                              fontWeight: "700",
                              border: packageFlowerFilter === f.id ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                              background: packageFlowerFilter === f.id ? "#fff7ed" : "white",
                              color: packageFlowerFilter === f.id ? "#c2410c" : "#64748b",
                              cursor: "pointer"
                            }}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                      {filteredPackageCards.map(pkg => {
                        const isSelected = selectedPackage === pkg.id && bookingMode === "package";
                        return (
                          <div
                            key={pkg.id}
                            className="hover-card-highlight"
                            style={{
                              border: isSelected ? "2px solid #ea580c" : "1px solid #e2e8f0",
                              borderRadius: "16px",
                              padding: "18px",
                              background: isSelected ? "#fff7ed" : "white",
                              position: "relative",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              boxShadow: isSelected ? "0 10px 25px rgba(234, 88, 12, 0.12)" : "none"
                            }}
                          >
                            {pkg.badge && (
                              <span style={{ position: "absolute", top: "-10px", right: "14px", background: "#ea580c", color: "white", fontSize: "10px", fontWeight: "800", padding: "2px 10px", borderRadius: "10px", zIndex: 3 }}>
                                {pkg.badge}
                              </span>
                            )}

                            <div>
                              {/* Card Image with PROMINENT FLOWER BADGE HIGHLIGHT */}
                              <div style={{ width: "100%", height: "150px", borderRadius: "12px", overflow: "hidden", marginBottom: "14px", position: "relative" }}>
                                <img src={pkg.img} alt={pkg.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                
                                {/* PROMINENT FLOWER BADGE */}
                                <div style={{
                                  position: "absolute",
                                  bottom: "10px",
                                  left: "10px",
                                  background: pkg.flowerBadgeBg,
                                  color: pkg.flowerBadgeColor,
                                  fontSize: "11px",
                                  fontWeight: "800",
                                  padding: "4px 12px",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  border: `1px solid ${pkg.flowerBadgeColor}33`
                                }}>
                                  {pkg.flowerBadge}
                                </div>
                              </div>

                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                                <h4 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{pkg.name}</h4>
                                <span style={{ fontSize: "17px", fontWeight: "900", color: "#ea580c" }}>{pkg.priceStr}</span>
                              </div>
                              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px", lineHeight: "1.4" }}>{pkg.desc}</p>

                              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                {pkg.included.map((item, i) => (
                                  <li key={i} style={{ fontSize: "12px", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Check size={14} className="text-emerald-600" strokeWidth={3} /> {item}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                              <button
                                type="button"
                                className="hover-button-highlight"
                                onClick={() => setViewingPackageDetails(pkg)}
                                style={{
                                  flex: 1,
                                  padding: "9px",
                                  borderRadius: "10px",
                                  border: "1px solid #cbd5e1",
                                  background: "white",
                                  color: "#475569",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  cursor: "pointer"
                                }}
                              >
                                View Details 🔍
                              </button>
                              <button
                                type="button"
                                className="hover-button-highlight"
                                onClick={() => applyPackagePresets(pkg.id)}
                                style={{
                                  flex: 1.2,
                                  padding: "9px",
                                  borderRadius: "10px",
                                  border: isSelected ? "none" : "1px solid #ea580c",
                                  background: isSelected ? "#ea580c" : "#fff7ed",
                                  color: isSelected ? "white" : "#c2410c",
                                  fontSize: "12px",
                                  fontWeight: "700",
                                  cursor: "pointer"
                                }}
                              >
                                {isSelected ? "✓ Selected Package" : "Select Package"}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Package Included Confirmation Box */}
                    {selectedPackage && (
                      <div style={{
                        marginTop: "20px",
                        backgroundColor: "#f0fdf4",
                        border: "1px solid #bbf7d0",
                        padding: "16px",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                        <div>
                          <h5 style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: "700", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
                            <CheckCircle2 size={16} /> All-Inclusive Package Activated ({packageCards.find(p => p.id === selectedPackage)?.name})
                          </h5>
                          <p style={{ margin: 0, fontSize: "12px", color: "#15803d" }}>
                            Flower Type: <strong>{packageCards.find(p => p.id === selectedPackage)?.flowerBadge}</strong> | Theme: <strong>{selectedTheme.toUpperCase()}</strong>
                          </p>
                        </div>
                        <button
                          type="button"
                          className="hover-button-highlight"
                          onClick={() => setCustomizePackage(!customizePackage)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #16a34a",
                            background: "white",
                            color: "#15803d",
                            fontSize: "11px",
                            fontWeight: "700",
                            cursor: "pointer",
                            whiteSpace: "nowrap"
                          }}
                        >
                          {customizePackage ? "Hide Custom Details ▲" : "Customize Elements ⚙️"}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* WEDDING SPECIFIC OPTIONS: VARMALA / JAIMALA & BRIDAL BOUQUET (WITH CARD HOVER HIGHLIGHT) */}
                {isWeddingEvent && (
                  <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #fed7aa", backgroundColor: "#fff7ed" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                      <Flower2 className="text-orange-600" size={20} />
                      <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#9a3412", margin: 0 }}>
                        Wedding Specials: Varmala & Bridal Bouquet
                      </h3>
                    </div>
                    <p style={{ fontSize: "12px", color: "#c2410c", marginBottom: "16px" }}>
                      Select fresh flower garlands (Jaimala) and bridal hand bouquets for the couple
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                      {/* Varmala Garland Selector */}
                      <div>
                        <label style={{ fontSize: "13px", fontWeight: "700", color: "#431407", display: "block", marginBottom: "8px" }}>
                          🌺 Wedding Garland Pair (Varmala / Jaimala)
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {varmalaOptions.map(v => (
                            <div
                              key={v.id}
                              className="hover-item-box"
                              onClick={() => setSelectedVarmala(v.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: selectedVarmala === v.id ? "2px solid #ea580c" : "1px solid #ffedd5",
                                background: selectedVarmala === v.id ? "#ffedd5" : "white",
                                cursor: "pointer"
                              }}
                            >
                              <div>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{v.name}</div>
                                <div style={{ fontSize: "11px", color: "#64748b" }}>{v.desc}</div>
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: "800", color: "#ea580c" }}>{v.priceStr}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bridal Bouquet Selector */}
                      <div>
                        <label style={{ fontSize: "13px", fontWeight: "700", color: "#431407", display: "block", marginBottom: "8px" }}>
                          💐 Bride & Groom Hand Bouquet
                        </label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {bouquetOptions.map(b => (
                            <div
                              key={b.id}
                              className="hover-item-box"
                              onClick={() => setSelectedBouquet(b.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                border: selectedBouquet === b.id ? "2px solid #ea580c" : "1px solid #ffedd5",
                                background: selectedBouquet === b.id ? "#ffedd5" : "white",
                                cursor: "pointer"
                              }}
                            >
                              <div>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{b.name}</div>
                                <div style={{ fontSize: "11px", color: "#64748b" }}>{b.desc}</div>
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: "800", color: "#ea580c" }}>{b.priceStr}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SHOW INDIVIDUAL SECTIONS & ADDITIONAL ITEMS ONLY IN CUSTOM MODE OR WHEN CUSTOMIZE BUTTON IS CLICKED */}
                {(bookingMode === "custom" || customizePackage) && (
                  <>
                    {/* 2. CHOOSE FLOWER TYPE (REQUIRED) */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        2. Choose Flower Type <span style={{ color: "#ef4444", fontSize: "12px" }}>(Required)</span>
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Select the quality and composition of floral arrangements</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                        {flowerOptions.map(opt => {
                          const isSelected = flowerType === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className="hover-card-highlight"
                              onClick={() => setFlowerType(opt.id)}
                              style={{
                                border: isSelected ? "2px solid #ea580c" : "1px solid #e2e8f0",
                                background: isSelected ? "#fff7ed" : "white",
                                borderRadius: "12px",
                                padding: "12px",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"
                              }}
                            >
                              <div>
                                <div style={{ width: "100%", height: "90px", borderRadius: "8px", overflow: "hidden", marginBottom: "8px" }}>
                                  <img src={opt.img} alt={opt.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                                <span style={{ fontSize: "10px", fontWeight: "700", color: "#c2410c", background: "#ffedd5", padding: "2px 6px", borderRadius: "4px" }}>
                                  {opt.badge}
                                </span>
                                <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "4px 0 2px" }}>{opt.name}</h4>
                                <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: "1.2" }}>{opt.desc}</p>
                              </div>
                              <div style={{ marginTop: "8px", fontSize: "12px", fontWeight: "800", color: "#ea580c", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>+₹{opt.price.toLocaleString("en-IN")}</span>
                                {isSelected && <CheckCircle2 size={16} className="text-emerald-600" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. CHOOSE DECORATION THEME (WITH HOVER CARD HIGHLIGHT) */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        3. Choose Decoration Theme
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Select a cohesive design theme for your venue ambiance</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                        {themeCards.map(theme => {
                          const isSelected = selectedTheme === theme.id;
                          return (
                            <div
                              key={theme.id}
                              className="hover-card-highlight"
                              style={{
                                border: isSelected ? "2px solid #ea580c" : "1px solid #e2e8f0",
                                borderRadius: "12px",
                                overflow: "hidden",
                                background: "white",
                                display: "flex",
                                flexDirection: "column"
                              }}
                            >
                              <div style={{ width: "100%", height: "130px", position: "relative", overflow: "hidden" }}>
                                <img src={theme.img} alt={theme.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <span style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(15, 23, 42, 0.75)", color: "white", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", fontWeight: "700" }}>
                                  {theme.price}
                                </span>
                              </div>
                              <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                <div>
                                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 2px" }}>{theme.name}</h4>
                                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: "1.3" }}>{theme.desc}</p>
                                </div>
                                <button
                                  type="button"
                                  className="hover-button-highlight"
                                  onClick={() => setSelectedTheme(theme.id)}
                                  style={{
                                    marginTop: "10px",
                                    width: "100%",
                                    padding: "6px",
                                    borderRadius: "6px",
                                    border: isSelected ? "none" : "1px solid #cbd5e1",
                                    background: isSelected ? "#ea580c" : "white",
                                    color: isSelected ? "white" : "#475569",
                                    fontWeight: "700",
                                    fontSize: "11px",
                                    cursor: "pointer"
                                  }}
                                >
                                  {isSelected ? "✓ Selected" : "Select Theme"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. STAGE DECORATION STYLE */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        4. Stage Decoration Style
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Choose one central stage geometry</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {stageOptions.map(opt => {
                          const isSelected = stageStyle === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => setStageStyle(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              {isSelected ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 5. ENTRANCE DECORATION */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        5. Entrance Decoration
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Choose welcoming entrance gate arch</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {entranceOptions.map(opt => {
                          const isSelected = entranceStyle === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => setEntranceStyle(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              {isSelected ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 6. BACKDROP DESIGN */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        6. Backdrop Design
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Choose stage background backdrop texture</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {backdropOptions.map(opt => {
                          const isSelected = backdropStyle === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => setBackdropStyle(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              {isSelected ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 7. LIGHTING DECORATION (MULTI-SELECT) */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        7. Lighting Decoration <span style={{ fontSize: "11px", color: "#ea580c", fontWeight: "600" }}>(Multiple allowed)</span>
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Select illumination types to enhance event mood</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {lightingOptions.map(opt => {
                          const isSelected = selectedLighting.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => toggleLighting(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px"
                              }}
                            >
                              {isSelected && <Check size={14} className="text-orange-600" strokeWidth={3} />}
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 8. TABLE DECORATION */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        8. Table Decoration
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Select guest & VIP banquet table centerpiece style</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {tableOptions.map(opt => {
                          const isSelected = tableStyle === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => setTableStyle(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              {isSelected ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 9. CEILING DECORATION */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        9. Ceiling Decoration
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "14px" }}>Select overhead ceiling hanging design</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                        {ceilingOptions.map(opt => {
                          const isSelected = ceilingStyle === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className="hover-button-highlight"
                              onClick={() => setCeilingStyle(opt)}
                              style={{
                                padding: "10px",
                                borderRadius: "8px",
                                border: isSelected ? "2px solid #ea580c" : "1px solid #cbd5e1",
                                background: isSelected ? "#fff7ed" : "white",
                                color: isSelected ? "#c2410c" : "#334155",
                                fontWeight: isSelected ? "700" : "600",
                                fontSize: "12px",
                                cursor: "pointer"
                              }}
                            >
                              {isSelected ? `✓ ${opt}` : opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* 10. ADDITIONAL DECORATION ITEMS (WITH HOVER ITEM HIGHLIGHT) */}
                    <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                        10. Additional Decoration Items <span style={{ fontSize: "11px", color: "#ea580c", fontWeight: "600" }}>({selectedExtraItems.length} Selected)</span>
                      </h3>
                      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "16px" }}>Check additional props and elements to include in your venue decoration total</p>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                        {extraItemsOptions.map(item => {
                          const isChecked = selectedExtraItems.includes(item.name);
                          return (
                            <div
                              key={item.name}
                              className="hover-item-box"
                              onClick={() => toggleExtraItem(item.name)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                border: isChecked ? "1.5px solid #ea580c" : "1px solid #cbd5e1",
                                background: isChecked ? "#fff7ed" : "#f8fafc",
                                cursor: "pointer"
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                  style={{ accentColor: "#ea580c", width: "16px", height: "16px", cursor: "pointer" }}
                                />
                                <span style={{ fontSize: "13px", fontWeight: "600", color: "#0f172a" }}>{item.name}</span>
                              </div>
                              <span style={{ fontSize: "12px", fontWeight: "700", color: "#ea580c" }}>+₹{item.price.toLocaleString("en-IN")}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}

                {/* 11. DECORATION NOTES */}
                <div style={{ background: "white", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", marginBottom: "4px" }}>
                    11. Decoration Notes
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "12px" }}>Enter any specific custom decoration instructions or color preferences</p>

                  <textarea
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter any custom decoration requirements...&#10;&#10;Example:&#10;• Use white roses only&#10;• Add couple initials on stage&#10;• Theme color: Blue & Gold"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      color: "#0f172a",
                      lineHeight: "1.6",
                      resize: "vertical"
                    }}
                  />
                </div>

                <EventSummaryFooter
                  icon={Sparkles}
                  overrides={{ decorationTotal }}
                  customDetails={
                    <span>Decoration Cost: <strong style={{ fontWeight: "600", color: "#475569" }}>₹{decorationTotal.toLocaleString()}</strong></span>
                  }
                />

                {/* Navigation Buttons */}
                <div className="bottom-navigation" style={{ marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                  <button className="btn-nav-back hover-button-highlight" onClick={() => navigate("/client/venue-details")}>
                    <ArrowLeft size={20} /> Back to Venue
                  </button>
                  <button className="btn-nav-continue hover-button-highlight" onClick={handleContinue}>
                    Continue to Catering <ArrowRight size={20} />
                  </button>
                </div>

              </div>

              {/* Right Column: 12. DECORATION COST SUMMARY (Clean Compact Sticky Sidebar: 340px) */}
              <div style={{ position: "sticky", top: "24px" }}>
                <div style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "18px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.06)"
                }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Sparkles size={18} className="text-orange-500" /> 12. Decoration Cost Summary
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "#475569" }}>
                    
                    {bookingMode === "package" && selectedPackage ? (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: "600" }}>Selected Package ({packageCards.find(p => p.id === selectedPackage)?.name})</span>
                          <span style={{ fontWeight: "800", color: "#0f172a" }}>₹{getPackageCost().toLocaleString("en-IN")}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Flower Type</span>
                          <span style={{ fontWeight: "700", color: "#16a34a", fontSize: "11px" }}>{packageCards.find(p => p.id === selectedPackage)?.flowerBadge}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Stage, Entrance, Backdrop & Lighting</span>
                          <span style={{ fontWeight: "700", color: "#16a34a", fontSize: "11px" }}>Included in Package</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* CUSTOM BUILD MODE: SHOW EXPLICIT INDIVIDUAL SELECTED ITEMS & COSTS */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Theme ({themeCards.find(t => t.id === selectedTheme)?.name || "Royal"})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getThemeCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Flower Type ({flowerOptions.find(f => f.id === flowerType)?.name})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getFlowerCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Stage Style ({stageStyle})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getStageCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Entrance Gate ({entranceStyle})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getEntranceCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Backdrop Design ({backdropStyle})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getBackdropCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Lighting ({selectedLighting.length} selected)</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getLightingCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Table Decor ({tableStyle})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getTableCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Ceiling Decor ({ceilingStyle})</span>
                          <span style={{ fontWeight: "700", color: "#0f172a" }}>₹{getCeilingCost().toLocaleString("en-IN")}</span>
                        </div>
                      </>
                    )}

                    {/* Wedding Varmala & Bouquet Addons Summary */}
                    {isWeddingEvent && (
                      <>
                        {selectedVarmala !== "none" && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Wedding Garlands ({varmalaOptions.find(v => v.id === selectedVarmala)?.name})</span>
                            <span style={{ fontWeight: "700", color: "#ea580c" }}>+₹{getVarmalaCost().toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        {selectedBouquet !== "none" && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Bridal Bouquet ({bouquetOptions.find(b => b.id === selectedBouquet)?.name})</span>
                            <span style={{ fontWeight: "700", color: "#ea580c" }}>+₹{getBouquetCost().toLocaleString("en-IN")}</span>
                          </div>
                        )}
                      </>
                    )}

                    {/* ITEMIZED ADDITIONAL DECORATION ITEMS (ONLY SHOW IF CUSTOM MODE OR CUSTOMIZING) */}
                    {(bookingMode === "custom" || customizePackage) && selectedExtraItems.length > 0 && (
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "700", color: "#0f172a", marginTop: "2px" }}>
                          <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px" }}>
                            <PlusCircle size={13} className="text-orange-500" /> Additional Add-ons ({selectedExtraItems.length})
                          </span>
                          <span style={{ color: "#ea580c", fontSize: "12px" }}>+₹{getExtraItemsCost().toLocaleString("en-IN")}</span>
                        </div>

                        <div style={{
                          background: "#fff7ed",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          border: "1px solid #ffedd5",
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px"
                        }}>
                          {selectedExtraItems.map(itemName => {
                            const itemObj = extraItemsOptions.find(opt => opt.name === itemName);
                            return (
                              <div key={itemName} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#7c2d12" }}>
                                <span>• {itemName}</span>
                                <span style={{ fontWeight: "700" }}>+₹{(itemObj ? itemObj.price : 1500).toLocaleString("en-IN")}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}

                    <hr style={{ border: "none", borderTop: "1px dashed #cbd5e1", margin: "6px 0" }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                      <span>Decoration Total</span>
                      <span style={{ fontSize: "19px", color: "#ea580c" }}>₹{decorationTotal.toLocaleString("en-IN")}</span>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="hover-button-highlight"
                    onClick={handleContinue}
                    style={{
                      marginTop: "16px",
                      width: "100%",
                      padding: "12px",
                      borderRadius: "10px",
                      border: "none",
                      background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 6px 16px rgba(234, 88, 12, 0.22)"
                    }}
                  >
                    Continue to Guest List <ArrowRight size={16} />
                  </button>

                  <div style={{ marginTop: "14px", background: "#f8fafc", padding: "10px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px", color: "#64748b", display: "flex", gap: "6px", alignItems: "start" }}>
                    <Info size={14} className="text-orange-500 shrink-0 mt-0.5" />
                    <span>Prices are inclusive of setup, transport, teardown, and staffing for your specified event venue.</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* VIEW DETAILS MODAL WITH ITEMIZED ONE-LINE DESCRIPTIONS & WEDDING GARLAND / BOUQUET OPTIONS */}
          {viewingPackageDetails && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(8px)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px"
            }}>
              <div style={{
                background: "white",
                borderRadius: "24px",
                maxWidth: "600px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                padding: "28px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
                position: "relative",
                border: "1px solid rgba(255, 255, 255, 0.8)"
              }}>
                <button
                  type="button"
                  onClick={() => setViewingPackageDetails(null)}
                  style={{ position: "absolute", top: "20px", right: "20px", background: "#f1f5f9", border: "none", borderRadius: "50%", padding: "8px", cursor: "pointer", color: "#475569" }}
                >
                  <X size={20} />
                </button>

                <div style={{ width: "100%", height: "220px", borderRadius: "16px", overflow: "hidden", marginBottom: "20px", position: "relative" }}>
                  <img src={viewingPackageDetails.img} alt={viewingPackageDetails.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  
                  {/* PROMINENT FLOWER BADGE IN MODAL */}
                  <div style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    background: viewingPackageDetails.flowerBadgeBg,
                    color: viewingPackageDetails.flowerBadgeColor,
                    fontSize: "12px",
                    fontWeight: "800",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                  }}>
                    {viewingPackageDetails.flowerBadge}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{viewingPackageDetails.name}</h3>
                  <span style={{ fontSize: "20px", fontWeight: "900", color: "#ea580c" }}>{viewingPackageDetails.priceStr}</span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>{viewingPackageDetails.desc}</p>

                {/* DETAILED ONE-LINE ITEM DESCRIPTIONS */}
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Info size={16} className="text-orange-500" /> Package Specifications & Inclusions
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", color: "#334155" }}>
                    <div style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px" }}>
                      <strong style={{ color: "#0f172a" }}>🏛️ Stage Setup:</strong> {viewingPackageDetails.stageDetail}
                    </div>
                    <div style={{ borderBottom: "1px dashed #e2e8f0", paddingBottom: "8px" }}>
                      <strong style={{ color: "#0f172a" }}>🚪 Entrance Arch:</strong> {viewingPackageDetails.entranceDetail}
                    </div>
                    <div>
                      <strong style={{ color: "#0f172a" }}>🌸 Flower Composition:</strong> {viewingPackageDetails.flowerComposition}
                    </div>
                  </div>
                </div>

                {/* WEDDING SPECIFICS INSIDE MODAL */}
                {isWeddingEvent && (
                  <div style={{ background: "#fff7ed", padding: "16px", borderRadius: "14px", border: "1px solid #fed7aa", marginBottom: "20px" }}>
                    <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#9a3412", margin: "0 0 12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Flower2 size={16} className="text-orange-600" /> Wedding Garlands & Bouquet Selections
                    </h4>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#431407", display: "block", marginBottom: "4px" }}>
                          🌺 Garland Pair (Varmala)
                        </label>
                        <select
                          value={selectedVarmala}
                          onChange={(e) => setSelectedVarmala(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #fdba74", fontSize: "12px", background: "white", color: "#0f172a", fontWeight: "600" }}
                        >
                          {varmalaOptions.map(v => (
                            <option key={v.id} value={v.id}>{v.name} ({v.priceStr})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: "11px", fontWeight: "700", color: "#431407", display: "block", marginBottom: "4px" }}>
                          💐 Bridal Bouquet
                        </label>
                        <select
                          value={selectedBouquet}
                          onChange={(e) => setSelectedBouquet(e.target.value)}
                          style={{ width: "100%", padding: "8px", borderRadius: "8px", border: "1px solid #fdba74", fontSize: "12px", background: "white", color: "#0f172a", fontWeight: "600" }}
                        >
                          {bouquetOptions.map(b => (
                            <option key={b.id} value={b.id}>{b.name} ({b.priceStr})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="hover-button-highlight"
                  onClick={() => {
                    applyPackagePresets(viewingPackageDetails.id);
                    setViewingPackageDetails(null);
                  }}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
                    color: "white",
                    fontWeight: "800",
                    fontSize: "15px",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(234, 88, 12, 0.25)"
                  }}
                >
                  Select & Confirm {viewingPackageDetails.name}
                </button>
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
                <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Decoration configuration saved!</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Decoration;
