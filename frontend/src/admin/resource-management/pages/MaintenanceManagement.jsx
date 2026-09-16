import React, { useState } from "react";
import { Wrench, Trash2, CheckCircle, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MaintenanceManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [maintenanceItems, setMaintenanceItems] = useState([
    { id: "MNT-001", resource: "Speaker Set", category: "Sound", issue: "No Sound", reportedDate: "10 May, 2025", status: "Repairing" },
    { id: "MNT-002", resource: "LED Par Light", category: "Lighting", issue: "Not Working", reportedDate: "08 May, 2025", status: "Pending" },
    { id: "MNT-003", resource: "Banquet Chair", category: "Furniture", issue: "Broken Leg", reportedDate: "05 May, 2025", status: "Repairing" },
    { id: "MNT-004", resource: "Projector", category: "Electronics", issue: "Display Issue", reportedDate: "07 May, 2025", status: "Completed" },
    { id: "MNT-005", resource: "Round Table", category: "Furniture", issue: "Surface Damage", reportedDate: "06 May, 2025", status: "Pending" },
  ]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Repairing":
        return "text-blue-700 bg-blue-100";
      case "Pending":
        return "text-amber-700 bg-amber-100";
      case "Completed":
        return "text-green-700 bg-green-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setMaintenanceItems(items =>
      items.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this item from maintenance records?")) {
      setMaintenanceItems(items => items.filter(item => item.id !== id));
    }
  };

  const filteredItems = maintenanceItems.filter(item => {
    const matchesSearch = item.resource.toLowerCase().includes(searchTerm.toLowerCase()) || item.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Maintenance Management</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Maintenance</span>
          </div>
        </div>
        <button
          className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Wrench size={18} />
          <span>Add Maintenance</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search resource or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Repairing</option>
              <option>Completed</option>
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
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">ID</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Issue</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Reported Date</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-500">{item.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                    {item.resource}
                    <div className="text-xs text-gray-500">{item.category}</div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.issue}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{item.reportedDate}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      {item.status !== "Completed" && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(item.id, "Repairing")} 
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" 
                            title="Mark as Repairing"
                          >
                            <Wrench size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(item.id, "Completed")} 
                            className="p-1.5 text-green-500 hover:bg-green-50 rounded transition-colors" 
                            title="Mark as Completed"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" 
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500">No maintenance records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing {filteredItems.length} entries</p>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">«</button>
            <button className="px-3 py-1 bg-[#5b2ceb] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceManagement;
