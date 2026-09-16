import React, { useState, useEffect } from "react";
import { Check, ArrowLeft, ArrowRight, CheckCircle2, Info, Leaf, Upload, FileText, Minus, Plus, Utensils, X, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const cakeOptions = [
  { id: 'none', name: 'No Cake Needed', price: 0, desc: 'Do not include a customized celebration cake.', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80' },
  { id: 'cake-choc', name: 'Premium Chocolate Truffle (1.5 Kg)', price: 1200, desc: 'Rich Belgian chocolate layers with truffle frosting.', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400&q=80' },
  { id: 'cake-red', name: 'Luxury Red Velvet (1.5 Kg)', price: 1500, desc: 'Classic red velvet base with cream cheese frosting.', img: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=400&q=80' },
  { id: 'cake-butter', name: 'Butterscotch Caramel (2 Kg)', price: 1800, desc: 'Crunchy butterscotch praline with gold caramel drizzle.', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80' },
  { id: 'cake-vanilla', name: 'Strawberry Vanilla Bliss (1.5 Kg)', price: 1000, desc: 'Sponge cake layered with fresh strawberry compote.', img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=400&q=80' },
  { id: 'cake-3tier', name: 'Royal 3-Tier Celebrations Cake (5 Kg)', price: 5000, desc: 'Stunning three-tiered design customized for weddings or major events.', img: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=400&q=80' }
];

const Catering = () => {
  const navigate = useNavigate();
  const [foodType, setFoodType] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [plates, setPlates] = useState(() => {
    const savedCount = localStorage.getItem("booking_guest_count");
    return savedCount ? Number(savedCount) : 250;
  });
  const [combo, setCombo] = useState('');
  const [activeTab, setActiveTab] = useState('Starter');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [customMenuTab, setCustomMenuTab] = useState('Starters');
  const [customQuantities, setCustomQuantities] = useState({});

  const [showAllItemsModal, setShowAllItemsModal] = useState(false);
  const [allItemsFilterTab, setAllItemsFilterTab] = useState("All");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  const [selectedCake, setSelectedCake] = useState(() => {
    const savedCake = localStorage.getItem("booking_cake_name");
    if (savedCake) {
      const match = cakeOptions.find(c => c.name === savedCake);
      return match ? match.id : 'none';
    }
    return 'none';
  });

  const [cakeText, setCakeText] = useState(() => {
    return localStorage.getItem("booking_cake_text") || '';
  });

  const [cakeEggless, setCakeEggless] = useState(() => {
    return localStorage.getItem("booking_cake_eggless") === "Yes";
  });

  const [cakeWeight, setCakeWeight] = useState(() => {
    return localStorage.getItem("booking_cake_weight") || '';
  });

  const handleCakeSelect = (cakeId) => {
    setSelectedCake(cakeId);
    if (cakeId === 'none') {
      setCakeEggless(false);
      setCakeText('');
      setCakeWeight('');
      localStorage.removeItem("booking_cake_name");
      localStorage.removeItem("booking_cake_price");
      localStorage.removeItem("booking_cake_text");
      localStorage.removeItem("booking_cake_eggless");
      localStorage.removeItem("booking_cake_weight");
    } else {
      const savedCakeName = localStorage.getItem("booking_cake_name");
      const cake = cakeOptions.find(c => c.id === cakeId);
      if (cake && savedCakeName !== cake.name) {
        setCakeEggless(false);
        setCakeText('');
        setCakeWeight('');
      }
    }
  };

  const getCombos = () => {
    const stored = localStorage.getItem("admin_catering_packages");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length >= 6) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse admin_catering_packages", e);
      }
    }

    const defaultCombos = [
      { id: 'classic_veg', name: "Classic Veg Combo", price: 180, popular: false, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80", type: "Vegetarian", description: "Standard vegetarian menu with essential items.", minPlates: 50, maxPlates: 300, status: "Available", customMenu: true },
      { id: 'premium', name: "Premium Combo", price: 250, popular: true, img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80", type: "Vegetarian", description: "Delicious vegetarian combo with premium items.", minPlates: 50, maxPlates: 500, status: "Available", customMenu: true },
      { id: 'grand_veg', name: "Grand Veg Combo", price: 400, popular: false, img: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=400&q=80", type: "Vegetarian", description: "Luxury vegetarian banquet with exotic dishes.", minPlates: 80, maxPlates: 1000, status: "Available", customMenu: true },
      { id: 'classic_nonveg', name: "Classic Non-Veg Combo", price: 280, popular: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80", type: "Non-Vegetarian", description: "Standard non-vegetarian selection for all gatherings.", minPlates: 50, maxPlates: 400, status: "Available", customMenu: true },
      { id: 'deluxe', name: "Deluxe Combo", price: 350, popular: false, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80", type: "Non-Vegetarian", description: "Perfect non-vegetarian package for all events.", minPlates: 50, maxPlates: 800, status: "Available", customMenu: true },
      { id: 'grand_nonveg', name: "Grand Non-Veg Combo", price: 500, popular: false, img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80", type: "Non-Vegetarian", description: "Premium non-vegetarian buffet with elite main courses.", minPlates: 80, maxPlates: 1200, status: "Available", customMenu: true },
      { id: 'royal', name: "Royal Combo", price: 450, popular: false, img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80", type: "Both", description: "Best of both veg and non-veg cuisines.", minPlates: 100, maxPlates: 1000, status: "Available", customMenu: true },
      { id: 'luxury', name: "Luxury Combo", price: 600, popular: false, img: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=400&q=80", type: "Both", description: "Wide range of cuisines in buffet style.", minPlates: 100, maxPlates: 1500, status: "Available", customMenu: true }
    ];

    localStorage.setItem("admin_catering_packages", JSON.stringify(defaultCombos));
    return defaultCombos;
  };

  const combos = getCombos().filter(c => {
    if (c.status !== 'Available') return false;
    if (foodType === 'veg') {
      return c.type === 'Vegetarian';
    } else if (foodType === 'nonveg') {
      return c.type === 'Non-Vegetarian';
    } else if (foodType === 'both') {
      return true;
    }
    return true; // When foodType is empty (Select Option), show all combos
  });

  const menuItems = {
    'Starter': [
      { name: 'Veg Spring Roll', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=150&q=80' },
      { name: 'Paneer Tikka', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=150&q=80' },
      { name: 'Hara Bhara Kabab', img: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=150&q=80' },
      { name: 'Cheese Corn Ball', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=150&q=80' },
      { name: 'Veg Manchurian Dry', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=150&q=80' },
      { name: 'Pickle', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=150&q=80' }
    ],
    'Main Course': [
      { name: 'Paneer Butter Masala', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=150&q=80' },
      { name: 'Veg Kadai', img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=150&q=80' },
      { name: 'Dal Makhani', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=150&q=80' }
    ],
    'Rice': [
      { name: 'Jeera Rice', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=150&q=80' },
      { name: 'Veg Biryani', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=150&q=80' }
    ],
    'Bread': [
      { name: 'Butter Naan', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80' },
      { name: 'Tandoori Roti', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=150&q=80' }
    ],
    'Dessert': [
      { name: 'Gulab Jamun', img: 'https://images.unsplash.com/photo-1622313762347-3c09fe5f2719?auto=format&fit=crop&w=150&q=80' },
      { name: 'Vanilla Ice Cream', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=150&q=80' }
    ],
    'Drinks': [
      { name: 'Fresh Lime Soda', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=150&q=80' },
      { name: 'Blue Lagoon Mocktail', img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=150&q=80' }
    ],
    'Others': [
      { name: 'Green Salad', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80' },
      { name: 'Masala Papad', img: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=150&q=80' }
    ]
  };

  const getCustomSidebarItems = () => {
    // Define all standard base items
    const baseItemsList = [
      // Starters
      { id: 's1', name: 'Pickle', category: 'Starters', desc: 'Mixed pickle with authentic homemade taste', price: 30, type: 'Both', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=100&q=80' },
      { id: 's2', name: 'Paneer Tikka', category: 'Starters', desc: 'Cottage cheese marinated with spices & grilled', price: 60, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=100&q=80' },
      { id: 's3', name: 'Veg Spring Roll', category: 'Starters', desc: 'Crispy rolls stuffed with vegetables', price: 40, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=100&q=80' },
      { id: 's4', name: 'Hara Bhara Kabab', category: 'Starters', desc: 'Healthy & delicious green kebab', price: 45, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=100&q=80' },
      { id: 's5', name: 'Cheese Corn Ball', category: 'Starters', desc: 'Crispy cheesy corn balls served hot', price: 50, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=100&q=80' },
      { id: 's6', name: 'Veg Manchurian Dry', category: 'Starters', desc: 'Indo-chinese style veg manchurian', price: 50, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=100&q=80' },
      { id: 's_nv1', name: 'Chicken Tikka', category: 'Starters', desc: 'Spiced chicken chunks grilled in tandoor', price: 80, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=100&q=80' },
      { id: 's_nv2', name: 'Fish Amritsari', category: 'Starters', desc: 'Crispy batter-fried fish spiced with carom seeds', price: 95, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=100&q=80' },
      { id: 's_nv3', name: 'Mutton Seekh Kebab', category: 'Starters', desc: 'Skewered minced mutton kebabs cooked in tandoor', price: 120, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=100&q=80' },
      { id: 's_nv4', name: 'Chicken Lollipop', category: 'Starters', desc: 'Deep-fried chicken wings served with hot garlic sauce', price: 85, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=100&q=80' },
      
      // Rice & Breads
      { id: 'r1', name: 'Hyderabadi Chicken Biryani', category: 'Rice & Breads', desc: 'Authentic rich dum biryani with saffron & chicken', price: 175, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&q=80' },
      { id: 'r2', name: 'Jeera Basmati Rice', category: 'Rice & Breads', desc: 'Aromatic basmati rice tempered with cumin & ghee', price: 70, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=100&q=80' },
      { id: 'r3', name: 'Butter Naan', category: 'Rice & Breads', desc: 'Soft and fluffy tandoori flatbread with butter', price: 20, type: 'Both', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=100&q=80' },
      { id: 'r4', name: 'Veg Dum Biryani', category: 'Rice & Breads', desc: 'Fragrant basmati rice cooked with fresh veggies', price: 120, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=100&q=80' },
      
      // Main Course
      { id: 'm1', name: 'Paneer Butter Masala', category: 'Main Course', desc: 'Rich and creamy paneer curry cooked in tomato gravy', price: 120, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=100&q=80' },
      { id: 'm2', name: 'Veg Kadai', category: 'Main Course', desc: 'Mixed vegetables cooked with freshly ground spices', price: 110, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=100&q=80' },
      { id: 'm3', name: 'Dal Makhani', category: 'Main Course', desc: 'Slow cooked black lentils with cream and butter', price: 90, type: 'Vegetarian', img: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=100&q=80' },
      { id: 'm4', name: 'Butter Naan', category: 'Main Course', desc: 'Soft and fluffy flatbread with butter', price: 20, type: 'Both', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=100&q=80' },
      { id: 'm5', name: 'Jeera Rice', category: 'Main Course', desc: 'Aromatic basmati rice tempered with cumin seeds', price: 70, type: 'Both', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=100&q=80' },
      { id: 'm_nv1', name: 'Chicken Butter Masala', category: 'Main Course', desc: 'Tender chicken cooked in rich buttery tomato gravy', price: 150, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=100&q=80' },
      { id: 'm_nv2', name: 'Mutton Rogan Josh', category: 'Main Course', desc: 'Slow-cooked mutton curry in traditional aromatic spices', price: 185, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=100&q=80' },
      { id: 'm_nv3', name: 'Chicken Biryani', category: 'Main Course', desc: 'Aromatic basmati rice cooked with spiced chicken and herbs', price: 140, type: 'Non-Vegetarian', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=100&q=80' },
      
      // Desserts
      { id: 'd1', name: 'Gulab Jamun', category: 'Desserts', desc: 'Sweet milk-solid balls dipped in sugar syrup', price: 50, type: 'Both', img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=100&q=80' },
      { id: 'd2', name: 'Rasgulla', category: 'Desserts', desc: 'Soft and spongy cottage cheese dumplings', price: 45, type: 'Both', img: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?auto=format&fit=crop&w=100&q=80' },
      { id: 'd3', name: 'Vanilla Ice Cream', category: 'Desserts', desc: 'Classic rich vanilla bean ice cream', price: 40, type: 'Both', img: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=100&q=80' },
      
      // Drinks
      { id: 'dr1', name: 'Fresh Lime Soda', category: 'Drinks', desc: 'Refreshing carbonated lime drink', price: 30, type: 'Both', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=100&q=80' },
      { id: 'dr2', name: 'Blue Lagoon Mocktail', category: 'Drinks', desc: 'Sweet and tangy citrus mocktail', price: 60, type: 'Both', img: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=100&q=80' },
      { id: 'dr3', name: 'Soft Drink', category: 'Drinks', desc: 'Chilled soft drink (cola/orange/lime)', price: 25, type: 'Both', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=100&q=80' },
      
      // Others
      { id: 'o1', name: 'Green Salad', category: 'Others', desc: 'Fresh cucumber, tomato, onion and carrot slices', price: 30, type: 'Both', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80' },
      { id: 'o2', name: 'Masala Papad', category: 'Others', desc: 'Crispy papad topped with onions, tomatoes & spices', price: 15, type: 'Both', img: 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&w=100&q=80' }
    ];

    const defaultItems = [
      { id: 'cust-1', name: 'Malai Paneer Tikka', category: 'Starters', price: 65, type: 'Vegetarian', desc: 'Creamy marinated cottage cheese cubes grilled in tandoor', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-2', name: 'Chicken Biryani Special', category: 'Main Course', price: 175, type: 'Non-Vegetarian', desc: 'Authentic Hyderabadi dum biryani served with raita', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-3', name: 'Mango Lassi Mocktail', category: 'Drinks', price: 45, type: 'Vegetarian', desc: 'Thick creamy mango yogurt smoothie with cardamom', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-4', name: 'Gulab Jamun with Rabri', category: 'Desserts', price: 55, type: 'Vegetarian', desc: 'Hot gulab jamun served with thick rich rabri', img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=400&q=80' }
    ];

    const storedAdminItems = localStorage.getItem("admin_custom_menu_items");
    let itemsList = [];
    if (storedAdminItems) {
      try {
        itemsList = JSON.parse(storedAdminItems);
      } catch (e) {
        console.error(e);
      }
    }

    const hasBaseItems = itemsList.some(item => item.id.startsWith('s') || item.id.startsWith('r') || item.id.startsWith('m') || item.id.startsWith('d') || item.id.startsWith('o'));

    if (!hasBaseItems) {
      itemsList = [...itemsList];
      baseItemsList.forEach(baseItem => {
        if (!itemsList.some(item => item.name.toLowerCase() === baseItem.name.toLowerCase())) {
          itemsList.push(baseItem);
        }
      });
      if (itemsList.length === baseItemsList.length) {
        defaultItems.forEach(defItem => {
          if (!itemsList.some(item => item.name.toLowerCase() === defItem.name.toLowerCase())) {
            itemsList.unshift(defItem);
          }
        });
      }
      localStorage.setItem("admin_custom_menu_items", JSON.stringify(itemsList));
    }

    const baseItems = {
      'Starters': [],
      'Rice & Breads': [],
      'Main Course': [],
      'Desserts': [],
      'Drinks': [],
      'Others': []
    };

    itemsList.forEach(item => {
      const cat = item.category || 'Starters';
      if (!baseItems[cat]) baseItems[cat] = [];
      baseItems[cat].push({
        id: item.id,
        name: item.name,
        desc: item.desc || 'Special custom dish added by catering management',
        price: item.price,
        type: item.type || 'Vegetarian',
        img: item.img || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=100&q=80'
      });
    });

    return baseItems;
  };

  const getFilteredCustomSidebarItems = () => {
    const items = getCustomSidebarItems();
    const filtered = {};
    Object.keys(items).forEach(cat => {
      filtered[cat] = items[cat].filter(item => {
        const itemType = item.type || 'Vegetarian';
        if (foodType === 'veg') {
          return itemType === 'Vegetarian' || itemType === 'Both';
        } else if (foodType === 'nonveg') {
          return itemType === 'Non-Vegetarian' || itemType === 'Both';
        } else if (foodType === 'both') {
          return true;
        }
        return true;
      });
    });
    return filtered;
  };

  const customSidebarItems = getFilteredCustomSidebarItems();

  const handleCustomQtyChange = (itemId, isIncrement) => {
    setCombo('custom'); // Automatically switch to custom combo when adding custom items
    setCustomQuantities(prev => {
      const currentQty = prev[itemId] || 0;
      const newQty = isIncrement ? currentQty + 1 : Math.max(0, currentQty - 1);
      return { ...prev, [itemId]: newQty };
    });
  };

  const handlePlateChange = (change) => {
    const newCount = plates + change;
    if (newCount >= 50) {
      setPlates(newCount);
      localStorage.setItem("booking_guest_count", newCount.toString());
    }
  };

  const getCustomComboPrice = () => {
    let totalRate = 0;
    Object.keys(customSidebarItems).forEach(cat => {
      customSidebarItems[cat].forEach(item => {
        totalRate += item.price * (customQuantities[item.id] || 0);
      });
    });
    return totalRate;
  };

  const getComboPrice = () => {
    if (combo === 'custom') {
      return getCustomComboPrice();
    }
    const selected = combos.find(c => c.id === combo);
    return selected ? selected.price : 0;
  };

  const getComboName = () => {
    if (combo === 'custom') {
      return "Custom Combo";
    }
    const selected = combos.find(c => c.id === combo);
    return selected ? selected.name : '';
  };

  const getCakePrice = () => {
    const cake = cakeOptions.find(c => c.id === selectedCake);
    if (!cake || cake.id === 'none') return 0;

    const savedCakeName = localStorage.getItem("booking_cake_name");
    const savedCakePrice = Number(localStorage.getItem("booking_cake_price")) || 0;
    if (savedCakeName === cake.name && savedCakePrice > 0) {
      return savedCakePrice;
    }
    return cake.price;
  };

  const getCakeName = () => {
    const cake = cakeOptions.find(c => c.id === selectedCake);
    return cake ? cake.name : 'None';
  };

  const getCakeDisplayName = () => {
    const cake = cakeOptions.find(c => c.id === selectedCake);
    if (!cake) return 'None';
    if (cake.id === 'none') return cake.name;

    const savedCakeName = localStorage.getItem("booking_cake_name");
    const savedCakeWeight = localStorage.getItem("booking_cake_weight");
    if (savedCakeName === cake.name && savedCakeWeight) {
      const baseName = cake.name.replace(/\s*\([\d.]+\s*Kg\)/i, "");
      return `${baseName} (${Number(savedCakeWeight).toFixed(1)} Kg)`;
    }

    if (cakeWeight) {
      const baseName = cake.name.replace(/\s*\([\d.]+\s*Kg\)/i, "");
      return `${baseName} (${Number(cakeWeight).toFixed(1)} Kg)`;
    }
    return cake.name;
  };

  const totalAmount = (getComboPrice() * plates) + getCakePrice();

  const getCurrentMenuItems = () => {
    if (combo !== 'custom') {
      return menuItems[activeTab] || [];
    }
    let categoryKey = activeTab;
    if (activeTab === 'Starter') categoryKey = 'Starters';
    if (activeTab === 'Dessert') categoryKey = 'Desserts';
    const items = customSidebarItems[categoryKey] || [];
    return items.filter(item => (customQuantities[item.id] || 0) > 0);
  };

  // Sync selected combo when foodType changes
  useEffect(() => {
    const availableCombos = getCombos().filter(c => {
      if (c.status !== 'Available') return false;
      if (foodType === 'veg') return c.type === 'Vegetarian';
      if (foodType === 'nonveg') return c.type === 'Non-Vegetarian';
      if (foodType === 'both') return true;
      return false;
    });

    if (combo !== '' && combo !== 'custom' && !availableCombos.some(c => c.id === combo)) {
      setCombo('');
    }
  }, [foodType]);

  const handleContinue = () => {
    if (foodType === '') {
      alert("Please select a food type first!");
      return;
    }
    if (combo === '') {
      alert("Please select a package combo or create a custom menu first!");
      return;
    }

    const comboPrice = getComboPrice();
    const comboName = getComboName();

    localStorage.setItem("booking_food_type", foodType);
    localStorage.setItem("booking_catering_combo_name", comboName);
    localStorage.setItem("booking_catering_price_per_plate", comboPrice.toString());
    localStorage.setItem("booking_guest_count", plates.toString());
    localStorage.setItem("booking_cake_name", getCakeName());
    localStorage.setItem("booking_cake_price", getCakePrice().toString());
    localStorage.setItem("booking_cake_text", selectedCake !== 'none' ? cakeText : '');
    localStorage.setItem("booking_cake_eggless", selectedCake !== 'none' && cakeEggless ? 'Yes' : 'No');
    if (selectedCake !== 'none') {
      const savedCakeName = localStorage.getItem("booking_cake_name");
      const cake = cakeOptions.find(c => c.id === selectedCake);
      if (cake) {
        let finalWeight = cakeWeight;
        if (!finalWeight && savedCakeName === cake.name) {
          finalWeight = localStorage.getItem("booking_cake_weight") || "";
        }
        if (!finalWeight) {
          const match = cake.name.match(/(\d+\.\d+|\d+)\s*Kg/i);
          finalWeight = match ? match[1] : "1.5";
        }
        localStorage.setItem("booking_cake_weight", finalWeight.toString());
      }
    } else {
      localStorage.removeItem("booking_cake_weight");
    }

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      navigate("/client/services");
    }, 1500);
  };

  return (
    <div className={`premium-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "0 0 4px" }}>Catering</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Choose your preferred food type and menu for your event</p>
          </div>

          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "71.42857142857143%", background: '#ea580c' }}></div>
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
              <div className="step-circle" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>5</div>
              <div className="step-label" style={{color: '#ea580c', fontWeight: 500}}>Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>6</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Catering Options</div>
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


          <div className="catering-container" style={{ padding: "0 32px 32px" }}>
            
            {/* 1. Select Food Type */}
            <div className="section-block">
              <h3 className="section-title">1. Select Food Type</h3>
              <div className="food-type-layout">
                <div className="food-type-grid">
                  <div 
                    className={`food-card ${foodType === '' ? 'selected' : ''}`}
                    onClick={() => setFoodType('')}
                  >
                    <div className="food-icon bg-slate-100 text-slate-500"><Utensils size={24} /></div>
                    <div className="food-info">
                      <h4>Select Option</h4>
                      <p>Click to choose food type preference</p>
                    </div>
                    {foodType === '' && (
                      <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>
                    )}
                  </div>

                  <div 
                    className={`food-card ${foodType === 'veg' ? 'selected' : ''}`}
                    onClick={() => setFoodType('veg')}
                  >
                    <div className="food-icon bg-green-light text-green"><Leaf size={24} /></div>
                    <div className="food-info">
                      <h4>Vegetarian</h4>
                      <p>Pure veg menu with wide variety of dishes</p>
                    </div>
                    {foodType === 'veg' && (
                      <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>
                    )}
                  </div>
                  
                  <div 
                    className={`food-card ${foodType === 'nonveg' ? 'selected' : ''}`}
                    onClick={() => setFoodType('nonveg')}
                  >
                    <div className="food-icon bg-red-light text-red">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="food-info">
                      <h4>Non-Vegetarian</h4>
                      <p>Delicious veg & non-veg combinations</p>
                    </div>
                    {foodType === 'nonveg' && (
                      <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>
                    )}
                  </div>

                  <div 
                    className={`food-card ${foodType === 'both' ? 'selected' : ''}`}
                    onClick={() => setFoodType('both')}
                  >
                    <div className="food-icon bg-purple-light text-purple"><Utensils size={24} /></div>
                    <div className="food-info">
                      <h4>Both (Veg + Non-Veg)</h4>
                      <p>Perfect mix for all your guests</p>
                    </div>
                    {foodType === 'both' && (
                      <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>
                    )}
                  </div>
                </div>
                
                <div className="food-alert green-alert">
                  <Info size={20} className="text-green-700 alert-icon" />
                  <p>All our food is prepared with hygienic ingredients and served by professional staff.</p>
                </div>
              </div>
            </div>

            {/* 2. Choose Plate & Combo */}
            <div className="section-block">
              <h3 className="section-title">2. Choose Plate & Combo</h3>
              <p className="section-subtitle">Select the number of plates and view the included menu</p>
              
              <div className="plates-combo-layout">
                <div className="plates-counter-section">
                  <label className="font-semibold text-sm mb-2 block">Number of Plates</label>
                  <div className="plates-counter">
                    <button onClick={() => handlePlateChange(-10)}><Minus size={16} /></button>
                    <input type="number" value={plates} readOnly />
                    <button onClick={() => handlePlateChange(10)}><Plus size={16} /></button>
                    <span>Plates</span>
                  </div>
                  <p className="plates-hint">Total Guests: {plates}</p>
                </div>

                <div className="combo-scroll-container">
                  {combos.map(c => (
                    <div 
                      key={c.id} 
                      className={`combo-card ${combo === c.id ? 'selected' : ''}`}
                      onClick={() => setCombo(c.id)}
                    >
                      {foodType === 'veg' && (
                        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, border: "2px solid #16a34a", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Vegetarian">
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16a34a" }}></div>
                        </div>
                      )}
                      {foodType === 'nonveg' && (
                        <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, border: "2px solid #dc2626", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Non-Vegetarian">
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#dc2626" }}></div>
                        </div>
                      )}
                      {c.popular && <div className="popular-badge">Most Popular</div>}
                      {combo === c.id && <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>}
                      <div className="combo-img">
                        <img src={c.img} alt={c.name} />
                      </div>
                      <div className="combo-info">
                        <h4>{c.name}</h4>
                        <div className="combo-price">₹{c.price} <span>/ Plate</span></div>
                        <button className="btn-view-details" onClick={(e) => { e.stopPropagation(); navigate(`/client/catering/combo-details/${c.id}`); }}>View Details</button>
                      </div>
                    </div>
                  ))}

                  <div 
                    className={`combo-card custom-combo ${combo === 'custom' ? 'selected' : ''}`}
                    onClick={() => setCombo('custom')}
                  >
                    {foodType === 'veg' && (
                      <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, border: "2px solid #16a34a", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Vegetarian">
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16a34a" }}></div>
                      </div>
                    )}
                    {foodType === 'nonveg' && (
                      <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, border: "2px solid #dc2626", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Non-Vegetarian">
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#dc2626" }}></div>
                      </div>
                    )}
                    {combo === 'custom' && <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>}
                    <div className="custom-icon"><Utensils size={32} /></div>
                    <h4>Custom Combo</h4>
                    <p>Create your own menu as per your preference</p>
                    <button 
                      className="btn-outline-orange" 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setCombo('custom'); 
                        setIsSidebarOpen(true); 
                      }}
                    >
                      {combo === 'custom' ? 'Customize Menu' : 'Create Custom Menu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Customized Cake Options */}
            <div className="section-block" style={{ marginTop: "32px" }}>
              <h3 className="section-title">3. Customized Cake Options</h3>
              <p className="section-subtitle">Select a customized celebration cake and specify what to write on top</p>
              
              <div className="cake-options-layout" style={{ marginTop: "20px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                  {cakeOptions.map(cake => (
                    <div 
                      key={cake.id} 
                      className={`combo-card ${selectedCake === cake.id ? 'selected' : ''}`}
                      onClick={() => handleCakeSelect(cake.id)}
                      style={{ 
                        cursor: "pointer", 
                        position: "relative", 
                        minHeight: "260px", 
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: cake.id === 'none' ? 'center' : 'space-between',
                        alignItems: cake.id === 'none' ? 'center' : 'stretch',
                        textAlign: cake.id === 'none' ? 'center' : 'left',
                        boxSizing: "border-box"
                      }}
                    >
                      {selectedCake === cake.id && (
                        <div className="check-badge-corner"><Check size={14} strokeWidth={3} /></div>
                      )}
                      {cake.id === 'none' ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                          <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎂❌</div>
                          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: "800", color: "#0f172a" }}>{cake.name}</h4>
                          <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>{cake.desc}</p>
                          <div className="combo-price" style={{ fontSize: "15px", fontWeight: "850", color: "#ea580c", marginTop: "12px" }}>
                            Free / Included
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="combo-img" style={{ height: "140px", overflow: "hidden", borderRadius: "8px 8px 0 0" }}>
                              <img src={cake.img} alt={cake.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "12px" }}>
                              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{cake.name}</h4>
                              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", lineHeight: "1.4" }}>{cake.desc}</p>
                            </div>
                          </div>
                          <div className="combo-info" style={{ padding: "12px", paddingTop: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div className="combo-price" style={{ fontSize: "15px", fontWeight: "800", color: "#ea580c" }}>
                              ₹{cake.price.toLocaleString()}
                            </div>
                            <button 
                              className="btn-view-details" 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                navigate(`/client/catering/cake-details/${cake.id}`); 
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {selectedCake !== 'none' && (
                  <div className="cake-text-input-container mt-6" style={{
                    marginTop: "24px",
                    maxWidth: "500px",
                    background: "#f8fafc",
                    padding: "20px",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0"
                  }}>
                    <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#0f172a", marginBottom: "8px" }}>
                      🎂 Text to Write on Cake
                    </label>
                    <input 
                      type="text" 
                      value={cakeText}
                      onChange={(e) => setCakeText(e.target.value)}
                      placeholder="Enter message (e.g., Happy Birthday John, Congrats Anjali & Rohan)"
                      maxLength={50}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid #cbd5e1",
                        fontSize: "14px",
                        color: "#0f172a",
                        outline: "none",
                        transition: "border-color 0.2s",
                        boxSizing: "border-box"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "#ea580c"}
                      onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
                    />
                    <p style={{ fontSize: "11px", color: "#64748b", marginTop: "6px", marginBottom: 0 }}>
                      Limit: 50 characters. This text will be beautifully written on top of the cake.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Selected Summary Footer */}
            <EventSummaryFooter
              icon={Utensils}
              overrides={{
                cateringPricePerPlate: getComboPrice(),
                guestCount: plates,
                cakePrice: getCakePrice(),
                foodType
              }}
              customDetails={
                <>
                  <span>Food Type: <strong style={{fontWeight: "600", color: "#475569"}}>{foodType === 'veg' ? 'Vegetarian' : foodType === 'nonveg' ? 'Non-Vegetarian' : foodType === 'both' ? 'Veg + Non-Veg' : 'Not Selected'}</strong></span>
                  <span>Plates: <strong style={{fontWeight: "600", color: "#475569"}}>{plates}</strong></span>
                  {combo && <span>Menu: <strong style={{fontWeight: "600", color: "#475569"}}>{getComboName()} (₹{getComboPrice()}/plate)</strong></span>}
                  {selectedCake !== 'none' && (
                    <span>Cake: <strong style={{fontWeight: "600", color: "#475569"}}>{getCakeDisplayName()}{cakeEggless ? ' (Eggless)' : ''} (₹{getCakePrice()})</strong></span>
                  )}
                </>
              }
            />

            <div className="bottom-navigation" style={{ marginTop: "40px" }}>
              <button className="btn-nav-back" onClick={() => navigate("/client/decoration")}>
                <ArrowLeft size={20} /> Back to Decoration
              </button>
              <button className="btn-nav-continue" onClick={handleContinue}>
                Continue to Additional Services <ArrowRight size={20} />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Right Sidebar - Custom Menu Add Items */}
      {isSidebarOpen && (
        <div className="custom-menu-overlay" onClick={() => setIsSidebarOpen(false)}>
          <div className="custom-menu-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="sidebar-header">
              <h3>Custom Menu - Add Items</h3>
              <button className="close-btn" onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="sidebar-tabs">
              {Object.keys(customSidebarItems).map(tab => (
                <div 
                  key={tab} 
                  className={`sidebar-tab ${customMenuTab === tab ? 'active' : ''}`}
                  onClick={() => setCustomMenuTab(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>

            <div className="sidebar-content-scroll">
              {customSidebarItems[customMenuTab].map(item => (
                <div key={item.id} className="sidebar-item-card">
                  <div className="item-img">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                    <div className="item-price">₹{item.price} <span>/ Plate</span></div>
                  </div>
                  <div className="item-actions">
                    <div className="qty-counter">
                      <button onClick={() => handleCustomQtyChange(item.id, false)}><Minus size={14} /></button>
                      <input type="text" value={customQuantities[item.id] || 0} readOnly />
                      <button onClick={() => handleCustomQtyChange(item.id, true)}><Plus size={14} /></button>
                    </div>
                    <button 
                      className={`btn-add ${(customQuantities[item.id] || 0) > 0 ? 'bg-emerald-600 text-white' : ''}`}
                      onClick={() => handleCustomQtyChange(item.id, true)}
                    >
                      {(customQuantities[item.id] || 0) > 0 ? `Added (${customQuantities[item.id]})` : 'Add'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sidebar-footer">
              <button className="btn-view-all" onClick={() => { setIsSidebarOpen(false); setShowAllItemsModal(true); }}>
                <FileText size={18} /> View All Custom Menu Items List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL CUSTOM MENU ITEMS LIST MODAL */}
      {showAllItemsModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-left">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white m-0 flex items-center gap-2">
                    <Utensils size={22} className="text-orange-400" />
                    Complete Custom Menu Items List
                  </h3>
                  <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                    {Object.values(customQuantities).filter(q => q > 0).length} Dishes Selected
                  </span>
                </div>
                <p className="text-xs text-slate-300 m-0 mt-1">
                  Browse, review, and manage all available custom dishes per plate for your event catering
                </p>
              </div>

              <button 
                onClick={() => setShowAllItemsModal(false)}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700 font-bold"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Filters */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
                {["All", "Starters", "Rice & Breads", "Main Course", "Desserts", "Drinks", "Others"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setAllItemsFilterTab(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      allItemsFilterTab === cat 
                        ? "bg-orange-500 text-white shadow-sm" 
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  showSelectedOnly 
                    ? "bg-emerald-600 text-white shadow-sm" 
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                <CheckCircle2 size={14} />
                {showSelectedOnly ? "Showing Selected Only" : "Show Selected Only"}
              </button>
            </div>

            {/* Modal Item Cards List */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-3">
              {(() => {
                const flatItems = [];
                Object.keys(customSidebarItems).forEach(cat => {
                  customSidebarItems[cat].forEach(item => {
                    flatItems.push({ ...item, category: cat });
                  });
                });

                const filtered = flatItems.filter(item => {
                  const matchesCat = allItemsFilterTab === "All" || item.category === allItemsFilterTab;
                  const matchesSelected = !showSelectedOnly || (customQuantities[item.id] || 0) > 0;
                  return matchesCat && matchesSelected;
                });

                return (
                  <>
                    {filtered.map(item => {
                      const qty = customQuantities[item.id] || 0;
                      return (
                        <div key={item.id} className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          qty > 0 ? "bg-orange-50/60 border-orange-200 shadow-xs" : "bg-white border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-4">
                            <img src={item.img} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-slate-900 m-0">{item.name}</h4>
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  {item.category}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 m-0 mt-0.5">{item.desc}</p>
                              <div className="text-xs font-black text-orange-600 mt-1">
                                ₹{item.price} <span className="text-[10px] font-normal text-slate-500">/ Plate</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 shrink-0">
                            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                              <button 
                                onClick={() => handleCustomQtyChange(item.id, false)}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-9 text-center text-xs font-black text-slate-900">
                                {qty}
                              </span>
                              <button 
                                onClick={() => handleCustomQtyChange(item.id, true)}
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            {qty > 0 && (
                              <div className="text-right min-w-[80px]">
                                <div className="text-[10px] text-slate-400 font-bold">Total Item Cost</div>
                                <div className="text-xs font-black text-emerald-600">₹{item.price * qty}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {filtered.length === 0 && (
                      <div className="text-center py-12 text-slate-400 font-bold text-xs">
                        No custom menu dishes found for the selected filter.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4 text-white">
              <div>
                <div className="text-xs text-slate-400 font-bold">Custom Menu Rate Per Plate</div>
                <div className="text-lg font-black text-orange-400">
                  ₹{(() => {
                    let totalRate = 0;
                    Object.keys(customSidebarItems).forEach(cat => {
                      customSidebarItems[cat].forEach(item => {
                        totalRate += item.price * (customQuantities[item.id] || 0);
                      });
                    });
                    return totalRate;
                  })()} <span className="text-xs text-slate-300 font-semibold">/ Plate ({plates} Guests = ₹{(
                    (() => {
                      let totalRate = 0;
                      Object.keys(customSidebarItems).forEach(cat => {
                        customSidebarItems[cat].forEach(item => {
                          totalRate += item.price * (customQuantities[item.id] || 0);
                        });
                      });
                      return totalRate * plates;
                    })()
                  ).toLocaleString("en-IN")})</span>
                </div>
              </div>

              <button
                onClick={() => setShowAllItemsModal(false)}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md cursor-pointer"
              >
                Done & Back to Catering
              </button>
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
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Catering package selected successfully!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default Catering;
