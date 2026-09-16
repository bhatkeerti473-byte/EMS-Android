import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, Clock, AlertCircle } from "lucide-react";
import "./styles/LiveVenueCalendar.css";

// Mock data to simulate backend availability
const MOCK_AVAILABILITY = {
  "2026-07-20": { status: "partial", slots: { morning: true, afternoon: false, evening: true } },
  "2026-07-21": { status: "full", slots: { morning: false, afternoon: false, evening: false } },
  "2026-07-25": { status: "partial", slots: { morning: false, afternoon: true, evening: false } },
};

export default function LiveVenueCalendar({ selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (selectedDate) return new Date(selectedDate);
    return new Date("2026-07-01"); // Defaulting to July 2026 as per mockup
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    
    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month padding
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.unshift({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPast: true,
        dateStr: "",
      });
    }
    
    // Current month days
    const today = new Date();
    today.setHours(0,0,0,0);

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isPast = date < today && date.toDateString() !== today.toDateString();
      
      days.push({
        day: i,
        isCurrentMonth: true,
        isPast,
        dateStr,
        status: MOCK_AVAILABILITY[dateStr]?.status || "available",
      });
    }
    
    // Next month padding (to fill 42 cells, i.e., 6 rows)
    const totalCells = 42;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isPast: false,
        dateStr: "",
      });
    }
    
    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (dayObj) => {
    if (!dayObj.isCurrentMonth || dayObj.isPast || dayObj.status === "full") return;
    onDateSelect(dayObj.dateStr);
  };

  // formatting
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  
  const selectedDateObj = selectedDate ? new Date(`${selectedDate}T00:00:00`) : null;
  const formattedSelectedDate = selectedDateObj 
    ? selectedDateObj.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : "None Selected";

  const selectedAvailability = selectedDate ? (MOCK_AVAILABILITY[selectedDate] || { status: "available", slots: { morning: true, afternoon: true, evening: true }}) : null;
  const isFullDayAvailable = selectedAvailability?.status !== "full" && selectedAvailability?.status !== "partial";

  return (
    <div className="live-calendar-container">
      <div className="live-calendar-main">
        
        {/* Left Side: Calendar UI */}
        <div className="calendar-card-ui">
          <div className="calendar-header-nav">
            <button type="button" onClick={handlePrevMonth} aria-label="Previous month">
              <ArrowLeft size={18} />
            </button>
            <h3>{monthName}</h3>
            <button type="button" onClick={handleNextMonth} aria-label="Next month">
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="calendar-grid">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
              <div key={day} className="calendar-day-name">{day}</div>
            ))}

            {calendarDays.map((d, index) => {
              if (!d.isCurrentMonth) {
                return <div key={`pad-${index}`} className="calendar-day-cell past-date">{d.day}</div>;
              }

              let className = "calendar-day-cell ";
              if (d.isPast) className += "past-date ";
              else if (selectedDate === d.dateStr) className += "selected-date ";
              else if (d.status === "available") className += "status-available ";
              else if (d.status === "partial") className += "status-partial ";
              else if (d.status === "full") className += "status-full ";

              return (
                <div 
                  key={d.dateStr} 
                  className={className}
                  onClick={() => handleDayClick(d)}
                >
                  {d.day}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-color available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-color partial"></div>
              <span>Partially Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-color full"></div>
              <span>Fully Booked</span>
            </div>
            <div className="legend-item">
              <div className="legend-color selected"></div>
              <span>Selected Date</span>
            </div>
            <div className="legend-item">
              <div className="legend-color past"></div>
              <span>Past Date</span>
            </div>
          </div>
          
          <div className="calendar-meta">
            <Clock size={12} />
            <span>Real-time availability • Updated every 5 minutes</span>
          </div>
        </div>

        {/* Right Side: Overview */}
        <div className="overview-section">
          <div className="overview-header">
            <h3>Selected Date: {formattedSelectedDate}</h3>
          </div>

          {!selectedDate ? (
            <div className="availability-alert">
              <AlertCircle size={20} className="alert-icon" style={{color: '#64748b'}} />
              <div className="alert-content">
                <h4 style={{color: '#334155'}}>No Date Selected</h4>
                <p style={{color: '#64748b'}}>Please select a date from the calendar to view available time slots.</p>
              </div>
            </div>
          ) : isFullDayAvailable ? (
            <div className="availability-alert">
              <Check size={20} className="alert-icon" />
              <div className="alert-content">
                <h4>Full Day Available</h4>
                <p>You can book this entire day</p>
              </div>
              <div className="alert-badge">Available</div>
            </div>
          ) : (
            <div className="availability-alert alert-error">
              <AlertCircle size={20} className="alert-icon" />
              <div className="alert-content">
                <h4>Limited Availability</h4>
                <p>Some time slots are already booked on this day.</p>
              </div>
              <div className="alert-badge">Partially Booked</div>
            </div>
          )}

          {selectedDate && (
            <div className="slot-overview-list">
              <div className="slot-overview-list-header">Time Slot Overview</div>
              
              <div className="slot-item">
                <div className="slot-item-info">
                  <strong>Full Day</strong>
                  <span>(09:00 AM - 11:00 PM)</span>
                </div>
                <div className={`slot-badge ${isFullDayAvailable ? "available" : "unavailable"}`}>
                  {isFullDayAvailable ? "Available" : "Not Available"}
                </div>
              </div>

              <div className="slot-item">
                <div className="slot-item-info">
                  <strong>Morning</strong>
                  <span>(09:00 AM - 02:00 PM)</span>
                </div>
                <div className={`slot-badge ${selectedAvailability.slots.morning !== false ? "available" : "unavailable"}`}>
                  {selectedAvailability.slots.morning !== false ? "Available" : "Not Available"}
                </div>
              </div>

              <div className="slot-item">
                <div className="slot-item-info">
                  <strong>Afternoon</strong>
                  <span>(02:00 PM - 06:00 PM)</span>
                </div>
                <div className={`slot-badge ${selectedAvailability.slots.afternoon !== false ? "available" : "unavailable"}`}>
                  {selectedAvailability.slots.afternoon !== false ? "Available" : "Not Available"}
                </div>
              </div>

              <div className="slot-item">
                <div className="slot-item-info">
                  <strong>Evening</strong>
                  <span>(06:00 PM - 11:00 PM)</span>
                </div>
                <div className={`slot-badge ${selectedAvailability.slots.evening !== false ? "available" : "unavailable"}`}>
                  {selectedAvailability.slots.evening !== false ? "Available" : "Not Available"}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
