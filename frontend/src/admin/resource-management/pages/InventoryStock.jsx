import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InventoryStock = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const stockData = [
    { name: "Chair", category: "Furniture", total: 200, available: 150, allocated: 50, damaged: 0, maintenance: 0, remaining: 150, status: "Available" },
    { name: "Table Round", category: "Furniture", total: 50, available: 30, allocated: 20, damaged: 0, maintenance: 0, remaining: 30, status: "Available" },
    { name: "Sound System", category: "Audio", total: 10, available: 5, allocated: 5, damaged: 0, maintenance: 0, remaining: 5, status: "Available" },
    { name: "LED Par Light", category: "Lighting", total: 30, available: 5, allocated: 25, damaged: 0, maintenance: 0, remaining: 5, status: "Low Stock" },
    { name: "Flower Bouquet", category: "Decoration", total: 100, available: 10, allocated: 90, damaged: 0, maintenance: 0, remaining: 10, status: "Low Stock" },
    { name: "Stage 10x20", category: "Stage", total: 5, available: 2, allocated: 3, damaged: 0, maintenance: 0, remaining: 2, status: "Available" },
    { name: "Generator", category: "Electrical", total: 5, available: 1, allocated: 3, damaged: 0, maintenance: 1, remaining: 1, status: "Maintenance" },
    { name: "Projector", category: "Electronics", total: 8, available: 4, allocated: 4, damaged: 0, maintenance: 0, remaining: 4, status: "Available" },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Available":
        return "text-green-700 bg-green-100";
      case "Low Stock":
        return "text-amber-700 bg-amber-100";
      case "Maintenance":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventory Stock</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Inventory Stock</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search resource name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
            >
              <option>All Categories</option>
              <option>Furniture</option>
              <option>Audio</option>
              <option>Lighting</option>
              <option>Decoration</option>
              <option>Stage</option>
              <option>Electrical</option>
              <option>Electronics</option>
            </select>
          </div>
          <button className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-5 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Total Stock</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Available</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Allocated</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Damaged</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Maintenance</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Remaining</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {stockData.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 last:border-0 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.total}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.available}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.allocated}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.damaged}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center font-medium">{item.maintenance}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 text-center font-bold">{item.remaining}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing 1 to 10 of 25 entries</p>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">«</button>
            <button className="px-3 py-1 bg-[#5b2ceb] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStock;
