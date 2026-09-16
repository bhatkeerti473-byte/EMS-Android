import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MapPin,
  Briefcase,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";

function ResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [resourceType, setResourceType] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
      navigate("/login?from=event-management");
      return;
    }

    fetchResources();
  }, [navigate]);

  const fetchResources = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/events/resources", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResources(data.resources || []);
      }
    } catch (error) {
      console.log("Using sample resources data fallback");
      setResources([]);
    }
  };

  // Filter process listening to updated creation wizard keys
  useEffect(() => {
    let filtered = resources;

    if (searchTerm) {
      filtered = filtered.filter((resource) =>
        (resource.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.resourceType || resource.type || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (resourceType !== "all") {
      filtered = filtered.filter((resource) => (resource.resourceType || resource.type) === resourceType);
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, resourceType]);

  const handleAddResource = () => {
    alert("Global Inventory System add window context to be implemented.");
  };

  const handleDeleteResource = async (resourceId) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/events/resources/${resourceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setResources(resources.filter((r) => r._id !== resourceId));
        alert("Resource deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  // Safe fallback samples matching your operational database model keys
  const sampleResources = [
    {
      _id: "1",
      name: "Audio Equipment",
      resourceType: "Equipment",
      quantity: 5,
      status: "Available",
      location: "Warehouse A",
    },
    {
      _id: "2",
      name: "Lighting System",
      resourceType: "Equipment",
      quantity: 3,
      status: "Available",
      location: "Warehouse A",
    },
    {
      _id: "3",
      name: "Event Coordinator",
      resourceType: "Staff",
      quantity: 2,
      status: "Booked",
      location: "Office",
    },
  ];

  const displayResources = resources.length > 0 ? filteredResources : sampleResources;

  return (
    <div className="flex-1 min-h-screen bg-gray-100">
      {/* Dynamic Header Block Element */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Master Resources Directory</h2>
          <p className="text-gray-600 text-sm">Manage aggregate global event resources inventory logistics</p>
        </div>
        <button
          onClick={handleAddResource}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          Add New Resource Asset
        </button>
      </div>

      <div className="p-8">
        {/* Search Engine controls */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Filter master registry assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800"
            />
          </div>
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800"
          >
            <option value="all">All Types</option>
            <option value="Equipment">Equipment</option>
            <option value="Staff">Staff</option>
            <option value="Venue">Venue</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Aggregate Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-center gap-4">
            <Briefcase className="text-indigo-600" size={32} />
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Total Inventory Assets</p>
              <p className="text-3xl font-black text-gray-800">{displayResources.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-center gap-4">
            <Users className="text-green-600" size={32} />
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Registered Personnel</p>
              <p className="text-3xl font-black text-gray-800">
                {displayResources.filter((r) => (r.resourceType || r.type) === "Staff").length}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-center gap-4">
            <MapPin className="text-orange-600" size={32} />
            <div>
              <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Monitored Locations</p>
              <p className="text-3xl font-black text-gray-800">
                {displayResources.filter((r) => (r.resourceType || r.type) === "Venue").length}
              </p>
            </div>
          </div>
        </div>

        {/* Master Catalog Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-sm text-left">
                  <th className="py-3 px-4 font-bold">Asset Identifier Name</th>
                  <th className="py-3 px-4 font-bold">Classification Category</th>
                  <th className="py-3 px-4 font-bold">Qty Available</th>
                  <th className="py-3 px-4 font-bold">Status Allocation</th>
                  <th className="py-3 px-4 font-bold">Storage Hub / Location</th>
                  <th className="py-3 px-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayResources.map((resource, idx) => (
                  <tr key={resource._id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition text-sm text-gray-700">
                    <td className="py-4 px-4 text-gray-900 font-bold">{resource.name}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {resource.resourceType || resource.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-600">{resource.quantity}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${(resource.status || resource.availability) === "Available"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {resource.status || resource.availability}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-500 font-medium">{resource.location || "Not assigned"}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-3">
                        <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1">
                          <Edit size={15} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResource(resource._id)}
                          className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                        >
                          <Trash2 size={15} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {displayResources.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-gray-300 mb-2" size={44} />
                <p className="text-gray-500 font-medium">No records matching query specifications found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;
