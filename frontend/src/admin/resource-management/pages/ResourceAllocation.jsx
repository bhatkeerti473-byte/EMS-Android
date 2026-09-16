import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourceAllocation = () => {
  const navigate = useNavigate();
  
  const [allocationItems, setAllocationItems] = useState([
    { id: 1, name: "Chair", available: 150, required: 200, selected: true },
    { id: 2, name: "Table Round", available: 30, required: 20, selected: true },
    { id: 3, name: "Sound System", available: 5, required: 2, selected: true },
    { id: 4, name: "LED Par Light", available: 5, required: 10, selected: true },
    { id: 5, name: "Flower Bouquet", available: 10, required: 20, selected: false },
    { id: 6, name: "Stage 10x20", available: 2, required: 1, selected: true },
  ]);

  const handleSelectionToggle = (id) => {
    setAllocationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleRequiredChange = (id, value) => {
    setAllocationItems(items =>
      items.map(item =>
        item.id === id ? { ...item, required: parseInt(value) || 0 } : item
      )
    );
  };

  const handleDelete = (id) => {
    setAllocationItems(items => items.filter(item => item.id !== id));
  };

  const totalItems = allocationItems.filter(item => item.selected).length;
  const totalQuantity = allocationItems.filter(item => item.selected).reduce((sum, item) => sum + item.required, 0);

  const handleAllocate = () => {
    alert("Resources Allocated Successfully!");
    navigate("/admin/resource-management/resource-list");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resource Allocation</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Resource Allocation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Event Name</label>
                <p className="text-gray-800 font-medium">Wedding Ceremony</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Event Date</label>
                <p className="text-gray-800 font-medium">25/05/2025</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Venue</label>
                <p className="text-gray-800 font-medium">Dream Palace Banquet</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Organizer</label>
                <p className="text-gray-800 font-medium">John Doe</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Expected Guests</label>
                <p className="text-gray-800 font-medium">300</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Notes</label>
                <p className="text-gray-800 font-medium">None</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assign Resources */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Assign Resources</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500 w-10"></th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">Resource Name</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">Available</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">Quantity Required</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocationItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleSelectionToggle(item.id)}
                          className="w-4 h-4 text-[#5b2ceb] border-gray-300 rounded focus:ring-[#5b2ceb]"
                        />
                      </td>
                      <td className="py-4 px-2 text-sm text-gray-800 font-medium">{item.name}</td>
                      <td className="py-4 px-2 text-sm text-gray-600">{item.available}</td>
                      <td className="py-4 px-2">
                        <input
                          type="number"
                          value={item.required}
                          onChange={(e) => handleRequiredChange(item.id, e.target.value)}
                          disabled={!item.selected}
                          className={`w-24 px-3 py-1.5 border rounded-md text-sm outline-none ${item.selected ? 'border-gray-300 focus:border-[#5b2ceb]' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Submit */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
                <div className="flex items-center space-x-8 mb-4 sm:mb-0">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Total Items</p>
                    <p className="text-xl font-bold text-gray-800">{totalItems}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-semibold mb-1">Total Quantity</p>
                    <p className="text-xl font-bold text-gray-800">{totalQuantity}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleAllocate}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
                >
                  Allocate Resources
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceAllocation;
