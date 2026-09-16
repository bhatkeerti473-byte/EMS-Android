import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft, UploadCloud, 
  ChevronDown, Camera, Video, Star, MapPin, CheckCircle2, Save
} from "lucide-react";

export default function PhotographyManagement() {
  const [studios, setStudios] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [isPhoto, setIsPhoto] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [experience, setExperience] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [rating, setRating] = useState("4.8");
  const [reviews, setReviews] = useState("120");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("Available");
  const [img, setImg] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_studios");
    if (stored) {
      setStudios(JSON.parse(stored));
    } else {
      const defaultStudios = [
        {
          id: 'perfect-click',
          name: 'Perfect Click Studio',
          rating: 4.8,
          reviews: 120,
          location: 'Bangalore',
          services: ['Candid', 'Traditional', 'Pre-Wedding'],
          price: 25000,
          img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80',
          isPhoto: true,
          isVideo: false,
          experience: '8+ Years',
          teamSize: '12',
          status: 'Available'
        },
        {
          id: 'memories-forever',
          name: 'Memories Forever',
          rating: 4.7,
          reviews: 98,
          location: 'Bangalore',
          services: ['Candid', 'Traditional', 'Cinematic'],
          price: 30000,
          img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=400&q=80',
          isPhoto: true,
          isVideo: true,
          experience: '6+ Years',
          teamSize: '10',
          status: 'Available'
        },
        {
          id: 'snappers-studio',
          name: "Snapper's Studio",
          rating: 4.6,
          reviews: 75,
          location: 'Bangalore',
          services: ['Candid', 'Cinematic', 'Traditional'],
          price: 28000,
          img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80',
          isPhoto: true,
          isVideo: false,
          experience: '4+ Years',
          teamSize: '6',
          status: 'Available'
        },
        {
          id: 'the-frame-makers',
          name: 'The Frame Makers',
          rating: 4.9,
          reviews: 150,
          location: 'Bangalore',
          services: ['Candid', 'Traditional', 'Pre-Wedding'],
          price: 35000,
          img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80',
          isPhoto: true,
          isVideo: false,
          experience: '10+ Years',
          teamSize: '15',
          status: 'Available'
        }
      ];

      localStorage.setItem("admin_studios", JSON.stringify(defaultStudios));
      setStudios(defaultStudios);
    }
  }, []);

  const saveToLocalStorage = (updatedStudios) => {
    setStudios(updatedStudios);
    localStorage.setItem("admin_studios", JSON.stringify(updatedStudios));
  };

  const handleAddClick = () => {
    setEditingId(null);
    handleReset();
    setIsPanelOpen(true);
  };

  const handleEdit = (studio) => {
    setEditingId(studio.id);
    setName(studio.name || "");
    setIsPhoto(studio.isPhoto !== undefined ? studio.isPhoto : true);
    setIsVideo(studio.isVideo !== undefined ? studio.isVideo : false);
    setExperience(studio.experience || "");
    setTeamSize(studio.teamSize || "");
    setRating(studio.rating || "4.8");
    setReviews(studio.reviews || "50");
    setLocation(studio.location || studio.city || "");
    setServices(Array.isArray(studio.services) ? studio.services.join(", ") : studio.services || "");
    setPrice(studio.price || "");
    setStatus(studio.status || "Available");
    setImg(studio.img || "");
    setIsPanelOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this studio?")) {
      const updated = studios.filter((s) => s.id !== id);
      saveToLocalStorage(updated);
    }
  };

  const handleReset = () => {
    setName("");
    setIsPhoto(true);
    setIsVideo(false);
    setExperience("");
    setTeamSize("");
    setRating("4.8");
    setReviews("50");
    setLocation("");
    setServices("");
    setPrice("");
    setStatus("Available");
    setImg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location || !price) {
      alert("Please fill in Studio Name, Location, and Starting Price!");
      return;
    }

    const servicesArr = services
      ? services.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Candid", "Traditional"];

    const newStudioData = {
      id: editingId ? editingId : `studio-${Date.now()}`,
      name,
      isPhoto,
      isVideo,
      experience: experience || "5+ Years",
      teamSize: teamSize || "5",
      rating: parseFloat(rating) || 4.8,
      reviews: parseInt(reviews) || 50,
      location,
      services: servicesArr,
      price: parseFloat(price) || 25000,
      status,
      img: img || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"
    };

    let updated;
    if (editingId) {
      updated = studios.map((s) => (s.id === editingId ? newStudioData : s));
    } else {
      updated = [newStudioData, ...studios];
    }

    saveToLocalStorage(updated);
    setIsPanelOpen(false);
    handleReset();
  };

  // Filter logic
  const filteredStudios = studios.filter((studio) => {
    const matchesSearch = studio.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          studio.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeSubTab === "photo") return studio.isPhoto;
    if (activeSubTab === "video") return studio.isVideo;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      
      {/* VIEW 1: FULL LIST VIEW */}
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
                <span className="text-gray-900 font-black">Photography & Videography</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">Photography & Videography Management</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Manage all photography and videography studios and their services.</p>
            </div>

            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
            >
              <Plus size={18} />
              Add New Studio
            </button>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            <button 
              onClick={() => setActiveSubTab("all")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'all' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              All Studios ({studios.length})
              {activeSubTab === 'all' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("photo")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'photo' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Photography Studios ({studios.filter(s => s.isPhoto).length})
              {activeSubTab === 'photo' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
            <button 
              onClick={() => setActiveSubTab("video")}
              className={`pb-3 text-[14px] font-bold transition-colors relative cursor-pointer ${activeSubTab === 'video' ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Videography Studios ({studios.filter(s => s.isVideo).length})
              {activeSubTab === 'video' && <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500 rounded-t-full"></div>}
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">All Registered Studios</h3>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search studio or city..." 
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
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Studio Details</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Type</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Experience</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Rating</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Price (Starting)</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudios.map((studio) => (
                    <tr key={studio.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-4">
                          <div className="w-[80px] h-[64px] rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs shrink-0">
                            <img 
                              src={studio.img} 
                              alt={studio.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <p className="text-[14px] font-black text-gray-900 leading-tight">{studio.name}</p>
                            <p className="text-[11px] font-bold text-gray-500 mt-0.5">
                              {Array.isArray(studio.services) ? studio.services.join(", ") : studio.services}
                            </p>
                            <span className="text-[11px] text-gray-400 font-medium">Team Size: {studio.teamSize || "5"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col items-center gap-1.5">
                          {studio.isPhoto && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-purple-200 bg-purple-50 text-purple-600">
                              <Camera size={11} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Photography</span>
                            </div>
                          )}
                          {studio.isVideo && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-green-200 bg-green-50 text-green-600">
                              <Video size={11} />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Videography</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-[13px] font-black text-gray-900">
                        {studio.experience || "5+ Years"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <Star size={15} className="text-amber-400 fill-amber-400" />
                          <span className="text-[13px] font-black text-gray-900">{studio.rating || "4.8"}</span>
                        </div>
                        <p className="text-[11px] font-bold text-blue-600 mt-0.5">({studio.reviews || "50"} Reviews)</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-[13px] font-bold text-gray-900">{studio.location || "Bangalore"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-gray-900">
                        ₹ {studio.price ? studio.price.toLocaleString() : "N/A"}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${studio.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                          {studio.status || "Available"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(studio)}
                            className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Studio"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(studio.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Studio"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStudios.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-8 text-gray-500 font-medium">No studios found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT STUDIO) */}
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
                Back to Studio List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Studio Details" : "Add New Photography & Videography Studio"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify studio location, pricing, specialties, and team size." : "Register a new photography or videography studio provider."}
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
                {editingId ? "Save Changes" : "Save Studio"}
              </button>
            </div>
          </div>

          {/* Form Grid */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2-Columns */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Camera size={20} className="text-orange-500" />
                Studio Profile & Pricing
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Studio Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Perfect Click Photography & Cinematic Studio" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-semibold"
                  required
                />
              </div>

              {/* Studio Type checkboxes */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-gray-800">Studio Services Provided <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isPhoto}
                      onChange={(e) => setIsPhoto(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Photography Services</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      checked={isVideo}
                      onChange={(e) => setIsVideo(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="text-[13px] font-bold text-gray-900">Videography Services</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Experience (e.g. "8+ Years")</label>
                  <input 
                    type="text" 
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 8+ Years" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Team Size</label>
                  <input 
                    type="number" 
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    placeholder="e.g. 12" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Location / City <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                    required
                  />
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Specialties (Comma-separated)</label>
                <input 
                  type="text" 
                  value={services}
                  onChange={(e) => setServices(e.target.value)}
                  placeholder="e.g. Candid Photography, Cinematic Teaser, Drone Shoot, Pre-Wedding Album" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Starting Price (₹) <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 25000" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-orange-500 font-black"
                  required
                />
              </div>
            </div>

            {/* Right Column: Image Preview */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Studio Cover Image</h3>
                
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
                    src={img || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                    Cover Preview
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
              <button 
                type="button"
                onClick={() => setIsPanelOpen(false)}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              >
                Back to Studio List
              </button>

              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={18} />
                {editingId ? "Save Changes" : "Save Studio"}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
