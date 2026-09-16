import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Pencil,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  Wrench,
} from "lucide-react";

const maintenanceRows = [
  { venue: "Royal Palace Hall", issue: "AC Service", start: "10 Jun 2025", end: "12 Jun 2025", priority: "High", status: "In Progress", staff: "Ramesh Kumar" },
  { venue: "City Auditorium", issue: "Sound System Repair", start: "15 Jun 2025", end: "16 Jun 2025", priority: "Medium", status: "Pending", staff: "Suresh Yadav" },
  { venue: "Conference Center", issue: "Painting Work", start: "18 Jun 2025", end: "20 Jun 2025", priority: "Low", status: "Pending", staff: "Anil Sharma" },
  { venue: "Wedding Hall", issue: "Furniture Repair", start: "22 Jun 2025", end: "24 Jun 2025", priority: "High", status: "In Progress", staff: "Ramesh Kumar" },
  { venue: "Grand Banquet Hall", issue: "Electrical Maintenance", start: "25 Jun 2025", end: "26 Jun 2025", priority: "Medium", status: "Completed", staff: "Suresh Yadav" },
];

const maintenanceCalendar = [
  { day: 10, label: "Royal Palace Hall", issue: "AC Service", tone: "rose" },
  { day: 11, label: "Royal Palace Hall", issue: "AC Service", tone: "rose" },
  { day: 15, label: "City Auditorium", issue: "Sound Repair", tone: "amber" },
  { day: 16, label: "City Auditorium", issue: "Sound Repair", tone: "amber" },
  { day: 18, label: "Conference Center", issue: "Painting Work", tone: "emerald" },
  { day: 19, label: "Conference Center", issue: "Painting Work", tone: "emerald" },
  { day: 20, label: "Conference Center", issue: "Painting Work", tone: "emerald" },
];

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const statusClass = {
  "In Progress": "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const priorityClass = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-emerald-100 text-emerald-700",
};

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "");

export default function MaintenanceRecords() {
  const [month] = useState(5);
  const [year] = useState(2025);
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(
    () =>
      maintenanceRows.filter((row) =>
        `${row.venue} ${row.issue} ${row.staff}`.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const [venueOptions, setVenueOptions] = useState([
    "Royal Palace Hall", "City Auditorium", "Conference Center", "Wedding Hall", "Grand Banquet Hall"
  ]);

  React.useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/venues`)
      .then((res) => res.json())
      .then((data) => {
        if (data.venues && data.venues.length > 0) {
          setVenueOptions(data.venues.map((v) => v.name));
        }
      })
      .catch(() => {});
  }, []);

  const stats = [
    { label: "Total Venues", value: "42", icon: Wrench },
    { label: "Under Maintenance", value: "3", icon: ShieldAlert },
    { label: "Scheduled Jobs", value: "5", icon: CalendarDays },
    { label: "Completed Jobs", value: "12", icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">Venue Maintenance</h2>
        <p className="mt-1 text-sm text-slate-500">Venue Management &gt; Maintenance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colors = ["text-violet-500", "text-orange-500", "text-blue-500", "text-emerald-500"];
          return (
            <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <Icon className={colors[index]} size={20} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <h3 className="font-bold text-slate-900 mb-4">Add Maintenance</h3>
          <div className="space-y-4">
            {[
              {
                label: "Venue Name",
                options: venueOptions,
              },
              {
                label: "Maintenance Type",
                options: ["AC Service", "Sound System Repair", "Painting Work", "Furniture Repair", "Electrical Maintenance", "Plumbing", "General Cleaning"],
              },
              {
                label: "Priority",
                options: ["Low", "Medium", "High"],
              },
              {
                label: "Assigned To",
                options: ["Ramesh Kumar", "Suresh Yadav", "Anil Sharma", "Vikas Singh"],
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{field.label} *</label>
                <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none focus:border-orange-500">
                  <option value="">Select {field.label}</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Start Date *</label>
                <input type="date" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">End Date *</label>
                <input type="date" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Description *</label>
              <textarea rows="4" className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-500" placeholder="Enter maintenance details..." />
            </div>
            <div className="flex gap-3">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">
                <Plus size={18} />
                Save Maintenance
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700">Reset</button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
            <h3 className="font-bold text-slate-900">Maintenance List</h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search maintenance..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 outline-none focus:border-orange-500 sm:w-64"
                />
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                <Filter size={16} />
                Filter
              </button>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
                <CalendarDays size={16} />
                This Month
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b text-slate-500">
                <tr>
                  <th className="py-3 pr-4">#</th>
                  <th className="py-3 pr-4">Venue</th>
                  <th className="py-3 pr-4">Issue Type</th>
                  <th className="py-3 pr-4">Start Date</th>
                  <th className="py-3 pr-4">End Date</th>
                  <th className="py-3 pr-4">Priority</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Assigned To</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr key={row.venue + row.issue} className="border-b last:border-0">
                    <td className="py-4 pr-4 text-slate-500">{index + 1}</td>
                    <td className="py-4 pr-4 font-semibold text-slate-900">{row.venue}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.issue}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.start}</td>
                    <td className="py-4 pr-4 text-slate-600">{row.end}</td>
                    <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass[row.priority]}`}>{row.priority}</span></td>
                    <td className="py-4 pr-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass[row.status]}`}>{row.status}</span></td>
                    <td className="py-4 pr-4 text-slate-600">{row.staff}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"><Pencil size={14} /></button>
                        <button className="rounded-lg border border-rose-200 p-2 text-rose-500 hover:bg-rose-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-sm text-slate-500">Showing 1 to {filteredRows.length} of {filteredRows.length} entries</p>
          </div>
        </section>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-5">
          <h3 className="font-bold text-slate-900">Maintenance Calendar</h3>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Today</button>
            <button className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"><Clock3 size={16} /></button>
            <button className="rounded-xl border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"><CalendarDays size={16} /></button>
          </div>
        </div>
        <div className="text-center mb-4">
          <h4 className="text-2xl font-extrabold text-slate-900">{monthNames[month]} {year}</h4>
        </div>
        <div className="grid grid-cols-7 text-center text-sm font-semibold text-slate-500 border-b border-slate-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-3">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-slate-200">
          {Array.from({ length: 35 }).map((_, idx) => {
            const day = idx + 1;
            const item = maintenanceCalendar.find((row) => row.day === day);
            return (
              <div key={idx} className="min-h-28 bg-white p-3">
                <span className="text-sm font-semibold text-slate-700">{day}</span>
                {item ? (
                  <div className={`mt-3 rounded-xl border px-3 py-2 text-xs font-semibold ${
                    item.tone === "rose" ? "bg-rose-50 border-rose-200 text-rose-700" : item.tone === "amber" ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    <p>{item.label}</p>
                    <p className="font-normal">{item.issue}</p>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-400">
                    No job
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
