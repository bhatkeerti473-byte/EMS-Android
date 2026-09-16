import React, { useState, useEffect, useMemo } from "react";
import { 
  Users, Calendar, Clock, DollarSign, Search, ChevronDown, 
  Download, Eye, Edit3, Trash2, Plus, ChevronLeft, ChevronRight 
} from "lucide-react";
import ClientDetails from "./ClientDetails";

function ClientDashboard({ clients: propsClients = [], bookings = [] }) {
  const [clients, setClients] = useState(propsClients);
  const [activeClient, setActiveClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setClients(propsClients);
  }, [propsClients]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      setClients(clients.filter((client) => client.id !== id));
    }
  };

  const handleEdit = (id) => {
    alert(`Edit functionality for client ${id} would open a form/modal here.`);
  };

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const totalBookings = clients.reduce((sum, c) => sum + (c.totalBookings || 0), 0);
    
    const today = new Date();
    const upcoming = bookings.filter(b => {
      const bDate = new Date(b.event_date);
      return !isNaN(bDate.getTime()) && bDate >= today;
    }).length;
    
    const totalSpentVal = clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const totalRevenue = `₹${totalSpentVal.toLocaleString("en-IN")}`;

    return {
      totalClients,
      totalBookings,
      upcomingEvents: upcoming || 0,
      totalRevenue
    };
  }, [clients, bookings, propsClients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If a client is selected, render the ClientDetails view instead.
  if (activeClient) {
    return <ClientDetails client={activeClient} onBack={() => setActiveClient(null)} />;
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Clients</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and view all registered clients and their service metrics.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Clients</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{stats.totalClients}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5"><span className="text-green-500">Active</span> registered users</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Bookings</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{stats.totalBookings}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5">Consolidated bookings</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Upcoming Events</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{stats.upcomingEvents}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5">Upcoming schedules</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Volume</p>
            <h3 className="text-2xl font-black text-gray-900 leading-none">{stats.totalRevenue}</h3>
            <p className="text-[11px] font-bold text-gray-400 mt-1.5">Cumulative billing cost</p>
          </div>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        
        {/* Controls */}
        <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="relative w-full xl:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by client name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium font-sans"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Client ID</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Total Bookings</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 align-middle">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <img 
                        src={client.img} 
                        alt={client.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop";
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600 truncate max-w-[150px]">{client.id}</td>
                  <td className="px-6 py-4 align-middle text-[14px] font-bold text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600">{client.email}</td>
                  <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600">{client.phone}</td>
                  <td className="px-6 py-4 align-middle text-[14px] font-bold text-gray-900 text-center">{client.totalBookings}</td>
                  <td className="px-6 py-4 align-middle text-[14px] font-bold text-gray-950">₹ {Number(client.totalSpent || client.totalPaid || 0).toLocaleString("en-IN")}</td>
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setActiveClient(client)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        title="View Details & Services Taken"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(client.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                        title="Delete Client"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-gray-500 font-medium">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm font-semibold text-gray-500">Showing 1 to {filteredClients.length} of {filteredClients.length} entries</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded border-none bg-[#ff7b00] text-white text-sm font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white"><ChevronRight size={16} /></button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ClientDashboard;
