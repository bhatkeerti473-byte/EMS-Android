import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft,
  Car, ShieldCheck, ChevronDown, Save
} from "lucide-react";

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Car"); // Car, Bus, Mini Bus
  const [type, setType] = useState("Luxury Sedan");
  const [seats, setSeats] = useState("");
  const [luggage, setLuggage] = useState("3");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [driver, setDriver] = useState(true);
  const [availability, setAvailability] = useState("Available");
  const [popular, setPopular] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_vehicles");
    let vehiclesList = [];
    if (stored) {
      try {
        vehiclesList = JSON.parse(stored);
        let migrated = false;
        vehiclesList = vehiclesList.map(v => {
          if (v.category === 'Tempo Traveller') {
            v.category = 'Mini Bus';
            migrated = true;
          }
          if (v.name && v.name.includes('Tempo Traveller')) {
            v.name = v.name.replace('Tempo Traveller', 'Mini Bus');
            migrated = true;
          }
          if (v.img && (v.img.includes('photo-1570125909232-eb263c188f7e') || v.img.includes('photo-1561361058-c24cecae35ca') || v.img.includes('photo-1601584115197-04ecc0da31d7'))) {
            v.img = '/images/media__1785136699758.png';
            migrated = true;
          }
          return v;
        });
        if (migrated) {
          localStorage.setItem("admin_vehicles", JSON.stringify(vehiclesList));
        }
        setVehicles(vehiclesList);
      } catch (e) {
        console.error("Failed to parse admin_vehicles", e);
        setVehicles([]);
      }
    } else {
      const defaultVehicles = [
        { id: 'camry', name: 'Toyota Camry', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 12,000 - ₹ 15,000', popular: true, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
        { id: 'innova', name: 'Toyota Innova Crysta', seats: 6, luggage: 6, type: 'Premium MPV', price: '₹ 14,000 - ₹ 18,000', popular: false, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
        { id: 'benz', name: 'Mercedes Benz E-Class', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 18,000 - ₹ 25,000', popular: false, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
        { id: 'bmw', name: 'BMW 5 Series', seats: 4, luggage: 3, type: 'Luxury Sedan', price: '₹ 20,000 - ₹ 28,000', popular: false, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=400&q=80', category: 'Car', driver: true, availability: 'Available' },
        { id: 'tempo-17', name: 'Mini Bus (17 Seater)', seats: 17, luggage: 10, type: 'Best for small groups', price: '₹ 7,000 - ₹ 9,000', img: '/images/media__1785136699758.png', category: 'Mini Bus', driver: true, availability: 'Available' },
        { id: 'mini-bus', name: 'Mini Bus (25 Seater)', seats: 25, luggage: 15, type: 'Ideal for medium groups', price: '₹ 9,000 - ₹ 12,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' },
        { id: 'deluxe', name: 'Deluxe AC Bus (35 Seater)', seats: 35, luggage: 20, type: 'Comfortable AC Bus', price: '₹ 13,000 - ₹ 16,000', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80', category: 'Bus', driver: true, availability: 'Available' }
      ];
      setVehicles(defaultVehicles);
      localStorage.setItem("admin_vehicles", JSON.stringify(defaultVehicles));
    }
  }, []);

  const saveToStorage = (updatedVehicles) => {
    setVehicles(updatedVehicles);
    localStorage.setItem("admin_vehicles", JSON.stringify(updatedVehicles));
  };

  const handleReset = () => {
    setName("");
    setCategory("Car");
    setType("Luxury Sedan");
    setSeats("");
    setLuggage("3");
    setPrice("");
    setImg("");
    setDriver(true);
    setAvailability("Available");
    setPopular(false);
    setEditingId(null);
  };

  const handleAddClick = () => {
    handleReset();
    setIsPanelOpen(true);
  };

  const handleEdit = (v) => {
    setName(v.name);
    setCategory(v.category || "Car");
    setType(v.type || "Luxury Sedan");
    setSeats(String(v.seats || ""));
    setLuggage(String(v.luggage || "3"));
    setPrice(v.price ? v.price.replace("₹ ", "") : "");
    setImg(v.img || "");
    setDriver(v.driver !== false);
    setAvailability(v.availability || "Available");
    setPopular(v.popular || false);
    setEditingId(v.id);
    setIsPanelOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      const updated = vehicles.filter(v => v.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price || !seats) {
      alert("Please fill in Vehicle Name, Seats, and Rental Price!");
      return;
    }

    const formattedPrice = price.includes("₹") ? price : `₹ ${price}`;

    const newVehicleData = {
      id: editingId ? editingId : `veh-${Date.now()}`,
      name,
      category,
      type: type || "Luxury Vehicle",
      seats: parseInt(seats) || 4,
      luggage: parseInt(luggage) || 3,
      price: formattedPrice,
      img: img || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80",
      driver,
      availability,
      popular
    };

    let updated;
    if (editingId) {
      updated = vehicles.map(v => (v.id === editingId ? newVehicleData : v));
    } else {
      updated = [newVehicleData, ...vehicles];
    }

    saveToStorage(updated);
    setIsPanelOpen(false);
    handleReset();
  };

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch = v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.type?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeSubTab === "cars") return v.category === "Car";
    if (activeSubTab === "buses") return v.category === "Bus" || v.category === "Mini Bus";
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      
      {/* VIEW 1: LIST VIEW */}
      {!isPanelOpen && (
        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-bold mb-1">
                <span className="text-gray-500">Dashboard</span>
                <span className="text-gray-400">›</span>
                <span className="text-orange-500 font-bold">Additional Services</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-900 font-black">Vehicle Management</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">Vehicle Logistics Management</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Manage luxury cars, buses, and mini buses for event logistics.</p>
            </div>

            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
            >
              <Plus size={18} />
              Add New Vehicle
            </button>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveSubTab("all")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'all' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              All Fleet ({vehicles.length})
              {activeSubTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("cars")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'cars' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Cars ({vehicles.filter(v => v.category === 'Car').length})
              {activeSubTab === 'cars' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("buses")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'buses' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Buses & Mini Buses ({vehicles.filter(v => v.category !== 'Car').length})
              {activeSubTab === 'buses' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">All Fleet Vehicles</h3>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search vehicle name or type..." 
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
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Vehicle Details</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Category</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Seats</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Driver</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Rental Price</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-[80px] h-[64px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs shrink-0">
                            <img 
                              src={v.img} 
                              alt={v.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-black text-gray-900 leading-tight">{v.name}</p>
                              {v.popular && <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">VIP</span>}
                            </div>
                            <span className="text-[11px] text-gray-400 font-bold">{v.type}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-bold rounded">
                          {v.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center text-[13px] font-black text-gray-900">
                        {v.seats} Seats
                      </td>
                      <td className="px-4 py-4 text-center">
                        {v.driver !== false ? (
                          <span className="inline-flex items-center gap-1 text-[12px] text-green-700 font-semibold">
                            <ShieldCheck size={14} /> Included
                          </span>
                        ) : (
                          <span className="text-[12px] text-gray-400">Self Drive</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-gray-900">
                        {v.price}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${v.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                          {v.availability || "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(v)}
                            className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Vehicle"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(v.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Vehicle"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500 font-medium">No vehicles found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT VEHICLE) */}
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
                Back to Fleet List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Vehicle Details" : "Add New Vehicle to Fleet"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify seating capacity, driver options, and rental rates." : "Register a new luxury car, bus, or mini bus for event transportation."}
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
                {editingId ? "Save Changes" : "Save Vehicle"}
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2-Columns */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Car size={20} className="text-orange-500" />
                Vehicle Specifications & Rates
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Vehicle Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mercedes Benz E-Class / Luxury Coach (45 Seater)" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Category <span className="text-red-500">*</span></label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 bg-white font-semibold cursor-pointer"
                  >
                    <option value="Car">Car</option>
                    <option value="Bus">Bus</option>
                    <option value="Mini Bus">Mini Bus</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Availability Status <span className="text-red-500">*</span></label>
                  <select 
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 bg-white font-bold cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Seating Capacity <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    placeholder="e.g. 4 or 45" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Luggage Bags Capacity</label>
                  <input 
                    type="number" 
                    value={luggage}
                    onChange={(e) => setLuggage(e.target.value)}
                    placeholder="e.g. 3" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Vehicle Type / Desc</label>
                  <input 
                    type="text" 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="e.g. Luxury Sedan AC" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Rental Price Range <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 12,000 - 15,000" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-orange-500 font-black"
                  required
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={driver}
                    onChange={(e) => setDriver(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Chauffeur / Driver Included</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={popular}
                    onChange={(e) => setPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Mark as VIP Vehicle</span>
                </label>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Vehicle Photo</h3>
                
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
                    src={img || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80";
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
                Back to Fleet List
              </button>

              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={18} />
                {editingId ? "Save Changes" : "Save Vehicle"}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
