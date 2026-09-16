import React, { useState, useEffect } from 'react';
import {
  FileText, User, Clock, MapPin, Calendar, Users, Tag,
  FileEdit, X, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Info,
  Camera, Music, BedDouble, Car, Utensils, Award, CreditCard, Plus
} from 'lucide-react';

function BookingDetails({ bookingId, onBack, onNext }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingVendor, setViewingVendor] = useState(null);
  const [replacingVendor, setReplacingVendor] = useState(null);
  const [selectedNewVendorId, setSelectedNewVendorId] = useState("");
  const [customAssignedVendors, setCustomAssignedVendors] = useState(null);
  const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
  const [assignCategory, setAssignCategory] = useState("Catering");
  const [assignVendorId, setAssignVendorId] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
  const [assignStaffId, setAssignStaffId] = useState("");
  const [staffRole, setStaffRole] = useState("Event Staff");

  // Payment & Attendance State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPayee, setPaymentPayee] = useState(null); // { id, name, type: 'Staff' | 'Vendor' }
  const [paymentForm, setPaymentForm] = useState({ amount: "", paymentMethod: "UPI" });

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [viewingStaff, setViewingStaff] = useState(null);
  const [reportingDate, setReportingDate] = useState("");
  const [reportingTime, setReportingTime] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const bookingRes = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);
        const bookingData = await bookingRes.json();
        if (bookingData.success) {
          setBooking(bookingData.data);
        }

        const staffRes = await fetch("http://localhost:5000/api/staff");
        const staffData = await staffRes.json();
        if (Array.isArray(staffData)) {
          setStaffList(staffData);
        }

        const vendorRes = await fetch("http://localhost:5000/api/vendors");
        const vendorData = await vendorRes.json();
        if (Array.isArray(vendorData)) {
          setVendorList(vendorData);
        }

        const assignmentRes = await fetch(`http://localhost:5000/api/staff-assignments/event/${bookingId}`);
        const assignmentData = await assignmentRes.json();
        if (assignmentData.success) {
          setAssignments(assignmentData.assignments);
        }
      } catch (err) {
        console.error("Failed to load details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [bookingId]);

  const handleProcessPayment = async () => {
    if (!paymentForm.amount) {
      alert("Please enter a payment amount.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/finance/process-work-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking._id,
          payeeId: paymentPayee.id,
          payeeType: paymentPayee.type,
          amount: paymentForm.amount,
          paymentMethod: paymentForm.paymentMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${paymentPayee.type} payment processed successfully!`);
        setIsPaymentModalOpen(false);
        setPaymentForm({ amount: "", paymentMethod: "UPI" });
        // Optionally refetch assignments or update local state
        const updatedAssignments = assignments.map(a => {
          if (paymentPayee.type === "Staff" && a.employeeId._id === paymentPayee.id) {
            return { ...a, paymentStatus: "Paid" };
          }
          return a;
        });
        setAssignments(updatedAssignments);
      } else {
        alert(data.message || "Payment failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error processing payment");
    }
  };

  const handleViewAttendance = async (assignment) => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/staff/${assignment.employeeId._id}?assignmentId=${assignment._id}`);
      const data = await res.json();
      if (data.success) {
        setAttendanceData(data.attendance);
        setViewingStaff(assignment.employeeId.name);
        setIsAttendanceModalOpen(true);
      } else {
        alert("Could not fetch attendance");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching attendance");
    }
  };

  const handleApprove = async () => {
    if (!window.confirm("Are you sure you want to confirm this booking?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/approve`, {
        method: "PUT"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Booking confirmed successfully!");
        setBooking(data.data);
      } else {
        alert("Failed to confirm booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Error confirming booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt("Please enter the reason for cancellation:");
    if (reason === null) return;
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/admin-cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancellationReason: reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Booking cancelled successfully.");
        setBooking(data.data);
      } else {
        alert("Failed to cancel booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Please enter the reason for rejection:");
    if (reason === null) return; // cancelled prompt
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}/reject`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rejectionReason: reason })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Booking rejected successfully.");
        setBooking(data.data);
      } else {
        alert("Failed to reject booking.");
      }
    } catch (err) {
      console.error(err);
      alert("Error rejecting booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-sm">Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <p className="text-red-500 font-bold">Booking not found.</p>
        <button onClick={onBack} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-colors">Go Back</button>
      </div>
    );
  }

  const total = booking.total_cost || booking.amount || 0;
  const paid = booking.advance_paid || 0;
  const remaining = Math.max(total - paid, 0);

  // Mappings
  const assignedStaffNames = (booking.assignedStaff || [])
    .map(id => staffList.find(s => s.id === id || s._id === id))
    .filter(Boolean);

  const displayStaffList = [...assignments];
  assignedStaffNames.forEach(staff => {
    if (!displayStaffList.find(a => a.employeeId?._id === staff._id)) {
      displayStaffList.push({
        _id: `dummy-${staff._id}`,
        employeeId: staff,
        role: staff.role || "Pending Role",
        assignmentStatus: "Pending Schedule",
        reportingDate: "N/A",
        reportingTime: "N/A",
        isPending: true
      });
    }
  });

  const defaultVendorList = [
    { id: 'v1', name: 'Food Fiesta Catering', category: 'Catering', phone: '+91 98765 44321', email: 'catering@foodfiesta.com', address: 'MG Road, Bangalore', status: 'Active', contractBasis: 'Per Event (₹45,000)' },
    { id: 'v2', name: 'Royal Stage Decorators', category: 'Decoration', phone: '+91 98765 11223', email: 'decor@royalstage.com', address: 'Indiranagar, Bangalore', status: 'Active', contractBasis: 'Per Event (₹25,000)' },
    { id: 'v3', name: 'Perfect Click 4K Studio', category: 'Photography', phone: '+91 98765 88990', email: 'studio@perfectclick.com', address: 'Koramangala, Bangalore', status: 'Active', contractBasis: 'Per Event (₹35,000)' },
    { id: 'v4', name: 'RockStar DJ & Lighting', category: 'DJ & Sound', phone: '+91 98765 77665', email: 'dj@rockstar.com', address: 'HSR Layout, Bangalore', status: 'Active', contractBasis: 'Per Event (₹18,000)' }
  ];

  const assignedVendorNames = (booking.assignedVendors || [])
    .map(id => vendorList.find(v => v.id === id || v._id === id))
    .filter(Boolean);

  const activeDisplayVendors = customAssignedVendors || (assignedVendorNames.length > 0 ? assignedVendorNames : defaultVendorList);

  const handleConfirmReplaceVendor = () => {
    if (!selectedNewVendorId) {
      alert("Please select a new replacement vendor!");
      return;
    }
    const foundNew = vendorList.find(v => (v.id === selectedNewVendorId || v._id === selectedNewVendorId));
    const newVendorObj = foundNew || {
      id: selectedNewVendorId,
      name: selectedNewVendorId.includes('101') ? 'Gourmet Feast Caterers' : selectedNewVendorId.includes('102') ? 'Elite Event Decorators' : 'Supreme Luxury Services',
      category: replacingVendor?.category || 'Catering',
      phone: '+91 98765 99112',
      email: 'contact@newvendor.com',
      status: 'Active',
      contractBasis: 'Per Event Contract'
    };

    const updated = activeDisplayVendors.map(v => (v.id === replacingVendor?.id || v._id === replacingVendor?.id || v.category === replacingVendor?.category ? { ...newVendorObj, category: replacingVendor?.category || v.category } : v));

    setCustomAssignedVendors(updated);
    setReplacingVendor(null);
    setSelectedNewVendorId("");
  };

  const handleConfirmReplace = handleConfirmReplaceVendor;

  const handleConfirmAssignVendor = () => {
    if (!assignVendorId) {
      alert("Please select a vendor to assign!");
      return;
    }
    const found = vendorList.find(v => (v.id === assignVendorId || v._id === assignVendorId));
    const newVendor = found || {
      id: assignVendorId,
      name: assignVendorId.includes('101') ? 'Gourmet Feast Caterers' : assignVendorId.includes('102') ? 'Elite Event Decorators' : 'Supreme Luxury Services',
      category: assignCategory,
      phone: '+91 98765 99112',
      email: 'contact@assignedvendor.com',
      status: 'Active',
      contractBasis: 'Per Event Contract'
    };

    const currentList = activeDisplayVendors || [];
    setCustomAssignedVendors([...currentList, newVendor]);
    setIsAssignVendorModalOpen(false);
    setAssignVendorId("");
  };

  const handleConfirmAssignStaff = async () => {
    if (!assignStaffId) {
      alert("Please select a staff member to assign!");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/staff-assignments/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: assignStaffId,
          eventId: bookingId,
          role: staffRole,
          reportingDate: reportingDate || booking.event_date?.split('T')[0],
          reportingTime: reportingTime || "09:00 AM",
          eventDate: booking.event_date?.split('T')[0] || new Date().toISOString().split('T')[0],
          eventStartTime: "10:00 AM",
          eventEndTime: "08:00 PM",
          responsibilities,
          clientPreferences: booking.notes
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Staff assigned successfully and notification sent.");
        setAssignments([...assignments, { ...data.assignment, employeeId: staffList.find(s => s._id === assignStaffId) }]);
        setIsAssignStaffModalOpen(false);
      } else {
        alert("Failed to assign staff.");
      }
    } catch (err) {
      console.error(err);
      alert("Error assigning staff.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("approve")) return 'bg-green-50 text-green-700 border-green-200';
    if (s.includes("pending")) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (s.includes("cancel") || s.includes("reject")) return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1400px]">

      {/* Header & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[14px]">
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBack}>Dashboard</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBack}>Bookings</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Event Details</span>
        </div>
        <button onClick={onBack} className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition-colors flex items-center gap-1.5">
          <ArrowRight size={14} className="rotate-180" /> Back to Dashboard
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-600 mb-1">Booking ID</p>
            <h3 className="text-[14px] font-black text-orange-500 font-mono">#{booking._id.slice(-8).toUpperCase()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
            <User size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-600 mb-1">Client ID</p>
            <h3 className="text-[14px] font-black text-blue-600 font-mono">#{booking.client_id || "N/A"}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100">
            <CreditCard size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-600 mb-1">Cost (Paid / Total)</p>
            <h3 className="text-[14px] font-black text-gray-900">₹{paid.toLocaleString()} / ₹{total.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-400 flex items-center justify-center shrink-0 border border-orange-100">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-600 mb-2">Booking Status</p>
            <span className={`inline-block px-3 py-1 rounded text-[11px] font-black border ${getStatusBadge(booking.booking_status || booking.status)}`}>
              {booking.booking_status || booking.status || "Pending Approval"}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Information: Client & Event */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Client Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
              <User size={18} className="text-orange-500" />
              Client Information
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-400 uppercase">
                  {booking.clientName ? booking.clientName.slice(0, 2) : "CL"}
                </div>
              </div>

              <div className="flex-1 w-full text-[13px]">
                <div className="grid grid-cols-[130px_auto] gap-x-4 gap-y-3.5">
                  <div className="text-gray-500 font-bold flex items-center gap-2"><User size={14} /> Client Name</div>
                  <div className="text-gray-900 font-semibold">{booking.clientName || "N/A"}</div>

                  <div className="text-gray-500 font-bold flex items-center gap-2"><User size={14} /> Mobile Number</div>
                  <div className="text-gray-900 font-semibold">{booking.phone_number || "N/A"}</div>

                  <div className="text-gray-500 font-bold flex items-center gap-2"><User size={14} /> Email</div>
                  <div className="text-gray-900 font-semibold truncate">{booking.clientEmail || "N/A"}</div>

                  <div className="text-gray-500 font-bold flex items-start gap-2 pt-0.5"><MapPin size={14} className="shrink-0 mt-0.5" /> Venue Address</div>
                  <div className="text-gray-900 font-semibold leading-relaxed">{booking.location || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
              <Calendar size={18} className="text-orange-500" />
              Event Details
            </h3>
            <div className="flex-1 w-full text-[13px]">
              <div className="grid grid-cols-[130px_auto] gap-x-4 gap-y-3.5">
                <div className="text-gray-500 font-bold flex items-center gap-2"><FileText size={14} /> Event Type</div>
                <div className="text-gray-900 font-semibold">{booking.eventTitle || booking.event_type || "N/A"}</div>

                <div className="text-gray-500 font-bold flex items-center gap-2"><Calendar size={14} /> Date Scheduled</div>
                <div className="text-gray-900 font-semibold">
                  {booking.event_date ? new Date(booking.event_date).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A"}
                </div>

                <div className="text-gray-500 font-bold flex items-center gap-2"><Clock size={14} /> Scheduled Time</div>
                <div className="text-gray-900 font-semibold">{booking.time_slot || "Full Day"}</div>

                <div className="text-gray-500 font-bold flex items-center gap-2"><Users size={14} /> Assigned Venue</div>
                <div className="text-gray-900 font-semibold">
                  {booking.isOwnVenue && booking.ownVenueDetails?.name
                    ? booking.ownVenueDetails.name
                    : booking.venueName || booking.venue_name || booking.location || "To be confirmed"}
                </div>

                <div className="text-gray-500 font-bold flex items-start gap-2 pt-0.5"><FileEdit size={14} className="shrink-0 mt-0.5" /> Special Notes</div>
                <div className="text-gray-900 font-semibold leading-relaxed">{booking.notes || "No special requests mentioned."}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Catering Menu & Seating Arrangements details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-[16px] font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-50 pb-3">
          <Utensils size={18} className="text-orange-500" />
          Catering, Food & Seating Services Mappings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[13px]">

          {/* Catering Info */}
          <div className="bg-orange-50/30 border border-orange-100 rounded-xl p-5 space-y-4">
            <h4 className="font-bold text-orange-900 flex items-center gap-2 text-sm">
              <Utensils size={16} /> Food Menu Selection
            </h4>
            <div className="grid grid-cols-[130px_auto] gap-y-3">
              <div className="text-gray-500 font-semibold">Catering Package:</div>
              <div className="text-gray-900 font-bold">{booking.cateringPackage || "Custom Package"}</div>

              <div className="text-gray-500 font-semibold">Menu Type:</div>
              <div className="text-gray-900 font-bold">{booking.catering_details?.type || "Not configured"}</div>

              <div className="text-gray-500 font-semibold">Guest Count:</div>
              <div className="text-gray-900 font-bold">{booking.catering_details?.guest_count || booking.guests || 0} Guests</div>
            </div>
          </div>

          {/* Seating Details */}
          <div className="bg-blue-50/30 border border-blue-100 rounded-xl p-5 space-y-4">
            <h4 className="font-bold text-blue-900 flex items-center gap-2 text-sm">
              <Award size={16} /> Layout & Seating Setup
            </h4>
            <div className="grid grid-cols-[130px_auto] gap-y-3">
              <div className="text-gray-500 font-semibold">Seating Type:</div>
              <div className="text-gray-900 font-bold">{booking.seatingArrangement?.seatingType || "Standard Seating"}</div>

              <div className="text-gray-500 font-semibold">Dining Arrangement:</div>
              <div className="text-gray-900 font-bold">{booking.seatingArrangement?.diningSetup || "Not configured"}</div>

              <div className="text-gray-500 font-semibold">Extra Chairs/Sofas:</div>
              <div className="text-gray-900 font-bold">
                Chairs: {booking.seatingArrangement?.additionalRequirements?.extraChairs || 0} |
                VIP Sofa: {booking.seatingArrangement?.additionalRequirements?.vipSofa || 0}
              </div>
            </div>
          </div>

        </div>
      </div>



      {/* Mapped Assignments: Mapped Staff & Vendors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Assigned Staff */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
            <h3 className="text-[16px] font-black text-gray-900 flex items-center gap-2 m-0">
              <Users size={18} className="text-orange-500" />
              Assigned Event Staff
            </h3>
            <button
              onClick={() => setIsAssignStaffModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Assign Staff
            </button>
          </div>
          {displayStaffList.length > 0 ? (
            <div className="flex flex-col divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
              {displayStaffList.map(assignment => (
                <div key={assignment._id} className="flex flex-col py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#5b2ceb]/10 text-[#5b2ceb] flex items-center justify-center font-bold text-sm uppercase">
                        {assignment.employeeId?.name?.slice(0, 2) || "ST"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{assignment.employeeId?.name || "Unknown Staff"}</div>
                        <div className="text-xs text-gray-500 font-semibold">{assignment.role}</div>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      {assignment.isPending ? (
                        <button
                          onClick={() => {
                            setAssignStaffId(assignment.employeeId._id);
                            setStaffRole(assignment.employeeId.role || "Event Staff");
                            setIsAssignStaffModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        >
                          Schedule Now
                        </button>
                      ) : (
                        <>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            assignment.assignmentStatus === 'Completed' ? 'bg-green-100 text-green-700' :
                            assignment.assignmentStatus === 'Accepted' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {assignment.assignmentStatus}
                          </span>
                          {assignment.notificationStatus === 'Read' && (
                            <span className="text-[10px] text-gray-400 mt-1">Read at: {new Date(assignment.readAt).toLocaleString()}</span>
                          )}
                          {assignment.assignmentStatus === 'Completed' && (
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={() => handleViewAttendance(assignment)}
                                className="px-2 py-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                              >
                                View Attendance
                              </button>
                              {assignment.paymentStatus === 'Paid' ? (
                                <span className="px-2 py-1 text-[10px] font-bold text-green-700 bg-green-100 rounded border border-green-200">Paid</span>
                              ) : (
                                <button 
                                  onClick={() => {
                                    setPaymentPayee({ id: assignment.employeeId._id, name: assignment.employeeId.name, type: "Staff" });
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="px-2 py-1 text-[10px] font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-sm"
                                >
                                  Pay Staff
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex gap-4 bg-gray-50 p-2 rounded">
                    <div><span className="font-bold">Reporting:</span> {assignment.reportingDate} {assignment.reportingTime}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400 py-6 text-sm justify-center">
              <Info size={16} /> No staff assigned to this booking yet.
            </div>
          )}
        </div>

        {/* Mapped Vendors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-3 mb-4">
            <h3 className="text-[16px] font-black text-gray-900 flex items-center gap-2 m-0">
              <Users size={18} className="text-orange-500" />
              Assigned Event Vendors
            </h3>
            <button
              onClick={() => setIsAssignVendorModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={14} /> Assign Vendor
            </button>
          </div>
          <div className="flex flex-col divide-y divide-gray-50 max-h-64 overflow-y-auto pr-1">
            {activeDisplayVendors.map((vendor, idx) => (
              <div key={vendor.id || vendor._id || idx} className="flex items-center justify-between py-3 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-xs uppercase shrink-0">
                    {vendor.initials || vendor.name?.slice(0, 2) || "VD"}
                  </div>
                  <div>
                    <div className="font-black text-gray-900 text-sm leading-tight">{vendor.name}</div>
                    <div className="text-[11px] text-violet-600 font-bold mt-0.5">{vendor.category}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-500 font-medium mr-1 hidden sm:inline">{vendor.phone || "+91 98765 44321"}</span>
                  
                  {vendor.paymentStatus === 'Paid' ? (
                    <span className="px-2.5 py-1 text-[10px] font-bold text-green-700 bg-green-100 rounded border border-green-200">Paid</span>
                  ) : (
                    <button 
                      onClick={() => {
                        setPaymentPayee({ id: vendor.id || vendor._id, name: vendor.name, type: "Vendor" });
                        setIsPaymentModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-sm cursor-pointer"
                    >
                      Pay Vendor
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setReplacingVendor(vendor);
                      setSelectedNewVendorId("");
                    }}
                    className="px-2.5 py-1 text-xs font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    onClick={() => setViewingVendor(vendor)}
                    className="px-2.5 py-1 text-xs font-bold text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW VENDOR DETAILS MODAL */}
        {viewingVendor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-sm uppercase">
                    {viewingVendor.initials || viewingVendor.name?.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-gray-900 m-0">{viewingVendor.name}</h3>
                    <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded">
                      {viewingVendor.category || "Catering Vendor"}
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
                    <span className="font-black text-gray-900">{viewingVendor.phone || "+91 98765 44321"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Email Address:</span>
                    <span className="font-bold text-gray-800">{viewingVendor.email || `${viewingVendor.name?.toLowerCase().replace(/\s+/g, '')}@vendor.com`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-semibold">Address / Office:</span>
                    <span className="font-semibold text-gray-800">{viewingVendor.address || "MG Road, Indiranagar, Bangalore"}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold">Contract Status:</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                      {viewingVendor.status || "Active Contract"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-bold">Contract Basis / Rate:</span>
                    <span className="font-black text-emerald-700">{viewingVendor.contractBasis || "Per Event Contract"}</span>
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
                  <p className="text-xs text-gray-500 m-0 mt-0.5">Select replacement for: <strong className="text-blue-600">{replacingVendor.category}</strong></p>
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
                  <div className="text-slate-500 mt-0.5">{replacingVendor.phone || "+91 98765 44321"}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Replacement Vendor</label>
                  <select
                    value={selectedNewVendorId}
                    onChange={(e) => setSelectedNewVendorId(e.target.value)}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Select Replacement Vendor --</option>
                    {vendorList.filter(v => v.category === replacingVendor.category && v._id !== replacingVendor._id).map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.phone})</option>
                    ))}
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

      </div>

      {/* Rejection/Cancellation Alert Box */}
      {(booking.rejectionReason || booking.cancellation_reason) && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex items-start gap-3">
          <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="font-black text-red-900 text-sm">Booking {booking.booking_status || "Cancelled / Rejected"}</h4>
            <p className="text-red-700 text-xs mt-1 leading-relaxed"><strong>Reason:</strong> {booking.rejectionReason || booking.cancellation_reason}</p>
          </div>
        </div>
      )}

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
        >
          Close Panel
        </button>

        <div className="flex items-center gap-3">
          {/* Approve/Reject Controls for Pending bookings */}
          {(booking.booking_status === "Pending Approval" || booking.status === "Pending") && (
            <div className="flex gap-2">
              <button
                disabled={isSubmitting}
                onClick={handleReject}
                className="px-6 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[13px] font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                Reject Booking
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleApprove}
                className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          )}

          {/* Cancel Control for Confirmed bookings */}
          {(booking.booking_status === "Confirmed" || booking.status === "Approved") && (
            <div className="flex gap-2">
              <button
                disabled={isSubmitting}
                onClick={handleCancel}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[13px] font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
            >
              Next: Venue & Services
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ASSIGN VENDOR MODAL */}
      {isAssignVendorModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                  <Users size={18} className="text-orange-500" />
                  Assign New Vendor to Booking
                </h3>
                <p className="text-xs text-gray-500 m-0 mt-0.5">Select a category and choose a vendor to assign.</p>
              </div>
              <button
                onClick={() => setIsAssignVendorModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Service Category</label>
                <select
                  value={assignCategory}
                  onChange={(e) => setAssignCategory(e.target.value)}
                  className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                >
                  <option value="Catering">Catering Vendor 🍲</option>
                  <option value="Decoration">Decoration Vendor 💐</option>
                  <option value="Photography">Photography & Video Studio 📷</option>
                  <option value="DJ & Sound">DJ & Sound System 🎵</option>
                  <option value="Vehicle / Transport">Vehicle / Transport Service 🚗</option>
                  <option value="Hotel Accommodations">Hotel Accommodations 🏨</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Vendor</label>
                <select
                  value={assignVendorId}
                  onChange={(e) => setAssignVendorId(e.target.value)}
                  className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                >
                  <option value="">-- Choose Vendor --</option>
                  {(vendorList.length > 0 ? vendorList : [
                    { id: 'v101', name: `Gourmet ${assignCategory} Specialists`, category: assignCategory, phone: '+91 98765 99112' },
                    { id: 'v102', name: `Elite ${assignCategory} Services`, category: assignCategory, phone: '+91 98765 88223' },
                    { id: 'v103', name: `Supreme Luxury ${assignCategory}`, category: assignCategory, phone: '+91 98765 77334' }
                  ]).map(v => (
                    <option key={v.id || v._id} value={v.id || v._id}>
                      {v.name} ({v.phone || v.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsAssignVendorModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignVendor}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer"
              >
                Assign Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN STAFF MODAL */}
      {isAssignStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 m-0 flex items-center gap-2">
                  <Users size={18} className="text-orange-500" />
                  Assign Staff to Event
                </h3>
              </div>
              <button
                onClick={() => setIsAssignStaffModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">Select Staff</label>
                <select
                  value={assignStaffId}
                  onChange={(e) => setAssignStaffId(e.target.value)}
                  className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                >
                  <option value="">-- Choose Staff --</option>
                  {assignedStaffNames.length > 0 ? (
                    assignedStaffNames.map(s => (
                      <option key={s._id} value={s._id}>{s.name} - {s.role}</option>
                    ))
                  ) : (
                    <option value="" disabled>No staff selected during booking</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Role</label>
                  <input
                    type="text"
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Reporting Date</label>
                  <input
                    type="date"
                    value={reportingDate}
                    onChange={(e) => setReportingDate(e.target.value)}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Reporting Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 08:30 AM"
                    value={reportingTime}
                    onChange={(e) => setReportingTime(e.target.value)}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">Responsibilities</label>
                  <input
                    type="text"
                    placeholder="e.g. Coordinate event setup"
                    value={responsibilities}
                    onChange={(e) => setResponsibilities(e.target.value)}
                    className="w-full text-xs font-bold p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none bg-white"
                  />
                </div>
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
                onClick={handleConfirmAssignStaff}
                disabled={isSubmitting}
                className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                Assign Staff & Notify
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default BookingDetails;
