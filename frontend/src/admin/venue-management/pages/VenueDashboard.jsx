import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  IndianRupee,
  LayoutDashboard,
  Store,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "");

const revenueTrend = [
  { month: "Jan", actual: 680000, target: 600000 },
  { month: "Feb", actual: 920000, target: 750000 },
  { month: "Mar", actual: 810000, target: 800000 },
  { month: "Apr", actual: 970000, target: 850000 },
  { month: "May", actual: 1080000, target: 950000 },
  { month: "Jun", actual: 1180000, target: 1050000 },
];

const usageDistribution = [
  { name: "Banquet Hall", value: 12, color: "#3b82f6" },
  { name: "Conference Hall", value: 10, color: "#10b981" },
  { name: "Outdoor Venue", value: 8, color: "#8b5cf6" },
  { name: "Wedding Hall", value: 7, color: "#ec4899" },
  { name: "Auditorium", value: 5, color: "#fb923c" },
];

const incomeSummary = [
  { title: "Revenue Up", value: "₹11,80,000", change: "+12.8%", trend: "up" },
  { title: "Revenue Down", value: "₹3,40,000", change: "-4.2%", trend: "down" },
];

const recentBookings = [
  { id: "VBK001", venue: "Royal Palace Hall", event: "Wedding Ceremony", date: "12 Jun 2026", status: "Confirmed" },
  { id: "VBK002", venue: "Grand Conference Center", event: "Corporate Meeting", date: "15 Jun 2026", status: "Confirmed" },
  { id: "VBK003", venue: "Green Garden Resort", event: "Birthday Party", date: "18 Jun 2026", status: "Pending" },
  { id: "VBK004", venue: "City Auditorium", event: "Music Concert", date: "20 Jun 2026", status: "Confirmed" },
  { id: "VBK005", venue: "Sunshine Banquet", event: "Engagement", date: "22 Jun 2026", status: "Cancelled" },
];

function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <div className={`rounded-2xl bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] border-l-4 ${stat.border} p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{stat.title}</p>
          <p className="mt-2 text-2xl font-extrabold text-slate-900">{stat.value}</p>
        </div>
        <Icon className={stat.iconColor} size={28} />
      </div>
      <p className="mt-4 text-sm text-emerald-600 font-medium">{stat.growth}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    Confirmed: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Cancelled: "bg-rose-100 text-rose-700",
    Available: "bg-emerald-100 text-emerald-700",
    Booked: "bg-blue-100 text-blue-700",
    Maintenance: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusConfig[status]}`}>
      {status}
    </span>
  );
}

export default function VenueDashboard() {
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [venueList, setVenueList] = useState([]);

  const visibleBookings = showAllBookings ? recentBookings : recentBookings.slice(0, 2);

  const fetchVenues = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/venues`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to load venues");
      }
      setVenueList(data.venues || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const totalVenues = venueList.length;
  const availableVenues = venueList.filter((venue) => ["Available", "Active"].includes(venue.status)).length;
  const bookedVenues = venueList.filter((venue) => venue.status === "Booked").length;
  const maintenanceVenues = venueList.filter((venue) => venue.status === "Maintenance").length;
  const totalRevenueValue = venueList.reduce((sum, venue) => sum + (Number(venue.price) || 0), 0);

  const stats = [
    { title: "Total Venues", value: totalVenues.toString(), growth: totalVenues > 0 ? "+5% from last month" : "No data yet", icon: Store, border: "border-blue-500", iconColor: "text-blue-500" },
    { title: "Available Venues", value: availableVenues.toString(), growth: "Current availability", icon: CalendarDays, border: "border-emerald-500", iconColor: "text-emerald-500" },
    { title: "Booked Venues", value: bookedVenues.toString(), growth: "Current bookings", icon: LayoutDashboard, border: "border-violet-500", iconColor: "text-violet-500" },
    { title: "Total Price Value", value: `₹${totalRevenueValue.toLocaleString("en-IN")}`, growth: "Sum of venue prices", icon: IndianRupee, border: "border-amber-500", iconColor: "text-amber-500" },
    { title: "Under Maintenance", value: maintenanceVenues.toString(), growth: "Needs attention", icon: AlertCircle, border: "border-rose-500", iconColor: "text-rose-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {stats.map((stat) => <StatCard key={stat.title} stat={stat} />)}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {/* Revenue Trend Chart */}
        <section className="rounded-3xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Trend</h3>
              <p className="text-sm text-slate-500 mt-1">Monthly revenue vs target</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
              {incomeSummary.map((item) => (
                <div key={item.title} className={`rounded-3xl p-4 ${item.trend === "up" ? "bg-emerald-50" : "bg-rose-50"}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">{item.title}</p>
                    {item.trend === "up" ? (
                      <ArrowUpRight className="text-emerald-600" size={18} />
                    ) : (
                      <ArrowDownRight className="text-rose-600" size={18} />
                    )}
                  </div>
                  <p className="mt-2 text-xl font-bold text-slate-900">{item.value}</p>
                  <p className={`mt-1 text-sm font-semibold ${item.trend === "up" ? "text-emerald-600" : "text-rose-600"}`}>{item.change}</p>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(val) => `₹${val.toLocaleString("en-IN")}`} />
              <Tooltip formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, ""]} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} name="Actual Revenue" />
              <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 6" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        </section>

        {/* Venue Usage Distribution */}
        <section className="rounded-3xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Venue Usage Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-4 items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={usageDistribution} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {usageDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {usageDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Recent Bookings */}
      <section>
        <div className="rounded-3xl bg-white shadow-[0_10px_40px_rgba(15,23,42,0.08)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Venue Bookings</h3>
            <button
              className="text-sm font-semibold text-slate-500 hover:text-slate-700"
              onClick={() => setShowAllBookings(!showAllBookings)}
            >
              {showAllBookings ? "Show Less" : "View All"}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 text-left">
                  <th className="pb-2">Booking ID</th>
                  <th className="pb-2">Venue Name</th>
                  <th className="pb-2">Event</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleBookings.map((b) => (
                  <tr key={b.id} className="border-t border-slate-100">
                    <td className="py-3 text-sky-600 font-semibold">{b.id}</td>
                    <td className="py-3 text-slate-700">{b.venue}</td>
                    <td className="py-3 text-slate-500">{b.event}</td>
                    <td className="py-3 text-slate-500">{b.date}</td>
                    <td className="py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}