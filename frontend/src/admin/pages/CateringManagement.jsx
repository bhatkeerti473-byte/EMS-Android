import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft, 
  CheckCircle2, XCircle, ChevronDown, Utensils, Save
} from "lucide-react";

const CATERING_BASE_ITEMS = [
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

export default function CateringManagement({ initialTab = "packages" }) {
  const [packages, setPackages] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Package Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Vegetarian"); // Vegetarian, Non-Vegetarian, Both
  const [minPlates, setMinPlates] = useState("50");
  const [maxPlates, setMaxPlates] = useState("500");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [customMenu, setCustomMenu] = useState(true);
  const [img, setImg] = useState("");
  const [popular, setPopular] = useState(false);

  const [adminTab, setAdminTab] = useState(initialTab); // "packages" | "custom_items"
  const [customItems, setCustomItems] = useState([]);
  const [isItemPanelOpen, setIsItemPanelOpen] = useState(false);
  const [customItemCategoryFilter, setCustomItemCategoryFilter] = useState("All Items");
  const [customItemSearchQuery, setCustomItemSearchQuery] = useState("");

  useEffect(() => {
    if (initialTab) {
      setAdminTab(initialTab);
    }
  }, [initialTab]);

  // Custom Item Form State
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Starters");
  const [itemPrice, setItemPrice] = useState("");
  const [itemType, setItemType] = useState("Vegetarian");
  const [itemDesc, setItemDesc] = useState("");
  const [itemImg, setItemImg] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_catering_packages");
    let needsReset = false;
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length < 6) {
          needsReset = true;
        }
      } catch (e) {
        needsReset = true;
      }
    } else {
      needsReset = true;
    }

    if (needsReset) {
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
      setPackages(defaultCombos);
      localStorage.setItem("admin_catering_packages", JSON.stringify(defaultCombos));
    } else {
      setPackages(JSON.parse(stored));
    }

    const defaultItems = [
      { id: 'cust-1', name: 'Malai Paneer Tikka', category: 'Starters', price: 65, type: 'Vegetarian', desc: 'Creamy marinated cottage cheese cubes grilled in tandoor', img: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-2', name: 'Chicken Biryani Special', category: 'Main Course', price: 175, type: 'Non-Vegetarian', desc: 'Authentic Hyderabadi dum biryani served with raita', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-3', name: 'Mango Lassi Mocktail', category: 'Drinks', price: 45, type: 'Vegetarian', desc: 'Thick creamy mango yogurt smoothie with cardamom', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
      { id: 'cust-4', name: 'Gulab Jamun with Rabri', category: 'Desserts', price: 55, type: 'Vegetarian', desc: 'Hot gulab jamun served with thick rich rabri', img: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=400&q=80' }
    ];

    const storedItems = localStorage.getItem("admin_custom_menu_items");
    let initialList = [];
    if (storedItems) {
      try {
        initialList = JSON.parse(storedItems);
      } catch (e) {
        console.error(e);
      }
    }

    // Check if the base items are already in the stored items. If not, perform migration.
    const hasBaseItems = initialList.some(item => item.id.startsWith('s') || item.id.startsWith('r') || item.id.startsWith('m') || item.id.startsWith('d') || item.id.startsWith('o'));
    
    let mergedItems = [];
    if (!hasBaseItems) {
      mergedItems = [...initialList];
      CATERING_BASE_ITEMS.forEach(baseItem => {
        const nameExists = mergedItems.some(item => item.name.toLowerCase() === baseItem.name.toLowerCase());
        if (!nameExists) {
          mergedItems.push(baseItem);
        }
      });
      if (initialList.length === 0) {
        defaultItems.forEach(defItem => {
          if (!mergedItems.some(item => item.name.toLowerCase() === defItem.name.toLowerCase())) {
            mergedItems.unshift(defItem);
          }
        });
      }
      localStorage.setItem("admin_custom_menu_items", JSON.stringify(mergedItems));
      setCustomItems(mergedItems);
    } else {
      let modified = false;
      initialList.forEach(item => {
        if (item.img && item.img.includes('1622313762347-3c09fe5f2719')) {
          item.img = 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&w=400&q=80';
          modified = true;
        }
      });
      if (modified) {
        localStorage.setItem("admin_custom_menu_items", JSON.stringify(initialList));
      }
      setCustomItems(initialList);
    }
  }, []);

  const saveToStorage = (updated) => {
    setPackages(updated);
    localStorage.setItem("admin_catering_packages", JSON.stringify(updated));
  };

  const saveCustomItemsToStorage = (updated) => {
    setCustomItems(updated);
    localStorage.setItem("admin_custom_menu_items", JSON.stringify(updated));
  };

  const handleSaveCustomItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) {
      alert("Please provide Dish Name and Price!");
      return;
    }

    const newItem = {
      id: editingItemId ? editingItemId : `cust-${Date.now()}`,
      name: itemName,
      category: itemCategory,
      price: parseFloat(itemPrice) || 0,
      type: itemType,
      desc: itemDesc,
      img: itemImg || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80"
    };

    let updated;
    if (editingItemId) {
      updated = customItems.map(item => (item.id === editingItemId ? newItem : item));
    } else {
      updated = [newItem, ...customItems];
    }

    saveCustomItemsToStorage(updated);
    setIsItemPanelOpen(false);
    setItemName("");
    setItemPrice("");
    setItemDesc("");
    setItemImg("");
    setEditingItemId(null);
  };

  const handleDeleteCustomItem = (id) => {
    if (window.confirm("Are you sure you want to delete this custom menu dish?")) {
      const updated = customItems.filter(i => i.id !== id);
      saveCustomItemsToStorage(updated);
    }
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setType("Vegetarian");
    setMinPlates("50");
    setMaxPlates("500");
    setPrice("");
    setStatus("Available");
    setCustomMenu(true);
    setImg("");
    setPopular(false);
    setEditingId(null);
  };

  const handleAddClick = () => {
    handleReset();
    setIsPanelOpen(true);
  };

  const handleEdit = (pkg) => {
    setName(pkg.name);
    setDescription(pkg.description || "");
    setType(pkg.type || "Vegetarian");
    setMinPlates(String(pkg.minPlates || "50"));
    setMaxPlates(String(pkg.maxPlates || "500"));
    setPrice(String(pkg.price || ""));
    setStatus(pkg.status || "Available");
    setCustomMenu(pkg.customMenu !== false);
    setImg(pkg.img || "");
    setPopular(pkg.popular || false);
    setEditingId(pkg.id);
    setIsPanelOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this catering package?")) {
      const updated = packages.filter(p => p.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Please fill in Package Name and Price!");
      return;
    }

    const newPkg = {
      id: editingId ? editingId : `cat-${Date.now()}`,
      name,
      description,
      type,
      minPlates: parseInt(minPlates) || 50,
      maxPlates: parseInt(maxPlates) || 500,
      price: parseFloat(price) || 250,
      status,
      customMenu,
      img: img || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80",
      popular
    };

    let updated;
    if (editingId) {
      updated = packages.map(p => (p.id === editingId ? newPkg : p));
    } else {
      updated = [newPkg, ...packages];
    }

    saveToStorage(updated);
    setIsPanelOpen(false);
    handleReset();
  };

  const filteredPackages = packages.filter((pkg) =>
    pkg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomItems = customItems.filter((item) => {
    const matchesCategory = customItemCategoryFilter === "All Items" || (item.category || "Starters") === customItemCategoryFilter;
    const matchesSearch = item.name?.toLowerCase().includes(customItemSearchQuery.toLowerCase()) ||
                          item.desc?.toLowerCase().includes(customItemSearchQuery.toLowerCase()) ||
                          item.category?.toLowerCase().includes(customItemSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const vegItems = filteredCustomItems.filter(item => item.type === "Vegetarian" || item.type === "Both" || item.type === "Vegan" || !item.type);
  const nonVegItems = filteredCustomItems.filter(item => item.type === "Non-Vegetarian");

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      
      {/* VIEW 1: LIST VIEW */}
      {!isPanelOpen && (
        <div className="flex flex-col gap-6 w-full">
          {/* Header & Sub-Nav Tabs */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[13px] font-bold mb-1">
                  <span className="text-gray-500">Dashboard</span>
                  <span className="text-gray-400">›</span>
                  <span className="text-orange-500 font-bold">Catering Management</span>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-900 font-black">
                    {adminTab === "packages" ? "Combo Packages" : "Custom Menu Items"}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-gray-900">Catering & Menu Package Management</h1>
                <p className="text-[13px] text-gray-500 font-medium mt-0.5">Manage and sync catering combos and food menu pricing.</p>
              </div>

              {adminTab === "packages" ? (
                <button 
                  onClick={handleAddClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
                >
                  <Plus size={18} />
                  Add New Package
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setItemName("");
                    setItemPrice("");
                    setItemDesc("");
                    setItemImg("");
                    setEditingItemId(null);
                    setIsItemPanelOpen(true);
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
                >
                  <Plus size={18} />
                  Add Custom Dish Item
                </button>
              )}
            </div>

            {/* Sub-Nav Pills */}
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <button
                onClick={() => setAdminTab("packages")}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  adminTab === "packages"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                📦 Combo Packages ({packages.length})
              </button>

              <button
                onClick={() => setAdminTab("custom_items")}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  adminTab === "custom_items"
                    ? "bg-orange-500 text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Utensils size={14} /> Custom Menu Items Manager ({customItems.length})
              </button>
            </div>
          </div>

          {/* VIEW: CUSTOM MENU ITEMS MANAGER */}
          {adminTab === "custom_items" && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
              {/* Header & Filter Controls */}
              <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[16px] font-black text-gray-900 flex items-center gap-2">
                      <Utensils size={18} className="text-orange-500" /> Custom Menu Dishes
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">Dishes added here will immediately appear on the Client Catering Sidebar.</p>
                  </div>

                  {/* Top Search Bar */}
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search starters, rice, main course..." 
                      value={customItemSearchQuery}
                      onChange={(e) => setCustomItemSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 outline-none focus:border-orange-500 transition-colors w-72 font-semibold"
                    />
                  </div>
                </div>

                {/* Category Filter Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1">
                  {["All Items", "Starters", "Rice & Breads", "Main Course", "Desserts", "Drinks", "Others"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCustomItemCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        customItemCategoryFilter === cat
                          ? "bg-orange-500 text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {cat === "Starters" && "🍲 "}
                      {cat === "Rice & Breads" && "🍚 "}
                      {cat === "Main Course" && "🍛 "}
                      {cat === "Desserts" && "🍨 "}
                      {cat === "Drinks" && "🍹 "}
                      {cat === "Others" && "🥗 "}
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-6 p-5">
                {/* Vegetarian Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div style={{ border: "2px solid #16a34a", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Vegetarian">
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16a34a" }}></div>
                    </div>
                    <h4 className="text-sm font-black text-green-700 uppercase tracking-wider">Vegetarian Dishes ({vegItems.length})</h4>
                  </div>
                  
                  {vegItems.length > 0 ? (
                    <div className="overflow-x-auto w-full rounded-xl border border-gray-100">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Dish / Item</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Category</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Type</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Price (Per Plate)</th>
                            <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {vegItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                                  <div>
                                    <p className="text-xs font-black text-gray-900">{item.name}</p>
                                    <p className="text-[11px] text-gray-500 truncate max-w-xs">{item.desc}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-md">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div style={{ border: "2px solid #16a34a", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Vegetarian">
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#16a34a" }}></div>
                                  </div>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-green-100 text-green-700">
                                    {item.type || 'Vegetarian'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-xs font-black text-gray-900">
                                ₹ {item.price} / Plate
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setItemName(item.name);
                                      setItemCategory(item.category || "Starters");
                                      setItemPrice(String(item.price));
                                      setItemType(item.type || "Vegetarian");
                                      setItemDesc(item.desc || "");
                                      setItemImg(item.img || "");
                                      setEditingItemId(item.id);
                                      setIsItemPanelOpen(true);
                                    }}
                                    className="w-7 h-7 rounded border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 cursor-pointer"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomItem(item.id)}
                                    className="w-7 h-7 rounded border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl text-xs font-bold bg-gray-50/50">
                      No vegetarian dishes found matching the current search.
                    </div>
                  )}
                </div>

                {/* Non-Vegetarian Section */}
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                    <div style={{ border: "2px solid #dc2626", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Non-Vegetarian">
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#dc2626" }}></div>
                    </div>
                    <h4 className="text-sm font-black text-red-600 uppercase tracking-wider">Non-Vegetarian Dishes ({nonVegItems.length})</h4>
                  </div>
                  
                  {nonVegItems.length > 0 ? (
                    <div className="overflow-x-auto w-full rounded-xl border border-gray-100">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/50">
                            <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Dish / Item</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Category</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Type</th>
                            <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase">Price (Per Plate)</th>
                            <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {nonVegItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <img src={item.img} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0" />
                                  <div>
                                    <p className="text-xs font-black text-gray-900">{item.name}</p>
                                    <p className="text-[11px] text-gray-500 truncate max-w-xs">{item.desc}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-md">
                                  {item.category}
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  <div style={{ border: "2px solid #dc2626", padding: "2px", display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "white", borderRadius: "2px", width: "14px", height: "14px" }} title="Non-Vegetarian">
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#dc2626" }}></div>
                                  </div>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-red-100 text-red-600">
                                    {item.type}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-xs font-black text-gray-900">
                                ₹ {item.price} / Plate
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setItemName(item.name);
                                      setItemCategory(item.category || "Starters");
                                      setItemPrice(String(item.price));
                                      setItemType(item.type || "Vegetarian");
                                      setItemDesc(item.desc || "");
                                      setItemImg(item.img || "");
                                      setEditingItemId(item.id);
                                      setIsItemPanelOpen(true);
                                    }}
                                    className="w-7 h-7 rounded border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 cursor-pointer"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomItem(item.id)}
                                    className="w-7 h-7 rounded border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl text-xs font-bold bg-gray-50/50">
                      No non-vegetarian dishes found matching the current search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: COMBO PACKAGES TABLE */}
          {adminTab === "packages" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">All Catering Packages</h3>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search catering packages..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:border-orange-500 transition-colors w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Package Details</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Food Type</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Plate Count Range</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Price (Per Plate)</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Customizable</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-[80px] h-[64px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs shrink-0">
                            <img 
                              src={pkg.img} 
                              alt={pkg.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-black text-gray-900 leading-tight">{pkg.name}</p>
                              {pkg.popular && <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Popular</span>}
                            </div>
                            <p className="text-[12px] font-medium text-gray-500 mt-0.5 max-w-[240px] leading-tight truncate">{pkg.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${
                          pkg.type === 'Vegetarian' ? 'bg-green-100 text-green-700' : 
                          pkg.type === 'Non-Vegetarian' ? 'bg-red-100 text-red-600' : 
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {pkg.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-[13px] font-black text-gray-900">
                        {pkg.minPlates} - {pkg.maxPlates} Plates
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-gray-900">
                        ₹ {pkg.price}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {pkg.customMenu ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-green-700"><CheckCircle2 size={15} className="text-green-500" /> Yes</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-gray-400"><XCircle size={15} className="text-gray-300" /> No</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${pkg.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(pkg)}
                            className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(pkg.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredPackages.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500 font-medium">No catering packages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT CATERING PACKAGE) */}
      {isPanelOpen && (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto animate-fade-in pb-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3.5 py-1.5 rounded-lg transition-colors w-fit mb-2 cursor-pointer border border-orange-200"
              >
                <ArrowLeft size={14} />
                Back to Catering List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Catering Package" : "Add New Catering Combo"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify menu pricing per plate, food type, and plate count limits." : "Create a new food catering combo package."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              >
                Cancel / Back
              </button>
              <button 
                type="button"
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={16} />
                {editingId ? "Save Changes" : "Save Package"}
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2-Columns */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Utensils size={20} className="text-orange-500" />
                Catering Details & Plate Rates
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Package Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Wedding Feast Combo" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Food Type <span className="text-red-500">*</span></label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 bg-white font-semibold cursor-pointer"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Both">Both (Veg & Non-Veg)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Availability Status <span className="text-red-500">*</span></label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 bg-white font-bold cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Min Plates</label>
                  <input 
                    type="number" 
                    value={minPlates}
                    onChange={(e) => setMinPlates(e.target.value)}
                    placeholder="e.g. 50" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Max Plates</label>
                  <input 
                    type="number" 
                    value={maxPlates}
                    onChange={(e) => setMaxPlates(e.target.value)}
                    placeholder="e.g. 1000" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Price Per Plate (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 350" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-orange-500 font-black"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Package Description</label>
                <textarea 
                  rows={3} 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe included dishes, starters, desserts..." 
                  className="w-full border border-gray-200 rounded-xl p-3 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={customMenu}
                    onChange={(e) => setCustomMenu(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Allow Custom Menu Selection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Mark as Popular</span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Package Photo</h3>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-bold text-gray-700">Image URL</label>
                  <input 
                    type="text" 
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..." 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-[13px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative">
                  <img 
                    src={img || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
              <button 
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              >
                Back to Catering List
              </button>

              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={18} />
                {editingId ? "Save Changes" : "Save Package"}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* Modal / Overlay for Adding or Editing Custom Menu Item */}
      {isItemPanelOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Utensils size={20} className="text-orange-500" />
                {editingItemId ? "Edit Custom Menu Item" : "Add New Custom Menu Dish"}
              </h3>
              <button 
                type="button"
                onClick={() => setIsItemPanelOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Dish / Item Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g. Paneer Tikka Platter / Butter Chicken"
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                  >
                    <option value="Starters">Starters 🍲</option>
                    <option value="Rice & Breads">Rice & Breads 🍚</option>
                    <option value="Main Course">Main Course 🍛</option>
                    <option value="Desserts">Desserts 🍨</option>
                    <option value="Drinks">Drinks 🍹</option>
                    <option value="Others">Others 🥗</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Price Per Plate (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Food Type</label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                  >
                    <option value="Vegetarian">Vegetarian 🟢</option>
                    <option value="Non-Vegetarian">Non-Vegetarian 🔴</option>
                    <option value="Vegan">Vegan 🌱</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Dish Image URL</label>
                  <input
                    type="text"
                    value={itemImg}
                    onChange={(e) => setItemImg(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Description / Special Flavors</label>
                <textarea
                  rows={2}
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="e.g. Fresh cottage cheese marinated in spices and cooked in tandoor..."
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-orange-500 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsItemPanelOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-500 text-white rounded-xl text-xs font-black hover:bg-orange-600 shadow-sm"
                >
                  {editingItemId ? "Save Changes" : "Add Dish Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
