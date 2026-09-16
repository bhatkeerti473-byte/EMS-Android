import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit, Trash2, ArrowLeft,
  Music, Speaker, Lightbulb, Save
} from "lucide-react";

export default function DJManagement() {
  const [packages, setPackages] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form States
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [proDj, setProDj] = useState("1 Professional DJ");
  const [sound, setSound] = useState("Basic Sound System");
  const [lighting, setLighting] = useState("4 LED Lights");
  const [smoke, setSmoke] = useState(false);
  const [generator, setGenerator] = useState(false);
  const [hours, setHours] = useState("4");
  const [guests, setGuests] = useState("Up to 100 Guests");
  const [img, setImg] = useState("");
  const [popular, setPopular] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("admin_djs");
    if (stored) {
      setPackages(JSON.parse(stored));
    } else {
      const defaultPackages = [
        {
          id: 'basic',
          name: 'Basic DJ Package',
          price: 12000,
          guests: 'Up to 100 Guests',
          features: ['1 Professional DJ', 'Basic Sound System', '2 Speakers', '4 LED Lights', 'Up to 4 Hours'],
          img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
          popular: false,
          proDj: '1 Professional DJ',
          sound: 'Basic Sound System',
          lighting: '4 LED Lights',
          smoke: false,
          generator: false,
          hours: 4
        },
        {
          id: 'standard',
          name: 'Standard DJ Package',
          price: 18000,
          guests: 'Up to 200 Guests',
          features: ['1 Professional DJ', 'Quality Sound System', '4 Speakers & 2 Subwoofers', '6 LED Lights', 'Up to 6 Hours'],
          img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
          popular: false,
          proDj: '1 Professional DJ',
          sound: 'Quality Sound System',
          lighting: '6 LED Lights',
          smoke: false,
          generator: false,
          hours: 6
        },
        {
          id: 'premium',
          name: 'Premium DJ Package',
          price: 25000,
          guests: 'Up to 300 Guests',
          features: ['1 Top DJ', 'Premium Sound System', '6 Speakers & 2 Subwoofers', '12 LED Lights', 'Smoke Machine', 'Up to 8 Hours'],
          img: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&w=400&q=80',
          popular: true,
          proDj: '1 Top DJ',
          sound: 'Premium Sound System',
          lighting: '12 LED Lights',
          smoke: true,
          generator: false,
          hours: 8
        },
        {
          id: 'luxury',
          name: 'Luxury DJ Package',
          price: 35000,
          guests: 'Up to 500 Guests',
          features: ['2 Professional DJs', 'High End Sound System', '8 Speakers & 4 Subwoofers', '16 LED Lights + Moving Heads', 'Smoke Machine', 'Up to 10 Hours'],
          img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&q=80',
          popular: false,
          proDj: '2 Professional DJs',
          sound: 'High End Sound System',
          lighting: '16 LED Lights + Moving Heads',
          smoke: true,
          generator: false,
          hours: 10
        }
      ];

      setPackages(defaultPackages);
      localStorage.setItem("admin_djs", JSON.stringify(defaultPackages));
    }
  }, []);

  const saveToStorage = (updated) => {
    setPackages(updated);
    localStorage.setItem("admin_djs", JSON.stringify(updated));
  };

  const handleReset = () => {
    setName("");
    setPrice("");
    setProDj("1 Professional DJ");
    setSound("Basic Sound System");
    setLighting("4 LED Lights");
    setSmoke(false);
    setGenerator(false);
    setHours("4");
    setGuests("Up to 100 Guests");
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
    setPrice(String(pkg.price));
    setProDj(pkg.proDj || "1 Professional DJ");
    setSound(pkg.sound || "Basic Sound System");
    setLighting(pkg.lighting || "4 LED Lights");
    setSmoke(!!pkg.smoke);
    setGenerator(!!pkg.generator);
    setHours(String(pkg.hours || "4"));
    setGuests(pkg.guests || "Up to 100 Guests");
    setImg(pkg.img || "");
    setPopular(!!pkg.popular);
    setEditingId(pkg.id);
    setIsPanelOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this DJ package?")) {
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

    const featuresList = [
      proDj,
      sound,
      lighting,
      smoke ? "Smoke Machine Included" : null,
      generator ? "Generator Support Included" : null,
      `Up to ${hours} Hours`
    ].filter(Boolean);

    const newPkg = {
      id: editingId ? editingId : `dj-${Date.now()}`,
      name,
      price: parseFloat(price) || 15000,
      guests,
      features: featuresList,
      img: img || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80",
      popular,
      proDj,
      sound,
      lighting,
      smoke,
      generator,
      hours: parseInt(hours) || 4
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
    pkg.guests?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span className="text-gray-900 font-black">DJ & Sound Management</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900">DJ & Sound Package Management</h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">Configure and manage DJ, sound system, and lighting bundles.</p>
            </div>

            <button 
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[13px] font-bold transition-all shadow-sm cursor-pointer w-fit"
            >
              <Plus size={18} />
              Add New Package
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col w-full">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[16px] font-black text-gray-900">All DJ & Sound Packages</h3>
              
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search packages..." 
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
                    <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Package Details</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">DJ Staff</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Sound & Lighting</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Smoke</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Generator</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Hours</th>
                    <th className="px-4 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Price</th>
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
                                e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80";
                              }}
                            />
                          </div>
                          <div className="flex flex-col gap-1 pt-0.5">
                            <div className="flex items-center gap-2">
                              <p className="text-[14px] font-black text-gray-900 leading-tight">{pkg.name}</p>
                              {pkg.popular && <span className="bg-orange-100 text-orange-600 text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">Popular</span>}
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium">{pkg.guests || "All Events"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-800">
                          <Music size={14} className="text-purple-600" />
                          {pkg.proDj || "1 DJ"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1 text-[12px]">
                          <div className="flex items-center gap-1 text-gray-700">
                            <Speaker size={12} className="text-blue-500" />
                            <span>{pkg.sound || "Basic"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-700">
                            <Lightbulb size={12} className="text-amber-500" />
                            <span>{pkg.lighting || "Basic"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {pkg.smoke ? (
                          <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black rounded uppercase">Yes</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-semibold rounded uppercase">No</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {pkg.generator ? (
                          <span className="inline-flex px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 text-[10px] font-black rounded uppercase">Yes</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 bg-gray-50 text-gray-500 border border-gray-200 text-[10px] font-semibold rounded uppercase">No</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center text-[13px] font-black text-gray-900">
                        {pkg.hours || "4"} hrs
                      </td>
                      <td className="px-4 py-4 text-[14px] font-black text-gray-900">
                        ₹ {pkg.price ? pkg.price.toLocaleString() : "N/A"}
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
                      <td colSpan="8" className="text-center py-8 text-gray-500 font-medium">No packages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL PAGE FORM (ADD / EDIT DJ PACKAGE) */}
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
                Back to DJ Package List
              </button>
              <h1 className="text-2xl font-black text-gray-900">
                {editingId ? "Edit DJ Package" : "Add New DJ & Sound Package"}
              </h1>
              <p className="text-[13px] text-gray-500 font-medium mt-0.5">
                {editingId ? "Modify sound system setup, lighting, and performance duration." : "Create a new DJ & sound system package for events."}
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
                <Music size={20} className="text-orange-500" />
                Package Features & Pricing
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-gray-800">Package Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Wedding DJ & Line Array Sound System" 
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">DJ Staff Info</label>
                  <input 
                    type="text" 
                    value={proDj}
                    onChange={(e) => setProDj(e.target.value)}
                    placeholder="e.g. 1 Professional DJ + 1 Anchor" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Target Guest Capacity</label>
                  <input 
                    type="text" 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    placeholder="e.g. Up to 300 Guests" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Sound System Setup</label>
                  <input 
                    type="text" 
                    value={sound}
                    onChange={(e) => setSound(e.target.value)}
                    placeholder="e.g. 4 Speakers & 2 Subwoofers" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Lighting Setup</label>
                  <input 
                    type="text" 
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                    placeholder="e.g. 12 LED Lights + Moving Heads" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Performance Duration (Hours)</label>
                  <input 
                    type="number" 
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. 6" 
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-[14px] text-gray-800 outline-none focus:border-orange-500 font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-gray-800">Package Price (₹) <span className="text-red-500">*</span></label>
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

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={smoke}
                    onChange={(e) => setSmoke(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Include Smoke Machine</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={generator}
                    onChange={(e) => setGenerator(e.target.checked)}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <span className="text-[13px] font-bold text-gray-900">Include Power Generator Backup</span>
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
                <h3 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">Package Banner Image</h3>
                
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
                    src={img || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80"} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80";
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
                Back to DJ Package List
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

    </div>
  );
}
