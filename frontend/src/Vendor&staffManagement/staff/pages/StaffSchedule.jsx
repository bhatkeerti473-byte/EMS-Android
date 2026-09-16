import React from "react";
import { Clock, Calendar, Shield, MapPin } from "lucide-react";

export default function StaffSchedule() {
  const scheduleData = [
    {
      time: "09:00 AM",
      title: "Wedding Ceremony",
      date: "10 July 2026",
      location: "Grand Palace, Hall A",
      role: "Gate Security & Crowds Control",
      status: "Upcoming"
    },
    {
      time: "01:00 PM",
      title: "Corporate Event",
      date: "22 July 2026",
      location: "Taj Convention Center",
      role: "VIP Escort & Entrance Control",
      status: "Upcoming"
    },
    {
      time: "06:00 PM",
      title: "Birthday Party",
      date: "05 August 2026",
      location: "Dream Land Gardens",
      role: "Access Point Duty",
      status: "Upcoming"
    },
    {
      time: "07:00 PM",
      title: "Music Concert",
      date: "18 August 2026",
      location: "Stadium Arena",
      role: "Stage Perimeter Protection",
      status: "Upcoming"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Introduction Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-500 leading-relaxed">
          Here is your chronological schedule. Please make sure to report at your assigned locations 15 minutes before the start time.
        </p>
      </div>

      {/* Timeline Schedule Grid */}
      <div className="relative border-l border-slate-200 ml-4 pl-8 space-y-8 py-2">
        {scheduleData.map((item, index) => (
          <div key={index} className="relative group">
            {/* Timeline bullet indicator */}
            <span className="absolute -left-[41px] top-1.5 h-6 w-6 rounded-full border-4 border-slate-50 bg-orange-500 ring-4 ring-orange-500/10 flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" />

            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 grid grid-cols-1 md:grid-cols-[140px_minmax(0,1fr)_auto] items-center gap-6">
              {/* Shift Time Info */}
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-orange-500 flex items-center gap-2">
                  <Clock size={16} className="shrink-0" />
                  {item.time}
                </span>
                <span className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                  <Calendar size={12} className="shrink-0" />
                  {item.date}
                </span>
              </div>

              {/* Event & Duty Info */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800 leading-tight">
                  {item.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    <Shield size={13} className="text-slate-400 shrink-0" />
                    {item.role}
                  </span>
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="md:self-center shrink-0">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
