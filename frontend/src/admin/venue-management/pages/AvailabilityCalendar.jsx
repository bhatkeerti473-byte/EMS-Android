import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, CircleDot, BadgeCheck, Wrench, Filter } from "lucide-react";

const statusStyles = {
  Available: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Booked: "bg-amber-100 text-amber-700 border-amber-200",
  Maintenance: "bg-rose-100 text-rose-700 border-rose-200",
};

const eventMap = {
  "2026-06-10": { status: "Booked", venue: "Conference Center" },
  "2026-06-12": { status: "Available", venue: "Grand Hall" },
  "2026-06-14": { status: "Maintenance", venue: "City Auditorium" },
  "2026-06-18": { status: "Booked", venue: "Wedding Hall" },
  "2026-06-21": { status: "Available", venue: "Outdoor Lawn" },
  "2026-06-24": { status: "Maintenance", venue: "Royal Palace" },
  "2026-06-27": { status: "Booked", venue: "Banquet Hall" },
  "2026-07-02": { status: "Available", venue: "Conference Center" },
  "2026-07-05": { status: "Booked", venue: "Grand Hall" },
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function AvailabilityCalendar() {
  const today = useMemo(() => new Date("2026-06-10T00:00:00"), []);
  const [view, setView] = useState("Month");
  const [currentMonth, setCurrentMonth] = useState(5);
  const [currentYear, setCurrentYear] = useState(2026);

  const monthMatrix = useMemo(() => {
    const first = new Date(currentYear, currentMonth, 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < startDay; i += 1) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push(new Date(currentYear, currentMonth, d));
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }
    return cells;
  }, [currentMonth, currentYear]);

  const isPastDate = (date) => date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const goPrev = () => {
    const prevMonth = currentMonth - 1;
    if (currentYear === today.getFullYear() && prevMonth < today.getMonth()) return;
    if (prevMonth < 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(prevMonth);
    }
  };

  const goNext = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const canGoPrev = !(currentYear === today.getFullYear() && currentMonth === today.getMonth());

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">Availability Calendar</h2>
        <p className="mt-1 text-sm text-slate-500">Venue Management &gt; Availability Calendar</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Venues", value: "12", icon: CalendarDays, tone: "blue" },
          { label: "Available", value: "7", icon: BadgeCheck, tone: "emerald" },
          { label: "Booked", value: "3", icon: CircleDot, tone: "amber" },
          { label: "Maintenance", value: "2", icon: Wrench, tone: "rose" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className={`text-${item.tone}-500`} size={20} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={goPrev} disabled={!canGoPrev} className={`rounded-xl border px-3 py-2 ${canGoPrev ? "border-slate-200 text-slate-700 hover:bg-slate-50" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}>
              <ChevronLeft size={18} />
            </button>
            <button onClick={goNext} className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50">
              <ChevronRight size={18} />
            </button>
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Today
            </button>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-extrabold text-slate-900">{monthNames[currentMonth]} {currentYear}</h3>
          </div>

          <div className="flex items-center gap-2">
            {["Month", "Week", "Day"].map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${view === item ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
              >
                {item}
              </button>
            ))}
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        {view === "Month" && (
          <>
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-500 border-b border-slate-200">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-3">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-200">
              {monthMatrix.map((date, idx) => {
                if (!date) {
                  return <div key={idx} className="min-h-28 bg-white" />;
                }

                if (isPastDate(date)) {
                  return <div key={date.toISOString()} className="min-h-28 bg-slate-50" />;
                }

                const key = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                const event = eventMap[key];
                const isToday = date.toDateString() === today.toDateString();

                return (
                  <div key={key} className={`min-h-28 bg-white p-3 ${isToday ? "ring-2 ring-blue-500 ring-inset" : ""}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${isToday ? "text-blue-600" : "text-slate-700"}`}>{date.getDate()}</span>
                      {event && <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyles[event.status]}`}>{event.status}</span>}
                    </div>
                    {event ? (
                      <div className={`mt-3 rounded-xl border px-3 py-2 text-xs font-semibold ${statusStyles[event.status]}`}>
                        <p>{event.venue}</p>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400">
                        Available
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view !== "Month" && (
          <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
            Week and Day views can be expanded later. Month view is fully active now.
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
          {Object.entries(statusStyles).map(([status, style]) => (
            <div key={status} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${style}`}>
              <span className="h-2.5 w-2.5 rounded-full bg-current" />
              {status}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
