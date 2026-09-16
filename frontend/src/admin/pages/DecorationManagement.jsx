import React, { useState } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft, UploadCloud, 
  IndianRupee, Flower2, CheckCircle2, AlertCircle, ChevronDown, 
  ChevronLeft, ChevronRight, Save, Check, MonitorPlay
} from "lucide-react";

const EVENT_TYPE_OPTIONS = ["Wedding", "Birthday", "Corporate", "Baby Shower", "Engagement", "Anniversary"];

const mockPackages = [
  { id: 1, name: "Classic Decoration", flower: "Mixed Flowers", category: "Classic", items: "Stage, Entrance, Centerpieces, Welcome Board", price: "25,000", status: "Active", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Wedding", "Engagement", "Anniversary"] },
  { id: 2, name: "Premium Decoration", flower: "Rose, Lily, Orchid", category: "Premium", items: "Stage, Entrance, Centerpieces, Welcome Board, Ceiling Decor", price: "45,000", status: "Active", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Wedding", "Engagement"] },
  { id: 3, name: "Royal Decoration", flower: "Rose, Orchid, Lily", category: "Royal", items: "Stage, Entrance, Centerpieces, Mandap, Ceiling Decor, Pathway", price: "75,000", status: "Active", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Wedding"] },
  { id: 4, name: "Luxury Decoration", flower: "Premium Flowers", category: "Luxury", items: "Everything Included, Theme Setup, Mandap, Ceiling, VIP Lounge", price: "1,20,000", status: "Active", image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Wedding"] },
  { id: 5, name: "Cartoon Balloon Theme", flower: "Balloons", category: "Classic", items: "Balloon Arch, Cake Table, Birthday Selfie Point", price: "28,000", status: "Active", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Birthday", "Baby Shower"] },
  { id: 6, name: "Professional Conference Setup", flower: "No Flowers", category: "Premium", items: "Company Branding, Podium, Registration Desk", price: "38,000", status: "Active", image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80", applicableEvents: ["Corporate"] },
];

export default function DecorationManagement() {
  const [packages, setPackages] = useState(() => {
    try {
      const saved = localStorage.getItem("decoration_packages");
      return saved ? JSON.parse(saved) : mockPackages;
    } catch {
      return mockPackages;
    }
  });

  const [viewMode, setViewMode] = useState("list"); // "list" | "form"
  const [editingId, setEditingId] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Form State
  const [packageName, setPackageName] = useState("");
  const [flowerType, setFlowerType] = useState("Mixed Flowers");
  const [category, setCategory] = useState("Classic");
  const [itemsIncluded, setItemsIncluded] = useState("");
  const [price, setPrice] = useState("");
  const [applicableEvents, setApplicableEvents] = useState(["Wedding"]);
  const [status, setStatus] = useState("Active");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const imageInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setPackageName("");
    setFlowerType("Mixed Flowers");
    setCategory("Classic");
    setItemsIncluded("Stage Decor, Entrance Gate, Centerpieces, Welcome Board");
    setPrice("35,000");
    setApplicableEvents(["Wedding"]);
    setStatus("Active");
    setUploadedImages([]);
    setVideoFile(null);
    setViewMode("form");
  };

  const handleOpenEditForm = (pkg) => {
    setEditingId(pkg.id);
    setPackageName(pkg.name);
    setFlowerType(pkg.flower);
    setCategory(pkg.category || "Classic");
    setItemsIncluded(pkg.items);
    setPrice(pkg.price);
    setApplicableEvents(pkg.applicableEvents || ["Wedding"]);
    setStatus(pkg.status);
    setUploadedImages(pkg.image ? [pkg.image] : []);
    setVideoFile(pkg.video || null);
    setViewMode("form");
  };

  const handleDeletePackage = (id) => {
    if (!window.confirm("Are you sure you want to delete this decoration package?")) return;
    const updated = packages.filter((p) => p.id !== id);
    setPackages(updated);
    try {
      localStorage.setItem("decoration_packages", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePackage = (e) => {
    if (e) e.preventDefault();

    if (!packageName.trim()) {
      alert("Please enter a decoration package name.");
      return;
    }

    let updatedList;
    if (editingId) {
      updatedList = packages.map((pkg) =>
        pkg.id === editingId
          ? {
              ...pkg,
              name: packageName,
              flower: flowerType,
              category,
              items: itemsIncluded,
              price: price || pkg.price,
              applicableEvents,
              status,
              image: uploadedImages.length > 0 ? uploadedImages[0] : pkg.image,
              video: videoFile,
            }
          : pkg
      );
    } else {
        const newPkg = {
          id: Date.now(),
          name: packageName,
          flower: flowerType,
          category,
          items: itemsIncluded,
          price,
          applicableEvents,
          status,
          image: uploadedImages.length > 0 ? uploadedImages[0] : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
          video: videoFile,
        };
        updatedList = [...packages, newPkg];
      }

    setPackages(updatedList);
    try {
      localStorage.setItem("decoration_packages", JSON.stringify(updatedList));
    } catch (err) {
      console.error(err);
    }

    setSaveSuccessMsg(editingId ? "Decoration package updated successfully!" : "New decoration package added successfully!");
    setTimeout(() => {
      setSaveSuccessMsg("");
      setViewMode("list");
    }, 1200);
  };

  // Filtered packages
  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pkg.flower.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || pkg.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const activeCount = packages.filter((p) => p.status === "Active").length;
  const inactiveCount = packages.filter((p) => p.status === "Inactive").length;

  return (
    <div className="flex flex-col gap-6 w-full min-h-full">
      
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg font-bold text-xs flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* VIEW 1: FULL LIST VIEW */}
      {viewMode === "list" && (
        <div className="flex flex-col gap-6 w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[13px] font-bold mb-1">
                <span className="text-gray-500">Dashboard</span>
                <span className="text-gray-400">›</span>
                <span className="text-orange-500 font-bold">Decoration Management</span>
                <span className="text-gray-400">›</span>
                <span className="text-gray-900 font-black">All Decorations</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">Decoration Management</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Add, edit, delete and manage decoration packages.</p>
            </div>
            
            <button 
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm w-fit cursor-pointer"
            >
              <Plus size={18} />
              Add New Decoration
            </button>
          </div>

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                <Flower2 size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-500 mb-1">Total Packages</p>
                <h3 className="text-[22px] font-black text-gray-900 leading-none">{packages.length}</h3>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-500 mb-1">Active Packages</p>
                <h3 className="text-[22px] font-black text-green-600 leading-none">{activeCount}</h3>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-500 mb-1">Inactive Packages</p>
                <h3 className="text-[22px] font-black text-red-500 leading-none">{inactiveCount}</h3>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
                <IndianRupee size={24} />
              </div>
              <div>
                <p className="text-[12px] font-bold text-gray-500 mb-1">Average Price</p>
                <h3 className="text-[22px] font-black text-orange-500 leading-none">₹ 45,000</h3>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            
            {/* Search & Filter controls */}
            <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <h3 className="text-[16px] font-black text-gray-900">All Decoration Packages</h3>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search package..." 
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div className="relative">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 outline-none focus:border-orange-500 transition-colors bg-white cursor-pointer font-bold"
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            {/* Table */}
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Package Name</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Flower Type</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Items Included</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-[11px] font-black text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPackages.map((pkg, idx) => (
                    <tr key={pkg.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{idx + 1}</td>
                      <td className="px-5 py-4">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shadow-2xs">
                          <img 
                            src={pkg.image || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=150&q=80"} 
                            alt={pkg.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-gray-900">{pkg.name}</td>
                      <td className="px-5 py-4 text-[13px] font-medium text-gray-600">{pkg.flower}</td>
                      <td className="px-5 py-4 text-[12px] font-medium text-gray-500 max-w-[240px] leading-tight truncate">{pkg.items}</td>
                      <td className="px-5 py-4 text-[13px] font-black text-gray-900">₹ {pkg.price}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[11px] font-black rounded-md ${pkg.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditForm(pkg)}
                            className="w-8 h-8 rounded-lg border border-orange-200 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition-colors cursor-pointer"
                            title="Edit Package"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeletePackage(pkg.id)}
                            className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Package"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-500">Showing {filteredPackages.length} of {packages.length} entries</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT DECORATION PACKAGE) */}
      {viewMode === "form" && (
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto animate-fade-in pb-12">
          
          {/* Form Header with Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
            <div>
              <button 
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 px-3.5 py-1.5 rounded-lg transition-colors w-fit mb-2 cursor-pointer border border-orange-200"
              >
                <ArrowLeft size={14} />
                Back to Decoration List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit Decoration Package" : "Add New Decoration Package"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify package pricing, floral themes, and included items." : "Create and publish a new decoration package with images and pricing details."}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setViewMode("list")}
                className="px-5 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              >
                Cancel / Back
              </button>
              <button 
                type="button"
                onClick={handleSavePackage}
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-bold transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={16} />
                Save Package
              </button>
            </div>
          </div>

          {/* Full Page Form Grid */}
          <form onSubmit={handleSavePackage} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2-Columns: Package Details */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <h3 className="text-lg font-black text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Flower2 size={20} className="text-orange-500" />
                Package Information & Pricing
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Package Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="e.g. Royal Crystal Mandap & Stage Decoration" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-semibold" 
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Flower Type <span className="text-red-500">*</span></label>
                  <select 
                    value={flowerType}
                    onChange={(e) => setFlowerType(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-white font-semibold cursor-pointer"
                  >
                    <option value="Mixed Flowers">Mixed Flowers</option>
                    <option value="Rose, Lily, Orchid">Rose, Lily, Orchid</option>
                    <option value="Premium Flowers">Premium Flowers</option>
                    <option value="White Flowers">White Flowers</option>
                    <option value="Seasonal Flowers">Seasonal Flowers</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>

                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-bold text-gray-800">Status <span className="text-red-500">*</span></label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="appearance-none w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all bg-white font-bold cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-[36px] text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Package Category Radio Pills */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-bold text-gray-800">Package Category <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap items-center gap-3">
                  {["Classic", "Premium", "Royal", "Luxury"].map((cat) => {
                    const isCatSelected = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                          isCatSelected
                            ? "bg-orange-500 text-white border-orange-500 shadow-sm ring-2 ring-orange-500/20"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Items Included <span className="text-red-500">*</span></label>
                <textarea 
                  rows={4} 
                  value={itemsIncluded}
                  onChange={(e) => setItemsIncluded(e.target.value)}
                  placeholder="Enter items included (e.g. Stage Mandap, Entrance Arch, Table Centerpieces, Photo Booth, VIP Seating)..." 
                  className="w-full border border-gray-200 rounded-xl p-4 text-[14px] text-gray-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium resize-none custom-scrollbar"
                ></textarea>
                <div className="text-right text-[11px] font-medium text-gray-400">{itemsIncluded.length}/500</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Price (₹) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                  <input 
                    type="text" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 45,000" 
                    className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-black" 
                    required
                  />
                </div>
              </div>

              {/* Applicable Event Types */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-[13px] font-bold text-gray-800">Applicable Event Types <span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-3">
                  {EVENT_TYPE_OPTIONS.map((event) => {
                    const isSelected = applicableEvents.includes(event);
                    return (
                      <label key={event} className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-all ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setApplicableEvents([...applicableEvents, event]);
                            } else {
                              setApplicableEvents(applicableEvents.filter(e => e !== event));
                            }
                          }}
                        />
                        <span className="text-xs font-bold text-gray-700">{event}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Images & Service Checkboxes */}
            <div className="flex flex-col gap-6">
              
              {/* Image Upload Box */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Decoration Images</h3>
                
                <div 
                  onClick={() => imageInputRef.current && imageInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length) {
                      const file = e.dataTransfer.files[0];
                      if (file.type.startsWith("image/")) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setUploadedImages(prev => [...prev, ev.target.result]);
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                  className="border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/70 p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all relative"
                >
                  <input 
                    type="file" 
                    ref={imageInputRef} 
                    hidden 
                    accept="image/*" 
                    multiple
                    onChange={(e) => {
                      if (e.target.files.length) {
                        Array.from(e.target.files).forEach(file => {
                          if (file.type.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setUploadedImages(prev => [...prev, ev.target.result]);
                            reader.readAsDataURL(file);
                          }
                        });
                      }
                    }} 
                  />
                  <UploadCloud size={36} className="text-orange-500 mb-2" />
                  <p className="text-[13px] font-bold text-gray-700">Click or drag images to upload</p>
                  <p className="text-[11px] font-medium text-gray-400 mt-1">High quality photos (1200x800px recommended)</p>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 relative group">
                        <img src={img} alt={`Decor ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Walkthrough (Optional) */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Video Walkthrough (Optional)</h3>
                
                <div 
                  onClick={() => videoInputRef.current && videoInputRef.current.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files.length) {
                      const file = e.dataTransfer.files[0];
                      if (file.type.startsWith("video/")) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setVideoFile(ev.target.result);
                        reader.readAsDataURL(file);
                      }
                    }
                  }}
                  className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer overflow-hidden relative"
                >
                  <input 
                    type="file" 
                    ref={videoInputRef} 
                    hidden 
                    accept="video/*" 
                    onChange={(e) => {
                      if (e.target.files.length && e.target.files[0].type.startsWith("video/")) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setVideoFile(ev.target.result);
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }} 
                  />
                  {videoFile ? (
                    <video src={videoFile} controls className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center text-slate-500">
                      <MonitorPlay size={32} className="mb-2 text-orange-500" />
                      <p className="text-[13px] font-bold text-gray-700">Click or drag MP4 video here</p>
                    </div>
                  )}
                </div>
                {videoFile && (
                  <button 
                    onClick={() => setVideoFile(null)}
                    className="mt-1 text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove Video
                  </button>
                )}
              </div>

              {/* Service Features Checkboxes */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Service Highlights</h3>
                
                <div className="flex flex-col gap-2.5">
                  {[
                    "Grand Entrance Arch & Pathway",
                    "Royal Mandap & Stage Decoration",
                    "Imported Fresh Flowers & Carpet",
                    "Crystal Chandeliers & LED Ambient Lights",
                    "VIP Lounge Seating Setup",
                    "Custom Photo Booth & Welcome Board"
                  ].map((feature, idx) => (
                    <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-5 h-5 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                        <Check size={14} />
                      </div>
                      <span className="text-[13px] font-bold text-gray-800">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Form Action Bar */}
            <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
              <button 
                type="button"
                onClick={() => setViewMode("list")}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              >
                Back to Decoration List
              </button>

              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Save size={18} />
                Save Package
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );
}
