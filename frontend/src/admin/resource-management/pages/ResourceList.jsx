import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourceList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [resources, setResources] = useState([
    { id: "RES-001", name: "Chair", category: "Furniture", quantity: 200, available: 150, allocated: 50, status: "Available" },
    { id: "RES-002", name: "Table Round", category: "Furniture", quantity: 50, available: 30, allocated: 20, status: "Available" },
    { id: "RES-003", name: "Sound System", category: "Audio Equipment", quantity: 10, available: 5, allocated: 5, status: "Available" },
    { id: "RES-004", name: "LED Par Light", category: "Lighting", quantity: 30, available: 5, allocated: 25, status: "Low Stock" },
    { id: "RES-005", name: "Flower Bouquet", category: "Decoration", quantity: 100, available: 10, allocated: 90, status: "Low Stock" },
    { id: "RES-006", name: "Stage 10x20", category: "Stage Equipment", quantity: 5, available: 2, allocated: 3, status: "Available" },
    { id: "RES-007", name: "Sofa Set", category: "Furniture", quantity: 20, available: 5, allocated: 15, status: "Available" },
    { id: "RES-008", name: "Generator", category: "Electrical", quantity: 5, available: 1, allocated: 4, status: "Maintenance" },
    { id: "RES-009", name: "Projector", category: "Electronics", quantity: 8, available: 4, allocated: 4, status: "Available" },
    { id: "RES-010", name: "AC Portable", category: "Electrical", quantity: 10, available: 6, allocated: 4, status: "Available" },
  ]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources(resources.filter(r => r.id !== id));
    }
  };

  const handleView = (resource) => {
    alert(`Viewing Details:\n\nName: ${resource.name}\nID: ${resource.id}\nCategory: ${resource.category}\nAvailable: ${resource.available}\nStatus: ${resource.status}`);
  };

  const handleEdit = (resource) => {
    alert(`Redirecting to edit page for ${resource.name} (ID: ${resource.id})`);
    // navigate(`/admin/resource-management/edit-resource/${resource.id}`);
  };

  const filteredResources = resources.filter(res => {
    const matchSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "All Categories" || res.category === categoryFilter;
    const matchStatus = statusFilter === "All Status" || res.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const currentItems = filteredResources.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
          <h2 className="text-2xl font-bold text-gray-800">Resource List</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Resource List</span>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin/resource-management/add-resource")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>Add Resource</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search resource..."
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
              <option>Audio Equipment</option>
              <option>Lighting</option>
              <option>Decoration</option>
              <option>Stage Equipment</option>
              <option>Electrical</option>
              <option>Electronics</option>
            </select>
          </div>
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
            >
              <option>All Status</option>
              <option>Available</option>
              <option>Low Stock</option>
              <option>Maintenance</option>
            </select>
          </div>
          <button onClick={() => setCurrentPage(1)} className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-5 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource ID</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Quantity</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Available</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Allocated</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((resource) => (
                <tr key={resource.id} className="border-b border-gray-50 hover:bg-gray-50 last:border-0 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-500">{resource.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{resource.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{resource.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center">{resource.quantity}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center">{resource.available}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center">{resource.allocated}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${getStatusStyle(resource.status)}`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleView(resource)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleEdit(resource)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(resource.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {filteredResources.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredResources.length)} of {filteredResources.length} entries
          </p>
          <div className="flex items-center space-x-1">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >«</button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md text-sm font-medium shadow-sm ${currentPage === i + 1 ? 'bg-[#5b2ceb] text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >{i + 1}</button>
            ))}
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceList;
