import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, MapPin, Clock, Lock, ArrowRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import EventSummaryFooter from "../styles/components/EventSummaryFooter";
import "../styles/premium-dashboard.css";

import axios from "axios";

const SelectDate = () => {
  const navigate = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const [bookingTimeType, setBookingTimeType] = useState(() => {
    return localStorage.getItem("booking_time_type") || "fullDay";
  });

  const [selectedSlotPreset, setSelectedSlotPreset] = useState(() => {
    return localStorage.getItem("booking_time_slot") || "Full Day Event (09:00 AM - 11:00 PM)";
  });

  const [startTime, setStartTime] = useState(() => {
    return localStorage.getItem("booking_start_time") || "09:00";
  });

  const [endTime, setEndTime] = useState(() => {
    return localStorage.getItem("booking_end_time") || "23:00";
  });
  
  const handleContinue = async () => {
    setAvailabilityError("");
    const venueId = localStorage.getItem("booking_venue_id");
    
    // If a venue is already selected, check availability first
    if (venueId) {
      setIsChecking(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/availability?venueId=${venueId}&date=${selectedDateStr}`);
        if (!response.data.available) {
          setAvailabilityError("✕ Venue is already booked for this date. Please select another date.");
          setIsChecking(false);
          return;
        }
      } catch (error) {
        setAvailabilityError("Unable to verify venue availability. Please try again.");
        setIsChecking(false);
        return;
      }
      setIsChecking(false);
    }

    const timeLabel = bookingTimeType === "fullDay" 
      ? "Full Day Event (09:00 AM - 11:00 PM)" 
      : selectedSlotPreset;

    localStorage.setItem("booking_event_date", selectedDateStr);
    localStorage.setItem("booking_time_type", bookingTimeType);
    localStorage.setItem("booking_time_slot", timeLabel);
    localStorage.setItem("booking_start_time", startTime);
    localStorage.setItem("booking_end_time", endTime);

    try {
      const existing = JSON.parse(localStorage.getItem("client_bookings") || "[]");
      if (existing.length > 0) {
        existing[0].event_date = selectedDateStr;
        existing[0].eventDate = selectedDateStr;
        existing[0].timeSlot = timeLabel;
        existing[0].startTime = startTime;
        existing[0].endTime = endTime;
        localStorage.setItem("client_bookings", JSON.stringify(existing));
      }
    } catch(e) {}

    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      const selectedPkg = localStorage.getItem("booking_selected_package");
      if (selectedPkg) {
        navigate("/client/summary");
      } else {
        navigate("/client/event-type");
      }
    }, 1500);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Initial active view state
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11

  // Set default selected date (tomorrow)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [selectedDateStr, setSelectedDateStr] = useState(() => {
    const saved = localStorage.getItem("booking_event_date");
    if (saved) return saved;
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const day = String(tomorrow.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  // Calculate limits
  const oneYearFromToday = new Date(today);
  oneYearFromToday.setFullYear(oneYearFromToday.getFullYear() + 1);

  const isPrevMonthDisabled = () => {
    return currentYear === today.getFullYear() && currentMonth === today.getMonth();
  };

  const isNextMonthDisabled = () => {
    // Cannot navigate more than a year forward
    const limitYear = oneYearFromToday.getFullYear();
    const limitMonth = oneYearFromToday.getMonth();
    return currentYear > limitYear || (currentYear === limitYear && currentMonth >= limitMonth);
  };

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled()) return;
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled()) return;
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper arrays for calendar generation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate();

  // Helper to determine booking availability of a specific date
  const getDateBookingStatus = (dayNum, cellDate) => {
    const isPast = cellDate < today;
    const isTooFar = cellDate > oneYearFromToday;
    if (isPast || isTooFar) return { status: "unavailable" };

    // Fully booked dates (both day & night booked)
    if (dayNum % 11 === 0) {
      return { status: "booked", bookedSession: "full" };
    }

    // Partially booked dates (Morning/Day session is booked, Evening/Night session is 100% available!)
    if (dayNum % 4 === 0 || dayNum === 15 || dayNum === 22) {
      return { 
        status: "partial", 
        bookedSession: "morning", 
        bookedLabel: "Morning Session (09:00 AM - 03:00 PM) Booked",
        availableLabel: "Evening & Night Sessions Available" 
      };
    }

    return { status: "available" };
  };

  const renderCalendarDays = () => {
    const days = [];

    // Previous month filler days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="cal-day cal-unavailable opacity-30">
          {prevMonthDaysCount - i}
        </div>
      );
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const cellDate = new Date(currentYear, currentMonth, dayNum);
      cellDate.setHours(0, 0, 0, 0);

      const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const statusInfo = getDateBookingStatus(dayNum, cellDate);
      const isSelected = selectedDateStr === cellDateStr;

      let className = "cal-day relative flex flex-col items-center justify-center p-1";
      if (isSelected) className += " cal-selected";
      else if (statusInfo.status === "unavailable") className += " cal-unavailable disabled-past";
      else if (statusInfo.status === "booked") className += " cal-booked";
      else if (statusInfo.status === "partial") className += " cal-available bg-red-50/90 border border-red-300 text-red-900 font-extrabold";
      else className += " cal-available";

      const isSelectable = statusInfo.status === "available" || statusInfo.status === "partial";

      days.push(
        <div
          key={`curr-${dayNum}`}
          className={className}
          onClick={() => {
            if (isSelectable) {
              setSelectedDateStr(cellDateStr);
              localStorage.setItem("booking_event_date", cellDateStr);

              // If Day/Morning session is booked, automatically select Evening/Night session!
              if (statusInfo.status === "partial") {
                setBookingTimeType("customTime");
                setSelectedSlotPreset("Evening Gala (06:00 PM - 11:00 PM)");
                setStartTime("18:00");
                setEndTime("23:00");
              }
            }
          }}
          style={{ cursor: isSelectable ? "pointer" : "not-allowed" }}
        >
          <span className="text-sm">{dayNum}</span>
          {statusInfo.status === "partial" && !isSelected && (
            <span className="text-[9px] font-black text-red-700 bg-red-100/90 px-1 py-0.2 rounded leading-none mt-0.5" style={{fontSize: "8px", padding: "1px 3px"}}>
              Eve Free
            </span>
          )}
        </div>
      );
    }

    // Next month filler days
    const totalCells = days.length > 35 ? 42 : 35;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="cal-day cal-unavailable opacity-30">
          {i}
        </div>
      );
    }

    return days;
  };

  // Parsing details of selected date
  const selectedDateObj = new Date(selectedDateStr + "T00:00:00");
  const selectedDateDay = selectedDateObj.getDate();
  const selectedDateMonthName = selectedDateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const selectedDateDayName = selectedDateObj.toLocaleDateString("en-US", { weekday: "long" });
  const selectedDateFormatted = selectedDateObj.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
  const selectedDateBookingStatus = getDateBookingStatus(selectedDateDay, selectedDateObj);

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Client Overview" hideNotifications={true} />

        <div className="premium-content-scroll" style={{ backgroundColor: "#ffffff" }}>
          <div className="page-header" style={{ padding: "20px 32px 0" }}>
            <h2 style={{ color: "#0f172a", fontSize: "24px", marginBottom: "4px" }}>Select Event Date</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginTop: "0" }}>Please select your preferred event date from the calendar</p>
          </div>

          {/* Stepper Area */}
          <div className="stepper-wrapper" style={{ margin: "20px 32px 10px" }}>
            <div className="stepper-line-bg"></div>
            <div className="stepper-line-active" style={{ width: "0%", background: '#ea580c' }}></div>
            <div className="step-point">
              <div className="step-circle active" style={{background: '#ea580c', borderColor: '#ea580c', color: 'white'}}>1</div>
              <div className="step-label active" style={{color: '#ea580c', fontWeight: 600}}>Select Date</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">2</div>
              <div className="step-label">Event Type</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">3</div>
              <div className="step-label">Expected Guests</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">4</div>
              <div className="step-label">Select Venue</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">5</div>
              <div className="step-label">Decoration Style</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">6</div>
              <div className="step-label">Catering Options</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">7</div>
              <div className="step-label">Additional Services</div>
            </div>
            <div className="step-point">
              <div className="step-label-point">8</div>
              <div className="step-label">Booking Summary</div>
            </div>
          </div>

          <div className="calendar-layout">
            <div className="calendar-main">
              <div className="calendar-header">
                <button 
                  className="cal-nav-btn" 
                  onClick={handlePrevMonth}
                  disabled={isPrevMonthDisabled()}
                  style={{ opacity: isPrevMonthDisabled() ? 0.3 : 1, cursor: isPrevMonthDisabled() ? "not-allowed" : "pointer" }}
                >
                  <ChevronLeft size={20} />
                </button>
                <h3>{monthNames[currentMonth]} {currentYear}</h3>
                <button 
                  className="cal-nav-btn" 
                  onClick={handleNextMonth}
                  disabled={isNextMonthDisabled()}
                  style={{ opacity: isNextMonthDisabled() ? 0.3 : 1, cursor: isNextMonthDisabled() ? "not-allowed" : "pointer" }}
                >
                  <ChevronRight size={20} />
                </button>
                <button 
                  className="cal-today-btn"
                  onClick={() => {
                    setCurrentYear(today.getFullYear());
                    setCurrentMonth(today.getMonth());
                  }}
                >
                  <CalendarIcon size={16} style={{marginRight: '6px'}}/> Today
                </button>
              </div>

              <div className="calendar-grid">
                <div className="cal-weekday">Sun</div>
                <div className="cal-weekday">Mon</div>
                <div className="cal-weekday">Tue</div>
                <div className="cal-weekday">Wed</div>
                <div className="cal-weekday">Thu</div>
                <div className="cal-weekday">Fri</div>
                <div className="cal-weekday">Sat</div>

                {renderCalendarDays()}
              </div>

              <div className="calendar-legend">
                <div className="legend-item">
                  <span className="legend-dot dot-available"></span>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: "#ef4444", border: "1px solid #dc2626" }}></span>
                  <span>Day Booked (Evening Free)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dot-booked"></span>
                  <span>Fully Booked</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dot-selected"></span>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot dot-unavailable"></span>
                  <span>Unavailable / Past</span>
                </div>
              </div>
            </div>

            <div className="calendar-sidebar">
              <div className="summary-card">
                <div className="summary-card-header">
                  <CalendarIcon size={18} className="icon-blue" />
                  <h4>Event Date Details</h4>
                </div>
                
                <div className="selected-date-box">
                  <div className="date-badge">
                    <span className="day-num">{selectedDateDay}</span>
                    <span className="month-name">{selectedDateMonthName}</span>
                  </div>
                  <div className="date-info">
                    <div className="day-name">{selectedDateDayName}</div>
                    <div className="full-date">{selectedDateFormatted}</div>
                    <div className="selected-label">(Selected Date)</div>
                  </div>
                </div>
              </div>

              {/* Event Time & Duration Card */}
              <div className="summary-card">
                <div className="summary-card-header">
                  <Clock size={18} className="icon-blue" />
                  <h4>Select Event Time & Duration</h4>
                </div>

                <div className="p-3 space-y-3">
                  {/* Notice banner if Morning Session is booked */}
                  {selectedDateBookingStatus.status === "partial" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Partial Date Availability Notice
                      </div>
                      <p className="text-amber-800 text-[11px] leading-relaxed">
                        ⚠️ <strong>Morning Session (09:00 AM - 03:00 PM)</strong> is booked for another event.
                        <br />
                        <strong className="text-emerald-700">✅ Evening Gala & Night Sessions are 100% Available for you!</strong>
                      </p>
                    </div>
                  )}

                  {/* Full Day vs Custom Slot toggle */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      disabled={selectedDateBookingStatus.status === "partial"}
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        bookingTimeType === "fullDay" && selectedDateBookingStatus.status !== "partial"
                          ? "bg-orange-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      } ${selectedDateBookingStatus.status === "partial" ? "opacity-40 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (selectedDateBookingStatus.status !== "partial") {
                          setBookingTimeType("fullDay");
                          setSelectedSlotPreset("Full Day Event (09:00 AM - 11:00 PM)");
                          setStartTime("09:00");
                          setEndTime("23:00");
                        }
                      }}
                    >
                      ☀️ Full Day
                    </button>
                    <button
                      type="button"
                      className={`py-2 px-3 text-xs font-bold rounded-lg transition-all ${
                        bookingTimeType === "customTime" || selectedDateBookingStatus.status === "partial"
                          ? "bg-orange-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => setBookingTimeType("customTime")}
                    >
                      ⏰ Specific Time Slot
                    </button>
                  </div>

                  {/* Preset Slot Pills */}
                  {bookingTimeType === "customTime" || selectedDateBookingStatus.status === "partial" ? (
                    <div className="space-y-2 pt-1">
                      <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Choose Time Session
                      </label>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { label: "Morning Session (09:00 AM - 03:00 PM)", start: "09:00", end: "15:00", isBooked: selectedDateBookingStatus.status === "partial" },
                          { label: "Evening Gala (06:00 PM - 11:00 PM)", start: "18:00", end: "23:00", isBooked: false },
                          { label: "Late Night Party (08:00 PM - 02:00 AM)", start: "20:00", end: "02:00", isBooked: false },
                          { label: "Custom Time Range", start: startTime, end: endTime, isBooked: false }
                        ].map((slot, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              if (!slot.isBooked) {
                                setSelectedSlotPreset(slot.label);
                                setStartTime(slot.start);
                                setEndTime(slot.end);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                              slot.isBooked
                                ? "border-slate-200 bg-slate-100/80 text-slate-400 opacity-60 cursor-not-allowed"
                                : selectedSlotPreset === slot.label
                                ? "border-orange-500 bg-orange-50/70 text-orange-900 cursor-pointer"
                                : "border-slate-200 bg-white hover:border-slate-300 text-slate-700 cursor-pointer"
                            }`}
                          >
                            <span>{slot.label} {slot.isBooked ? "(🔒 Booked)" : ""}</span>
                            {!slot.isBooked && selectedSlotPreset === slot.label && <Check size={14} className="text-orange-600" />}
                          </div>
                        ))}
                      </div>

                      {/* Custom Time Selectors */}
                      {selectedSlotPreset === "Custom Time Range" && (
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">Start Time</label>
                            <input
                              type="time"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 bg-slate-50"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">End Time</label>
                            <input
                              type="time"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              className="w-full text-xs font-bold border border-slate-200 rounded-lg p-2 bg-slate-50"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-3 text-xs text-orange-900 font-medium">
                      <p className="font-bold mb-1 flex items-center gap-1.5 text-orange-800">
                        <Check size={14} /> Full Day Access Included
                      </p>
                      Venue accessible from <strong>09:00 AM</strong> to <strong>11:00 PM</strong> for setup, decoration & main event celebration.
                    </div>
                  )}
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-card-header">
                  <h4>Date Availability</h4>
                </div>
                <div className="availability-list">
                  <div className="avail-row">
                    <div className="avail-label">
                      <span className="legend-dot dot-available"></span> Available Dates
                    </div>
                    <div className="avail-count">{daysInMonth - (currentMonth === today.getMonth() && currentYear === today.getFullYear() ? today.getDate() : 0) - Math.floor(daysInMonth / 4)}</div>
                  </div>
                  <div className="avail-row">
                    <div className="avail-label">
                      <span className="legend-dot dot-booked"></span> Booked Dates
                    </div>
                    <div className="avail-count">{Math.floor(daysInMonth / 4)}</div>
                  </div>
                  <div className="avail-row">
                    <div className="avail-label">
                      <span className="legend-dot dot-unavailable"></span> Past / Limit Dates
                    </div>
                    <div className="avail-count">{currentMonth === today.getMonth() && currentYear === today.getFullYear() ? today.getDate() - 1 : 0}</div>
                  </div>
                </div>
              </div>

              <EventSummaryFooter icon={CalendarIcon} />

              <div className="action-area">
                {availabilityError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium w-full">
                    {availabilityError}
                  </div>
                )}
                <button 
                  className="continue-btn" 
                  onClick={handleContinue}
                  disabled={isChecking}
                  style={{ opacity: isChecking ? 0.7 : 1, cursor: isChecking ? 'not-allowed' : 'pointer' }}
                >
                  {isChecking ? "Checking Availability..." : <>Continue <ArrowRight size={20} /></>}
                </button>
                <div className="secure-info">
                  <Lock size={14} /> Your information is secure with us
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(8px)",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "white",
            padding: "40px",
            borderRadius: "24px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            maxWidth: "380px",
            width: "90%",
            border: "1px solid rgba(255, 255, 255, 0.8)"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "#f0fdf4",
              border: "3px solid #bbf7d0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              color: "#16a34a"
            }}>
              <Check size={40} strokeWidth={3} />
            </div>
            <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>Success!</h3>
            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>Date selected successfully!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default SelectDate;
