import React, { useState, useEffect } from "react";
import { 
  Plus, Edit3, Trash2, X, Search, CheckCircle2, AlertCircle,
  Save, ArrowLeft, Image as ImageIcon, Video, Calendar, MapPin, Check
} from "lucide-react";
import axios from "axios";

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // View state: 'list', 'add', 'edit'
  const [view, setView] = useState("list");
  
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/packages");
      setPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packages:", error);
      setLoading(false);
    }
  };

  const getInitialFormState = () => ({
    name: "", packageCode: "", eventType: "Wedding", category: "Standard",
    shortDescription: "", description: "", status: "Active",
    image: "", coverImage: "", galleryImages: [], previewVideo: "",
    originalPrice: 0, discount: 0, offerPrice: 0, advancePayment: 20, securityDeposit: 0, gstIncluded: false,
    offerEnabled: false, offerTitle: "", offerBadge: "🔥 Limited Offer", badgeBg: "#fff1f2", badgeColor: "#e11d48",
    offerStartDate: "", offerEndDate: "", countdownEnabled: false,
    venueIncluded: false, decorations: [], catering: [], photography: [], entertainment: [], additionalServices: [],
    maxBookings: 20, remainingSlots: 20, bookingStartDate: "", bookingEndDate: "", availabilityStatus: "Available",
    duration: "Full Day", setupTime: "", startTime: "", endTime: "", cleanupTime: "",
    cancellationPolicy: "Free Cancellation", termsAndConditions: "",
    features: [], specialInstructions: "", internalNotes: "", customerNotes: "",
    eligibleCities: [], eligibleVenues: [], minGuests: 50, maxGuests: 500
  });

  const handleAddNew = () => {
    setFormData(getInitialFormState());
    setView("add");
  };

  const handleEdit = (pkg) => {
    setFormData({
      ...getInitialFormState(),
      ...pkg,
      offerStartDate: pkg.offerStartDate ? new Date(pkg.offerStartDate).toISOString().slice(0, 16) : "",
      offerEndDate: pkg.offerEndDate ? new Date(pkg.offerEndDate).toISOString().slice(0, 16) : "",
      bookingStartDate: pkg.bookingStartDate ? new Date(pkg.bookingStartDate).toISOString().slice(0, 10) : "",
      bookingEndDate: pkg.bookingEndDate ? new Date(pkg.bookingEndDate).toISOString().slice(0, 10) : "",
    });
    setView("edit");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: type === "checkbox" ? checked : value };
      
      // Auto-calculate offer price
      if (name === "originalPrice" || name === "discount") {
        const orig = name === "originalPrice" ? Number(value) : Number(prev.originalPrice);
        const disc = name === "discount" ? Number(value) : Number(prev.discount);
        if (orig && disc >= 0) {
          updated.offerPrice = orig - (orig * (disc / 100));
        }
      }
      return updated;
    });
  };

  const handleCheckboxArray = (field, item) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(item)) {
        return { ...prev, [field]: current.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...current, item] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (view === "edit") {
        await axios.put(`http://localhost:5000/api/packages/${formData._id}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/packages", formData);
      }
      setView("list");
      fetchPackages();
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Failed to save package");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await axios.delete(`http://localhost:5000/api/packages/${id}`);
        fetchPackages();
      } catch (error) {
        console.error("Error deleting package:", error);
      }
    }
  };

  const filteredPackages = packages.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper arrays for the form
  const eventTypes = ["Wedding", "Reception", "Engagement", "Birthday", "Baby Shower", "Corporate"];
  const categories = ["Basic", "Standard", "Premium", "Luxury"];
  const decorationThemes = ["Royal", "Luxury", "Traditional", "Classic", "Modern"];
  const cateringOptions = ["Breakfast", "Lunch", "Dinner", "Welcome Drinks", "Desserts", "Live Counters", "Veg", "Non-Veg"];
  const photographyOptions = ["Photography", "Cinematography", "Drone Shoot", "Pre-Wedding", "LED Wall", "Album"];
  const entertainmentOptions = ["DJ", "Live Band", "Anchor", "Dancers", "Magic Show", "Kids Activities"];
  const additionalOptions = ["Invitation Cards", "Welcome Board", "Flower Bouquet", "Car Decoration", "Selfie Point", "Photo Booth", "Bridal Makeup", "Groom Makeup", "Luxury Sofa", "Flower Pathway", "Cake Table", "Gift Table", "Smoke Machine", "Confetti", "Artificial Fountain", "Cold Pyro", "Bubble Machine"];
  const citiesList = ["Udupi", "Bengaluru", "Mangalore", "Mysuru", "Mumbai", "Pune", "Chennai", "Hyderabad"];

  if (view === "list") {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Package Management</h2>
            <p className="text-gray-500">Manage featured offer packages and countdowns</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={18} /> Add New Package
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search packages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Package Name</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Pricing</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Countdown</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">Loading packages...</td>
                  </tr>
                ) : filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">No packages found.</td>
                  </tr>
                ) : (
                  filteredPackages.map(pkg => (
                    <tr key={pkg._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={pkg.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <div className="font-semibold text-gray-900">{pkg.name}</div>
                            <div className="text-xs text-gray-500">{pkg.offerBadge}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900 font-bold">₹{pkg.offerPrice?.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 line-through">₹{pkg.originalPrice?.toLocaleString()}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${pkg.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {pkg.offerEnabled ? (
                          <div className="flex items-center gap-1 text-orange-600 text-sm font-medium">
                            <CheckCircle2 size={16} className="text-green-500" /> Enabled
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-gray-400 text-sm font-medium">
                            <AlertCircle size={16} /> Disabled
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(pkg)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(pkg._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setView("list")} className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{view === 'add' ? 'Add New Package' : 'Edit Package'}</h2>
            <p className="text-gray-500">Configure all package details and settings</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setView("list")} className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium flex items-center gap-2">
            <Save size={18} /> {view === 'add' ? 'Publish Package' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Side: Form Configuration */}
        <div className="flex-1 space-y-6 w-full lg:w-2/3">
          
          {/* 1. Basic Information */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 focus:border-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Code</label>
                <input type="text" name="packageCode" value={formData.packageCode} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none" placeholder="Auto-generated if empty" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                <select name="eventType" value={formData.eventType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none">
                  {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none" rows="3"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-amber-500 outline-none">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Package Images */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">2. Package Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Package Banner (URL)</label>
                <div className="flex gap-4">
                  {formData.image && <img src={formData.image} className="w-16 h-16 rounded object-cover border" alt="Banner" />}
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} className="flex-1 px-3 py-2 border rounded-lg" placeholder="https://..." />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Package Pricing */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">3. Package Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                <input required type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg text-green-600 font-bold" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price (₹)</label>
                <input required type="number" name="offerPrice" value={formData.offerPrice} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg font-bold bg-gray-50" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Advance Payment (%)</label>
                <input type="number" name="advancePayment" value={formData.advancePayment} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Security Deposit (₹)</label>
                <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div className="flex items-center mt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="gstIncluded" checked={formData.gstIncluded} onChange={handleInputChange} className="w-4 h-4 text-amber-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">GST Included</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. Offer Settings */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">4. Offer Settings</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="offerEnabled" checked={formData.offerEnabled} onChange={handleInputChange} className="w-4 h-4 text-amber-600 rounded" />
                <span className="text-sm font-bold text-amber-600">Enable Offer</span>
              </label>
            </div>
            {formData.offerEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-lg border border-orange-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input type="text" name="offerTitle" value={formData.offerTitle} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Monsoon Mega Sale" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Badge</label>
                  <input type="text" name="offerBadge" value={formData.offerBadge} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer End Date & Time</label>
                  <input type="datetime-local" name="offerEndDate" value={formData.offerEndDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg" />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge BG</label>
                    <input type="color" name="badgeBg" value={formData.badgeBg} onChange={handleInputChange} className="w-full h-10 p-1 border rounded-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Badge Text</label>
                    <input type="color" name="badgeColor" value={formData.badgeColor} onChange={handleInputChange} className="w-full h-10 p-1 border rounded-lg" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Decoration Included */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">6. Decoration Included</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="decorationIncluded" checked={formData.decorationIncluded} onChange={handleInputChange} className="w-4 h-4 text-amber-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Include Decoration</span>
              </label>
            </div>
            {formData.decorationIncluded && (
              <div className="flex flex-wrap gap-2">
                {decorationThemes.map(theme => (
                  <button 
                    type="button"
                    key={theme} 
                    onClick={() => handleCheckboxArray("decorations", theme)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${formData.decorations?.includes(theme) ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 7. Catering Included */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">7. Catering Included</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="cateringIncluded" checked={formData.cateringIncluded} onChange={handleInputChange} className="w-4 h-4 text-amber-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Include Catering</span>
              </label>
            </div>
            {formData.cateringIncluded && (
              <div className="flex flex-wrap gap-2">
                {cateringOptions.map(opt => (
                  <button 
                    type="button"
                    key={opt} 
                    onClick={() => handleCheckboxArray("catering", opt)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${formData.catering?.includes(opt) ? "bg-green-50 border-green-200 text-green-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8. Photography Included */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">8. Photography Included</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="photographyIncluded" checked={formData.photographyIncluded} onChange={handleInputChange} className="w-4 h-4 text-amber-600 rounded" />
                <span className="text-sm font-medium text-gray-700">Include Photography</span>
              </label>
            </div>
            {formData.photographyIncluded && (
              <div className="flex flex-wrap gap-2">
                {photographyOptions.map(opt => (
                  <button 
                    type="button"
                    key={opt} 
                    onClick={() => handleCheckboxArray("photography", opt)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${formData.photography?.includes(opt) ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 9. Entertainment & 10. Additional Services */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">9 & 10. Entertainment & Additional Services</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Entertainment</h4>
                <div className="flex flex-wrap gap-2">
                  {entertainmentOptions.map(opt => (
                    <button 
                      type="button"
                      key={opt} 
                      onClick={() => handleCheckboxArray("entertainment", opt)}
                      className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition ${formData.entertainment?.includes(opt) ? "bg-pink-50 border-pink-200 text-pink-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-700 mb-2">Additional Services</h4>
                <div className="flex flex-wrap gap-2">
                  {additionalOptions.map(opt => (
                    <button 
                      type="button"
                      key={opt} 
                      onClick={() => handleCheckboxArray("additionalServices", opt)}
                      className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition ${formData.additionalServices?.includes(opt) ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Live Preview */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-6 space-y-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gray-900 text-white p-4 text-center font-bold text-sm tracking-widest uppercase">
              Live Preview
            </div>
            
            <div className="relative">
              <img 
                src={formData.image || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80"} 
                alt="Package" 
                className="w-full h-56 object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
              
              {formData.offerEnabled && formData.offerBadge && (
                <span className="absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg"
                  style={{ background: formData.badgeBg, color: formData.badgeColor }}>
                  {formData.offerBadge}
                </span>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h4 className="text-xl font-black mb-1">{formData.name || "Package Name"}</h4>
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{formData.eventType}</span>
                  <span className="text-amber-400 font-bold">{formData.category}</span>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="mb-4">
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-2xl font-black text-orange-600">₹{formData.offerPrice?.toLocaleString() || "0"}</span>
                  {formData.discount > 0 && (
                    <span className="text-sm text-gray-400 line-through mb-1">₹{formData.originalPrice?.toLocaleString() || "0"}</span>
                  )}
                </div>
                {formData.offerEnabled && formData.offerEndDate && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    ⏳ Offer Ends: {new Date(formData.offerEndDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Package Includes</p>
                {formData.venueIncluded && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Premium Venue</div>}
                {formData.decorationIncluded && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Custom Decoration</div>}
                {formData.cateringIncluded && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Premium Catering</div>}
                {formData.photographyIncluded && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Photography & Video</div>}
                {formData.entertainment?.length > 0 && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Entertainment ({formData.entertainment.length})</div>}
                {formData.additionalServices?.length > 0 && <div className="flex items-center gap-2 text-sm text-green-700 font-medium"><Check size={16} /> Extra Services ({formData.additionalServices.length})</div>}
              </div>

              <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition">
                Book Now Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPackages;
