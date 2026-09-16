import React, { useState, useRef } from "react";
import {
  ArrowLeft,
  UploadCloud,
  Plus,
  CalendarDays,
  Snowflake,
  Car,
  MonitorPlay,
  Wifi,
  Utensils,
  Zap,
  MapPin
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const InputField = ({ label, required, placeholder, value, onChange, type = "text", icon }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[13px] font-bold text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-orange-500 transition-colors"
      />
      {icon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
    </div>
  </div>
);

const SelectField = ({ label, required, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[13px] font-bold text-gray-800">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[14px] text-gray-700 outline-none focus:border-orange-500 transition-colors bg-white appearance-none"
    >
      <option disabled>{options[0]}</option>
      {options.slice(1).map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

export default function AddVenue() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    venueName: "",
    location: "",
    venueType: "Select venue type",
    description: "",
    capacity: "",
    acType: "Select type",
    parking: "Select parking",
    stage: "Select stage",
    rooms: "",
    price: "",
    availabilityStart: "",
    availabilityEnd: "",
    status: "Select status",
    amenities: {
      ac: true,
      nonAc: false,
      parking: false,
      stage: false,
      wifi: false,
      catering: false,
      power: false,
    },
    address: "",
    contactPerson: "",
    contactNumber: "",
    email: "",
    website: "",
  });

  const location_router = useLocation();
  const isEdit = location_router.pathname.includes("/edit-venue/");
  const editId = isEdit ? location_router.pathname.split("/").pop() : null;

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const imageInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);

  React.useEffect(() => {
    if (isEdit && editId) {
      fetch(`http://localhost:5000/api/venues/${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.venue) {
            const venue = data.venue;
            setForm({
              venueName: venue.name || "",
              location: venue.location || "",
              venueType: venue.type || "Select venue type",
              description: venue.description || "",
              capacity: venue.capacity || "",
              price: venue.price || "",
              status: venue.status || "Select status",
              amenities: {
                ac: venue.facilities?.includes("AC") || false,
                nonAc: venue.facilities?.includes("NONAC") || false,
                parking: venue.facilities?.includes("PARKING") || false,
                stage: venue.facilities?.includes("STAGE") || false,
                wifi: venue.facilities?.includes("WIFI") || false,
                catering: venue.facilities?.includes("CATERING") || false,
                power: venue.facilities?.includes("POWER") || false,
              },
              acType: "Select type",
              parking: "Select parking",
              stage: "Select stage",
              rooms: "",
              availabilityStart: "",
              availabilityEnd: "",
              address: "",
              contactPerson: "",
              contactNumber: "",
              email: "",
              website: "",
            });
            if (venue.images && venue.images.length > 0) {
              setMainImage(venue.images[0]);
              setGalleryImages(venue.images.slice(1));
            }
            if (venue.video) setVideoFile(venue.video);
          }
        })
        .catch(err => console.error("Error fetching venue", err));
    }
  }, [isEdit, editId]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (key) => {
    setForm((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] }
    }));
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleMainImageDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleMainImage(e.dataTransfer.files[0]);
  };
  
  const handleMainImage = (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setMainImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    handleGalleryFiles(Array.from(e.dataTransfer.files));
  };

  const handleGalleryFiles = (files) => {
    const validFiles = files.filter(f => f.type.startsWith("image/"));
    if (validFiles.length < files.length) {
      alert("Some files were rejected. Only image files are allowed.");
    }
    
    if (galleryImages.length + validFiles.length > 6) {
      alert("Maximum 6 additional images allowed.");
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleVideoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleVideoFile(file);
  };

  const handleVideoFile = (file) => {
    if (!file.type.startsWith("video/")) {
      alert("Only video files are allowed.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setVideoFile(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSaveVenue = async () => {
    if (!mainImage) {
      alert("Please upload the main image.");
      return;
    }

    try {
      let uploadedImageUrls = [];
      let finalVideoUrl = "";

      const uploadImage = async (imgStr) => {
        const res = await fetch("http://localhost:5000/api/admin/venues/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: imgStr })
        });
        const data = await res.json();
        return data.success ? data.imageUrl : null;
      };

      const mainUrl = await uploadImage(mainImage);
      if (mainUrl) uploadedImageUrls.push(mainUrl);

      for (let img of galleryImages) {
        const galUrl = await uploadImage(img);
        if (galUrl) uploadedImageUrls.push(galUrl);
      }

      if (videoFile) {
        const res = await fetch("http://localhost:5000/api/admin/venues/upload-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video: videoFile })
        });
        const data = await res.json();
        if (data.success) finalVideoUrl = data.videoUrl;
      }

      const payload = {
        name: form.venueName,
        type: form.venueType,
        location: form.location,
        capacity: Number(form.capacity) || 0,
        price: Number(form.price) || 0,
        description: form.description,
        facilities: Object.keys(form.amenities).filter(k => form.amenities[k]).map(k => k.toUpperCase()),
        images: uploadedImageUrls,
        video: finalVideoUrl,
        status: form.status
      };

      const endpoint = isEdit ? `http://localhost:5000/api/admin/venues/${editId}` : "http://localhost:5000/api/venues/create";
      const method = isEdit ? "PUT" : "POST";

      const saveRes = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const saveData = await saveRes.json();
      if (saveData.success || saveRes.ok) {
        alert(isEdit ? "Venue updated successfully!" : "Venue created successfully!");
        navigate("/admin/venue-management/overview");
      } else {
        alert("Failed to save venue.");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred");
    }
  };



  return (
    <div className="max-w-[1600px] mx-auto pb-24">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[13px] font-bold mb-2">
            <span className="text-blue-900 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate("/admin/dashboard")}>Dashboard</span>
            <span className="text-gray-400">›</span>
            <span className="text-blue-900 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => navigate(-1)}>Venue Management</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900">{isEdit ? "Edit Venue" : "Add New Venue"}</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-1">{isEdit ? "Edit Venue" : "Add New Venue"}</h1>
          <p className="text-[14px] text-gray-500 font-medium">{isEdit ? "Update venue details and save." : "Add venue details and manage availability."}</p>
        </div>
        <button 
          onClick={() => navigate("/admin/venue-management/overview")}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to All Venues
        </button>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Row 1: Images & Basic Info */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Venue Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Venue Images</h3>
            
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Main Image */}
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-800 mb-2">Main Image <span className="text-red-500">*</span></p>
                <div 
                  onDragOver={handleMainImageDrop}
                  onDrop={handleMainImageDrop}
                  onClick={() => imageInputRef.current.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-3 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer overflow-hidden relative"
                >
                  <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={(e) => { if(e.target.files[0]) handleMainImage(e.target.files[0]); }} />
                  {mainImage ? (
                    <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <UploadCloud size={32} className="text-gray-500 mx-auto mb-2" />
                      <p className="text-[13px] font-medium text-gray-600">Drag & drop image here</p>
                      <button className="px-4 py-1.5 mt-2 border border-gray-300 rounded-md bg-white text-[12px] font-bold text-gray-700 hover:bg-gray-50">Browse Main Image</button>
                    </div>
                  )}
                </div>
                {mainImage && (
                  <button onClick={() => setMainImage(null)} className="mt-2 text-xs text-red-500 font-bold hover:underline">Remove Main Image</button>
                )}
              </div>

              {/* Gallery Images */}
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-800 mb-2">Other Images (Max: 6)</p>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleGalleryDrop}
                  onClick={() => galleryInputRef.current.click()}
                  className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer relative"
                >
                  <input type="file" ref={galleryInputRef} hidden accept="image/*" multiple onChange={(e) => { if(e.target.files.length) handleGalleryFiles(Array.from(e.target.files)); }} />
                  <div className="flex items-center gap-2 text-slate-500">
                    <Plus size={20} />
                    <span className="text-sm font-medium">Add Gallery Images</span>
                  </div>
                </div>
                
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                        <img src={img} alt={`Preview ${idx+1}`} className="w-full h-full object-cover" />
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeGalleryImage(idx); }}
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-2 text-[11px] font-medium text-gray-400">
                  <p>{galleryImages.length}/6 additional images added.</p>
                </div>
              </div>

              {/* Video Walkthrough */}
              <div className="flex-1">
                <p className="text-[13px] font-bold text-gray-800 mb-2">Video Walkthrough (Max: 1)</p>
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleVideoDrop}
                  onClick={() => videoInputRef.current.click()}
                  className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer overflow-hidden relative"
                >
                  <input type="file" ref={videoInputRef} hidden accept="video/*" onChange={(e) => { if(e.target.files[0]) handleVideoFile(e.target.files[0]); }} />
                  {videoFile ? (
                    <video src={videoFile} controls className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-500">
                      <MonitorPlay size={24} />
                      <span className="text-sm font-medium">Click or drag video here</span>
                    </div>
                  )}
                </div>
                {videoFile && (
                  <button 
                    onClick={() => setVideoFile(null)}
                    className="mt-2 text-xs text-red-500 font-bold hover:underline"
                  >
                    Remove Video
                  </button>
                )}
                <p className="mt-2 text-[11px] font-medium text-gray-400">Upload an MP4 walkthrough of the venue.</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Basic Information</h3>
            <div className="flex flex-col gap-4">
              <InputField 
                label="Venue Name" required 
                placeholder="Enter venue name" 
                value={form.venueName} onChange={(v) => handleChange("venueName", v)} 
              />
              <InputField 
                label="Location" required 
                placeholder="Enter full location" 
                value={form.location} onChange={(v) => handleChange("location", v)} 
              />
              <SelectField 
                label="Venue Type" 
                value={form.venueType} onChange={(v) => handleChange("venueType", v)} 
                options={["Select venue type", "Banquet Hall", "Wedding Hall", "Outdoor Venue", "Resort"]} 
              />
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-[13px] font-bold text-gray-800">Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Enter venue description..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-700 outline-none focus:border-orange-500 transition-colors resize-none"
                ></textarea>
                <div className="text-right text-[11px] font-medium text-gray-400 mt-1">
                  0/500
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Venue Details */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="text-[15px] font-black text-gray-900 mb-5">Venue Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-5">
            <InputField 
              label="Capacity" required 
              placeholder="Enter capacity" 
              value={form.capacity} onChange={(v) => handleChange("capacity", v)} 
            />
            <SelectField 
              label="AC / Non AC" required 
              value={form.acType} onChange={(v) => handleChange("acType", v)} 
              options={["Select type", "AC", "Non AC", "Both"]} 
            />
            <SelectField 
              label="Parking" required 
              value={form.parking} onChange={(v) => handleChange("parking", v)} 
              options={["Select parking", "Available", "Not Available", "Valet"]} 
            />
            <SelectField 
              label="Stage" required 
              value={form.stage} onChange={(v) => handleChange("stage", v)} 
              options={["Select stage", "Included", "Optional", "Not Included"]} 
            />
            <InputField 
              label="Rooms" 
              placeholder="Enter number of rooms" 
              value={form.rooms} onChange={(v) => handleChange("rooms", v)} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <InputField 
              label="Price (₹)" required 
              placeholder="Enter price" 
              value={form.price} onChange={(v) => handleChange("price", v)} 
            />
            <InputField 
              label="Availability" required 
              placeholder="Select availability date" 
              type="date"
              value={form.availabilityStart} onChange={(v) => handleChange("availabilityStart", v)} 
            />
            <InputField 
              label="Availability End Date" 
              placeholder="Select end date" 
              type="date"
              value={form.availabilityEnd} onChange={(v) => handleChange("availabilityEnd", v)} 
            />
            <SelectField 
              label="Status" required 
              value={form.status} onChange={(v) => handleChange("status", v)} 
              options={["Select status", "Available", "Booked", "Maintenance"]} 
            />
          </div>
        </div>

        {/* Row 3: Amenities & Map / Additional Info */}
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
          
          <div className="flex flex-col gap-6">
            {/* Amenities */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-[15px] font-black text-gray-900 mb-5">Amenities</h3>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.ac ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-400"}`} onClick={() => toggleAmenity("ac")}>
                    {form.amenities.ac && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <Snowflake size={16} className={form.amenities.ac ? "text-blue-500" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.ac ? "text-blue-600" : "text-gray-600"}`}>AC</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.nonAc ? "bg-gray-500 border-gray-500" : "border-gray-300 group-hover:border-gray-400"}`} onClick={() => toggleAmenity("nonAc")}>
                    {form.amenities.nonAc && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <Snowflake size={16} className={form.amenities.nonAc ? "text-gray-500" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.nonAc ? "text-gray-700" : "text-gray-600"}`}>Non AC</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.parking ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-400"}`} onClick={() => toggleAmenity("parking")}>
                    {form.amenities.parking && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-[10px]">P</div>
                  <span className={`text-[13px] font-bold ${form.amenities.parking ? "text-blue-600" : "text-gray-600"}`}>Parking</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.stage ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-400"}`} onClick={() => toggleAmenity("stage")}>
                    {form.amenities.stage && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <MonitorPlay size={16} className={form.amenities.stage ? "text-blue-500" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.stage ? "text-blue-600" : "text-gray-600"}`}>Stage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.wifi ? "bg-green-500 border-green-500" : "border-gray-300 group-hover:border-green-400"}`} onClick={() => toggleAmenity("wifi")}>
                    {form.amenities.wifi && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <Wifi size={16} className={form.amenities.wifi ? "text-green-500" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.wifi ? "text-green-600" : "text-gray-600"}`}>Wi-Fi</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.catering ? "bg-gray-500 border-gray-500" : "border-gray-300 group-hover:border-gray-400"}`} onClick={() => toggleAmenity("catering")}>
                    {form.amenities.catering && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <Utensils size={16} className={form.amenities.catering ? "text-gray-600" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.catering ? "text-gray-700" : "text-gray-600"}`}>Catering</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${form.amenities.power ? "bg-blue-500 border-blue-500" : "border-gray-300 group-hover:border-blue-400"}`} onClick={() => toggleAmenity("power")}>
                    {form.amenities.power && <div className="w-2 h-2 bg-white rounded-sm"></div>}
                  </div>
                  <Zap size={16} className={form.amenities.power ? "text-blue-500" : "text-gray-400"} />
                  <span className={`text-[13px] font-bold ${form.amenities.power ? "text-blue-600" : "text-gray-600"}`}>Power Backup</span>
                </label>

              </div>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm flex-1">
              <h3 className="text-[15px] font-black text-gray-900 mb-5">Map Location</h3>
              <div className="mb-4">
                <InputField 
                  label="Venue Address" required 
                  placeholder="Enter address to show on map" 
                  value={form.address} onChange={(v) => handleChange("address", v)} 
                />
              </div>
              <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                <img 
                  src="https://www.google.com/maps/vt/pb=!1m4!1m3!1i15!2i23605!3i15494!2m3!1e0!2sm!3i420120488!3m7!2sen!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0!23i1301875" 
                  alt="Map Placeholder" 
                  className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <MapPin size={32} className="text-red-500 drop-shadow-md" fill="#ef4444" stroke="white" strokeWidth={2} />
                  <span className="mt-1 px-2 py-1 bg-white rounded shadow-sm text-[10px] font-bold text-gray-700">Koramanagala</span>
                </div>
                <div className="absolute right-3 bottom-3 flex flex-col shadow-sm rounded-md overflow-hidden border border-gray-200">
                  <button className="w-8 h-8 bg-white flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"><Plus size={16}/></button>
                  <button className="w-8 h-8 bg-white flex items-center justify-center hover:bg-gray-50"><span className="text-[20px] font-medium leading-none -mt-1">-</span></button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[15px] font-black text-gray-900 mb-5">Additional Information</h3>
            <div className="flex flex-col gap-4">
              <InputField 
                label="Contact Person" 
                placeholder="Enter contact person name" 
                value={form.contactPerson} onChange={(v) => handleChange("contactPerson", v)} 
              />
              <InputField 
                label="Contact Number" 
                placeholder="Enter contact number" 
                value={form.contactNumber} onChange={(v) => handleChange("contactNumber", v)} 
              />
              <InputField 
                label="Email" 
                placeholder="Enter email address" 
                value={form.email} onChange={(v) => handleChange("email", v)} 
              />
              <InputField 
                label="Website" 
                placeholder="Enter website (optional)" 
                value={form.website} onChange={(v) => handleChange("website", v)} 
              />
            </div>
          </div>

        </div>

      </div>

      {/* Action Bar */}
      <div className="mt-8 flex items-center justify-end gap-4">
        <button 
          onClick={handleReset}
          className="px-8 py-3 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-[13px] font-bold text-gray-700 transition-colors shadow-sm"
        >
          Reset
        </button>
        <button 
          onClick={handleSaveVenue}
          className="flex items-center gap-2 px-8 py-3 bg-[#ff7b00] hover:bg-[#ff8c20] text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          <UploadCloud size={16} />
          {isEdit ? "Save Changes" : "Save Venue"}
        </button>
      </div>

    </div>
  );
}
