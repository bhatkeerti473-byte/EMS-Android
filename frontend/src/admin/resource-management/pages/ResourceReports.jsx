import React, { useState } from "react";
import { CheckCircle, ArrowRightLeft, Package, BarChart2, FileText, Download, FileSpreadsheet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourceReports = () => {
  const navigate = useNavigate();

  const [reportType, setReportType] = useState("Resource Usage Report");
  const [fromDate, setFromDate] = useState("01/05/2025");
  const [toDate, setToDate] = useState("31/05/2025");

  const summaryStats = [
    { title: "Total Allocations", value: "45", icon: CheckCircle, color: "text-green-500", bgColor: "bg-green-100" },
    { title: "Total Returns", value: "40", icon: ArrowRightLeft, color: "text-amber-500", bgColor: "bg-amber-100" },
    { title: "Total Items Allocated", value: "650", icon: Package, color: "text-blue-500", bgColor: "bg-blue-100" },
    { title: "Utilization Rate", value: "82.4%", icon: BarChart2, color: "text-purple-500", bgColor: "bg-purple-100" },
  ];

  const reportData = [
    { name: "Chair", category: "Furniture", allocated: 200, returned: 190, damaged: 10, utilization: "95.00%" },
    { name: "Table Round", category: "Furniture", allocated: 60, returned: 58, damaged: 2, utilization: "96.67%" },
    { name: "Sound System", category: "Audio", allocated: 15, returned: 15, damaged: 0, utilization: "100%" },
    { name: "LED Par Light", category: "Lighting", allocated: 40, returned: 38, damaged: 2, utilization: "95.00%" },
    { name: "Flower Bouquet", category: "Decoration", allocated: 100, returned: 90, damaged: 10, utilization: "90.00%" },
  ];

  const handleGenerate = () => {
    alert(`Generating ${reportType} from ${fromDate} to ${toDate}`);
  };

  const handleExport = (type) => {
    alert(`Exporting report as ${type}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Reports</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <div className="flex-1 w-full max-w-xs">
            <label className="block text-sm font-semibold text-gray-500 mb-1.5">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
            >
              <option>Resource Usage Report</option>
              <option>Inventory Valuation Report</option>
              <option>Damage & Maintenance Report</option>
              <option>Low Stock Report</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-gray-500 mb-1.5">From Date</label>
            <input
              type="text"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-semibold text-gray-500 mb-1.5">To Date</label>
            <input
              type="text"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
            />
          </div>
          <button
            onClick={handleGenerate}
            className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm w-full md:w-auto"
          >
            Generate Report
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Report Summary Table */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Report Summary</h3>
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource Name</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Total Allocated</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Total Returned</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Damaged</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Utilization</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 last:border-0 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.allocated}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.returned}</td>
                      <td className="py-3 px-4 text-sm text-red-600 text-center font-medium">{item.damaged}</td>
                      <td className="py-3 px-4 text-sm text-gray-800 text-center font-semibold">{item.utilization}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Options */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Export Report</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExport('PDF')}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} />
                  <span className="font-semibold text-sm">Export as PDF</span>
                </div>
                <Download size={18} />
              </button>
              
              <button
                onClick={() => handleExport('Excel')}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl border border-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet size={20} />
                  <span className="font-semibold text-sm">Export as Excel</span>
                </div>
                <Download size={18} />
              </button>

              <button
                onClick={() => handleExport('CSV')}
                className="w-full flex items-center justify-between px-4 py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl border border-green-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText size={20} />
                  <span className="font-semibold text-sm">Export as CSV</span>
                </div>
                <Download size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceReports;
