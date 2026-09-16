import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import eventAPI from "../../services/eventApi";
import { ArrowLeft, ArrowRight, MapPin, Clock, Calendar } from "lucide-react";

function EventDetails() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    startTime: "",
    endTime: "",
    venueName: "",
    venueAddress: "",
    venueCity: "",
    venueState: "",
    venueZipCode: "",
    venueCapacity: "",
    timezone: "UTC",
  });

  const [milestones, setMilestones] = useState([
    { title: "Venue Selection", dueDate: null, status: "Pending" },
    { title: "Vendor Confirmation", dueDate: null, status: "Pending" },
    { title: "Staff Assignment", dueDate: null, status: "Pending" },
    { title: "Event Execution", dueDate: null, status: "Pending" },
  ]);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await eventAPI.getEventDetails(eventId);
      setEvent(response.data.event);
      if (response.data.schedule) {
        setFormData((prev) => ({
          ...prev,
          startDate: response.data.schedule.startDate ? new Date(response.data.schedule.startDate) : null,
          endDate: response.data.schedule.endDate ? new Date(response.data.schedule.endDate) : null,
          startTime: response.data.schedule.startTime || "",
          endTime: response.data.schedule.endTime || "",
          venueName: response.data.schedule.venue?.name || "",
          venueAddress: response.data.schedule.venue?.address || "",
          venueCity: response.data.schedule.venue?.city || "",
          venueState: response.data.schedule.venue?.state || "",
          venueZipCode: response.data.schedule.venue?.zipCode || "",
          venueCapacity: response.data.schedule.venue?.capacity || "",
          timezone: response.data.schedule.timezone || "UTC",
        }));
        if (response.data.schedule.milestones) {
          const formattedMilestones = response.data.schedule.milestones.map(m => ({
            ...m,
            dueDate: m.dueDate ? new Date(m.dueDate) : null
          }));
          setMilestones(formattedMilestones);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event details");
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatDateInputValue = (date) => (date ? date.toISOString().slice(0, 10) : "");
  const parseDateInputValue = (value) => (value ? new Date(value) : null);

  const handleDateChange = (date, fieldName) => {
    setFormData((prev) => {
      const updated = { ...prev, [fieldName]: date };

      if (fieldName === "startDate" && updated.endDate && date > updated.endDate) {
        updated.endDate = null;
      }
      if (fieldName === "endDate" && updated.startDate && date < updated.startDate) {
        updated.startDate = null;
      }
      return updated;
    });
  };

  const handleMilestoneChange = (index, value) => {
    const updated = [...milestones];
    updated[index].dueDate = value;
    setMilestones(updated);
  };

  const handleSaveAndContinue = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (
      !formData.startDate ||
      !formData.endDate ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.venueName
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.startDate < today) {
      setError("Start Date cannot be in the past");
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError("End Date cannot be earlier than the Start Date");
      return;
    }

    setLoading(true);
    try {
      await eventAPI.saveEventSchedule({
        eventId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: {
          name: formData.venueName,
          address: formData.venueAddress,
          city: formData.venueCity,
          state: formData.venueState,
          zipCode: formData.venueZipCode,
          capacity: parseInt(formData.venueCapacity) || 0,
        },
        timezone: formData.timezone,
        milestones: milestones.map((m) => ({
          ...m,
          dueDate: m.dueDate ? m.dueDate : undefined,
        })),
      });

      navigate(`/user/event-resources/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save event schedule");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
              2
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Event Details & Schedule</h1>
          </div>
          <p className="text-gray-600 text-center text-lg">
            Set dates, times, venue details, and key milestones for <span className="font-semibold text-gray-800">{event.title}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Date & Time Section */}
          <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <Calendar className="w-5 h-5 text-[#ea580c]" />
              Date & Time
            </h3>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  value={formatDateInputValue(formData.startDate)}
                  onChange={(e) => handleDateChange(parseDateInputValue(e.target.value), "startDate")}
                  min={formatDateInputValue(new Date())}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">End Date *</label>
                <input
                  type="date"
                  name="endDate"
                  value={formatDateInputValue(formData.endDate)}
                  onChange={(e) => handleDateChange(parseDateInputValue(e.target.value), "endDate")}
                  min={formatDateInputValue(formData.startDate || new Date())}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:border-[#ea580c]"
                />
              </div>
            </div>
          </div>

          {/* Venue Section */}
          <div className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 pb-2 border-b border-gray-100">
              <MapPin className="w-5 h-5 text-[#ea580c]" />
              Venue Details
            </h3>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Venue Name *</label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleInputChange}
                  placeholder="Enter venue name..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Address</label>
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  placeholder="Street address..."
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">City</label>
                  <input
                    type="text"
                    name="venueCity"
                    value={formData.venueCity}
                    onChange={handleInputChange}
                    placeholder="City..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">State</label>
                  <input
                    type="text"
                    name="venueState"
                    value={formData.venueState}
                    onChange={handleInputChange}
                    placeholder="State..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Zip Code</label>
                  <input
                    type="text"
                    name="venueZipCode"
                    value={formData.venueZipCode}
                    onChange={handleInputChange}
                    placeholder="Zip code..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">Capacity</label>
                  <input
                    type="number"
                    name="venueCapacity"
                    value={formData.venueCapacity}
                    onChange={handleInputChange}
                    placeholder="Max guests..."
                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Clock className="w-5 h-5 text-[#ea580c]" />
            Key Milestones
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-gray-800 font-semibold mb-3 text-sm">{milestone.title}</h4>
                <input
                  type="date"
                  value={formatDateInputValue(milestone.dueDate)}
                  onChange={(e) => handleMilestoneChange(index, parseDateInputValue(e.target.value))}
                  min={formatDateInputValue(formData.startDate || new Date())}
                  max={formData.endDate ? formatDateInputValue(formData.endDate) : ""}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-[#ea580c]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => navigate(`/user/create-event`)}
            className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={handleSaveAndContinue}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-[#ea580c] hover:bg-[#d97706] text-white font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Saving..." : "Continue to Resources"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;