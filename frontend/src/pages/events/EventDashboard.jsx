import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventAPI from "../../services/eventApi";
import GuestTab from "./GuestTab";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

function EventDashboard() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const fetchEventData = useCallback(async () => {
    try {
      const response = await eventAPI.getEventDetails(eventId);
      setEvent(response.data.event);
      setSchedule(response.data.schedule);
      setResources(response.data.resources || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event data");
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await eventAPI.updateEvent(eventId, { status: newStatus });
      setEvent({ ...event, status: newStatus });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventAPI.deleteEvent(eventId);
        navigate("/client/dashboard");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete event");
      }
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
  }

  const statusColors = {
    Planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    Scheduled: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    Ongoing: "bg-green-500/20 text-green-300 border-green-500/30",
    Completed: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    Cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
  };

  const totalResourceCost = resources.reduce((sum, r) => sum + (r.cost || 0), 0);
  const completedMilestones = schedule?.milestones?.filter((m) => m.status === "Completed").length || 0;
  const totalMilestones = schedule?.milestones?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/client/dashboard")}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-4 py-1 rounded-full text-sm font-medium border ${statusColors[event.status]}`}>
                  {event.status}
                </span>
                <span className="text-gray-400 text-sm">
                  Category: <span className="text-purple-300 font-medium">{event.category}</span>
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/user/event-details/${eventId}`)}
                className="p-3 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition flex items-center gap-2"
                title="Edit event"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteEvent}
                className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition flex items-center gap-2"
                title="Delete event"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-gray-400 text-sm">Event Date</span>
            </div>
            <p className="text-white font-semibold">
              {schedule ? new Date(schedule.startDate).toLocaleDateString() : "Not set"}
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span className="text-gray-400 text-sm">Venue</span>
            </div>
            <p className="text-white font-semibold">{schedule?.venue?.name || "Not assigned"}</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Resources</span>
            </div>
            <p className="text-white font-semibold">{resources.length} assigned</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              <span className="text-gray-400 text-sm">Est. Cost</span>
            </div>
            <p className="text-white font-semibold">${totalResourceCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-700">
          <div className="flex gap-4 overflow-x-auto">
            {["overview", "schedule", "resources", "milestones", "guests"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm transition whitespace-nowrap ${
                  activeTab === tab
                    ? "text-purple-400 border-b-2 border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Event Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Title</span>
                    <p className="text-white font-medium">{event.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Category</span>
                    <p className="text-white font-medium">{event.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Status</span>
                    <p className="text-white font-medium">{event.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Expected Attendees</span>
                    <p className="text-white font-medium">
                      {event.maxAttendees || "Not specified"} {event.maxAttendees && "max"}
                    </p>
                  </div>
                  {event.description && (
                    <div>
                      <span className="text-gray-400 text-sm">Description</span>
                      <p className="text-white text-sm">{event.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Event Status</h3>
                <div className="space-y-2">
                  {["Planning", "Scheduled", "Ongoing", "Completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={loading}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition ${
                        event.status === status
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && schedule && (
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-6">Event Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    Dates & Times
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Start Date</span>
                      <p className="text-white font-medium">
                        {new Date(schedule.startDate).toLocaleDateString()} at {schedule.startTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">End Date</span>
                      <p className="text-white font-medium">
                        {new Date(schedule.endDate).toLocaleDateString()} at {schedule.endTime}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Timezone</span>
                      <p className="text-white font-medium">{schedule.timezone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Venue Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400">Venue</span>
                      <p className="text-white font-medium">{schedule.venue?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Address</span>
                      <p className="text-white font-medium">
                        {schedule.venue?.address}
                        {schedule.venue?.city && `, ${schedule.venue.city}`}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Capacity</span>
                      <p className="text-white font-medium">{schedule.venue?.capacity} guests</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === "resources" && (
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-6">Assigned Resources</h3>
              {resources.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-gray-400">No resources assigned</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource._id} className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-white font-semibold">{resource.name}</h4>
                          <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            {resource.resourceType}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            resource.status === "Available"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}
                        >
                          {resource.status}
                        </span>
                      </div>
                      {resource.description && (
                        <p className="text-gray-400 text-sm mb-2">{resource.description}</p>
                      )}
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Qty: {resource.quantity}</span>
                        <span className="text-white font-medium">${resource.cost}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === "milestones" && schedule && (
            <div className="bg-slate-800/50 backdrop-blur p-6 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-6">
                Key Milestones ({completedMilestones}/{totalMilestones})
              </h3>
              <div className="space-y-3">
                {schedule.milestones?.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex-shrink-0">
                      {milestone.status === "Completed" ? (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      ) : milestone.status === "In Progress" ? (
                        <Clock className="w-6 h-6 text-yellow-400" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{milestone.title}</p>
                      <p className="text-gray-400 text-sm">
                        Due: {new Date(milestone.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        milestone.status === "Completed"
                          ? "bg-green-500/20 text-green-300"
                          : milestone.status === "In Progress"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {milestone.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guests Tab */}
          {activeTab === "guests" && (
            <GuestTab eventId={eventId} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/client/dashboard")}
            className="px-8 py-3 rounded-lg border border-slate-600 text-white hover:bg-slate-700/50 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/user/event-resources/${eventId}`)}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Manage Resources
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDashboard;
