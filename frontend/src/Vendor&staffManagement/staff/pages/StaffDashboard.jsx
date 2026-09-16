import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Megaphone
} from "lucide-react";

export default function StaffDashboard() {
  // Statistics cards data
  const stats = [
    {
      label: "Assigned Events",
      value: "5",
      helper: "Total Events",
      icon: CalendarDays,
      bgClass: "bg-orange-50/50 border-orange-100 text-orange-600",
      iconBg: "bg-orange-100/50"
    },
    {
      label: "Pending Tasks",
      value: "6",
      helper: "Tasks Pending",
      icon: ClipboardList,
      bgClass: "bg-amber-50/50 border-amber-100 text-amber-600",
      iconBg: "bg-amber-100/50"
    },
    {
      label: "Completed Tasks",
      value: "12",
      helper: "Tasks Completed",
      icon: CheckCircle2,
      bgClass: "bg-emerald-50/50 border-emerald-100 text-emerald-600",
      iconBg: "bg-emerald-100/50"
    },
    {
      label: "Present Days",
      value: "25",
      helper: "This Month",
      icon: CalendarDays,
      bgClass: "bg-blue-50/50 border-blue-100 text-blue-600",
      iconBg: "bg-blue-100/50"
    },
    {
      label: "Absent Days",
      value: "2",
      helper: "This Month",
      icon: XCircle,
      bgClass: "bg-red-50/50 border-red-100 text-red-600",
      iconBg: "bg-red-100/50"
    },
    {
      label: "Attendance",
      value: "92%",
      helper: "This Month",
      icon: TrendingUp,
      bgClass: "bg-purple-50/50 border-purple-100 text-purple-600",
      iconBg: "bg-purple-100/50",
      to: "/staff/attendance"
    }
  ];

  // Column 1: Today's Schedule
  const todaysSchedule = [
    { time: "09:00 AM", title: "Wedding Ceremony", dept: "Security", status: "Upcoming" },
    { time: "01:00 PM", title: "Corporate Event", dept: "Security", status: "Upcoming" },
    { time: "06:00 PM", title: "Birthday Party", dept: "Security", status: "Upcoming" }
  ];

  const [upcomingEvents, setUpcomingEvents] = React.useState([]);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings");
        const result = await response.json();
        
        // Handle object response with nested data array OR direct array
        const bookingsArray = Array.isArray(result) ? result : (result.data || []);
        
        // Filter bookings that have assigned staff
        const staffedBookings = bookingsArray.filter(b => b.assignedStaff && b.assignedStaff.length > 0);
        
        const formattedEvents = staffedBookings.map(b => {
          const date = new Date(b.event_date);
          const day = date.getDate().toString().padStart(2, "0");
          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
          return {
            day,
            month,
            title: b.eventTitle || b.event_type || "Event",
            dateTime: `${day} ${month} ${date.getFullYear()} | ${b.time_slot}`,
            role: `Staff: ${b.assignedStaff.join(", ")}`,
            status: b.booking_status || b.status
          };
        });
        
        setUpcomingEvents(formattedEvents.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  // Column 3: Recent Announcements
  const announcements = [
    { text: "Team meeting at 10 AM tomorrow.", timeAgo: "2 hours ago" },
    { text: "Uniform update for all security staff.", timeAgo: "1 day ago" },
    { text: "New event assigned: Corporate Event.", timeAgo: "2 days ago" }
  ];

  return (
    <div className="space-y-6">
      {/* 6 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((card, idx) => {
          const Icon = card.icon;
          const cardBody = (
            <div className={`rounded-2xl border ${card.bgClass} p-4 bg-white flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold tracking-tight text-slate-900">{card.value}</span>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{card.helper}</p>
              </div>
            </div>
          );

          return card.to ? (
            <Link key={idx} to={card.to} className="block">
              {cardBody}
            </Link>
          ) : (
            <div key={idx}>{cardBody}</div>
          );
        })}
      </div>

      {/* Three Columns Sections Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Schedule Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
            <div className="mt-4 space-y-4">
              {todaysSchedule.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="flex gap-4">
                    <span className="text-sm font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-lg self-center">
                      {item.time}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{item.title}</p>
                      <p className="text-xs font-semibold text-slate-400 mt-1">{item.dept}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <Link
            to="/staff/schedule"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 mt-6 pt-4 border-t border-slate-100 block transition-colors"
          >
            View Full Schedule
          </Link>
        </div>

        {/* My Upcoming Events Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Upcoming Events</h2>
            <div className="mt-4 space-y-4">
              {upcomingEvents.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {/* Event Date Block */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl py-2 px-3 flex flex-col items-center justify-center shrink-0 w-14 text-center">
                    <span className="text-lg font-bold text-slate-800 leading-none">{item.day}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-wider mt-1">{item.month}</span>
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate leading-tight">{item.title}</p>
                    <p className="text-[11px] font-semibold text-slate-400 mt-1 truncate">{item.dateTime}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1.5 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                      {item.role}
                    </p>
                  </div>

                  {/* Badge */}
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/staff/events"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 mt-6 pt-4 border-t border-slate-100 block transition-colors"
          >
            View All Events
          </Link>
        </div>

        {/* Recent Announcements Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Announcements</h2>
            <div className="mt-4 space-y-4">
              {announcements.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-orange-50 text-orange-500 shrink-0">
                    <Megaphone size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 leading-tight">{item.text}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1.5">{item.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Just triggers a simple view or lists active announcements */}
          <Link
            to="/staff/dashboard"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 mt-6 pt-4 border-t border-slate-100 block transition-colors"
            onClick={(e) => {
              // Just visual feedback for announcements link since it's on the dashboard itself
              e.preventDefault();
              alert("You are viewing the latest announcements on your dashboard.");
            }}
          >
            View All Announcements
          </Link>
        </div>

      </div>
    </div>
  );
}
