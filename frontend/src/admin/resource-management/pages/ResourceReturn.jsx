import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourceReturn = () => {
  const navigate = useNavigate();

  const [returnItems, setReturnItems] = useState([
    { id: 1, name: "Chair", allocated: 200, returned: 195, damaged: 5, remarks: "5 chairs leg damaged" },
    { id: 2, name: "Table Round", allocated: 20, returned: 20, damaged: 0, remarks: "Good" },
    { id: 3, name: "Sound System", allocated: 2, returned: 2, damaged: 0, remarks: "Good" },
    { id: 4, name: "LED Par Light", allocated: 15, returned: 14, damaged: 1, remarks: "1 light not working" },
    { id: 5, name: "Flower Bouquet", allocated: 20, returned: 18, damaged: 2, remarks: "Few flowers wasted" },
    { id: 6, name: "Stage 10x20", allocated: 1, returned: 1, damaged: 0, remarks: "Good" },
  ]);

  const handleReturnChange = (id, field, value) => {
    setReturnItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    alert("Resource Return Submitted Successfully!");
    navigate("/admin/resource-management/dashboard");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resource Return</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Resource Return</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Event Details & Attachments */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Event Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Event Name</label>
                <p className="text-gray-800 font-medium">Wedding Ceremony</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Return Date</label>
                <p className="text-gray-800 font-medium">26/05/2025</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-500 mb-1">Venue</label>
                <p className="text-gray-800 font-medium">Dream Palace Banquet</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Attachments</h3>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-32 hover:bg-gray-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
              <Upload className="text-gray-400 mb-2" size={24} />
              <p className="text-sm font-medium text-gray-700">Choose file <span className="text-gray-400 font-normal">No file chosen</span></p>
              <p className="text-xs text-gray-400 mt-1">You can upload multiple images (Max 5MB each)</p>
            </div>
          </div>
        </div>

        {/* Right Column: Return Resources Table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Return Resources</h3>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">Resource Name</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Allocated</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Returned</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500 text-center">Damaged</th>
                    <th className="py-3 px-2 text-sm font-semibold text-gray-500">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {returnItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-2 text-sm text-gray-800 font-medium">{item.name}</td>
                      <td className="py-4 px-2 text-sm text-gray-600 text-center">{item.allocated}</td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          value={item.returned}
                          onChange={(e) => handleReturnChange(item.id, 'returned', parseInt(e.target.value) || 0)}
                          className="w-20 px-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#5b2ceb]"
                        />
                      </td>
                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          value={item.damaged}
                          onChange={(e) => handleReturnChange(item.id, 'damaged', parseInt(e.target.value) || 0)}
                          className="w-16 px-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#5b2ceb]"
                        />
                      </td>
                      <td className="py-4 px-2">
                        <input
                          type="text"
                          value={item.remarks}
                          onChange={(e) => handleReturnChange(item.id, 'remarks', e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm outline-none focus:border-[#5b2ceb]"
                          placeholder="Add remarks..."
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="mt-8 border-t border-gray-100 pt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-sm"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceReturn;
