import React, { useState } from "react";
import { Check, ArrowLeft, ArrowRight, Calendar, Clock, FileText, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

const StayDateTime = () => {
  const navigate = useNavigate();

  const selectedRoomName = localStorage.getItem("booking_selected_room") || "Hotel Grand Comfort";
  const selectedRoomQty = Number(localStorage.getItem("booking_room_qty")) || 1;
  const selectedRoomPrice = Number(localStorage.getItem("booking_room_price")) || 3000;
  
  const checkinDate = localStorage.getItem("booking_room_checkin_date") || "2026-06-20";
  const checkinTime = localStorage.getItem("booking_room_checkin_time") || "14:00";
  const nights = Number(localStorage.getItem("booking_room_nights")) || 1;

  const [roomQty, setRoomQty] = useState(selectedRoomQty);

  const getCheckoutDateStr = (checkinStr, nightCount) => {
    try {
      const date = new Date(checkinStr);
      if (isNaN(date.getTime())) return "21 June 2026";
      date.setDate(date.getDate() + nightCount);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return "21 June 2026";
    }
  };

  const formatCheckinDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const displayCheckinDate = formatCheckinDate(checkinDate);
  const checkoutDate = getCheckoutDateStr(checkinDate, nights);
  const checkoutTime = "11:00 AM";

  const updatedTotal = roomQty * selectedRoomPrice * nights;

  const handleContinue = () => {
    localStorage.setItem("booking_room_qty", roomQty);
    localStorage.setItem("booking_room_total", updatedTotal);
    navigate('/client/seating-arrangement');
  };

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          
          {/* Header & Stepper */}
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <button className="btn-menu-mobile d-md-none" style={{ background: 'none', border: 'none', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <h2 style={{ color: "#0f172a", fontSize: "24px", margin: "16px 0 4px" }}>Stay Date & Time</h2>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0" }}>Select check-in and check-out date & time for your guests</p>
          </div>

          <div className="stepper-wrapper">
            <div className="stepper-line-bg"></div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Decoration & Catering</div>
            </div>
            <div className="step-point">
              <div className="step-circle completed"><Check size={16} /></div>
              <div className="step-label active">Hall Type</div>
            </div>
            <div className="step-point">
              <div className="step-circle active">6</div>
              <div className="step-label active">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Booking Summary</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Payment</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">9</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>

          <div className="stay-datetime-container" style={{ padding: "0 32px 32px" }}>
            
            <div className="stay-layout-row">
              {/* 1. Select Stay Period */}
              <div className="stay-left-col">
                <div className="section-block">
                  <h3 className="section-title mb-6">1. Select Stay Period</h3>
                  
                  <div className="date-time-picker-group">
                    <label className="dt-label">Check-in Date & Time</label>
                    <div className="dt-inputs-row">
                      <div className="dt-input-wrapper flex-1">
                        <input type="text" value={displayCheckinDate} readOnly className="dt-input" />
                        <Calendar size={16} className="dt-icon" />
                      </div>
                      <div className="dt-input-wrapper w-40">
                        <input type="text" value={checkinTime} readOnly className="dt-input" style={{ textAlign: "center" }} />
                      </div>
                    </div>
                  </div>

                  <div className="date-time-picker-group mt-6">
                    <label className="dt-label">Check-out Date & Time</label>
                    <div className="dt-inputs-row">
                      <div className="dt-input-wrapper flex-1">
                        <input type="text" value={checkoutDate} readOnly className="dt-input" />
                        <Calendar size={16} className="dt-icon" />
                      </div>
                      <div className="dt-input-wrapper w-40">
                        <input type="text" value={checkoutTime} readOnly className="dt-input" style={{ textAlign: "center" }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="duration-summary-box mt-8">
                    <h5 className="font-bold text-gray-900 mb-1 text-sm">Total Stay Duration: {nights} Night{nights > 1 ? 's' : ''}</h5>
                    <p className="text-xs text-gray-600 m-0">({displayCheckinDate}, {checkinTime} – {checkoutDate}, {checkoutTime})</p>
                  </div>
                </div>

                {/* Important Information */}
                <div className="important-info-box mt-8">
                  <div className="flex gap-4">
                    <div className="info-icon text-orange-500"><FileText size={32} strokeWidth={1.5} /></div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-2">Important Information</h4>
                      <ul className="info-list">
                        <li>Early check-in is subject to availability.</li>
                        <li>Late check-out may be charged additionally.</li>
                        <li>Breakfast is included in all rooms.</li>
                        <li>Any cancellation within 48 hours of check-in will be non-refundable.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Selected Rooms & Availability */}
              <div className="stay-right-col">
                <div className="section-block h-full flex flex-col">
                  <h3 className="section-title mb-6">2. Selected Rooms & Availability</h3>
                  
                  <div className="selected-rooms-list mb-6">
                    {/* Room 1 */}
                    <div className="stay-room-item">
                      <div className="sr-img"><img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" alt={selectedRoomName} /></div>
                      <div className="sr-details flex-1">
                        <h4 className="font-bold text-sm text-gray-900 m-0 text-blue-800">{selectedRoomName}</h4>
                        <div className="text-xs text-gray-500 my-1">Selected Guest Accommodation</div>
                        <div className="text-xs text-gray-400">Rate: ₹ {selectedRoomPrice.toLocaleString('en-IN')} / Night</div>
                      </div>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => setRoomQty(prev => Math.max(1, prev - 1))}>-</button>
                        <span className="qty-val">{roomQty}</span>
                        <button className="qty-btn" onClick={() => setRoomQty(prev => prev + 1)}>+</button>
                      </div>
                      <div className="sr-price text-right ml-6">
                        <div className="font-bold text-sm text-gray-900">₹ {(selectedRoomPrice * roomQty).toLocaleString('en-IN')} <span className="text-xs text-gray-500 font-normal">/ Night</span></div>
                        <div className="text-xs text-gray-400 text-right mt-1">subtotal</div>
                      </div>
                    </div>
                  </div>

                  <div className="availability-banner bg-green-50 text-green-700 border border-green-200 rounded-lg p-3 flex items-center gap-3 text-sm font-medium mb-8">
                    <CheckCircle2 size={18} /> Rooms available for selected dates
                  </div>

                  {/* Stay Summary Box */}
                  <div className="stay-summary-receipt mt-auto bg-gray-50 border border-gray-200 p-6 rounded-xl">
                    <h4 className="font-bold text-sm text-gray-900 border-b border-gray-200 pb-3 mb-4">Stay Summary</h4>
                    <div className="summary-row flex justify-between text-xs text-gray-600 mb-3">
                      <span>Check-in</span>
                      <span className="font-medium text-gray-900">{displayCheckinDate}, {checkinTime}</span>
                    </div>
                    <div className="summary-row flex justify-between text-xs text-gray-600 mb-3">
                      <span>Check-out</span>
                      <span className="font-medium text-gray-900">{checkoutDate}, {checkoutTime}</span>
                    </div>
                    <div className="summary-row flex justify-between text-xs text-gray-600 mb-3">
                      <span>Total Rooms</span>
                      <span className="font-medium text-gray-900">{roomQty} Room{roomQty > 1 ? 's' : ''}</span>
                    </div>
                    <div className="summary-row flex justify-between text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
                      <span>Nights Duration</span>
                      <span className="font-medium text-gray-900">{nights} Night{nights > 1 ? 's' : ''}</span>
                    </div>
                    <div className="summary-total">
                      <div className="text-xs text-gray-500 mb-1">Total Amount</div>
                      <div className="text-xl font-bold text-blue-800">₹ {updatedTotal.toLocaleString('en-IN')}</div>
                      <div className="text-[10px] text-gray-400">(Incl. all taxes)</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <EventSummaryFooter icon={Calendar} />

            <div className="bottom-navigation" style={{ marginTop: "20px" }}>
              <button className="btn-nav-back" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} /> Back
              </button>
              <button className="btn-nav-continue" onClick={handleContinue}>
                Continue <ArrowRight size={20} />
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayDateTime;
