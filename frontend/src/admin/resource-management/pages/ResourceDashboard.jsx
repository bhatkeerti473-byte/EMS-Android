import React from "react";
import {
  Package,
  CheckCircle,
  ArrowRightLeft,
  Wrench,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ResourceDashboard = () => {
  const statCards = [
    {
      title: "Total Resources",
      value: "520",
      subtext: "All Resources",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Available Resources",
      value: "420",
      subtext: "70.77% Available",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Allocated Resources",
      value: "80",
      subtext: "15.38% Allocated",
      icon: ArrowRightLeft,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Maintenance",
      value: "20",
      subtext: "3.85% Under Maintenance",
      icon: Wrench,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
    },
    {
      title: "Low Stock Items",
      value: "15",
      subtext: "Need Attention",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-100",
    },
  ];

  const overviewData = [
    { name: "Available", value: 420, color: "#22c55e" },
    { name: "Allocated", value: 80, color: "#3b82f6" },
    { name: "Maintenance", value: 20, color: "#f59e0b" },
    { name: "Damaged", value: 10, color: "#ef4444" },
  ];

  const categoryData = [
    { name: "Furniture", value: 120, color: "#8b5cf6" },
    { name: "Lighting", value: 90, color: "#06b6d4" },
    { name: "Audio Equipment", value: 80, color: "#f43f5e" },
    { name: "Decoration", value: 70, color: "#10b981" },
    { name: "Electronics", value: 60, color: "#f59e0b" },
    { name: "Others", value: 100, color: "#64748b" },
  ];

  const monthlyUsageData = [
    { month: "Jan", allocated: 65, returned: 60 },
    { month: "Feb", allocated: 85, returned: 80 },
    { month: "Mar", allocated: 120, returned: 100 },
    { month: "Apr", allocated: 150, returned: 130 },
    { month: "May", allocated: 200, returned: 180 },
    { month: "Jun", allocated: 250, returned: 220 },
  ];

  const upcomingAllocations = [
    { event: "Wedding Ceremony", date: "25 May, 2025", resources: 35, status: "Confirmed" },
    { event: "Corporate Event", date: "28 May, 2025", resources: 12, status: "Confirmed" },
    { event: "Birthday Party", date: "30 May, 2025", resources: 18, status: "Pending" },
    { event: "Conference 2025", date: "02 Jun, 2025", resources: 50, status: "Confirmed" },
    { event: "Exhibition Show", date: "05 Jun, 2025", resources: 25, status: "Pending" },
  ];

  const lowStockAlerts = [
    { resource: "LED Par Light", category: "Lighting", available: 5, minimum: 15, status: "Low Stock" },
    { resource: "Flowers Bouquet", category: "Decoration", available: 10, minimum: 50, status: "Low Stock" },
    { resource: "Chair", category: "Furniture", available: 20, minimum: 50, status: "Low Stock" },
    { resource: "Sound System", category: "Audio", available: 2, minimum: 5, status: "Low Stock" },
    { resource: "Table Round", category: "Furniture", available: 8, minimum: 20, status: "Low Stock" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "text-green-700 bg-green-100";
      case "Pending":
        return "text-amber-700 bg-amber-100";
      case "Low Stock":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Resource Dashboard</h2>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${card.bgColor}`}>
              <card.icon className={card.color} size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
              <p className="text-gray-400 text-xs mt-1">{card.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resources Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resources Overview</h3>
          <div className="flex flex-col xl:flex-row items-center justify-center space-y-4 xl:space-y-0 xl:space-x-8">
            <div className="w-48 h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={overviewData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {overviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-gray-800">520</span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>
            <div className="space-y-3">
              {overviewData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 w-24">{item.name}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.value} <span className="text-xs text-gray-400 font-normal">({((item.value/520)*100).toFixed(2)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resources by Category</h3>
          <div className="flex flex-col xl:flex-row items-center justify-center space-y-4 xl:space-y-0 xl:space-x-6">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 text-xs">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-600 w-28">{item.name}</span>
                  <span className="font-semibold text-gray-800">
                    {item.value} <span className="text-gray-400 font-normal">({((item.value/520)*100).toFixed(2)}%)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>

      {/* Bottom Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Resource Allocations */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Upcoming Resource Allocations</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              View All Allocations <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Event Name</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Date</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Resources</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAllocations.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-800 font-medium">{item.event}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{item.date}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{item.resources} items</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Low Stock Alerts</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
              View All Alerts <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Resource Name</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Category</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Available</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Minimum</th>
                  <th className="py-3 px-2 text-sm font-semibold text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {lowStockAlerts.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-2 text-sm text-gray-800 font-medium">{item.resource}</td>
                    <td className="py-3 px-2 text-sm text-gray-600">{item.category}</td>
                    <td className="py-3 px-2 text-sm text-gray-600 text-center">{item.available}</td>
                    <td className="py-3 px-2 text-sm text-gray-600 text-center">{item.minimum}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDashboard;
