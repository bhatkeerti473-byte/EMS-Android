import React from "react";
import { TrendingUp, BarChart3, FileText } from "lucide-react";
import { ResponsiveContainer, ComposedChart, Line, Bar as ReBar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

const revenueTrend = [
  { month: "Jan", revenue: 680000, bookings: 18 },
  { month: "Feb", revenue: 920000, bookings: 22 },
  { month: "Mar", revenue: 810000, bookings: 20 },
  { month: "Apr", revenue: 970000, bookings: 25 },
  { month: "May", revenue: 1080000, bookings: 28 },
  { month: "Jun", revenue: 1180000, bookings: 30 },
];

const revenueRows = [
  { venue: "Royal Palace Hall", revenue: 320000, reports: "Monthly Report" },
  { venue: "Grand Conference Center", revenue: 280000, reports: "Quarterly Report" },
  { venue: "Sunshine Banquet", revenue: 210000, reports: "Monthly Report" },
];

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function VenueDetails() {
  const totalRevenue = revenueTrend.reduce((sum, item) => sum + item.revenue, 0);
  const latestMonthRevenue = revenueTrend[revenueTrend.length - 1]?.revenue || 0;
  const topVenueRevenue = Math.max(...revenueRows.map((row) => row.revenue));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">Venue Revenue</h2>
        <p className="mt-1 text-sm text-slate-500">Monthly, annual, and venue-wise revenue insights.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Monthly Revenue", value: formatINR(latestMonthRevenue), icon: TrendingUp },
          { label: "Annual Revenue", value: formatINR(totalRevenue), icon: BarChart3 },
          { label: "Top Venue Revenue", value: formatINR(topVenueRevenue), icon: FileText },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className="text-orange-500" size={20} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
          <h3 className="font-bold text-slate-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatINR(value)} width={100} />
              <Tooltip formatter={(value, name) => [name === "revenue" ? formatINR(value) : value, name === "revenue" ? "Revenue" : "Bookings"]} />
              <Legend />
              <ReBar dataKey="bookings" fill="#dbeafe" />
              <Line type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={3} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] overflow-x-auto">
          <h3 className="font-bold text-slate-900 mb-4">Venue Wise Revenue</h3>
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3 pr-4">Venue</th>
                <th className="py-3 pr-4">Revenue</th>
                <th className="py-3">Reports</th>
              </tr>
            </thead>
            <tbody>
              {revenueRows.map((row) => (
                <tr key={row.venue} className="border-b last:border-0">
                  <td className="py-4 pr-4 font-semibold text-slate-900">{row.venue}</td>
                  <td className="py-4 pr-4 text-slate-600">{formatINR(row.revenue)}</td>
                  <td className="py-4 text-orange-600 font-semibold">{row.reports}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
