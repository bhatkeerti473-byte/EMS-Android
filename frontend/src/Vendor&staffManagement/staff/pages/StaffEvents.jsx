import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, UserCheck, CheckCircle2, LogOut } from "lucide-react";
import CheckInVerificationModal from "../components/CheckInVerificationModal";
import CheckOutModal from "../components/CheckOutModal";

export default function StaffEvents() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [checkInEvent, setCheckInEvent] = useState(null);
  const [checkOutEvent, setCheckOutEvent] = useState(null);
  const [checkedInIds, setCheckedInIds] = useState([]); 
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
        const staffId = savedUser.id || savedUser._id;
        
        if (staffId) {
          const res = await fetch(`http://localhost:5000/api/staff-assignments/staff/${staffId}`);
          const data = await res.json();
          if (data.success) {
            setAssignments(data.assignments);
          }
        }
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleUpdateStatus = async (assignmentId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff-assignments/${assignmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignmentStatus: status })
      });
      if (res.ok) {
        setAssignments(assignments.map(a => a._id === assignmentId ? { ...a, assignmentStatus: status } : a));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategorizedEvents = () => {
    const upcoming = [];
    const ongoing = [];
    const completed = [];
    
    assignments.forEach(assignment => {
      const isCompleted = assignment.assignmentStatus === "Completed";
      const isOngoing = assignment.assignmentStatus === "In Progress" || checkedInIds.includes(assignment._id);
      
      const reportingDateTime = new Date(`${assignment.reportingDate}T${convertTime12to24(assignment.reportingTime)}`);
      const canCheckIn = new Date() >= reportingDateTime;

      const eventData = {
        id: assignment._id,
        assignmentId: assignment._id,
        title: assignment.eventId?.event_type || "Event",
        dateTime: `${assignment.reportingDate} | ${assignment.reportingTime}`,
        location: assignment.eventId?.venueName || assignment.eventId?.location || "Venue",
        role: assignment.role,
        status: assignment.assignmentStatus,
        colorClass: "border-blue-200 text-blue-600 bg-blue-50",
        badgeColor: "bg-blue-50 text-blue-600 border border-blue-200",
        eventId: assignment.eventId?._id,
        canCheckIn,
        reportingDateTime,
      };

      if (isCompleted) {
        completed.push({ ...eventData, status: "Completed", colorClass: "border-slate-200 text-slate-600 bg-slate-50", badgeColor: "bg-slate-100 text-slate-600 border border-slate-200" });
      } else if (isOngoing) {
        ongoing.push({ ...eventData, status: "In Progress", colorClass: "border-emerald-200 text-emerald-600 bg-emerald-50", badgeColor: "bg-emerald-50 text-emerald-600 border border-emerald-200 animate-pulse" });
      } else {
        upcoming.push({ ...eventData, status: assignment.assignmentStatus, colorClass: "border-orange-200 text-orange-600 bg-orange-50", badgeColor: "bg-orange-50 text-orange-600 border border-orange-200" });
      }
    });

    return { upcoming, ongoing, completed };
  };

  const convertTime12to24 = (time12h) => {
    if (!time12h) return "00:00";
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}:00`;
  };

  const eventsData = getCategorizedEvents();

  const tabs = [
    { id: "upcoming", label: "Upcoming Events", count: eventsData.upcoming.length },
    { id: "ongoing", label: "Ongoing Events", count: eventsData.ongoing.length },
    { id: "completed", label: "Completed Events", count: eventsData.completed.length }
  ];

  const currentEvents = eventsData[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 py-4 px-6 text-sm font-semibold border-b-2 transition-all duration-200 outline-none ${
              activeTab === tab.id
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === tab.id
                  ? "bg-orange-100 text-orange-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid Content */}
      {currentEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Event Visual Identity Card */}
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl shrink-0 flex items-center justify-center border ${event.colorClass}`}>
                    <CalendarDays size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{event.title}</h3>
                    <div className="mt-2 flex flex-col gap-1 text-slate-500 text-xs">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-600">{event.dateTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-500">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${event.badgeColor}`}>
                  {event.status}
                </span>
              </div>

              {/* Bottom Allocation Bar */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400 flex items-center gap-2">
                  <UserCheck size={14} className="text-slate-400" />
                  Your Role:
                </span>
                <span className="text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl">
                  {event.role}
                </span>
                
                {/* Actions */}
                {event.status === "Notification Sent" || event.status === "Assigned" || event.status === "Read" ? (
                  <button 
                    onClick={() => handleUpdateStatus(event.assignmentId, "Accepted")}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    Accept Assignment
                  </button>
                ) : event.status === "Accepted" && !checkedInIds.includes(event.id) ? (
                  event.canCheckIn ? (
                    <button 
                      onClick={() => setCheckInEvent(event)}
                      className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <CheckCircle2 size={16} /> Check In (Face Scan)
                    </button>
                  ) : (
                    <div className="ml-auto text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      Attendance opens at {event.reportingDateTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  )
                ) : null}
                
                {(event.status === "In Progress" || checkedInIds.includes(event.id)) && event.status !== "Completed" && (
                  <button 
                    onClick={() => setCheckOutEvent(event)}
                    className="ml-auto bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                  >
                    <LogOut size={16} /> Check Out
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 border-dashed">
          <p className="text-sm font-semibold text-slate-500">No events found in this category.</p>
        </div>
      )}

      {/* Modals */}
      {checkInEvent && (
        <CheckInVerificationModal 
          event={checkInEvent} 
          onClose={() => setCheckInEvent(null)} 
          onCheckInSuccess={async (id) => {
            try {
              const savedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
              const res = await fetch('http://localhost:5000/api/attendance/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  staffId: savedUser.id || savedUser._id,
                  eventId: checkInEvent.eventId,
                  assignmentId: id,
                  eventType: checkInEvent.title,
                  venueId: checkInEvent.location,
                  date: new Date().toISOString().split('T')[0],
                  checkInTime: new Date().toISOString(),
                  faceVerified: true,
                  gpsVerified: true
                })
              });
              const data = await res.json();
              if (res.ok) {
                setCheckedInIds([...checkedInIds, id]);
                setCheckInEvent(null);
                await handleUpdateStatus(id, "In Progress");
              } else {
                alert(data.message || "Failed to check in");
                setCheckInEvent(null);
              }
            } catch (err) {
              console.error(err);
              alert("Check-in error");
            }
          }} 

        />
      )}

      {checkOutEvent && (
        <CheckOutModal 
          event={checkOutEvent} 
          onClose={() => setCheckOutEvent(null)} 
          onCheckOutSuccess={async (id) => {
            try {
              const savedUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
              const res = await fetch('http://localhost:5000/api/attendance/check-out', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  staffId: savedUser.id || savedUser._id,
                  date: new Date().toISOString().split('T')[0],
                  checkOutTime: new Date().toISOString(),
                  assignmentId: id
                })
              });
              const data = await res.json();
              if (res.ok) {
                setCheckOutEvent(null);
                setCheckedInIds(checkedInIds.filter(checkedId => checkedId !== id));
                await handleUpdateStatus(id, "Completed");
              } else {
                alert(data.message || "Failed to check out");
                setCheckOutEvent(null);
              }
            } catch (err) {
              console.error(err);
              alert("Check-out error");
            }
          }} 

        />
      )}
    </div>
  );
}
