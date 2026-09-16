import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddResource = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    purchaseDate: "",
    supplier: "",
    quantity: "",
    availableQuantity: "",
    unitPrice: "",
    location: "",
    status: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving resource:", formData);
    alert("Resource saved successfully!");
    navigate("/admin/resource-management/resource-list");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Add Resource</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Add Resource</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Column 1 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Resource Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter resource name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Purchase Date</label>
                <input
                  type="date"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Available Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="availableQuantity"
                  required
                  placeholder="Enter available quantity"
                  value={formData.availableQuantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
                >
                  <option value="" disabled>Select Status</option>
                  <option value="Available">Available</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] bg-white"
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Audio Equipment">Audio Equipment</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Decoration">Decoration</option>
                  <option value="Stage Equipment">Stage Equipment</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  placeholder="Select Supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit Price (₹)</label>
                <input
                  type="number"
                  name="unitPrice"
                  placeholder="Enter unit price"
                  value={formData.unitPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  placeholder="Enter description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quantity <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="quantity"
                  required
                  placeholder="Enter total quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Enter location / storage place"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#5b2ceb] focus:ring-1 focus:ring-[#5b2ceb]"
                />
              </div>
            </div>
          </div>

          {/* Image Upload spanning below the first column */}
          <div className="md:w-1/3 pt-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-32 hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleImageUpload}
              />
              {formData.image ? (
                <img src={formData.image} alt="Resource" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <p className="text-sm font-medium text-gray-700">Choose File <span className="text-gray-400 font-normal">No file chosen</span></p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP (max size 2MB)</p>
                </>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end items-center space-x-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => navigate("/admin/resource-management/resource-list")}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-sm font-semibold text-white transition-colors shadow-sm"
            >
              Save Resource
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResource;
