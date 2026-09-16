import React from 'react';
import { 
  Users, Store, Search, ChevronDown, Plus, Trash2, 
  Building2, Flower2, Utensils, Camera, Music, Car, BedDouble,
  BarChart3, Clock, CheckCircle2, Settings, ArrowLeft, ArrowRight, User, X
} from 'lucide-react';

function Step3StaffVendor({ bookingId, onBackToDashboard, onPrevious, onNext }) {
  const data = {
    bookingId: bookingId || "BK-2026-00145",
    clientId: "CL-00058",
    status: "Pending",
  };

  const [selectedStaffType, setSelectedStaffType] = React.useState('Event Manager');
  const [selectedStaffIds, setSelectedStaffIds] = React.useState([]);
  
  const [staffData, setStaffData] = React.useState([]);
  const [busyStaffIds, setBusyStaffIds] = React.useState([]);
  const [filterDate, setFilterDate] = React.useState(new Date().toISOString().split('T')[0]);
  
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = React.useState(false);
  const [staffToAssign, setStaffToAssign] = React.useState(null);
  const [assignForm, setAssignForm] = React.useState({
    reportingDate: filterDate,
    reportingTime: "09:00 AM",
    adminMessage: ""
  });
  
  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffRes = await fetch("http://localhost:5000/api/staff");
        const staffList = await staffRes.json();
        setStaffData(staffList);
      } catch (err) {
        console.error("Error fetching staff", err);
      }
    };
    fetchStaff();
  }, []);

  React.useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/staff-assignments/available?date=${filterDate}`);
        const data = await res.json();
        if (data.success) {
          setBusyStaffIds(data.busyStaffIds);
        }
      } catch (err) {
        console.error("Error fetching availability", err);
      }
    };
    fetchAvailability();
  }, [filterDate]);

  const staffTypes = [
    { id: 'Security', label: 'Security', icon: Users },
    { id: 'Event Manager', label: 'Event Manager', icon: User },
    { id: 'Waiter', label: 'Waiter', icon: Users },
    { id: 'Cleaner', label: 'Cleaner', icon: Users },
  ].map(type => ({
    ...type,
    count: staffData.filter(s => s.role === type.id).length
  }));

  const staffAvailable = staffData.map(s => {
    const staffId = s.id || s._id;
    return {
      id: staffId,
      type: s.role,
      name: s.name,
      initials: s.initials || s.name.slice(0, 2).toUpperCase(),
      role: s.role,
      experience: s.experience || '2 Years',
      availability: busyStaffIds.includes(staffId) ? 'Busy' : 'Available',
      isBusy: busyStaffIds.includes(staffId)
    };
  });

  const handleToggleStaff = (staff) => {
    if (staff.isBusy) {
      alert("This staff member is already assigned to another event on this date.");
      return;
    }
    // If already selected, maybe unselect? (In this case it's actually assigned in DB, so we might not want to toggle easily, but let's keep local state for UI purposes)
    if (selectedStaffIds.includes(staff.id)) return; 
    
    setStaffToAssign(staff);
    setAssignForm({ ...assignForm, reportingDate: filterDate });
    setIsAssignStaffModalOpen(true);
  };

  const submitStaffAssignment = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff-assignments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: staffToAssign.id,
          eventId: data.bookingId,
          role: staffToAssign.role,
          reportingDate: assignForm.reportingDate,
          reportingTime: assignForm.reportingTime,
          adminMessage: assignForm.adminMessage,
          eventDate: assignForm.reportingDate, // Fallback to reportingDate for required schema fields
          eventStartTime: "10:00 AM", // Fallback for required field
          eventEndTime: "10:00 PM"   // Fallback for required field
        })
      });
      const responseData = await res.json();
      if (res.ok && responseData.success) {
        alert("Staff successfully assigned and notified!");
        setSelectedStaffIds(prev => [...prev, staffToAssign.id]);
        setIsAssignStaffModalOpen(false);
      } else {
        alert(responseData.message || "Failed to assign staff.");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning staff.");
    }
  };

  const [viewingVendor, setViewingVendor] = React.useState(null);
  const [replacingVendor, setReplacingVendor] = React.useState(null);
  const [selectedNewVendorName, setSelectedNewVendorName] = React.useState("");
  const [selectedVendorType, setSelectedVendorType] = React.useState('Catering Vendor');
  const [selectedVendorName, setSelectedVendorName] = React.useState('');
  const [isAddNewVendorModalOpen, setIsAddNewVendorModalOpen] = React.useState(false);
  const [newVendorForm, setNewVendorForm] = React.useState({ name: '', type: 'Catering Vendor', contact: '' });

  const [vendorsState, setVendorsState] = React.useState([
    { id: 'v1', type: "Venue Vendor", icon: Building2, color: "text-blue-500", name: "Royal Grand Palace", contact: "+91 91234 56780", date: "15 Jul 2026", workStatus: "Working", workColor: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: 'v2', type: "Decoration Vendor", icon: Flower2, color: "text-pink-500", name: "Dream Decorators", contact: "+91 99887 66554", date: "15 Jul 2026", workStatus: "Pending", workColor: "bg-orange-50 text-orange-600 border-orange-200" },
    { id: 'v3', type: "Catering Vendor", icon: Utensils, color: "text-green-500", name: "Food Fiesta Catering", contact: "+91 98765 44321", date: "15 Jul 2026", workStatus: "Working", workColor: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: 'v4', type: "Photography Studio", icon: Camera, color: "text-purple-500", name: "Capture Life Studio", contact: "+91 99876 54321", date: "15 Jul 2026", workStatus: "Working", workColor: "bg-blue-50 text-blue-600 border-blue-200" },
    { id: 'v5', type: "DJ Vendor", icon: Music, color: "text-orange-500", name: "Beat Blast DJs", contact: "+91 98712 34567", date: "15 Jul 2026", workStatus: "Pending", workColor: "bg-orange-50 text-orange-600 border-orange-200" },
    { id: 'v6', type: "Vehicle Vendor", icon: Car, color: "text-blue-500", name: "Sai Travels", contact: "+91 93412 34567", date: "15 Jul 2026", workStatus: "Completed", workColor: "bg-green-50 text-green-600 border-green-200" },
    { id: 'v7', type: "Hotel Vendor", icon: BedDouble, color: "text-indigo-500", name: "Grand Stay Hotel", contact: "+91 91234 88991", date: "15 Jul 2026", workStatus: "Working", workColor: "bg-blue-50 text-blue-600 border-blue-200" }
  ]);

  const handleConfirmReplace = () => {
    if (!selectedNewVendorName) {
      alert("Please select a new replacement vendor!");
      return;
    }
    const updated = vendorsState.map(v => v.type === replacingVendor.type ? { ...v, name: selectedNewVendorName } : v);
    setVendorsState(updated);
    setReplacingVendor(null);
    setSelectedNewVendorName("");
  };

  const handleAssignSelectedVendor = () => {
    if (!selectedVendorName) {
      alert("Please select a vendor from the dropdown!");
      return;
    }
    const newEntry = {
      id: `v_${Date.now()}`,
      type: selectedVendorType,
      icon: Store,
      color: 'text-orange-500',
      name: selectedVendorName,
      contact: '+91 98765 44321',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      workStatus: 'Working',
      workColor: 'bg-blue-50 text-blue-600 border-blue-200'
    };
    setVendorsState(prev => [...prev, newEntry]);
    setSelectedVendorName('');
    alert(`Vendor "${selectedVendorName}" assigned successfully!`);
  };

  const handleSaveNewVendorModal = () => {
    if (!newVendorForm.name.trim()) {
      alert("Please enter vendor name!");
      return;
    }
    const newEntry = {
      id: `v_${Date.now()}`,
      type: newVendorForm.type,
      icon: Store,
      color: 'text-purple-500',
      name: newVendorForm.name.trim(),
      contact: newVendorForm.contact || '+91 98765 11223',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      workStatus: 'Working',
      workColor: 'bg-blue-50 text-blue-600 border-blue-200'
    };
    setVendorsState(prev => [...prev, newEntry]);
    setIsAddNewVendorModalOpen(false);
    setNewVendorForm({ name: '', type: 'Catering Vendor', contact: '' });
    alert(`New vendor "${newEntry.name}" created & assigned successfully!`);
  };

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1500px]">
      
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[14px] mb-4">
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Dashboard</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Bookings</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => onPrevious(1)}>Booking Details</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Step 3 – Staff & Vendor Assignment</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Booking ID :</span>
            <span className="font-black text-orange-500">{data.bookingId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Client ID :</span>
            <span className="font-black text-blue-600">{data.clientId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Booking Status :</span>
            <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 text-[11px] font-black rounded border border-orange-200">
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Panels Layout */}
      <div className="flex flex-col gap-6">
        
        {/* Top Panel: Assigned Staff Redesign */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="text-[18px] font-black text-gray-900 m-0">Select Staff by Type</h3>
            <div className="flex items-center gap-3">
              <label className="text-[12px] font-bold text-gray-700">Check Availability Date:</label>
              <input 
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="text-[13px] font-bold p-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Column 1: Staff Types */}
            <div className="w-full md:w-64 shrink-0">
              <h4 className="text-[14px] font-bold text-gray-700 mb-4 px-2">Staff Types</h4>
              <div className="flex flex-col gap-1">
                {staffTypes.map((type) => {
                  const Icon = type.icon;
                  const isActive = selectedStaffType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedStaffType(type.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors border-l-4 ${
                        isActive 
                          ? 'border-orange-500 bg-orange-50/50' 
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={isActive ? 'text-orange-500' : 'text-gray-500'} />
                        <span className={`text-[13px] ${isActive ? 'font-bold text-orange-600' : 'font-medium text-gray-700'}`}>
                          {type.label}
                        </span>
                      </div>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border ${
                        isActive ? 'border-orange-200 bg-white text-orange-600' : 'border-gray-200 bg-white text-gray-500'
                      }`}>
                        {type.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Staff Table */}
            <div className="flex-1 border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-[#fcfaf8] px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-gray-500" />
                  <h4 className="text-[15px] font-bold text-gray-800">{selectedStaffType} Staff</h4>
                </div>
                <span className="text-[12px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                  {staffAvailable.filter(s => s.type === selectedStaffType).length} Available
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-white">
                      <th className="px-5 py-3 font-bold text-gray-500 text-[12px]">Staff Name</th>
                      <th className="px-5 py-3 font-bold text-gray-500 text-[12px]">Role</th>
                      <th className="px-5 py-3 font-bold text-gray-500 text-[12px]">Experience</th>
                      <th className="px-5 py-3 font-bold text-gray-500 text-[12px]">Availability</th>
                      <th className="px-5 py-3 font-bold text-gray-500 text-[12px] text-center">Select</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {staffAvailable.filter(s => s.type === selectedStaffType).map(staff => (
                      <tr key={staff.id} className="hover:bg-gray-50/50">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {staff.initials}
                            </div>
                            <span className="text-[13px] font-bold text-gray-900 leading-tight max-w-[100px]">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-gray-500 leading-tight max-w-[100px]">{staff.role}</td>
                        <td className="px-5 py-4 text-[13px] font-semibold text-gray-600">{staff.experience}</td>
                        <td className={`px-5 py-4 text-[12px] font-bold ${staff.isBusy ? 'text-red-500' : 'text-green-600'}`}>{staff.availability}</td>
                        <td className="px-5 py-4 text-center">
                          {selectedStaffIds.includes(staff.id) ? (
                            <span className="text-[11px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">Assigned</span>
                          ) : (
                            <button
                              onClick={() => handleToggleStaff(staff)}
                              disabled={staff.isBusy}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors ${staff.isBusy ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-orange-50 text-orange-600 hover:bg-orange-100 cursor-pointer border border-orange-200'}`}
                            >
                              Select
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {staffAvailable.filter(s => s.type === selectedStaffType).length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-5 py-10 text-center text-[13px] font-medium text-gray-400">
                          No staff available for this role.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column 3: Selected Staff Summary */}
            <div className="w-full md:w-64 shrink-0 bg-[#fcfaf8] rounded-xl border border-gray-100 p-5 flex flex-col">
              <h4 className="text-[14px] font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">Selected Staff</h4>
              
              <div className="flex-1 overflow-y-auto max-h-[300px]">
                {selectedStaffIds.length === 0 ? (
                  <p className="text-[13px] text-gray-500 font-medium text-center mt-10">No staff selected.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {selectedStaffIds.map(id => {
                      const staff = staffAvailable.find(s => s.id === id);
                      if (!staff) return null;
                      return (
                        <div key={id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div>
                            <p className="text-[12px] font-bold text-gray-900">{staff.name}</p>
                            <p className="text-[11px] font-medium text-gray-500">{staff.role}</p>
                          </div>
                          <button onClick={() => handleToggleStaff(id)} className="text-gray-400 hover:text-red-500">
                            <X size={14} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Panel: Assigned Vendors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center border border-purple-100">
                <Store size={24} />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-gray-900">Assigned Vendors</h3>
                <p className="text-[13px] text-gray-500 font-medium">Manage and assign vendors for this event.</p>
              </div>
            </div>
            <button 
              onClick={handleAssignSelectedVendor}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-4 py-2 rounded-lg text-[13px] font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={16} /> Assign Vendor
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-3 mb-8">
            <div className="flex-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Select Vendor Type</label>
              <select
                value={selectedVendorType}
                onChange={(e) => {
                  setSelectedVendorType(e.target.value);
                  setSelectedVendorName('');
                }}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-gray-800 outline-none focus:border-orange-500 bg-white"
              >
                <option value="Catering Vendor">Catering Vendor 🍲</option>
                <option value="Decoration Vendor">Decoration Vendor 💐</option>
                <option value="Photography Studio">Photography & Video Studio 📷</option>
                <option value="DJ Vendor">DJ & Sound Systems 🎵</option>
                <option value="Vehicle Vendor">Vehicle & Transport 🚗</option>
                <option value="Hotel Vendor">Hotel Accommodations 🏨</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-[12px] font-bold text-gray-700 mb-1.5">Select Vendor</label>
              <select
                value={selectedVendorName}
                onChange={(e) => setSelectedVendorName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[13px] font-semibold text-gray-800 outline-none focus:border-orange-500 bg-white"
              >
                <option value="">-- Select Vendor --</option>
                <option value={`Gourmet ${selectedVendorType}`}>Gourmet {selectedVendorType}</option>
                <option value={`Royal ${selectedVendorType}`}>Royal {selectedVendorType}</option>
                <option value={`Elite ${selectedVendorType}`}>Elite {selectedVendorType}</option>
                <option value={`Supreme ${selectedVendorType}`}>Supreme {selectedVendorType}</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={handleAssignSelectedVendor}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-xs cursor-pointer"
              >
                Assign Selected
              </button>
              <button 
                onClick={() => setIsAddNewVendorModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus size={16} /> Add New Vendor
              </button>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar border-t border-gray-100 pt-4">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Vendor Type</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Vendor Name</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Contact Number</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Available</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Assigned Date</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Status</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px]">Work Status</th>
                  <th className="pb-3 font-bold text-gray-900 text-[12px] text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {vendorsState.map((vendor, i) => {
                  const Icon = vendor.icon;
                  return (
                    <tr key={i}>
                      <td className="py-4">
                        <div className="flex items-center gap-2 text-[12px] font-bold text-gray-700">
                          <Icon size={14} className={vendor.color} />
                          {vendor.type}
                        </div>
                      </td>
                      <td className="py-4 text-[12px] font-semibold text-gray-900">{vendor.name}</td>
                      <td className="py-4 text-[12px] font-semibold text-gray-600">{vendor.contact}</td>
                      <td className="py-4 text-[12px] font-bold text-green-600">Yes</td>
                      <td className="py-4 text-[12px] font-semibold text-gray-600">{vendor.date}</td>
                      <td className="py-4">
                        <span className="px-2 py-1 bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold rounded">Assigned</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 border text-[10px] font-bold rounded ${vendor.workColor}`}>{vendor.workStatus}</span>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => {
                              setReplacingVendor(vendor);
                              setSelectedNewVendorName("");
                            }}
                            className="text-[11px] font-bold text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            Replace
                          </button>
                          <button 
                            onClick={() => setViewingVendor(vendor)}
                            className="text-[11px] font-bold text-slate-700 border border-slate-200 px-2 py-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* VIEW VENDOR DETAILS MODAL */}
      {viewingVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm uppercase">
                  {viewingVendor.name?.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 m-0">{viewingVendor.name}</h3>
                  <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                    {viewingVendor.type}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setViewingVendor(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl space-y-2 border border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Contact Number:</span>
                  <span className="font-black text-gray-900">{viewingVendor.contact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Assigned Date:</span>
                  <span className="font-bold text-gray-800">{viewingVendor.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Current Work Status:</span>
                  <span className="font-extrabold text-blue-600">{viewingVendor.workStatus}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                onClick={() => setViewingVendor(null)}
                className="px-5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPLACE VENDOR MODAL */}
      {replacingVendor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  Replace Assigned Vendor
                </h3>
                <p className="text-xs text-gray-500 m-0 mt-0.5">Select replacement for: <strong className="text-blue-600">{replacingVendor.type}</strong></p>
              </div>
              <button 
                onClick={() => setReplacingVendor(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div className="text-slate-400 font-bold">Currently Assigned:</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{replacingVendor.name}</div>
                <div className="text-slate-500 mt-0.5">{replacingVendor.contact}</div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Replacement Vendor</label>
                <select
                  value={selectedNewVendorName}
                  onChange={(e) => setSelectedNewVendorName(e.target.value)}
                  className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none bg-white"
                >
                  <option value="">-- Select Replacement Vendor --</option>
                  <option value={`Gourmet ${replacingVendor.type}`}>Gourmet {replacingVendor.type} (+91 98765 99112)</option>
                  <option value={`Elite ${replacingVendor.type}`}>Elite {replacingVendor.type} (+91 98765 88223)</option>
                  <option value={`Supreme ${replacingVendor.type}`}>Supreme {replacingVendor.type} (+91 98765 77334)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setReplacingVendor(null)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReplace}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                Confirm Replacement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Work Status Overview */}
      <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-[16px] font-black text-gray-900">Work Status Overview</h3>
            <p className="text-[12px] text-gray-500 font-medium">Track overall work status of staff and vendors.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-xl p-5 border border-orange-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100 shrink-0">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="text-[22px] font-black text-orange-500 leading-none mb-1">5</h3>
              <p className="text-[13px] font-black text-gray-900">Pending</p>
              <p className="text-[11px] font-medium text-gray-500">Yet to be assigned</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100 shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-[22px] font-black text-blue-500 leading-none mb-1">12</h3>
              <p className="text-[13px] font-black text-gray-900">Assigned</p>
              <p className="text-[11px] font-medium text-gray-500">Staff & vendors assigned</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center border border-yellow-100 shrink-0">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="text-[22px] font-black text-yellow-500 leading-none mb-1">8</h3>
              <p className="text-[13px] font-black text-gray-900">Working</p>
              <p className="text-[11px] font-medium text-gray-500">Work in progress</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100 shrink-0">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h3 className="text-[22px] font-black text-green-500 leading-none mb-1">3</h3>
              <p className="text-[13px] font-black text-gray-900">Completed</p>
              <p className="text-[11px] font-medium text-gray-500">Work completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onPrevious(2)}
          className="flex items-center gap-2 px-6 py-2.5 border border-orange-200 rounded-lg text-[13px] font-bold text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

      {/* ADD NEW VENDOR MODAL */}
      {isAddNewVendorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                  <Store size={18} className="text-purple-600" />
                  Add & Assign New Vendor
                </h3>
                <p className="text-xs text-gray-500 m-0 mt-0.5">Enter details to add and assign a new vendor instantly.</p>
              </div>
              <button 
                onClick={() => setIsAddNewVendorModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Vendor / Business Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Decorators & Stage Setup"
                  value={newVendorForm.name}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, name: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Service Category</label>
                <select
                  value={newVendorForm.type}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, type: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none bg-white"
                >
                  <option value="Catering Vendor">Catering Vendor 🍲</option>
                  <option value="Decoration Vendor">Decoration Vendor 💐</option>
                  <option value="Photography Studio">Photography Studio 📷</option>
                  <option value="DJ Vendor">DJ & Sound Vendor 🎵</option>
                  <option value="Vehicle Vendor">Vehicle & Transport 🚗</option>
                  <option value="Hotel Vendor">Hotel Vendor 🏨</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Contact Number</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98765 44321"
                  value={newVendorForm.contact}
                  onChange={(e) => setNewVendorForm({ ...newVendorForm, contact: e.target.value })}
                  className="w-full text-xs font-semibold p-2.5 border border-gray-200 rounded-xl focus:border-purple-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsAddNewVendorModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewVendorModal}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                Save & Assign Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAFF ASSIGNMENT MODAL */}
      {isAssignStaffModalOpen && staffToAssign && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                  <User size={18} className="text-orange-500" />
                  Assign & Schedule Staff
                </h3>
                <p className="text-xs text-gray-500 m-0 mt-0.5">Formalize assignment for <strong className="text-orange-600">{staffToAssign.name}</strong></p>
              </div>
              <button
                onClick={() => setIsAssignStaffModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Reporting Date</label>
                  <input
                    type="date"
                    value={assignForm.reportingDate}
                    onChange={(e) => setAssignForm({ ...assignForm, reportingDate: e.target.value })}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">Can be a previous day or custom date.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Reporting / Login Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM"
                    value={assignForm.reportingTime}
                    onChange={(e) => setAssignForm({ ...assignForm, reportingTime: e.target.value })}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Custom Admin Message</label>
                <textarea
                  placeholder="e.g. Don't miss event work... Please finish the task properly."
                  value={assignForm.adminMessage}
                  onChange={(e) => setAssignForm({ ...assignForm, adminMessage: e.target.value })}
                  className="w-full text-xs font-semibold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsAssignStaffModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitStaffAssignment}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                Send Assignment & Notify Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Step3StaffVendor;
