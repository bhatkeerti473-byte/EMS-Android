import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, ArrowRight, MapPin, Download, Mail, ChevronLeft, Menu, Check } from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import "../styles/premium-dashboard.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  const now = new Date();
  const formattedNow = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;

  useEffect(() => {
    const orderId = location.state?.orderId;
    if (!orderId) {
      setError("No valid booking ID found for this session. Please access your booking from the dashboard.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [bookingRes, paymentRes] = await Promise.all([
          fetch(`http://localhost:5000/api/bookings/${orderId}`),
          fetch(`http://localhost:5000/api/payments/booking/${orderId}`)
        ]);

        if (!bookingRes.ok) {
          throw new Error("Failed to fetch booking details. It may not exist or network failed.");
        }
        
        const bookingJson = await bookingRes.json();
        const bookingData = bookingJson.data || bookingJson;
        
        let paymentData = null;
        if (paymentRes.ok) {
          const pJson = await paymentRes.json();
          paymentData = pJson.data || pJson;
        }

        setBooking(bookingData);
        setPayment(paymentData);
        setLoading(false);

        // Cleanup local storage for wizard fields once successful
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("booking_")) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

      } catch (err) {
        console.error("Error loading success data:", err);
        setError(err.message || "An error occurred while loading your booking.");
        setLoading(false);
      }
    };

    fetchData();
  }, [location.state]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? dateStr : `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()}`;
  };

  const formatCurrency = (val) => {
    return '₹ ' + (val || 0).toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="premium-dashboard">
        <Sidebar />
        <div className="premium-main">
          <Topbar title="Booking Status" />
          <div className="premium-content-scroll flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading booking and payment details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-dashboard">
        <Sidebar />
        <div className="premium-main">
          <Topbar title="Booking Error" />
          <div className="premium-content-scroll flex items-center justify-center min-h-[60vh]">
            <div className="bg-red-50 text-red-700 p-8 rounded-2xl max-w-md text-center border border-red-200">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Failed to Load Status</h2>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => navigate("/client/my-bookings")}
                className="mt-6 btn-solid-orange py-2 px-6 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
              >
                Go to My Bookings <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isSuccess = booking?.booking_status === "Confirmed" || booking?.booking_status === "Approved";
  const totalCost = booking.total_cost || booking.amount || 0;
  const advancePaid = payment?.amount || booking.advance_paid || 0;
  const remainingDue = totalCost - advancePaid;

  // Calculate dynamic costs for breakdown
  const cakeCost = booking.cakeName && booking.cakeName !== 'None' ? (booking.cakePrice || 5000) : 0;
  const photoCost = booking.additionalServices?.photography ? 35000 : 0;
  const djCost = booking.additionalServices?.dj ? 20000 : 0;
  const transportCost = booking.additionalServices?.travel ? 30000 : 0;
  const cateringCost = (booking.cateringPackage || booking.catering_details) ? 30000 : 0;
  const decorationCost = booking.decorationPackage ? 25000 : 0;
  
  let otherCosts = cakeCost + photoCost + djCost + transportCost + cateringCost + decorationCost;
  let venueCost = totalCost - otherCosts;
  if (venueCost < 0) {
    venueCost = totalCost; 
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="premium-dashboard" style={{ backgroundColor: '#f3f4f6' }}>
      <Sidebar />
      <div className="premium-main">
        <div className="premium-content-scroll" style={{ padding: 0 }}>
          
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff', minHeight: '100vh', boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
            
            {/* Custom App-like Header */}
            <div style={{ backgroundColor: '#002B5B', padding: '15px 20px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #D4AF37' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <ChevronLeft className="cursor-pointer" onClick={() => navigate('/client/my-bookings')} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #D4AF37', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a192f' }}>
                    <span style={{ color: '#D4AF37', fontSize: '14px', lineHeight: 1, marginBottom: '-2px' }}>👑</span>
                    <span style={{ color: '#D4AF37', fontSize: '10px', fontWeight: 'bold' }}>EMS</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>EVENT</div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>MANAGEMENT SYSTEM</div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="hidden sm:block">
                  <div style={{ fontSize: '10px', fontStyle: 'italic', color: '#cbd5e1' }}>Making Your Special Moments</div>
                  <div style={{ fontSize: '10px', fontStyle: 'italic', color: '#cbd5e1' }}>More Memorable <span style={{color:'#D4AF37'}}>♥</span></div>
                </div>
                <Menu className="cursor-pointer hidden sm:block" />
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              
              {/* Top Title Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', backgroundColor: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <CheckCircle size={24} />
                  </div>
                  <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Booking Confirmed!</h1>
                </div>
                <div style={{ color: '#1e3a8a', fontFamily: '"Brush Script MT", cursive', fontSize: '20px', transform: 'rotate(-5deg)', textAlign: 'right', marginTop: '10px' }}>
                  Thank you<br/>for choosing<br/>Event! <span style={{color: '#D4AF37'}}>❤</span>
                </div>
              </div>

              <p style={{ fontWeight: '600', color: '#1e293b', marginBottom: '5px' }}>Hello {booking.clientName || 'Valued Client'},</p>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Your event booking has been successfully confirmed.<br/>We're excited to be a part of your special day!</p>

              {/* Grid Info */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px', backgroundColor: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>💍</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Event Type</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{booking.event_type || 'Wedding'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>📅</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Event Date</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{formatDate(booking.event_date || booking.eventDate)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🎫</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Booking ID</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', wordBreak: 'break-all' }}>{booking.bookingReference || booking._id}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>🗓️</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Booking Date</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{formatDate(booking.createdAt)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>⏱️</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Event Time</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{booking.time_slot || '09:00 AM - 11:00 PM'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>👥</span>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Guest Count</div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>{booking.guests || booking.catering_details?.guest_count || '150'} Guests</div>
                  </div>
                </div>
                
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ display: 'inline-flex', padding: '4px 12px', backgroundColor: '#d1fae5', color: '#059669', borderRadius: '4px', fontSize: '12px', fontWeight: '600', border: '1px solid #a7f3d0' }}>
                    <CheckCircle size={14} style={{ marginRight: '5px' }}/> Booking Status: Confirmed
                  </span>
                </div>
              </div>

              {/* Venue Card */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '25px', backgroundColor: '#f8fafc' }}>
                <div style={{ height: '180px', width: '100%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {booking.image ? (
                    <img src={getImageUrl(booking.image)} alt="Venue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#94a3b8' }}>No Venue Image</span>
                  )}
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                    <MapPin size={16} color="#3b82f6" />
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6' }}>Selected Venue</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a8a', margin: '0 0 10px 0' }}>{booking.venueName || 'Venue Not Specified'}</h3>
                  <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '10px' }}>
                    {booking.location || booking.address || 'Location Details Missing'}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.4' }}>
                    Your venue has been successfully reserved for your special event.
                  </p>
                </div>
              </div>

              {/* Selected Services */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <span style={{ fontSize: '18px' }}>⚙️</span>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>Selected Services & Items</h3>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '25px' }}>
                {cateringCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>🍽️</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Catering</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{booking.cateringPackage || 'Catering Included'}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(cateringCost)}</div>
                  </div>
                )}
                {decorationCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>✨</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Decoration</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{booking.decorationPackage}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(decorationCost)}</div>
                  </div>
                )}
                {cakeCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>🎂</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Cake</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{booking.cakeName}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(cakeCost)}</div>
                  </div>
                )}
                {photoCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>📸</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Photography</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Included in booking</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(photoCost)}</div>
                  </div>
                )}
                {djCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>🎵</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>DJ / Sound</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Included in booking</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(djCost)}</div>
                  </div>
                )}
                {transportCost > 0 && (
                  <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '15px', display: 'flex', gap: '12px', backgroundColor: 'white', position: 'relative' }}>
                    <div style={{ fontSize: '24px' }}>🚌</div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#334155', marginBottom: '3px' }}>Transport</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Included in booking</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', position: 'absolute', right: '15px', top: '15px' }}>{formatCurrency(transportCost)}</div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '25px' }}>
                
                {/* Cost Breakdown */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '18px' }}>💰</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>Event Cost Breakdown</h3>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '15px' }}>Cost breakdown for your event services.</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                    <span>Venue Booking</span>
                    <span>{formatCurrency(venueCost)}</span>
                  </div>
                  {cateringCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>Catering</span><span>{formatCurrency(cateringCost)}</span>
                    </div>
                  )}
                  {decorationCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>Decoration</span><span>{formatCurrency(decorationCost)}</span>
                    </div>
                  )}
                  {cakeCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>Cake</span><span>{formatCurrency(cakeCost)}</span>
                    </div>
                  )}
                  {photoCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>Photography</span><span>{formatCurrency(photoCost)}</span>
                    </div>
                  )}
                  {djCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>DJ / Sound</span><span>{formatCurrency(djCost)}</span>
                    </div>
                  )}
                  {transportCost > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                      <span>Transport</span><span>{formatCurrency(transportCost)}</span>
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 'bold', color: '#1e3a8a', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #cbd5e1' }}>
                    <span>Total Event Amount</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </div>
                </div>

                {/* Payment Summary */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '18px' }}>💳</span>
                    <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>Payment Summary</h3>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#334155', fontWeight: '500', marginBottom: '10px' }}>
                    <span>Total Amount</span>
                    <span>{formatCurrency(totalCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#059669', fontWeight: '600', marginBottom: '10px' }}>
                    <span>Amount Paid</span>
                    <span>{formatCurrency(advancePaid)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#dc2626', fontWeight: '700', padding: '10px 0', borderTop: '1px solid #cbd5e1', borderBottom: '1px solid #cbd5e1', marginBottom: '15px' }}>
                    <span>Remaining Amount</span>
                    <span>{formatCurrency(remainingDue)}</span>
                  </div>
                  
                  <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '15px' }}>
                    <CheckCircle size={16} /> Payment Status: Successful
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#334155', fontWeight: 'bold', marginBottom: '5px' }}>
                      <span>📄</span> Payment Details
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Payment Method</span><span>{booking.payment_method || 'Online'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Transaction ID</span><span style={{fontFamily: 'monospace'}}>{payment?.razorpay_payment_id || booking.payment_id || 'N/A'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Paid On</span><span>{formatDate(booking.paymentConfirmedAt || booking.createdAt)}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Status Timeline */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', backgroundColor: 'white', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '25px' }}>
                  <span style={{ fontSize: '18px' }}>📋</span>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a', margin: 0 }}>Booking Status</h3>
                </div>
                
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                  <div style={{ position: 'absolute', top: '10px', left: '10%', right: '10%', height: '2px', backgroundColor: '#e2e8f0', zIndex: 1 }}></div>
                  <div style={{ position: 'absolute', top: '10px', left: '10%', right: '50%', height: '2px', backgroundColor: '#10b981', zIndex: 1 }}></div>
                  
                  <div style={{ zIndex: 2, textAlign: 'center', width: '60px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Check size={12}/></div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', lineHeight: 1.2 }}>Booking<br/>Submitted</div>
                  </div>
                  <div style={{ zIndex: 2, textAlign: 'center', width: '60px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Check size={12}/></div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', lineHeight: 1.2 }}>Payment<br/>Confirmed</div>
                  </div>
                  <div style={{ zIndex: 2, textAlign: 'center', width: '60px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Check size={12}/></div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', lineHeight: 1.2 }}>Booking<br/>Confirmed</div>
                  </div>
                  <div style={{ zIndex: 2, textAlign: 'center', width: '60px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '10px' }}>⏳</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', lineHeight: 1.2 }}>Event<br/>Preparation</div>
                  </div>
                  <div style={{ zIndex: 2, textAlign: 'center', width: '60px' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '10px' }}>🏁</div>
                    <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', lineHeight: 1.2 }}>Event<br/>Completed</div>
                  </div>
                </div>
              </div>

              {/* Message Box */}
              <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <Mail className="text-blue-500" size={24} />
                <div style={{ fontSize: '12px', color: '#0369a1' }}>
                  A confirmation email with your booking details has been sent to your registered email.
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={() => window.location.href = `mailto:noreply@eventmanagement.com`} style={{ flex: 1, padding: '12px', border: '1px solid #002B5B', borderRadius: '8px', backgroundColor: 'white', color: '#002B5B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  <Mail size={18} /> Email
                </button>
                <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', backgroundColor: '#002B5B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
                  <Download size={18} /> Save PDF
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
