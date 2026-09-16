import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft,
  BedDouble, Wifi, Wind, Coffee, Compass, Save, ChevronDown
} from "lucide-react";

export default function GuestRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [type, setType] = useState("1-bedroom");
  const [distance, setDistance] = useState("Near to Hall (0.5 km)");
  const [location, setLocation] = useState("Near Royal Palace Hall");
  const [price, setPrice] = useState("");
  const [img, setImg] = useState("");
  const [roomsCount, setRoomsCount] = useState("");
  const [facilityWifi, setFacilityWifi] = useState(true);
  const [facilityBreakfast, setFacilityBreakfast] = useState(true);
  const [facilityAc, setFacilityAc] = useState(true);
  const [facilityParking, setFacilityParking] = useState(false);
  const [availability, setAvailability] = useState("Available");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_rooms");
    if (stored) {
      setRooms(JSON.parse(stored));
    } else {
      const defaultRooms = [
        {
          id: 'hotel-grand',
          type: '1-bedroom',
          name: 'Hotel Grand Comfort',
          distance: 'Near to Hall (0.5 km)',
          location: 'Near Royal Palace Hall',
          rating: 4.6,
          reviews: 125,
          price: '₹ 3,000',
          includes: 'Includes Breakfast',
          img: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80',
          tagType: 'near',
          facilities: ['WiFi', 'Breakfast', 'AC'],
          rooms: 15,
          availability: 'Available'
        },
        {
          id: 'stay-inn',
          type: '2-bedroom',
          name: 'Stay Inn Suites',
          distance: 'Near to Hall (0.8 km)',
          location: 'Near Royal Palace Hall',
          rating: 4.4,
          reviews: 98,
          price: '₹ 5,000',
          includes: 'Includes Breakfast',
          img: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80',
          tagType: 'near',
          facilities: ['WiFi', 'Breakfast', 'AC', 'Parking'],
          rooms: 10,
          availability: 'Available'
        },
        {
          id: 'hall-stay',
          type: 'multi-bed',
          name: 'Hall Stay (Multi Bed)',
          distance: 'In the Hall Premises',
          location: 'Inside Royal Palace Hall',
          rating: 4.2,
          reviews: 76,
          price: '₹ 1,500',
          includes: 'Includes Breakfast',
          img: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80',
          tagType: 'inside',
          facilities: ['WiFi', 'Breakfast'],
          rooms: 5,
          availability: 'Available'
        },
        {
          id: 'deluxe-suite',
          type: 'deluxe',
          name: 'Deluxe Luxury Suite',
          distance: 'Near to Hall (1.2 km)',
          location: 'Near Royal Palace Hall',
          rating: 4.7,
          reviews: 133,
          price: '₹ 6,000',
          includes: 'Includes Breakfast',
          img: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80',
          tagType: 'near',
          facilities: ['WiFi', 'Breakfast', 'AC', 'Parking'],
          rooms: 8,
          availability: 'Available'
        }
      ];

      setRooms(defaultRooms);
      localStorage.setItem("admin_rooms", JSON.stringify(defaultRooms));
    }
  }, []);

  const saveToStorage = (updated) => {
    setRooms(updated);
    localStorage.setItem("admin_rooms", JSON.stringify(updated));
  };

  const handleReset = () => {
    setName("");
    setType("1-bedroom");
    setDistance("Near to Hall (0.5 km)");
    setLocation("Near Royal Palace Hall");
    setPrice("");
    setImg("");
    setRoomsCount("");
    setFacilityWifi(true);
    setFacilityBreakfast(true);
    setFacilityAc(true);
    setFacilityParking(false);
    setAvailability("Available");
    setEditingId(null);
  };

  const handleAddClick = () => {
    handleReset();
    setIsPanelOpen(true);
  };

  const handleEdit = (room) => {
    setName(room.name);
    setType(room.type || "1-bedroom");
    setDistance(room.distance || "Near to Hall (0.5 km)");
    setLocation(room.location || "Near Royal Palace Hall");
    setPrice(room.price ? room.price.replace("₹ ", "") : "");
    setImg(room.img || "");
    setRoomsCount(String(room.rooms || "10"));
    setFacilityWifi(room.facilities ? room.facilities.includes("WiFi") : true);
    setFacilityBreakfast(room.facilities ? room.facilities.includes("Breakfast") : true);
    setFacilityAc(room.facilities ? room.facilities.includes("AC") : true);
    setFacilityParking(room.facilities ? room.facilities.includes("Parking") : false);
    setAvailability(room.availability || "Available");
    setEditingId(room.id);
    setIsPanelOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation option?")) {
      const updated = rooms.filter(r => r.id !== id);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !price) {
      alert("Please fill in Hotel / Room Name and Rate per Night!");
      return;
    }

    const facList = [];
    if (facilityWifi) facList.push("WiFi");
    if (facilityBreakfast) facList.push("Breakfast");
    if (facilityAc) facList.push("AC");
    if (facilityParking) facList.push("Parking");

    const formattedPrice = price.includes("₹") ? price : `₹ ${price}`;

    const newRoom = {
      id: editingId ? editingId : `room-${Date.now()}`,
      name,
      type,
      distance,
      location,
      rating: 4.5,
      reviews: 50,
      price: formattedPrice,
      includes: facilityBreakfast ? "Includes Breakfast" : "Room Only",
      img: img || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80",
      tagType: distance.toLowerCase().includes("inside") ? "inside" : "near",
      facilities: facList,
      rooms: parseInt(roomsCount) || 10,
      availability
    };

    let updated;
    if (editingId) {
      updated = rooms.map(r => (r.id === editingId ? newRoom : r));
    } else {
      updated = [newRoom, ...rooms];
    }

    saveToStorage(updated);
    setIsPanelOpen(false);
    handleReset();
  };

  const getTypeName = (t) => {
    if (t === "1-bedroom") return "1 Bedroom";
    if (t === "2-bedroom") return "2 Bedroom";
    if (t === "multi-bed") return "Multi-Bed Hall";
    if (t === "deluxe") return "Deluxe Suite";
    return t;
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.location?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeSubTab !== "all") return r.type === activeSubTab;
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
                <span className="text-gray-900 font-black">Guest Room Management</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">Guest Accommodation Management</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Manage guest rooms, hotel pairings, distance parameters, and check-in options.</p>
            </div>

            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
            >
              <Plus size={18} />
              Add New Accommodation
            </button>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveSubTab("all")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'all' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              All Options ({rooms.length})
              {activeSubTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("1-bedroom")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === '1-bedroom' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              1 Bedroom
              {activeSubTab === '1-bedroom' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("2-bedroom")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === '2-bedroom' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              2 Bedroom
              {activeSubTab === '2-bedroom' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("multi-bed")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'multi-bed' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Multi-Bed Halls
              {activeSubTab === 'multi-bed' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("deluxe")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'deluxe' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Deluxe Suites
              {activeSubTab === 'deluxe' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">All Accommodations</h3>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search hotels or location..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:border-orange-500 transition-colors w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Hotel Details</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Room Type</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Total Rooms</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Distance</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Included Facilities</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Rate/Night</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Status</th>
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-[80px] h-[64px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs shrink-0">
                            <img 
                              src={room.img} 
                              alt={room.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <p className="text-[14px] font-black text-gray-900 leading-tight">{room.name}</p>
                            <span className="text-[11px] text-gray-400 font-medium">{room.location || "Royal Palace Vicinity"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] font-bold text-gray-800">
                          <BedDouble size={14} className="text-blue-500" />
                          {getTypeName(room.type)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-[13px] font-black text-gray-900">
                        {room.rooms || "10"} Rooms
                      </td>
                      <td className="px-4 py-4 text-[13px] font-semibold text-gray-600">
                        {room.distance}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {room.facilities && room.facilities.map((fac) => (
                            <span key={fac} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold border border-gray-200 rounded">
                              {fac === "WiFi" && <Wifi size={10} />}
                              {fac === "AC" && <Wind size={10} />}
                              {fac === "Breakfast" && <Coffee size={10} />}
                              {fac === "Parking" && <Compass size={10} />}
                              {fac}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-gray-900">
                        {room.price}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${room.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                          {room.availability || "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(room)}
                            className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Accommodation"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(room.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Accommodation"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRooms.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500 font-medium">No room options found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT ACCOMMODATION) */}
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
                Back to Accommodations List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Guest Accommodation" : "Add New Guest Accommodation"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify hotel lodging rates, distance, and included amenities." : "Register a new guest hotel or stay room option for event attendees."}
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
                {editingId ? "Save Changes" : "Save Accommodation"}
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2-Columns */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <BedDouble size={20} className="text-orange-500" />
                Hotel & Room Details
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Hotel / Stay Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hotel Grand Comfort Suites" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Room Type Category <span className="text-red-500">*</span></label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 bg-white font-semibold cursor-pointer"
                  >
                    <option value="1-bedroom">1 Bedroom</option>
                    <option value="2-bedroom">2 Bedroom</option>
                    <option value="multi-bed">Multi-Bed Hall</option>
                    <option value="deluxe">Deluxe Suite</option>
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
                    <option value="Full">Full</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Distance Parameter</label>
                  <input 
                    type="text" 
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    placeholder="e.g. Near to Hall (0.5 km) or In Hall Premises" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Total Rooms Allocated</label>
                  <input 
                    type="number" 
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    placeholder="e.g. 15" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Rate per Night (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 3,500" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-orange-500 font-black"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-gray-800">Included Amenities</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={facilityWifi}
                      onChange={(e) => setFacilityWifi(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Free WiFi</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={facilityBreakfast}
                      onChange={(e) => setFacilityBreakfast(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Complimentary Breakfast</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={facilityAc}
                      onChange={(e) => setFacilityAc(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Air Conditioning (AC)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={facilityParking}
                      onChange={(e) => setFacilityParking(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Free Parking</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Hotel Cover Image</h3>
                
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
                    src={img || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80";
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
                Back to Accommodations List
              </button>

              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={18} />
                {editingId ? "Save Changes" : "Save Accommodation"}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
