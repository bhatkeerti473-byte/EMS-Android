import React, { useState } from "react";
import Invoice from "../../pages/Invoice";
import {
  X, User, Calendar, MapPin, CreditCard, Users, ShoppingBag, Package, MessageSquare, CheckCircle, ChevronRight,
  Mail, Phone, FileText, Globe, Clock, Lock, Shield, Info, Image, MapPinned, Hourglass, Star, Home, Palette, Music, Utensils,
  Building, LayoutGrid, UploadCloud, Car, Wifi, Check, Download, DollarSign, AlertCircle, Banknote, Bell
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Client Details", icon: User },
  { id: 2, title: "Event Details", icon: Calendar },
  { id: 3, title: "Venue Details", icon: MapPin },
  { id: 4, title: "Approval & Payment", icon: CreditCard },
  { id: 5, title: "Staff Assignment", icon: Users },
  { id: 6, title: "Vendors", icon: ShoppingBag },
  { id: 7, title: "Resources", icon: Package },
  { id: 8, title: "Timeline & Messages", icon: MessageSquare },
  { id: 9, title: "Complete", icon: CheckCircle },
];

export default function BookingWizardModal({ isOpen, onClose, booking, staffMembers = [], vendors = [] }) {
  const safeBooking = booking || {};
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : "N/A";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [activeStaffTab, setActiveStaffTab] = useState("Security");
  const [activeVendorTab, setActiveVendorTab] = useState("Catering");
  const [selectedStaff, setSelectedStaff] = useState([]);
  
  const todayDateStr = new Date().toISOString().split('T')[0];
  const maxDueDateStr = React.useMemo(() => {
    if (!safeBooking.event_date) return '';
    const date = new Date(safeBooking.event_date);
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  }, [safeBooking.event_date]);
  
  const [paymentDueDate, setPaymentDueDate] = useState(maxDueDateStr);
  const [showInvoice, setShowInvoice] = useState(false);
  
  const [msgSubject, setMsgSubject] = useState("Booking Update");
  const [msgBody, setMsgBody] = useState("");
  const [isSendingMsg, setIsSendingMsg] = useState(false);
  
  const handleSendMessage = async () => {
    if (!msgBody.trim()) return;
    setIsSendingMsg(true);
    try {
      await fetch("http://localhost:5000/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: safeBooking.client_id || safeBooking.client?._id || "client123",
          receiverRole: "Client",
          title: msgSubject,
          message: msgBody,
          type: "Email",
          contactInfo: safeBooking.clientEmail || safeBooking.email || "client@example.com",
          metadata: { bookingId: safeBooking._id || safeBooking.id }
        })
      });
      setMsgBody("");
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message.");
    } finally {
      setIsSendingMsg(false);
    }
  };
  
  React.useEffect(() => {
    if (maxDueDateStr) {
      setPaymentDueDate(maxDueDateStr);
    }
  }, [maxDueDateStr]);

  const defaultStaffRoles = ['Security', 'Event Manager', 'Waiter', 'Cleaner', 'Bartender', 'Decorator', 'Technician'];
  const uniqueStaffRoles = Array.from(new Set(staffMembers.map(s => s.role).filter(Boolean)));
  const displayStaffRoles = Array.from(new Set([...defaultStaffRoles, ...uniqueStaffRoles]));
  const filteredStaff = staffMembers.filter(s => s.role === activeStaffTab);

  const defaultVendorTypes = ['Catering', 'Decoration', 'Photography', 'Entertainment', 'Transport'];
  const uniqueVendorTypes = Array.from(new Set(vendors.map(v => v.category || v.type).filter(Boolean)));
  const displayVendorTypes = Array.from(new Set([...defaultVendorTypes, ...uniqueVendorTypes]));
  const filteredVendors = vendors.filter(v => (v.category || v.type) === activeVendorTab);

  React.useEffect(() => {
    if (!displayStaffRoles.includes(activeStaffTab) && displayStaffRoles.length > 0) {
      setActiveStaffTab(displayStaffRoles[0]);
    }
  }, [displayStaffRoles, activeStaffTab]);

  React.useEffect(() => {
    if (!displayVendorTypes.includes(activeVendorTab) && displayVendorTypes.length > 0) {
      setActiveVendorTab(displayVendorTypes[0]);
    }
  }, [displayVendorTypes, activeVendorTab]);

  const toggleStaffSelection = (staff) => {
    setSelectedStaff(prev => 
      prev.some(s => s.name === staff.name) 
        ? prev.filter(s => s.name !== staff.name) 
        : [...prev, staff]
    );
  };

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {/* Left Side: Client Information */}
            <div className="md:col-span-2 space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Client Information</h3>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Photo Column */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm">
                    <img src={safeBooking.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80"} alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-orange-200 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition text-sm">
                    <Image size={16} />
                    View / Change Photo
                  </button>
                </div>
                
                {/* Details Column */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FileText size={16} className="text-orange-400" />
                      <span className="text-sm">Client ID</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking._id ? "CL-" + safeBooking._id.substring(0, 6).toUpperCase() : "CL-1001"}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <User size={16} className="text-orange-400" />
                      <span className="text-sm">Full Name</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking.clientName || safeBooking.client_id || "Client"}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Mail size={16} className="text-orange-400" />
                      <span className="text-sm">Email</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking.clientEmail || "N/A"}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <Phone size={16} className="text-orange-400" />
                      <span className="text-sm">Phone</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking.phone_number || "N/A"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <MapPinned size={16} className="text-orange-400" />
                      <span className="text-sm">Address</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking.location || safeBooking.address || "N/A"}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2 text-gray-500 mb-1">
                      <FileText size={16} className="text-orange-400" />
                      <span className="text-sm">Notes</span>
                    </div>
                    <div className="font-semibold text-gray-900 ml-6">{safeBooking.notes || "N/A"}</div>
                  </div>
                </div>
              </div>

              {/* Additional Information Box */}
              <div className="mt-auto bg-orange-50/40 border border-orange-100 rounded-xl p-5">
                <h4 className="text-sm font-bold text-gray-800 mb-4">Additional Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Mail size={14} className="text-orange-400" />
                      <span>Preferred Contact</span>
                    </div>
                    <div className="font-medium text-sm text-gray-900">Email</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Globe size={14} className="text-orange-400" />
                      <span>Language</span>
                    </div>
                    <div className="font-medium text-sm text-gray-900">English</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Clock size={14} className="text-orange-400" />
                      <span>Timezone</span>
                    </div>
                    <div className="font-medium text-sm text-gray-900">(GMT-05:00) Eastern Time</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar size={14} className="text-orange-400" />
                      <span>Created On</span>
                    </div>
                    <div className="font-medium text-sm text-gray-900">{safeBooking.createdAt ? new Date(safeBooking.createdAt).toLocaleString() : "N/A"}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side: Booking Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#0f172a] p-5 flex items-center justify-between relative overflow-hidden">
                <div className="flex items-center gap-3 z-10">
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <FileText size={24} className="text-orange-500" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Booking Summary</h3>
                </div>
                <div className="absolute right-0 top-0 opacity-10">
                  <Calendar size={100} className="text-white -mr-6 -mt-6" />
                </div>
              </div>
              
              <div className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Lock size={16} /> <span>Booking ID</span>
                    </div>
                    <span className="font-semibold text-gray-900">{safeBooking._id ? "BK-" + safeBooking._id.substring(0, 6).toUpperCase() : "BK-1001"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar size={16} /> <span>Booking Date</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatDate(safeBooking.createdAt)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Calendar size={16} /> <span>Event Date</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatDate(safeBooking.event_date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <CheckCircle size={16} /> <span>Total Amount</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{safeBooking.total_cost || safeBooking.amount || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Shield size={16} /> <span>Advance Paid</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{safeBooking.advance_paid || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-gray-500">
                      <Shield size={16} /> <span>Remaining Amount</span>
                    </div>
                    <span className="font-semibold text-gray-900">₹{(safeBooking.total_cost || safeBooking.amount || 0) - (safeBooking.advance_paid || 0)}</span>
                  </div>
                </div>

                <div className="border-t border-dashed my-4 border-gray-200"></div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-gray-500">
                    <CreditCard size={16} /> <span>Status</span>
                  </div>
                  <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">{safeBooking.booking_status || safeBooking.status || "Pending"}</span>
                </div>

                <div className="mt-auto pt-6">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 flex gap-3">
                    <Info size={20} className="text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-blue-900">Advance payment received.</p>
                      <p className="text-xs text-blue-700 mt-1">Remaining payment is due before 15 May 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {/* Left Side: Event Details */}
            <div className="md:col-span-2 space-y-6 flex flex-col h-full">
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Calendar size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Event Information</h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Package size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Event Type</div>
                        <div className="font-semibold text-gray-900">{safeBooking.event_type || "Event"}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Event Name</div>
                        <div className="font-semibold text-gray-900">{safeBooking.eventTitle || safeBooking.event_type || "Event Name"}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 border-b border-gray-100 pb-4 md:col-span-2">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Description</div>
                        <div className="font-semibold text-gray-900">Wedding ceremony and reception</div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Guest Count</div>
                        <div className="font-semibold text-gray-900">{safeBooking.guests || 0} Guests</div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Event Date</div>
                        <div className="font-semibold text-gray-900">{formatDate(safeBooking.event_date)}</div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Clock size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Event Time</div>
                        <div className="font-semibold text-gray-900">{safeBooking.time_slot || "N/A"}</div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Hourglass size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Event Duration</div>
                        <div className="font-semibold text-gray-900">5 Hours</div>
                      </div>
                    </div>

                    <div className="flex gap-4 border-b border-gray-100 pb-4 md:col-span-2">
                      <div className="p-2 bg-orange-50 text-orange-500 rounded-lg h-fit border border-orange-100">
                        <Star size={18} />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-1">Special Requirements</div>
                        <div className="font-semibold text-gray-900">Floral stage, Live music, Photography</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-auto">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                    <CheckCircle size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900">Additional Details</h4>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                  <div className="flex gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg h-fit">
                      <Home size={16} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase mb-0.5 font-semibold">Setup Type</div>
                      <div className="font-semibold text-gray-800 text-sm">Indoor</div>
                    </div>
                  </div>
                  <div className="flex gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg h-fit">
                      <Palette size={16} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase mb-0.5 font-semibold">Theme</div>
                      <div className="font-semibold text-gray-800 text-sm">Classic Elegant</div>
                    </div>
                  </div>
                  <div className="flex gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg h-fit">
                      <Music size={16} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase mb-0.5 font-semibold">Music / Entertainment</div>
                      <div className="font-semibold text-gray-800 text-sm">Live Band</div>
                    </div>
                  </div>
                  <div className="flex gap-3 border-b border-gray-100 pb-3">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg h-fit">
                      <Utensils size={16} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase mb-0.5 font-semibold">Food Preference</div>
                      <div className="font-semibold text-gray-800 text-sm">Veg & Non-Veg</div>
                    </div>
                  </div>
                  <div className="flex gap-3 border-b border-gray-100 pb-3 md:col-span-2">
                    <div className="p-2 bg-blue-50 text-blue-500 rounded-lg h-fit">
                      <MessageSquare size={16} />
                    </div>
                    <div>
                      <div className="text-gray-500 text-[11px] uppercase mb-0.5 font-semibold">Other Notes</div>
                      <div className="font-semibold text-gray-800 text-sm">Bride entry at 7:00 PM, Special lighting for stage.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Event Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="bg-[#1e1b4b] p-5 flex items-center justify-between relative overflow-hidden">
                <h3 className="text-lg font-bold text-white z-10">Event Summary</h3>
                <div className="absolute right-0 top-0 opacity-40">
                  <Calendar size={80} className="text-white -mr-4 -mt-4 transform rotate-12" />
                </div>
              </div>
              
              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Event Type</span>
                    <span className="font-bold text-gray-900">{safeBooking.event_type || "Event"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Event Date</span>
                    <span className="font-bold text-gray-900">{formatDate(safeBooking.event_date)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Guest Count</span>
                    <span className="font-bold text-gray-900">{safeBooking.guests || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Event Time</span>
                    <span className="font-bold text-gray-900">{safeBooking.time_slot || "N/A"}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200"></div>

                <div className="bg-orange-50/70 border border-orange-100 rounded-lg p-4 flex gap-3">
                  <Clock size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-orange-600 uppercase mb-0.5">Event Duration</p>
                    <p className="text-sm font-semibold text-orange-900">5 Hours</p>
                  </div>
                </div>
                
                <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-4 flex gap-3">
                  <Info size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-blue-600 uppercase mb-0.5">Special Requirements</p>
                    <p className="text-xs font-semibold text-blue-900">Floral stage, Live music, Photography</p>
                  </div>
                </div>

                <div className="mt-auto rounded-xl overflow-hidden shadow-sm border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&h=200&q=80" alt="Event setup" className="w-full h-32 object-cover" />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
            {/* Left Side: Venue Details */}
            <div className="space-y-6 flex flex-col h-full">
              {/* Venue Information */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <Building size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Venue Information</h4>
                </div>
                <div className="p-5 flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-2/5">
                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&h=400&q=80" alt="Venue" className="w-full h-full object-cover rounded-xl shadow-sm min-h-[200px]" />
                  </div>
                  <div className="w-full xl:w-3/5 space-y-4 text-sm">
                    <div className="grid grid-cols-3 gap-y-3 items-start">
                      <div className="text-gray-500 py-1">Venue Name</div>
                      <div className="col-span-2 font-bold text-gray-900 text-base">{safeBooking.venueName || safeBooking.venue_id || "Venue"}</div>
                      
                      <div className="text-gray-500 py-1">Location</div>
                      <div className="col-span-2 space-y-2">
                        <div className="font-medium text-gray-900 leading-tight">{safeBooking.location || safeBooking.address || "N/A"}</div>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-orange-200 text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-50 transition">
                          <MapPin size={12} /> View on Map
                        </button>
                      </div>
                      
                      <div className="text-gray-500 py-1">Capacity</div>
                      <div className="col-span-2 font-medium text-gray-900 py-1">{safeBooking.guests || 0} Guests</div>
                      
                      <div className="text-gray-500 py-1">Venue Type</div>
                      <div className="col-span-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded border border-blue-100">Indoor</span>
                      </div>
                      
                      <div className="text-gray-500 py-1">Rental Fee</div>
                      <div className="col-span-2 font-bold text-orange-600 py-1">₹{safeBooking.total_cost || safeBooking.amount || 0}</div>
                      
                      <div className="text-gray-500 py-1">Availability</div>
                      <div className="col-span-2 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold px-2 py-1 bg-green-50 rounded border border-green-100">
                          <Check size={14} /> Available
                        </div>
                        <button className="flex items-center gap-1.5 text-blue-600 text-xs font-bold hover:underline">
                          <Calendar size={14} /> Check Availability
                        </button>
                      </div>
                      
                      <div className="text-gray-500 py-1">Amenities</div>
                      <div className="col-span-2 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200">
                          <Car size={12} className="text-blue-500" /> Parking
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200">
                          <Utensils size={12} className="text-blue-500" /> Catering
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200">
                          <Palette size={12} className="text-blue-500" /> Decoration
                        </span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-200">
                          <Wifi size={12} className="text-blue-500" /> WiFi
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <LayoutGrid size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900">Additional Information</h4>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  {[
                    "Air Conditioned Hall", "Valet Parking",
                    "Stage with Lighting", "Power Backup",
                    "Bridal Room Available", "2 Changing Rooms",
                    "Sound System Available", "Wheelchair Accessible"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venue Description */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm mt-auto">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900">Venue Description</h4>
                </div>
                <div className="p-5 text-sm text-gray-600 leading-relaxed">
                  {safeBooking.notes || "Venue description not provided."}
                </div>
              </div>
            </div>
            
            {/* Right Side: Venue Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Image size={18} />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Venue Gallery</h4>
              </div>
              
              <div className="p-6 space-y-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&h=200&q=80" className="w-full h-32 object-cover rounded-xl shadow-sm hover:opacity-90 transition cursor-pointer" alt="Gallery 1" />
                  <img src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=300&h=200&q=80" className="w-full h-32 object-cover rounded-xl shadow-sm hover:opacity-90 transition cursor-pointer" alt="Gallery 2" />
                  <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&h=200&q=80" className="w-full h-32 object-cover rounded-xl shadow-sm hover:opacity-90 transition cursor-pointer" alt="Gallery 3" />
                  <img src="https://images.unsplash.com/photo-1505366518450-4d54ebf7911b?auto=format&fit=crop&w=300&h=200&q=80" className="w-full h-32 object-cover rounded-xl shadow-sm hover:opacity-90 transition cursor-pointer" alt="Gallery 4" />
                </div>

                <button className="w-full py-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition group cursor-pointer text-gray-500">
                  <UploadCloud size={28} className="text-gray-400 group-hover:text-blue-500 transition" />
                  <div className="text-center mt-2">
                    <span className="font-bold text-gray-800 block">Add More Photos</span>
                    <span className="text-xs">JPG, PNG up to 5MB</span>
                  </div>
                </button>

                <div className="mt-auto">
                  <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                      <Info size={18} /> Important Note
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed pl-7">
                      Please review the venue information carefully. You can add more details or photos if required.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {/* Left Side */}
            <div className="md:col-span-2 space-y-6 flex flex-col h-full">
              
              {/* Payment Overview */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm p-5">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <CreditCard size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Payment Overview</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="col-span-2 md:col-span-1 border-r border-gray-100 pr-4">
                    <div className="text-gray-500 text-xs mb-1">Total Amount</div>
                    <div className="font-bold text-blue-600 text-2xl flex items-center justify-between">
                      ₹{(safeBooking.total_cost || safeBooking.amount || 0).toLocaleString()}
                      <div className="bg-blue-50 p-1.5 rounded-full text-blue-500"><DollarSign size={16} /></div>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 border-r border-gray-100 px-4">
                    <div className="text-gray-500 text-xs mb-1">Advance Paid</div>
                    <div className="font-bold text-green-600 text-xl flex items-center justify-between mt-1">
                      ₹{(safeBooking.advance_paid || 0).toLocaleString()}
                      <div className="bg-green-50 p-1.5 rounded-full text-green-500"><Download size={14} className="rotate-180" /></div>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-1 border-r border-gray-100 px-4">
                    <div className="text-gray-500 text-xs mb-1">Remaining Amount</div>
                    <div className="font-bold text-orange-600 text-xl flex items-center justify-between mt-1">
                      ₹{((safeBooking.total_cost || safeBooking.amount || 0) - (safeBooking.advance_paid || 0)).toLocaleString()}
                      <div className="bg-orange-50 p-1.5 rounded-full text-orange-500"><FileText size={14} /></div>
                    </div>
                  </div>
                  <div className="border-r border-gray-100 px-4 flex flex-col justify-center">
                    <div className="text-gray-500 text-xs mb-2">Payment Status</div>
                    <div><span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md border border-orange-200">Pending</span></div>
                  </div>
                  <div className="px-4 flex flex-col justify-center">
                    <div className="text-gray-500 text-xs mb-2">Due Date</div>
                    <div className="flex items-center gap-1.5 text-red-500 font-semibold text-sm">
                      <Calendar size={14} /> {formatDate(safeBooking.event_date)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 flex items-center justify-between border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gray-50 text-gray-600 rounded-lg">
                      <FileText size={18} />
                    </div>
                    <h4 className="font-bold text-gray-900">Payment History</h4>
                  </div>
                  <button 
                    onClick={() => setShowInvoice(true)}
                    className="flex items-center gap-2 border border-orange-500 text-orange-500 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-orange-50 transition"
                  >
                    <Download size={16} /> Download Receipt
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b text-gray-600 text-xs uppercase">
                      <tr>
                        <th className="px-5 py-3 font-semibold">Payment ID</th>
                        <th className="px-5 py-3 font-semibold">Payment Date</th>
                        <th className="px-5 py-3 font-semibold">Payment Type</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        <th className="px-5 py-3 font-semibold">Payment Method</th>
                        <th className="px-5 py-3 font-semibold">Transaction ID</th>
                        <th className="px-5 py-3 font-semibold">Status</th>
                        <th className="px-5 py-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      <tr className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-bold text-gray-900">PAY-001</td>
                        <td className="px-5 py-4 text-gray-600">15 Apr 2024</td>
                        <td className="px-5 py-4 text-gray-600">Advance Payment</td>
                        <td className="px-5 py-4 font-bold text-gray-900">₹{(safeBooking.advance_paid || 0).toLocaleString()}</td>
                        <td className="px-5 py-4 text-gray-600 flex items-center gap-2"><Building size={14} className="text-gray-400" /> Bank Transfer</td>
                        <td className="px-5 py-4 text-gray-600">TRX1234567890</td>
                        <td className="px-5 py-4"><span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200">Paid</span></td>
                        <td className="px-5 py-4 text-gray-500 text-xs max-w-[150px]">Advance payment received</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-5 py-4 font-bold text-gray-900">PAY-002</td>
                        <td className="px-5 py-4 text-gray-600">-</td>
                        <td className="px-5 py-4 text-gray-600">Remaining Payment</td>
                        <td className="px-5 py-4 font-bold text-gray-900">₹{((safeBooking.total_cost || safeBooking.amount || 0) - (safeBooking.advance_paid || 0)).toLocaleString()}</td>
                        <td className="px-5 py-4 text-gray-600">-</td>
                        <td className="px-5 py-4 text-gray-600">-</td>
                        <td className="px-5 py-4"><span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded border border-orange-200">Pending</span></td>
                        <td className="px-5 py-4 text-gray-500 text-xs max-w-[150px]">Due before {formatDate(safeBooking.event_date)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upcoming Payment */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 flex items-center justify-between relative overflow-hidden">
                <div className="space-y-4 z-10 w-2/3">
                  <div className="flex items-center gap-2 text-orange-600 font-bold">
                    <Bell size={18} /> Upcoming Payment
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 text-sm">
                    <AlertCircle size={16} className="text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>The remaining payment of <strong>$10,000.00</strong> is due before {formatDate(safeBooking.event_date)}.</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden pr-3">
                       <div className="px-3 text-gray-500 text-xs bg-gray-50 border-r border-gray-200 py-2.5">Set Payment Due Date</div>
                       <input 
                         type="date" 
                         value={paymentDueDate} 
                         onChange={(e) => setPaymentDueDate(e.target.value)}
                         min={todayDateStr}
                         max={maxDueDateStr}
                         className="px-3 py-2 text-sm text-gray-700 outline-none w-36" 
                       />
                    </div>
                    <button 
                      onClick={() => alert("Payment due date saved successfully!")}
                      className="bg-[#ea580c] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#c2410c] transition shadow-sm"
                    >
                      Update Due Date
                    </button>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-90 w-40 h-40">
                  <img src="https://cdni.iconscout.com/illustration/premium/thumb/payment-history-4437021-3725458.png" alt="Payment" className="w-full h-full object-contain" />
                </div>
              </div>

              {/* Payment Actions */}
              <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm p-5 mt-auto">
                <div className="flex items-center gap-3 mb-5 border-b border-gray-50 pb-3">
                  <div className="p-1.5 bg-gray-50 text-gray-600 rounded-lg">
                    <CreditCard size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900">Payment Actions</h4>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Type</label>
                    <select className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white">
                      <option>Select Payment Type</option>
                      <option>Remaining Payment</option>
                      <option>Additional Charges</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Amount</label>
                    <input type="text" className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Date</label>
                    <div className="relative">
                      <input type="text" className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white" placeholder="dd-mm-yyyy" />
                      <Calendar size={16} className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Payment Method</label>
                    <select className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white">
                      <option>Select Method</option>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Cash</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Transaction ID</label>
                    <input type="text" className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white" placeholder="Enter Transaction ID" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                    <textarea className="w-full border-gray-200 border rounded-lg p-2.5 text-sm outline-none focus:ring-1 focus:ring-orange-500 bg-white resize-none" rows="1" placeholder="Add notes here..."></textarea>
                  </div>
                  <div className="md:col-span-4 flex justify-end mt-2">
                    <button className="bg-[#ea580c] text-white px-8 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#c2410c] transition shadow-sm">
                      Add Payment
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Side: Booking Summary & Included Services */}
            <div className="bg-transparent flex flex-col h-full gap-6">
              
              {/* Booking Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-[#0f172a] p-5 flex items-center justify-between relative overflow-hidden">
                  <h3 className="text-lg font-bold text-white z-10">Booking Summary</h3>
                  <div className="absolute right-4 top-2 z-10 opacity-80">
                     <CreditCard size={40} className="text-blue-300" />
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Booking ID</span>
                    <span className="font-bold text-gray-900">{safeBooking._id ? "BK-" + safeBooking._id.substring(0, 6).toUpperCase() : "BK-1001"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Client Name</span>
                    <span className="font-bold text-gray-900">{safeBooking.clientName || safeBooking.client_id || "Client"}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-bold text-gray-900">{safeBooking.phone_number || "N/A"}</span>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2 pt-2"></div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-bold text-gray-900">₹{(safeBooking.total_cost || safeBooking.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Advance Paid</span>
                    <span className="font-bold text-green-600">₹{(safeBooking.advance_paid || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Remaining Amount</span>
                    <span className="font-bold text-orange-600">$10,000.00</span>
                  </div>
                  
                  <div className="border-t border-gray-100 my-2 pt-2"></div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Due Date</span>
                    <div className="flex items-center gap-1.5 text-red-500 font-semibold">
                      <Calendar size={14} /> 15 May 2024
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-3">
                    <span className="text-gray-500">Payment Status</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md border border-orange-200">Pending</span>
                  </div>
                </div>
              </div>

              {/* Included Services */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                  <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <FileText size={18} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg">Included Services</h4>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-blue-50 text-blue-500 rounded text-xs"><Building size={16} /></div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">Venue</div>
                        <div className="text-sm font-semibold text-gray-900">Grand Palace</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">$10,000.00</div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 text-gray-500 rounded text-xs"><Utensils size={16} /></div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">Catering</div>
                        <div className="text-sm font-semibold text-gray-900">Deluxe Catering</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">$3,000.00</div>
                  </div>
                  
                  <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-gray-100 text-gray-500 rounded text-xs"><Palette size={16} /></div>
                      <div>
                        <div className="text-xs text-gray-500 font-semibold">Decoration</div>
                        <div className="text-sm font-semibold text-gray-900">Royal Decoration</div>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">$2,000.00</div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 mt-2">
                    <span className="font-bold text-gray-900 text-sm">Total Services</span>
                    <span className="font-bold text-blue-600 text-base">$15,000.00</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4">Select Staff by Type</h3>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar - Categories */}
              <div className="w-full lg:w-1/4">
                <h4 className="font-semibold text-gray-900 mb-3">Staff Types</h4>
                <div className="space-y-1">
                  {displayStaffRoles.map(type => (
                    <div 
                      key={type}
                      onClick={() => setActiveStaffTab(type)}
                      className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer transition ${activeStaffTab === type ? 'bg-orange-50 border-l-4 border-amber-500 text-amber-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <div className="flex items-center gap-3">
                        {type === 'Security' ? <Users size={18} /> : <User size={18} />}
                        <span>{type}</span>
                      </div>
                      <span className="text-xs bg-white rounded-full px-2 py-0.5 border text-gray-500">
                        {staffMembers.filter(s => s.role === type).length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Middle Section - Table */}
              <div className="w-full lg:w-2/4 bg-white rounded-xl border shadow-sm flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <Users size={18} className="text-gray-500" />
                    <span>{activeStaffTab} Staff</span>
                  </div>
                  <span className="text-xs font-medium text-green-600">{filteredStaff.length} Available</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">Staff Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Experience</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Availability</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredStaff.length > 0 ? filteredStaff.map((s, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                              <img src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`} alt={s.name} />
                            </div>
                            <span className="font-medium text-gray-900">{s.name}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{s.role}</td>
                          <td className="px-4 py-3 text-gray-600">{s.experience}</td>
                          <td className={`px-4 py-3 font-medium ${s.status === 'Active' || s.availability === 'Available' ? 'text-green-600' : 'text-red-500'}`}>{s.status || s.availability || "Available"}</td>
                          <td className="px-4 py-3 text-center">
                            <input 
                              type="checkbox" 
                              checked={selectedStaff.some(selected => selected.name === s.name)}
                              onChange={() => toggleStaffSelection(s)}
                              className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" 
                            />
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-center py-4 text-gray-500">No {activeStaffTab} staff available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 bg-gray-50/50 mt-auto border-t text-xs text-gray-500">
                  Please select 3 to 4 security staff for this event.
                </div>
              </div>

              {/* Right Sidebar - Selected */}
              <div className="w-full lg:w-1/4 bg-gray-50 rounded-xl border p-5 flex flex-col h-[500px]">
                <h4 className="font-bold text-gray-900 border-b pb-3 mb-4">Selected Staff</h4>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {selectedStaff.length > 0 ? selectedStaff.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white border p-0.5 flex-shrink-0">
                        <img src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`} className="rounded-full w-full h-full object-cover" alt={s.name} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 text-sm truncate">{s.name}</div>
                        <div className="text-xs text-gray-500 truncate">{s.role}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-gray-500 py-4 text-center">No staff selected.</div>
                  )}
                </div>
                <div className="pt-4 border-t mt-4">
                  <div className="text-sm font-semibold text-gray-700">Total Selected: {selectedStaff.length}</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-bold mb-4">Select Vendors by Type</h3>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar - Categories */}
              <div className="w-full lg:w-1/4">
                <h4 className="font-semibold text-gray-900 mb-3">Vendor Types</h4>
                <div className="space-y-1">
                  {displayVendorTypes.map(type => (
                    <div 
                      key={type}
                      onClick={() => setActiveVendorTab(type)}
                      className={`flex justify-between items-center px-4 py-3 rounded-lg cursor-pointer transition ${activeVendorTab === type ? 'bg-orange-50 border-l-4 border-amber-500 text-amber-700 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={18} />
                        <span>{type}</span>
                      </div>
                      <span className="text-xs bg-white rounded-full px-2 py-0.5 border text-gray-500">{vendors.filter(v => (v.category || v.type) === type).length}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Middle Section - Table */}
              <div className="w-full lg:w-2/4 bg-white rounded-xl border shadow-sm flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <ShoppingBag size={18} className="text-gray-500" />
                    <span>{activeVendorTab} Vendors</span>
                  </div>
                  <span className="text-xs font-medium text-green-600">{filteredVendors.length} Available</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-gray-600">Vendor Name</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Service Type</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Rating</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Availability</th>
                        <th className="px-4 py-3 font-semibold text-gray-600 text-center">Select</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredVendors.length > 0 ? filteredVendors.map((v, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-4 font-medium text-gray-900">{v.name || v.vendorName}</td>
                          <td className="px-4 py-4 text-gray-600">{v.category || v.type}</td>
                          <td className="px-4 py-4 text-amber-500 font-medium">★★★★ {v.rating || "4.5"}</td>
                          <td className={`px-4 py-4 font-medium ${v.status === 'Active' || v.contractStatus === 'Active' || v.avail === 'Available' ? 'text-green-600' : 'text-red-500'}`}>{v.status || v.contractStatus || "Available"}</td>
                          <td className="px-4 py-4 text-center">
                            <input type="checkbox" className="w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500" />
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="5" className="text-center py-4 text-gray-500">No {activeVendorTab} vendors available.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Sidebar - Selected */}
              <div className="w-full lg:w-1/4 bg-gray-50 rounded-xl border p-5 flex flex-col h-[500px]">
                <h4 className="font-bold text-gray-900 border-b pb-3 mb-4">Selected Vendors</h4>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white border p-0.5 flex-shrink-0">
                      <img src="https://i.pravatar.cc/150?img=5" className="rounded-full w-full h-full object-cover" alt="Vendor" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">Royal Catering</div>
                      <div className="text-xs text-gray-500 truncate">Catering</div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t mt-4">
                  <div className="text-sm font-semibold text-gray-700">Total Selected: 1</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Select Resources</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-2">Resource Name</th>
                    <th className="px-4 py-2">Category</th>
                    <th className="px-4 py-2">Quantity Available</th>
                    <th className="px-4 py-2">Select Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Round Tables", cat: "Furniture", qty: "30" },
                    { name: "Chairs", cat: "Furniture", qty: "200" },
                    { name: "Stage Setup", cat: "Equipment", qty: "1" },
                    { name: "LED Screens", cat: "Equipment", qty: "2" },
                  ].map((r, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2 font-medium">{r.name}</td>
                      <td className="px-4 py-2">{r.cat}</td>
                      <td className="px-4 py-2">{r.qty}</td>
                      <td className="px-4 py-2">
                        <input type="number" min="0" max={r.qty} className="border rounded p-1 w-16" placeholder="0" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Timeline & Messages</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-4">Timeline</h4>
                <div className="space-y-4 border-l-2 border-amber-500 ml-2 pl-4 text-sm relative">
                  <div>
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500"></div>
                    <span className="text-gray-500 text-xs block">15 Apr 2024</span>
                    <span className="font-medium block">Booking Created</span>
                  </div>
                  <div>
                    <div className="absolute -left-2 top-10 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    <span className="text-gray-500 text-xs block">16 Apr 2024</span>
                    <span className="font-medium block">Advance Payment Received</span>
                  </div>
                  <div>
                    <div className="absolute -left-2 top-20 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                    <span className="text-gray-500 text-xs block">20 Apr 2024</span>
                    <span className="font-medium block">Venue Confirmed</span>
                  </div>
                  <div>
                    <div className="absolute -left-2 top-[120px] w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                    <span className="text-gray-500 text-xs block">Pending</span>
                    <span className="font-medium block text-gray-500">Remaining Payment Due</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Send Message</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">To</label>
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2">
                      <option>{safeBooking.clientName || safeBooking.client_id || "Client"} (Client)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2" value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2" rows="4" placeholder="Type your message here..." value={msgBody} onChange={(e) => setMsgBody(e.target.value)}></textarea>
                  </div>
                  <button onClick={handleSendMessage} disabled={isSendingMsg || !msgBody.trim()} className="bg-amber-600 text-white px-4 py-2 rounded font-medium text-sm w-full hover:bg-amber-700 disabled:opacity-50">
                    {isSendingMsg ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 9:
        return (
          <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Successfully Completed!</h2>
            <p className="text-gray-500">Booking ID: <span className="font-bold text-gray-900">{safeBooking._id ? "BK-" + safeBooking._id.substring(0, 6).toUpperCase() : "BK-1001"}</span></p>
            <p className="text-gray-500 max-w-md mx-auto pb-6">
              The event booking has been confirmed and all details have been saved successfully.
            </p>
            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <button onClick={() => setCurrentStep(10)} className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 w-full transition">
                View Booking Details
              </button>
              <button onClick={onClose} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 w-full transition">
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      case 10:
        return (
          <div className="space-y-6 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-amber-600" /> Complete Booking Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto pr-2">
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2"><User size={18} className="text-blue-500" /> Client Details</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Name:</span> <span className="font-medium">{safeBooking.clientName || safeBooking.client_id || "Client"}</span>
                  <span className="text-gray-500">Email:</span> <span className="font-medium">{safeBooking.clientEmail || "N/A"}</span>
                  <span className="text-gray-500">Phone:</span> <span className="font-medium">{safeBooking.phone_number || "N/A"}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2"><MapPin size={18} className="text-red-500" /> Event & Venue</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Event:</span> <span className="font-medium">{safeBooking.event_type || "Event"}</span>
                  <span className="text-gray-500">Venue:</span> <span className="font-medium">{safeBooking.venueName || safeBooking.venue_id || "Venue"}</span>
                  <span className="text-gray-500">Date:</span> <span className="font-medium">{formatDate(safeBooking.event_date)}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2"><CreditCard size={18} className="text-green-500" /> Payment Info</h4>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-500">Total:</span> <span className="font-medium">₹{safeBooking.total_cost || safeBooking.amount || 0}</span>
                  <span className="text-gray-500">Advance:</span> <span className="font-medium text-green-600">₹{safeBooking.advance_paid || 0}</span>
                  <span className="text-gray-500">Pending:</span> <span className="font-medium text-orange-600">₹{(safeBooking.total_cost || safeBooking.amount || 0) - (safeBooking.advance_paid || 0)}</span>
                  <span className="text-gray-500">Due Date:</span> <span className="font-medium text-red-500">{paymentDueDate}</span>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
                <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center gap-2"><Users size={18} className="text-purple-500" /> Staff & Vendors</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Assigned Staff:</span>
                    {selectedStaff.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedStaff.map((s, i) => <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">{s.role}: {s.name}</span>)}
                      </div>
                    ) : <span className="text-gray-400 italic">None selected</span>}
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">Vendors & Resources:</span>
                    <span className="font-medium">Vendors and Resources selected will be processed accordingly.</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button onClick={onClose} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition">
                Close & Return
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl flex flex-col max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-gray-400 cursor-pointer hover:text-gray-700" onClick={onClose}>&larr;</span>
              Booking ID: BK-1001
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Stepper Header */}
        <div className="px-8 py-6 border-b bg-gray-50/50 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                        isActive
                          ? "border-amber-600 bg-amber-600 text-white shadow-md"
                          : isCompleted
                          ? "border-amber-600 bg-white text-amber-600"
                          : "border-gray-300 bg-white text-gray-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span className={`text-[10px] sm:text-xs mt-2 font-medium w-16 text-center ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`h-[2px] w-8 sm:w-12 lg:w-16 mx-2 mb-6 ${isCompleted ? 'bg-amber-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center bg-gray-50 rounded-b-2xl">
          {currentStep > 1 && currentStep < 9 ? (
            <button
              onClick={handleBack}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
            >
              Back
            </button>
          ) : (
            <div></div> // Placeholder for alignment
          )}

          {currentStep < 9 && (
            <button
              onClick={async () => {
                if (currentStep === 8) {
                  try {
                    await fetch(`http://localhost:5000/api/bookings/${safeBooking._id || safeBooking.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        assignedStaff: selectedStaff.map(s => s.name)
                      })
                    });
                  } catch (error) {
                    console.error("Failed to update booking:", error);
                  }
                }
                handleNext();
              }}
              className="px-6 py-2 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition ml-auto flex items-center gap-2"
            >
              {currentStep === 8 ? "Complete" : "Next"} 
              {currentStep < 8 && <ChevronRight size={16} />}
            </button>
          )}
        </div>
      </div>
      
      {showInvoice && (
        <Invoice 
          bookingData={safeBooking} 
          paymentData={{}} 
          onClose={() => setShowInvoice(false)} 
        />
      )}
    </div>
  );
}
