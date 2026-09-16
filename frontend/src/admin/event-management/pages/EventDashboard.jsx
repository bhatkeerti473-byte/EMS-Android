import React, { useState, useEffect } from "react";
import AddEvent from "./AddEvent";
import { 
  Search, Filter, Plus, Edit3, Trash2, MoreVertical, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { defaultEventTypes } from "../../../utils/eventTypesData";

function EventDashboard() {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("admin_event_types");
    if (saved) {
      let parsed = JSON.parse(saved);
      // Migrate old baby shower image if present
      parsed = parsed.map(e => 
        e.id === "babyshower" && e.image && e.image.includes("unsplash") 
        ? { ...e, image: "/images/baby-shower-new.png" } 
        : e
      );
      return parsed;
    }
    return defaultEventTypes;
  });
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    localStorage.setItem("admin_event_types", JSON.stringify(events));
  }, [events]);

  const toggleStatus = (id) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, status: !event.status } : event
    ));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((event) => event.id !== id));
    }
  };

  const handleEdit = (id) => {
    const eventToEdit = events.find(e => e.id === id);
    if (eventToEdit) setEditingEvent({ ...eventToEdit });
  };

  const saveEdit = () => {
    setEvents(events.map(event => 
      event.id === editingEvent.id ? editingEvent : event
    ));
    setEditingEvent(null);
  };

  if (isAddingEvent) {
    return <AddEvent onCancel={() => setIsAddingEvent(false)} />;
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Events</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all events in the system</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 font-medium"
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 border border-gray-200 bg-white rounded-lg px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 w-full sm:w-auto">
            <Filter size={16} className="text-gray-500" />
            Filter
          </button>
          
          <button 
            onClick={() => setIsAddingEvent(true)}
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg font-bold transition-colors shadow-sm w-full sm:w-auto"
          >
            <Plus size={18} />
            Add New Event
          </button>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[13px] font-black text-gray-900 w-[200px]">Event Image</th>
                <th className="px-6 py-4 text-[13px] font-black text-gray-900 w-[180px]">Event Name</th>
                <th className="px-6 py-4 text-[13px] font-black text-gray-900">Description</th>
                <th className="px-6 py-4 text-[13px] font-black text-gray-900 w-[150px] text-center">Price (Starting From)</th>
                <th className="px-6 py-4 text-[13px] font-black text-gray-900 w-[120px] text-center">Status</th>
                <th className="px-6 py-4 text-[13px] font-black text-gray-900 w-[150px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 align-middle">
                    <div className="w-[180px] h-[100px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group-hover:shadow-md transition-shadow">
                      <img src={event.image || event.img} alt={event.title || event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle text-[14px] font-bold text-gray-900">{event.title || event.name}</td>
                  <td className="px-6 py-4 align-middle text-[13px] font-semibold text-gray-600 leading-relaxed pr-8">{event.description}</td>
                  <td className="px-6 py-4 align-middle text-[14px] font-bold text-gray-900 text-center">{event.price}</td>
                  
                  <td className="px-6 py-4 align-middle">
                    <div className="flex items-center justify-center gap-3">
                      {/* Toggle Switch */}
                      <button 
                        onClick={() => toggleStatus(event.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${event.status ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${event.status ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                      <span className={`text-[12px] font-bold ${event.status ? 'text-green-600 bg-green-50' : 'text-gray-500 bg-gray-100'} px-2 py-0.5 rounded border ${event.status ? 'border-green-200' : 'border-gray-200'}`}>
                        {event.status ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(event.id)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors border border-blue-100"
                        title="Edit Event"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors border border-red-100"
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        className="text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 p-2 rounded-lg transition-colors border border-gray-200 shadow-sm"
                        title="More Options"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <p className="text-[13px] font-semibold text-gray-500">Showing 1 to {events.length} of 6 entries</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white"><ChevronLeft size={16} /></button>
              <button className="w-8 h-8 flex items-center justify-center rounded border-none bg-orange-500 text-white text-[13px] font-bold shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors bg-white"><ChevronRight size={16} /></button>
            </div>
            
            <div className="flex items-center gap-2 border border-gray-200 bg-white rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[13px] font-semibold text-gray-700">10 / page</span>
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">Edit Event Type</h2>
              <button 
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 p-2 rounded-full transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Event Title</label>
                  <input 
                    type="text" 
                    value={editingEvent.title || editingEvent.name || ''} 
                    onChange={e => setEditingEvent({...editingEvent, title: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Starting Price</label>
                  <input 
                    type="text" 
                    value={editingEvent.price || ''} 
                    onChange={e => setEditingEvent({...editingEvent, price: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Image URL</label>
                <input 
                  type="text" 
                  value={editingEvent.image || editingEvent.img || ''} 
                  onChange={e => setEditingEvent({...editingEvent, image: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-800"
                />
                {editingEvent.image && (
                  <div className="mt-2 h-24 w-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={editingEvent.image || editingEvent.img} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Description</label>
                <textarea 
                  value={editingEvent.description || ''} 
                  onChange={e => setEditingEvent({...editingEvent, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all font-medium text-gray-800 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
              <button 
                onClick={() => setEditingEvent(null)}
                className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={saveEdit}
                className="px-6 py-2.5 rounded-lg font-bold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EventDashboard;
