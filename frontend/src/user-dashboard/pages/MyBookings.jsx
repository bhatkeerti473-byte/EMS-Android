import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Download,
  MapPin,
  MoreVertical,
  Search,
  Ticket,
  X as CloseIcon,
  Users,
  Check,
  XCircle
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import { getClientDisplayName, getClientPhoto, getCurrentClient } from "../services/clientSession";
import { createInvoice, getBookings, getInvoicePdfUrl, getUserBilling } from "../services/userApi";
import "../styles/dashboard.css";

const tabs = ["All Bookings", "Pending", "Approved", "Rejected"];

const BookingStatusTracker = ({ booking }) => {
  const bookingRawStatus = String(booking.booking_status || booking.status || "").trim().toLowerCase();
  const advancePaid = Number(booking.advance_paid || 0);
  
  const isCancelled = bookingRawStatus === "cancelled" || bookingRawStatus === "rejected";
  
  const stages = [
    { name: "Booking Submitted", desc: "Your booking request has been received." },
    { name: "Payment Confirmed", desc: "Your payment has been successfully verified." },
    { name: "Booking Confirmed", desc: "Your event booking is confirmed." },
    { name: "Event Preparation", desc: "Services and venue preparation will follow." },
    { name: "Event Completed", desc: "Event completed successfully." },
  ];

  let currentStageIndex = 0;
  
  if (isCancelled) {
    currentStageIndex = -1;
  } else {
    if (bookingRawStatus === "temporarily held" || bookingRawStatus === "pending approval" || bookingRawStatus === "pending") {
      currentStageIndex = 0;
    } else if (bookingRawStatus === "approved - awaiting payment") {
      currentStageIndex = 1;
    } else if (bookingRawStatus === "confirmed" || bookingRawStatus === "approved" || advancePaid > 0) {
      const eventDate = new Date(booking.event_date || booking.eventDate || booking.date);
      if (eventDate < new Date()) {
        currentStageIndex = 4;
      } else {
        currentStageIndex = 3;
      }
    }
  }

  if (isCancelled) {
    return (
      <div className="rounded-2xl border border-red-200 p-5 bg-red-50 mt-0 mb-6">
        <h4 className="text-red-700 font-bold flex items-center gap-2">
          <XCircle size={20} /> Booking Cancelled
        </h4>
        <p className="text-red-600 text-sm mt-1">This booking has been cancelled or rejected and will not proceed.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 mt-0 mb-6">
      <h4 className="text-sm uppercase tracking-wider font-extrabold text-slate-800 mb-6">Booking Progress</h4>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 z-0">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Stages */}
        <div className="relative z-10 flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div key={index} className="flex flex-col items-center text-center w-1/5 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 mb-3 bg-white shadow-sm z-10
                  ${isCompleted ? 'border-emerald-500 text-emerald-500' : 'border-slate-300 text-slate-300'}`}>
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <span className="w-2.5 h-2.5 rounded-full bg-current opacity-30" />}
                </div>
                <h5 className={`text-xs font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stage.name}
                </h5>
                <p className={`text-[10px] mt-1 hidden md:block px-1 ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const clientPhoto = getClientPhoto(currentClient);

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState(null);
  const [billingInvoices, setBillingInvoices] = useState([]);
  const [billingMessage, setBillingMessage] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelMessage, setCancelMessage] = useState("");

  const userIdentifier =
    currentClient?._id ||
    currentClient?.userId ||
    currentClient?.id ||
    currentClient?.email ||
    currentClient?.phone ||
    currentClient?.phone_number ||
    currentClient?.phoneNumber ||
    "client_1";

  const fetchDashboardData = useCallback(() => {
    setIsLoading(true);

    Promise.all([
      getBookings(userIdentifier).catch(() => []),
      getUserBilling(userIdentifier).then((data) => data.invoices || []).catch(() => [])
    ])
      .then(([bookingsData, invoicesData]) => {
        const apiBookings = Array.isArray(bookingsData) ? bookingsData : [];
        
        // Remove duplicates if any
        const map = new Map();
        apiBookings.forEach((item) => {
          const key = String(item.id || item._id);
          if (key && !map.has(key)) {
            map.set(key, item);
          }
        });

        // Sort bookings by created date descending
        const sortedBookings = Array.from(map.values()).sort((a, b) => {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        setBookings(sortedBookings);
        setBillingInvoices(Array.isArray(invoicesData) ? invoicesData : []);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [userIdentifier]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    window.addEventListener("focus", fetchDashboardData);
    return () => window.removeEventListener("focus", fetchDashboardData);
  }, [fetchDashboardData]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlBookingId = searchParams.get('bookingId');
    if (urlBookingId && bookings.length > 0 && !selectedBookingForDetail) {
      const b = bookings.find(x => String(x._id) === String(urlBookingId) || String(x.bookingReference) === String(urlBookingId));
      if (b) setSelectedBookingForDetail(b);
    }
  }, [location.search, bookings, selectedBookingForDetail]);

  const getInvoiceForBooking = (booking) => {
    const bookingId = String(booking?._id || booking?.id || "");
    if (!bookingId) return null;

    return billingInvoices.find((invoice) => {
      if (!invoice.bookingId) return false;
      const targetId = typeof invoice.bookingId === "object"
        ? invoice.bookingId._id || invoice.bookingId.id
        : invoice.bookingId;
      return String(targetId) === bookingId;
    });
  };

  // Helper to cleanly format UTC date strings to "YYYY-MM-DD"
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    try {
      // Split by 'T' to get just the date portion cleanly
      return dateString.includes("T") ? dateString.split("T")[0] : dateString;
    } catch {
      return dateString;
    }
  };

  // Helper to determine if slot is Full Day or a custom time
  const formatTimeSlot = (booking) => {
    const slot = booking.time_slot || booking.timeSlot;
    if (!slot || slot.toLowerCase() === "full day" || slot.toLowerCase() === "fullday") {
      return "Full Day";
    }
    return slot;
  };

  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const handleProceedToPayment = async (booking) => {
    try {
      setBillingMessage("");
      const advancePaid = Number(booking.advance_paid || booking.amount_paid || 0);
      
      if (advancePaid > 0) {
        // Remaining payment flow
        const token = localStorage.getItem("token") || localStorage.getItem("clientToken");
        const response = await fetch("http://localhost:5000/api/payments/create-remaining-order", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ booking_id: booking._id })
        });
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to create remaining order");
        
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID || "rzp_test_YourKeyId",
          amount: data.amount,
          currency: "INR",
          name: "Event Management System",
          description: "Remaining Balance Payment",
          order_id: data.order_id,
          handler: async function (res) {
            try {
              const verifyRes = await fetch("http://localhost:5000/api/payments/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: res.razorpay_order_id,
                  razorpay_payment_id: res.razorpay_payment_id,
                  razorpay_signature: res.razorpay_signature,
                  booking_id: booking._id,
                  amount_paid: data.amount / 100
                })
              });
              
              if (verifyRes.ok) {
                fetchDashboardData();
                navigate("/client/payment-success", { state: { orderId: booking._id } });
              } else {
                const errData = await verifyRes.json();
                setBillingMessage(errData.message || "Payment verification failed.");
              }
            } catch (err) {
              setBillingMessage("Payment verification failed.");
            }
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          setBillingMessage("Payment failed or cancelled.");
        });
        rzp.open();
        return;
      }
      
      let invoice = getInvoiceForBooking(booking);
      if (!invoice) {
        invoice = await createInvoice(booking._id || booking.id, booking.amount || booking.total_cost);
        setBillingInvoices((current) => [invoice, ...current]);
      }
      navigate(`/client/payments?invoice=${invoice._id}`);
    } catch (err) {
      setBillingMessage(err.message || "Unable to proceed with payment right now.");
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBookingForDetail || !cancelReason) return;
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("clientToken");
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBookingForDetail._id}/cancel`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ cancellation_reason: cancelReason })
      });
      const data = await response.json();
      if (response.ok) {
        setCancelMessage("Booking cancelled successfully.");
        fetchDashboardData();
        setSelectedBookingForDetail(data.data);
        setTimeout(() => { setShowCancelModal(false); setCancelMessage(""); }, 2000);
      } else {
        setCancelMessage(data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      setCancelMessage("Error cancelling booking.");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchText = searchTerm.trim().toLowerCase();

      const bookingRawStatus = String(
        booking.status ||
        booking.booking_status ||
        (booking.advance_paid > 0 ? "Confirmed" : "Pending")
      ).trim().toLowerCase();

      let normalizedTabGroup = "Pending";
      if (bookingRawStatus.includes("approved") || bookingRawStatus === "confirmed" || bookingRawStatus === "paid" || bookingRawStatus === "success") {
        normalizedTabGroup = "Approved";
      } else if (bookingRawStatus.includes("reject") || bookingRawStatus.includes("cancel") || bookingRawStatus === "failed") {
        normalizedTabGroup = "Rejected";
      }

      const matchesTab = activeTab === "All Bookings" || normalizedTabGroup === activeTab;

      const matchesSearch =
        (booking.eventTitle || booking.title || booking.event_type || booking.eventType || "").toLowerCase().includes(searchText) ||
        (booking.venueName || booking.location || booking.venue_name || booking.venue || booking.address || "").toLowerCase().includes(searchText) ||
        (booking.time_slot || "").toLowerCase().includes(searchText);

      return matchesTab && matchesSearch;
    });
  }, [bookings, activeTab, searchTerm]);

  const getStatusClassName = (status) => {
    const cleanStatus = String(status || "pending").toLowerCase();
    if (cleanStatus === "confirmed" || cleanStatus === "paid" || cleanStatus === "success" || cleanStatus === "approved") {
      return "state-approved";
    }
    if (cleanStatus === "rejected" || cleanStatus === "cancelled" || cleanStatus === "failed") {
      return "state-rejected";
    }
    return "state-pending";
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content bookings-content">
        <header className="bookings-topbar">
          <div className="page-title-row">
            <button type="button" className="icon-only" aria-label="Open menu">
              <Ticket size={19} />
            </button>
            <div>
              <h1>My Bookings</h1>
              <p>Manage all your event bookings and their details.</p>
            </div>
          </div>

          <div className="booking-header-actions">
            <div className="booking-search">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events, bookings..."
              />
              <Search size={17} />
            </div>
            <div className="booking-user">
              <img src={clientPhoto} alt={clientName} />
              <div>
                <strong>{clientName}</strong>
                <p>Client</p>
              </div>
            </div>
          </div>
        </header>

        <div className="booking-page-grid">
          <section className="bookings-list-panel" style={{ width: "100%" }}>
            <div className="booking-tabs">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  className={activeTab === tab ? "selected" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="booking-list">
              {isLoading && <p className="booking-empty">Loading bookings...</p>}

              {!isLoading && filteredBookings.length === 0 && (
                <div className="booking-empty-state" style={{ padding: "40px", textAlign: "center" }}>
                  <Ticket size={48} style={{ color: "#94a3b8", marginBottom: "16px" }} />
                  <h3>No Bookings Found</h3>
                  <p style={{ color: "#64748b", fontSize: "14px", marginTop: "4px" }}>
                    It looks like you don't have any event bookings matching this section.
                  </p>
                </div>
              )}

              {!isLoading &&
                filteredBookings.map((booking) => (
                  <article className="booking-row-card" key={booking.id || booking._id}>
                    <div className="booking-main-info">
                      <h3>{booking.eventTitle || booking.title || booking.event_type}</h3>
                      <div className="booking-row-meta">
                        <span>
                          <CalendarDays size={14} />
                          {formatDate(booking.event_date || booking.eventDate || booking.date)}
                        </span>
                        <span>
                          <MapPin size={14} />
                          {booking.isOwnVenue && booking.ownVenueDetails?.name 
                            ? booking.ownVenueDetails.name 
                            : booking.venueName || booking.venue_name || booking.location || booking.address || "TBD"}
                        </span>
                        <span>
                          <Clock3 size={14} />
                          {formatTimeSlot(booking)}
                        </span>
                      </div>
                    </div>

                    <div className="booking-id-block">
                      <span className={`booking-state ${getStatusClassName(booking.status || booking.booking_status)}`}>
                        {(() => {
                          const rawStatus = String(booking.booking_status || booking.status || "Pending");
                          if (rawStatus.toLowerCase() === "cancelled" || rawStatus.toLowerCase() === "rejected") return "Cancelled";
                          if (Number(booking.advance_paid || 0) > 0 || rawStatus.toLowerCase() === "confirmed") return "Confirmed";
                          return rawStatus;
                        })()}
                      </span>
                      <p>Booking ID</p>
                      <strong>{String(booking.bookingReference || booking.id || booking._id || "N/A").toUpperCase()}</strong>
                    </div>

                    <div className="booking-amount">
                      <p>{getInvoiceForBooking(booking) || booking.total_cost || booking.amount ? "Total Cost" : "Guests"}</p>
                      <strong>
                        {getInvoiceForBooking(booking)
                          ? formatINR(getInvoiceForBooking(booking).totalAmount)
                          : booking.total_cost || booking.amount
                            ? formatINR(booking.total_cost || booking.amount)
                            : booking.guests || booking.catering_details?.guest_count || "—"}
                      </strong>
                    </div>

                    <div className="booking-row-actions">
                      <button type="button" onClick={() => setSelectedBookingForDetail(booking)}>
                        View Details
                      </button>
                      <MoreVertical size={18} />
                    </div>
                  </article>
                ))}
            </div>
          </section>
        </div>
      </main>

      {selectedBookingForDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setSelectedBookingForDetail(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Booking Details</h2>
              <button
                type="button"
                onClick={() => setSelectedBookingForDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <CloseIcon size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {billingMessage && <p className="profile-save-message">{billingMessage}</p>}
              
              <BookingStatusTracker booking={selectedBookingForDetail} />

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Event Name</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {selectedBookingForDetail.eventTitle || selectedBookingForDetail.title || selectedBookingForDetail.event_type}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Time Slot</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {formatTimeSlot(selectedBookingForDetail)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Venue</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {selectedBookingForDetail.isOwnVenue && selectedBookingForDetail.ownVenueDetails?.name 
                      ? selectedBookingForDetail.ownVenueDetails.name 
                      : selectedBookingForDetail.venueName || selectedBookingForDetail.venue_name || "Home / Custom Venue"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Location Address</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2 text-ellipsis overflow-hidden whitespace-nowrap">
                    {selectedBookingForDetail.isOwnVenue && selectedBookingForDetail.ownVenueDetails?.location 
                      ? selectedBookingForDetail.ownVenueDetails.location
                      : selectedBookingForDetail.location || selectedBookingForDetail.address || selectedBookingForDetail.venueName || "TBD"}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Event Date</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2">
                    {formatDate(selectedBookingForDetail.event_date || selectedBookingForDetail.eventDate || selectedBookingForDetail.date)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Expected Guests</p>
                  <p className="text-lg font-semibold text-slate-900 mt-2 flex items-center gap-2">
                    <Users size={18} />
                    {selectedBookingForDetail.guests || selectedBookingForDetail.catering_details?.guest_count || "—"}
                  </p>
                </div>
              </div>

              {/* Selected Services with Photos Gallery */}
              <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/50 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <h4 className="text-sm uppercase tracking-wider font-extrabold text-slate-800 flex items-center gap-2">
                    <span>✨</span> Selected Services & Add-ons (With Photo Preview)
                  </h4>
                  <span className="text-xs bg-orange-100 text-orange-700 font-bold px-2.5 py-1 rounded-full">All Included</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Selected Venue Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.image || selectedBookingForDetail.venueImg || localStorage.getItem("booking_venue_image") || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80"} 
                        alt="Venue" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        Venue Hall
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.isOwnVenue && selectedBookingForDetail.ownVenueDetails?.name 
                          ? selectedBookingForDetail.ownVenueDetails.name 
                          : selectedBookingForDetail.venueName || localStorage.getItem("booking_venue_name") || selectedBookingForDetail.venue_name || "Royal Celebration Hall"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium line-clamp-1">
                        {selectedBookingForDetail.isOwnVenue && selectedBookingForDetail.ownVenueDetails?.location 
                          ? selectedBookingForDetail.ownVenueDetails.location
                          : selectedBookingForDetail.location || localStorage.getItem("booking_venue_location") || "Banjara Hills, Hyderabad"}
                      </p>
                    </div>
                  </div>

                  {/* Selected Decoration Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.decorationImg || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80"} 
                        alt="Decoration" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        Decoration Theme
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.decorationName || "Royal Crystal & Floral Theme Setup"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">Stage Mandap, Floral Entry Gate & Lighting</p>
                    </div>
                  </div>

                  {/* Selected Catering Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.cateringImg || "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80"} 
                        alt="Catering" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        Catering Menu
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.cateringPackage || "Premium Veg & Non-Veg Royal Buffet"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">
                        {selectedBookingForDetail.guests || selectedBookingForDetail.catering_details?.guest_count || 250} Guests | Welcome Drinks & Desserts
                      </p>
                    </div>
                  </div>

                  {/* Selected Cake Card */}
                  {selectedBookingForDetail.cakeName && selectedBookingForDetail.cakeName !== "None" && selectedBookingForDetail.cakeName !== "" && (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                      <div className="w-full h-32 relative bg-slate-100">
                        <img 
                          src={
                            selectedBookingForDetail.cakeName.includes("Chocolate") ? "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80" :
                            selectedBookingForDetail.cakeName.includes("Red Velvet") ? "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=500&q=80" :
                            selectedBookingForDetail.cakeName.includes("Butterscotch") ? "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=500&q=80" :
                            selectedBookingForDetail.cakeName.includes("Vanilla") ? "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=500&q=80" :
                            "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=500&q=80"
                          } 
                          alt="Customized Cake" 
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-orange-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                          Customized Cake
                        </span>
                      </div>
                      <div className="p-3.5 flex flex-col gap-1">
                        <p className="font-extrabold text-slate-900 text-sm m-0">
                          {selectedBookingForDetail.cakeName.replace(/\s*\([\d.]+\s*Kg\)/i, "")} ({Number(selectedBookingForDetail.cakeWeight || 1.5).toFixed(1)} Kg)
                        </p>
                        {selectedBookingForDetail.cakeEggless === "Yes" && (
                          <p className="text-[10px] text-emerald-700 font-extrabold m-0 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md w-fit">
                            🟢 Eggless (100% Veg)
                          </p>
                        )}
                        {selectedBookingForDetail.cakeText && (
                          <p className="text-orange-600 text-xs font-black m-0" style={{ wordBreak: "break-word" }}>
                            Writing: "{selectedBookingForDetail.cakeText}"
                          </p>
                        )}
                        <p className="text-slate-500 text-xs font-medium m-0">₹ {Number(selectedBookingForDetail.cakePrice || 0).toLocaleString()}</p>
                      </div>
                    </div>
                  )}

                  {/* Selected Photography Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.photoImg || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80"} 
                        alt="Photography Studio" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        Photography
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.photographyStudio || "Perfect Click 4K Studio"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">Candid Photography & Cinematic Teaser Video</p>
                    </div>
                  </div>

                  {/* Selected DJ & Sound Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.djImg || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80"} 
                        alt="DJ Sound" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        DJ & Sound
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.djPackage || "RockStar DJ & Disco Lighting Setup"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">Top DJ Artist, 4 Speakers & Smoke Machine</p>
                    </div>
                  </div>

                  {/* Selected Guest Room Photo Card */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                    <div className="w-full h-32 relative bg-slate-100">
                      <img 
                        src={selectedBookingForDetail.roomImg || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=500&q=80"} 
                        alt="Guest Rooms" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                        Accommodations
                      </span>
                    </div>
                    <div className="p-3.5 flex flex-col gap-1">
                      <p className="font-extrabold text-slate-900 text-sm">
                        {selectedBookingForDetail.roomName || "Hotel Grand Comfort Suites"}
                      </p>
                      <p className="text-slate-500 text-xs font-medium">10 Luxury Rooms | WiFi & Breakfast Included</p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBookingForDetail.staff_requirements && Object.keys(selectedBookingForDetail.staff_requirements).length > 0 && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Additional Staff On-Duty</p>
                  <div className="mt-2 space-y-1">
                    {Object.entries(selectedBookingForDetail.staff_requirements).map(([role, count]) => (
                      <p key={role} className="text-slate-900 font-medium text-sm">
                        {role}: <span className="font-semibold">{count}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Financial Breakdown & Rates */}
              {(() => {
                const invoiceObj = getInvoiceForBooking(selectedBookingForDetail);
                const calcGrandTotal = Number(selectedBookingForDetail.total_cost || selectedBookingForDetail.amount || invoiceObj?.totalAmount || 0);
                const calcAdvancePaid = Number(selectedBookingForDetail.advance_paid || invoiceObj?.paidAmount || 0);
                const calcBalance = calcGrandTotal - calcAdvancePaid;

                return (
                  <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <p className="text-sm uppercase tracking-widest text-slate-800 font-black flex items-center gap-2">
                        <span>💳</span> Full Financial Details
                      </p>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">Official Estimate</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center pt-1 text-base">
                        <span className="font-extrabold text-slate-900">Grand Total Amount</span>
                        <strong className="text-slate-900 font-black text-xl">
                          {formatINR(calcGrandTotal)}
                        </strong>
                      </div>
                    </div>

                    {/* Advance Pay & Remaining Balance Box */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3 mt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-bold uppercase">Advance Paid</span>
                          <span className={`${calcAdvancePaid > 0 ? "text-emerald-700" : "text-orange-600"} font-black text-lg`}>
                            {formatINR(calcAdvancePaid)}
                          </span>
                        </div>
                        <span className={`text-xs font-black px-3 py-1 rounded-md ${calcAdvancePaid > 0 ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                          {calcAdvancePaid > 0 ? "✅ Advance Paid" : "⏳ Advance Pending"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-500 font-bold uppercase">Remaining Balance</span>
                          <span className="text-orange-600 font-black text-xl">
                            {formatINR(Math.max(0, calcBalance))}
                          </span>
                        </div>
                        {calcBalance > 0 ? (
                          <button 
                            type="button" 
                            onClick={() => handleProceedToPayment(selectedBookingForDetail)}
                            className="text-xs text-white font-semibold bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-md transition-colors cursor-pointer"
                          >
                            Pay Remaining Amount
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2.5 py-1 rounded-md">
                            Fully Paid
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Payment Transaction & Method Details */}
                    {calcAdvancePaid > 0 && (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-4 space-y-2 text-xs">
                      <p className="font-extrabold text-emerald-900 text-sm flex items-center gap-1.5 mb-2">
                        <span>🛡️</span> Verified Transaction Record
                      </p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-slate-700">
                        <div>
                          <span className="text-slate-400 block font-bold">Booking ID:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {selectedBookingForDetail.bookingReference || selectedBookingForDetail._id || selectedBookingForDetail.id}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-bold">Transaction ID:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {selectedBookingForDetail.razorpay_payment_id || invoiceObj?.transactionId || "N/A"}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-bold">Order ID:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {selectedBookingForDetail.razorpay_order_id || invoiceObj?.orderId || "N/A"}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-bold">Status:</span>
                          <span className="font-bold text-emerald-700">
                            Confirmed
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block font-bold">Paid Date:</span>
                          <span className="font-bold text-slate-900">
                            {formatDate(selectedBookingForDetail.paymentConfirmedAt || selectedBookingForDetail.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    )}
                  </div>
                );
              })()}

              {selectedBookingForDetail.home_special_notes && (
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400">Special Setup Requirements</p>
                  <p className="text-slate-700 mt-2">{selectedBookingForDetail.home_special_notes}</p>
                </div>
              )}

              {(selectedBookingForDetail.booking_status === "Cancelled" || selectedBookingForDetail.booking_status === "Rejected") && (
                <div className="rounded-2xl border border-red-200 p-5 bg-red-50 space-y-3">
                  <h4 className="text-red-700 font-bold flex items-center gap-2 text-lg">
                    <span>❌</span> Booking {selectedBookingForDetail.booking_status}
                  </h4>
                  <p className="text-red-600 text-sm">
                    <strong>Reason:</strong> {selectedBookingForDetail.cancellation_reason || selectedBookingForDetail.rejectionReason || "Not provided"}
                  </p>
                  {selectedBookingForDetail.refund_status && selectedBookingForDetail.refund_status !== "Not Applicable" && (
                    <div className="mt-3 p-4 bg-white border border-red-100 rounded-lg text-sm grid grid-cols-2 gap-2">
                      <p className="col-span-2 sm:col-span-1"><strong>Event Date:</strong> {formatDate(selectedBookingForDetail.event_date || selectedBookingForDetail.eventDate || selectedBookingForDetail.date)}</p>
                      <p className="col-span-2 sm:col-span-1"><strong>Days Remaining:</strong> {selectedBookingForDetail.days_remaining !== undefined ? selectedBookingForDetail.days_remaining : 'N/A'}</p>
                      <p className="col-span-2 sm:col-span-1"><strong>Amount Paid:</strong> {formatINR(selectedBookingForDetail.advance_paid || selectedBookingForDetail.amount_paid || 0)}</p>
                      <p className="col-span-2 sm:col-span-1"><strong>Fee Percentage:</strong> {selectedBookingForDetail.fee_percentage !== undefined ? `${selectedBookingForDetail.fee_percentage}%` : 'N/A'}</p>
                      <p className="col-span-2 sm:col-span-1"><strong>Cancellation Fee:</strong> {formatINR(selectedBookingForDetail.cancellation_fee)}</p>
                      <p className="col-span-2 sm:col-span-1 text-emerald-600"><strong>Refund Amount:</strong> {formatINR(selectedBookingForDetail.refundable_amount)}</p>
                      <p className="col-span-2">
                        <strong>Refund Status:</strong> 
                        <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                          selectedBookingForDetail.refund_status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          selectedBookingForDetail.refund_status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {selectedBookingForDetail.refund_status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="rounded-2xl bg-slate-100 p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">System reference ID</p>
                  <p className="text-lg font-mono font-semibold text-slate-900 mt-2">
                    {selectedBookingForDetail.bookingReference || selectedBookingForDetail.id || selectedBookingForDetail._id}
                  </p>
                </div>
                {getInvoiceForBooking(selectedBookingForDetail) && (
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-emerald-600">Invoice</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {getInvoiceForBooking(selectedBookingForDetail).invoiceNumber}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForDetail(null)}
                  className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>
                <button
                    type="button"
                    className="flex-1 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 font-semibold text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center gap-2"
                    onClick={() => window.print()}
                >
                    <Download size={18} />
                    Save / Print Details
                </button>
                {getInvoiceForBooking(selectedBookingForDetail) && (
                  <button
                    type="button"
                    className="flex-1 rounded-2xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    onClick={() => {
                      const url = getInvoicePdfUrl(getInvoiceForBooking(selectedBookingForDetail)._id);
                      window.open(url, "_blank");
                    }}
                  >
                    <Download size={18} />
                    Download Receipt
                  </button>
                )}
                {(() => {
                  const invoiceObj = getInvoiceForBooking(selectedBookingForDetail);
                  const calcGrandTotal = Number(selectedBookingForDetail.total_cost || selectedBookingForDetail.amount || invoiceObj?.totalAmount || 0);
                  const calcAdvancePaid = Number(selectedBookingForDetail.advance_paid || invoiceObj?.paidAmount || 0);
                  
                  const isApproved = String(selectedBookingForDetail.status).toLowerCase() === "approved" || 
                                     String(selectedBookingForDetail.booking_status).toLowerCase() === "approved - awaiting payment" ||
                                     String(selectedBookingForDetail.booking_status).toLowerCase() === "approved" ||
                                     String(selectedBookingForDetail.booking_status).toLowerCase() === "confirmed";

                  if (isApproved && calcAdvancePaid === 0 && !invoiceObj) {
                    return (
                      <button
                        type="button"
                        className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 transition"
                        onClick={() => handleProceedToPayment(selectedBookingForDetail)}
                      >
                        Proceed to Payment
                      </button>
                    );
                  }
                  return null;
                })()}
                {(() => {
                  const invoiceObj = getInvoiceForBooking(selectedBookingForDetail);
                  const calcGrandTotal = Number(selectedBookingForDetail.total_cost || selectedBookingForDetail.amount || invoiceObj?.totalAmount || 0);
                  const calcAdvancePaid = Number(selectedBookingForDetail.advance_paid || invoiceObj?.paidAmount || 0);
                  const calcBalance = calcGrandTotal - calcAdvancePaid;
                  
                  if (calcBalance > 0 && calcAdvancePaid > 0) {
                    return (
                      <button
                        type="button"
                        className="flex-1 rounded-2xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-700 transition"
                        onClick={() => handleProceedToPayment(selectedBookingForDetail)}
                      >
                        Pay Balance ({formatINR(calcBalance)})
                      </button>
                    );
                  }
                  return null;
                })()}

                {(() => {
                  const status = String(selectedBookingForDetail.booking_status || selectedBookingForDetail.status).toLowerCase();
                  if (status !== "cancelled" && status !== "rejected" && status !== "completed") {
                    return (
                      <button
                        type="button"
                        className="flex-1 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-600 hover:bg-red-100 transition"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Booking
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowCancelModal(false)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Cancel Booking?</h3>
            <p className="text-slate-600 text-sm mb-4">
              Booking ID: {selectedBookingForDetail.bookingReference || selectedBookingForDetail._id}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Cancellation Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Select a reason</option>
                <option value="Personal reason">Personal reason</option>
                <option value="Change of plans">Change of plans</option>
                <option value="Date changed">Date changed</option>
                <option value="Found another venue">Found another venue</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {cancelMessage && <p className="text-red-500 text-sm mb-4">{cancelMessage}</p>}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition"
                onClick={handleCancelBooking}
                disabled={!cancelReason}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;