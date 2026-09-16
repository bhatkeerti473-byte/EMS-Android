import React, { useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResourceCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([
    { id: 1, name: "Furniture", description: "All types of furniture items", items: 120 },
    { id: 2, name: "Decoration", description: "Decoration related items", items: 90 },
    { id: 3, name: "Lighting", description: "All lighting equipment", items: 50 },
    { id: 4, name: "Sound", description: "Sound and audio systems", items: 60 },
    { id: 5, name: "Catering", description: "Catering equipment", items: 40 },
    { id: 6, name: "Electronics", description: "Electronic devices", items: 55 },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (newCategory.name) {
      if (editingId) {
        setCategories(categories.map(c => 
          c.id === editingId ? { ...c, name: newCategory.name, description: newCategory.description } : c
        ));
      } else {
        setCategories([...categories, { id: Date.now(), name: newCategory.name, description: newCategory.description, items: 0 }]);
      }
      setNewCategory({ name: "", description: "" });
      setEditingId(null);
      setIsModalOpen(false);
    }
  };

  const handleEdit = (category) => {
    setNewCategory({ name: category.name, description: category.description });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewCategory({ name: "", description: "" });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Resource Categories</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer" onClick={() => navigate("/admin/resource-management/dashboard")}>Dashboard</span>
            <span>/</span>
            <span>Resource & Inventory</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Categories</span>
          </div>
        </div>
        <button
          onClick={() => {
            setNewCategory({ name: "", description: "" });
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Plus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Category Name</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500">Description</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Total Items</th>
                <th className="py-3 px-4 text-sm font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-800 font-medium">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{category.description}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 text-center">{category.items}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleEdit(category)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Showing 1 to {categories.length} of {categories.length} entries</p>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">«</button>
            <button className="px-3 py-1 bg-[#5b2ceb] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">»</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{editingId ? "Edit Category" : "Add New Category"}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Catering"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-orange-500 outline-none"
                  rows="3"
                  placeholder="Category description..."
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg">{editingId ? "Update Category" : "Save Category"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCategories;
