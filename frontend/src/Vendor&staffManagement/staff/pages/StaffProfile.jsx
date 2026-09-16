import React, { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Check, Edit2, Lock, ShieldCheck } from "lucide-react";

export default function StaffProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [passwordState, setPasswordState] = useState({ old: "", new: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joiningDate: "",
    role: "staff",
    designation: "Staff Member",
    photo: null
  });

  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        const merged = {
          ...profile,
          name: parsed.name || "",
          email: parsed.email || "",
          address: parsed.address || "",
          photo: parsed.photo || null,
          joiningDate: parsed.createdAt ? new Date(parsed.createdAt).toLocaleDateString() : "",
          designation: parsed.role === 'staff' ? 'Staff Member' : 'User'
        };
        setProfile(merged);
        setFormData(merged);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(formData);
    
    // Save to localStorage so that layout updates in real-time
    const currentSession = localStorage.getItem("loggedInUser");
    let updatedSession = { ...formData };
    if (currentSession) {
      try {
        updatedSession = { ...JSON.parse(currentSession), ...formData };
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem("loggedInUser", JSON.stringify(updatedSession));
    setIsEditing(false);
    
    // Dispatch custom event to let layout reload name instantly if needed
    window.dispatchEvent(new Event("storage"));
    
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordState.new !== passwordState.confirm) {
      setPasswordMessage("New passwords do not match!");
      return;
    }
    
    // In a real app, verify old password with backend and update
    // Here we just mock success
    setPasswordMessage("Password changed successfully!");
    localStorage.setItem("staffPasswordChanged", "true");
    
    setTimeout(() => {
      setPasswordMessage("");
      setPasswordState({ old: "", new: "", confirm: "" });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6">
        
        {/* Left Card: Avatar and Status */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center self-start">
          <div className="relative">
            <img
              src={profile.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80"}
              alt={`${profile.name} Profile picture`}
              className="h-32 w-32 rounded-full border-4 border-slate-50 shadow-md object-cover"
            />
            <span className="absolute bottom-1 right-2 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <h2 className="text-xl font-bold text-slate-800 mt-4 leading-tight">{profile.name}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">{profile.designation}</p>

          <span className="mt-4 px-4 py-1 rounded-full text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-wider">
            Active
          </span>
        </div>

        {/* Right Card: Profile Form Details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Profile Details</h3>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl transition-all"
              >
                <Edit2 size={13} />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 bg-slate-50 disabled:bg-slate-50/50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm font-semibold transition-all"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    disabled={true} // Email shouldn't be edited for authentication key reasons
                    value={formData.email}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50 disabled:bg-slate-50/30 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Phone size={16} />
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 bg-slate-50 disabled:bg-slate-50/50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm font-semibold transition-all"
                    required
                  />
                </div>
              </div>

              {/* Joining Date */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Joining Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                    <Calendar size={16} />
                  </span>
                  <input
                    type="text"
                    name="joiningDate"
                    disabled={true} // Immutable hiring field
                    value={formData.joiningDate}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none bg-slate-50 disabled:bg-slate-50/30 disabled:text-slate-400 disabled:cursor-not-allowed text-sm font-semibold transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Home Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 pt-3.5 flex items-start text-slate-400">
                    <MapPin size={16} />
                  </span>
                  <textarea
                    name="address"
                    rows={3}
                    disabled={!isEditing}
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 bg-slate-50 disabled:bg-slate-50/50 disabled:text-slate-500 disabled:cursor-not-allowed text-sm font-semibold transition-all resize-none"
                    required
                  />
                </div>
              </div>

            </div>

            {/* Action buttons if in editing mode */}
            {isEditing && (
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 justify-end">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/10 transition-all"
                >
                  <Check size={14} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

      </div>

      {/* Security Settings (Change Password) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm max-w-2xl mt-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-6">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Security Settings</h3>
            <p className="text-xs text-slate-500 font-medium">Update your password to keep your account secure</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          {passwordMessage && (
            <div className={`p-3 rounded-xl text-sm font-bold ${passwordMessage.includes("success") ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {passwordMessage}
            </div>
          )}
          
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Old Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={passwordState.old}
                onChange={(e) => setPasswordState(p => ({ ...p, old: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-slate-50 text-sm font-semibold transition-all"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                New Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={passwordState.new}
                  onChange={(e) => setPasswordState(p => ({ ...p, new: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-slate-50 text-sm font-semibold transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  required
                  value={passwordState.confirm}
                  onChange={(e) => setPasswordState(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 bg-slate-50 text-sm font-semibold transition-all"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
