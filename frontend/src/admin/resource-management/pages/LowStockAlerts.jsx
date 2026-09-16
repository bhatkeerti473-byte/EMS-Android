import React from "react";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LowStockAlerts = () => {
  const navigate = useNavigate();

  const alerts = [
    { id: 1, resource: "LED Par Light", category: "Lighting", available: 2, minimum: 10, status: "Low Stock" },
    { id: 2, resource: "Round Table", category: "Furniture", available: 5, minimum: 20, status: "Low Stock" },
    { id: 3, resource: "Banquet Chair", category: "Furniture", available: 12, minimum: 50, status: "Low Stock" },
    { id: 4, resource: "Flower Vase", category: "Decoration", available: 1, minimum: 10, status: "Low Stock" },
    { id: 5, resource: "Sound System", category: "Sound", available: 0, minimum: 5, status: "Out of Stock" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Low Stock Alerts</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Low Stock Alerts</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start space-x-4">
          <AlertTriangle className="text-red-500 mt-0.5" size={24} />
          <div>
            <h3 className="text-red-800 font-semibold">Immediate Attention Required</h3>
            <p className="text-red-600 text-sm mt-1">There are {alerts.length} items that have fallen below the minimum required inventory level. Please re-order them to prevent booking shortages.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Resource Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Category</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Available Stock</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Min. Required</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Status</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((item) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-800 font-medium">{item.resource}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{item.category}</td>
                  <td className="py-4 px-4 text-sm text-center">
                    <span className="font-bold text-red-600">{item.available}</span>
                  </td>
                  <td className="py-4 px-4 text-sm text-center text-gray-600 font-medium">{item.minimum}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold ${item.status === 'Out of Stock' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button className="bg-[#5b2ceb] hover:bg-[#4e25b5] text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors shadow-sm inline-flex items-center space-x-1">
                      <ShoppingCart size={14} />
                      <span>Order Now</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlerts;
