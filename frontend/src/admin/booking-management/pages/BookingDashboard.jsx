import React, { useState, useEffect } from "react";
import BookingDetails from "./BookingDetails";
import BookingWorkflowContainer from "./BookingWorkflowContainer";
import { 
  CalendarCheck, ShieldCheck, Clock, XCircle, DollarSign, 
  Search, ChevronDown, Filter, Download, Plus, Eye, 
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight
} from "lucide-react";

const initialBookings = [
  {
    id: "BK-10078",
    clientName: "Rahul Sharma",
    event: "Wedding Ceremony",
    venue: "Royal Palace",
    date: "21 Jul 2026",
    time: "10:00 AM",
    status: "Confirmed",
    totalAmount: "₹1,45,000",
    advancePaid: "₹50,000",
    remaining: "₹95,000",
    paymentStatus: "Partially Paid"
  },
  {
    id: "BK-10077",
    clientName: "Priya Patel",
    event: "Corporate Event",
    venue: "Grand Hall",
    date: "20 Jul 2026",
    time: "09:30 AM",
    status: "Pending",
    totalAmount: "₹85,000",
    advancePaid: "₹0",
    remaining: "₹85,000",
    paymentStatus: "Unpaid"
  },
  {
    id: "BK-10076",
    clientName: "Amit Verma",
    event: "Birthday Party",
    venue: "Sunset Gardens",
    date: "19 Jul 2026",
    time: "07:00 PM",
    status: "Confirmed",
    totalAmount: "₹45,000",
    advancePaid: "₹20,000",
    remaining: "₹25,000",
    paymentStatus: "Partially Paid"
  },
  {
    id: "BK-10075",
    clientName: "Neha Singh",
    event: "Engagement",
    venue: "Bliss Banquet",
    date: "18 Jul 2026",
    time: "06:00 PM",
    status: "Cancelled",
    totalAmount: "₹95,000",
    advancePaid: "₹0",
    remaining: "₹95,000",
    paymentStatus: "Unpaid"
  },
  {
    id: "BK-10074",
    clientName: "Vikram Reddy",
    event: "Conference",
    venue: "Convention Center",
    date: "17 Jul 2026",
    time: "09:00 AM",
    status: "Confirmed",
    totalAmount: "₹1,50,000",
    advancePaid: "₹1,00,000",
    remaining: "₹50,000",
    paymentStatus: "Paid"
  },
  {
    id: "BK-10073",
    clientName: "Sneha Iyer",
    event: "Engagement",
    venue: "Garden View",
    date: "16 Jul 2026",
    time: "05:00 PM",
    status: "Pending",
    totalAmount: "₹65,000",
    advancePaid: "₹0",
    remaining: "₹65,000",
    paymentStatus: "Unpaid"
  },
  {
    id: "BK-10072",
    clientName: "Karan Mehta",
    event: "Wedding Reception",
    venue: "Royal Palace",
    date: "15 Jul 2026",
    time: "08:00 PM",
    status: "Confirmed",
    totalAmount: "₹2,20,000",
    advancePaid: "₹1,00,000",
    remaining: "₹1,20,000",
    paymentStatus: "Partially Paid"
  },
  {
    id: "BK-10071",
    clientName: "Anjali Gupta",
    event: "Corporate Event",
    venue: "Grand Hall",
    date: "14 Jul 2026",
    time: "10:00 AM",
    status: "Confirmed",
    totalAmount: "₹75,000",
    advancePaid: "₹30,000",
    remaining: "₹45,000",
    paymentStatus: "Paid"
  }
];

function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings?status=all");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setBookings(data.data);
        } else if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const getStatusBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("approve")) return 'bg-green-50 text-green-600 border-green-200';
    if (s.includes("pending")) return 'bg-orange-50 text-orange-600 border-orange-200';
    if (s.includes("cancel") || s.includes("reject")) return 'bg-red-50 text-red-600 border-red-200';
    return 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const getPaymentBadge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "paid") return 'bg-green-50 text-green-600 border-green-200';
    if (s === "partially paid") return 'bg-orange-50 text-orange-600 border-orange-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  const getPaymentStatus = (b) => {
    const total = b.total_cost || b.amount || 0;
    const paid = b.advance_paid || 0;
    if (paid >= total && total > 0) return "Paid";
    if (paid > 0) return "Partially Paid";
    return "Unpaid";
  };

  const handleViewDetails = (id) => {
    setSelectedBookingId(id);
  };

  if (selectedBookingId) {
    return <BookingWorkflowContainer bookingId={selectedBookingId} onBack={() => setSelectedBookingId(null)} />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-sm">Loading bookings...</p>
      </div>
    );
  }

  // Filter bookings based on controls
  const filteredBookings = bookings.filter(b => {
    const bookingId = String(b._id || b.id || "").toLowerCase();
    const clientName = String(b.clientName || b.clientEmail || "").toLowerCase();
    const event = String(b.eventTitle || b.event_type || "").toLowerCase();
    const matchesSearch = bookingId.includes(searchQuery.toLowerCase()) || 
                          clientName.includes(searchQuery.toLowerCase()) || 
                          event.includes(searchQuery.toLowerCase());

    const status = String(b.booking_status || b.status || "");
    const matchesStatus = statusFilter === "All" || 
      (statusFilter === "Confirmed" && (status.includes("Confirm") || status.includes("Approve"))) ||
      (statusFilter === "Pending" && status.includes("Pending")) ||
      (statusFilter === "Cancelled" && (status.includes("Cancel") || status.includes("Reject")));

    const matchesCategory = categoryFilter === "All" || String(b.event_type || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const confirmedCount = bookings.filter(b => {
    const s = String(b.booking_status || b.status || "").toLowerCase();
    return s.includes("confirm") || s.includes("approve");
  }).length;

  const pendingCount = bookings.filter(b => {
    const s = String(b.booking_status || b.status || "").toLowerCase();
    return s.includes("pending");
  }).length;

  const cancelledCount = bookings.filter(b => {
    const s = String(b.booking_status || b.status || "").toLowerCase();
    return s.includes("cancel") || s.includes("reject");
  }).length;

  const totalRevenue = bookings.reduce((sum, b) => {
    const s = String(b.booking_status || b.status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("approve")) {
      return sum + (b.total_cost || b.amount || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all event bookings and their details</p>
        </div>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm w-fit">
          <Plus size={18} />
          New Booking
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
            <CalendarCheck size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Bookings</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{bookings.length}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5"><ArrowUpRight size={12} className="text-green-500" /> <span className="text-green-500">Active</span> events</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Confirmed</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{confirmedCount}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5"><ArrowUpRight size={12} className="text-green-500" /> Approved bookings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Pending</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{pendingCount}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5"><Clock size={12} className="text-orange-500" /> Awaiting review</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Cancelled</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{cancelledCount}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5"><XCircle size={12} className="text-red-500" /> Rejected events</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Revenue</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5 flex items-center gap-0.5"><ArrowUpRight size={12} className="text-green-500" /> Secured sales</p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        
        {/* Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by booking ID, client name, event..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-[13px] font-semibold text-gray-700 border border-gray-200 bg-white rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-gray-50 transition-colors">
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-[13px] font-semibold text-gray-700 border border-gray-200 bg-white rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-gray-50 transition-colors">
              <option value="All">All Event Categories</option>
              <option value="Wedding">Wedding</option>
              <option value="Birthday Party">Birthday Party</option>
              <option value="Corporate Event">Corporate Event</option>
              <option value="Engagement">Engagement</option>
              <option value="Reception">Reception</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[1200px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[120px]">Booking ID</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[150px]">Client Name</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[160px]">Event</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[120px]">Total Amount</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[120px]">Advance Paid</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[120px]">Remaining</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[140px] text-center">Status</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 w-[100px] text-center">View Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((booking) => {
                const total = booking.total_cost || booking.amount || 0;
                const paid = booking.advance_paid || 0;
                const remaining = Math.max(total - paid, 0);
                const displayId = booking._id || booking.id;
                
                return (
                  <tr key={displayId} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4 align-middle text-[12px] font-bold text-gray-900 font-mono">#{displayId.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600">{booking.clientName || "Guest Client"}</td>
                    <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600">{booking.eventTitle || booking.event_type}</td>
                    
                    <td className="px-6 py-4 align-middle text-[13px] font-bold text-gray-900">₹{total.toLocaleString()}</td>
                    <td className="px-6 py-4 align-middle text-[13px] font-semibold text-green-600 font-bold">₹{paid.toLocaleString()}</td>
                    <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600">₹{remaining.toLocaleString()}</td>
                    
                    <td className="px-6 py-4 align-middle text-center">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${getStatusBadge(booking.booking_status || booking.status)}`}>
                        {booking.booking_status || booking.status || "Pending Approval"}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 align-middle text-center">
                      <button 
                        onClick={() => handleViewDetails(displayId)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors inline-flex items-center justify-center w-8 h-8 mx-auto"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[13px] font-semibold text-gray-500">Showing {filteredBookings.length} of {bookings.length} bookings</p>
        </div>

      </div>
    </div>
  );
}

export default BookingDashboard;
