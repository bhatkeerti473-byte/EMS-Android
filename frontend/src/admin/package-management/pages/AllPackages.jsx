import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit, Trash2, Tag, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      // Typically from API: fetch('/api/packages')
      // Dummy data for prototype
      const dummyData = [
        {
          _id: "pkg_1",
          name: "Grand Wedding Package",
          eventType: "Wedding",
          originalPrice: 250000,
          offerPrice: 200000,
          status: "Active",
          components: [
            { name: "Venue", basePrice: 60000, isRequired: true, isRemovable: false },
            { name: "Catering", basePrice: 70000, isRequired: true, isRemovable: false },
            { name: "Photography", basePrice: 30000, isRequired: false, isRemovable: true },
          ]
        }
      ];
      setPackages(dummyData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch packages:", error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter(p => p._id !== id));
      // DELETE api call...
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Package className="text-orange-500" />
            Offer Packages Management
          </h1>
          <p className="text-slate-500 mt-1">Create, edit, and manage dynamic offer packages for clients.</p>
        </div>
        <button
          onClick={() => navigate('/admin/packages/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} /> Add New Package
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-4">Package Name</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Components</th>
                <th className="p-4">Offer Price</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {packages.map(pkg => (
                <tr key={pkg._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{pkg.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{pkg._id}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-bold">
                      {pkg.eventType}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1.5 flex-wrap max-w-[200px]">
                      {pkg.components?.slice(0, 3).map((comp, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {comp.name}
                        </span>
                      ))}
                      {pkg.components?.length > 3 && (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          +{pkg.components.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-black text-emerald-600 text-[15px]">
                      ₹{pkg.offerPrice.toLocaleString()}
                    </div>
                    {pkg.originalPrice > pkg.offerPrice && (
                      <div className="text-[11px] text-slate-400 line-through font-semibold mt-0.5">
                        ₹{pkg.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-max ${
                      pkg.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {pkg.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {pkg.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(pkg._id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No packages found. Create your first package!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPackages;
