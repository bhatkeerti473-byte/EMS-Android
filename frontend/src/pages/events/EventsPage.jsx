import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  Plus,
  Search,
} from "lucide-react";

function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
      navigate("/login?from=event-management");
      return;
    }

    fetchUserEvents();
  }, [navigate]);

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (!token) return;

      const response = await fetch("http://localhost:5000/api/events/user-events", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  useEffect(() => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((event) => event.status === statusFilter);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, statusFilter]);

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setEvents(events.filter((e) => e._id !== eventId));
        alert("Event deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
          <p className="text-gray-600 text-sm">Manage and track all your events</p>
        </div>
        <button
          onClick={() => navigate("/user/create-event")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          New Event
        </button>
      </div>

      <div className="p-8">
        {/* Search and Filter */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="Planning">Planning</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Event Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Attendees</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4 text-gray-800 font-semibold">{event.title}</td>
                    <td className="py-4 px-4 text-gray-600">{event.category}</td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(event.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${event.status === "Planning"
                            ? "bg-orange-100 text-orange-700"
                            : event.status === "Scheduled"
                              ? "bg-blue-100 text-blue-700"
                              : event.status === "Ongoing"
                                ? "bg-green-100 text-green-700"
                                : event.status === "Completed"
                                  ? "bg-gray-100 text-gray-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{event.attendees?.length || 0}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/user/event-dashboard/${event._id}`)}
                          className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => navigate(`/user/event-details/${event._id}`)}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                <p className="text-gray-600">
                  {events.length === 0 ? "No events created yet" : "No events match your filters"}
                </p>
                {events.length === 0 && (
                  <button
                    onClick={() => navigate("/user/create-event")}
                    className="text-indigo-600 hover:text-indigo-700 font-semibold mt-2"
                  >
                    Create your first event
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
