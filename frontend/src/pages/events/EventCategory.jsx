import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import eventAPI from "../../services/eventApi";
import { ArrowRight, Heart, Briefcase, Users, Mic, Music, Image } from "lucide-react";

function EventCategory() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    {
      name: "Wedding",
      icon: Heart,
      description: "Ceremonies, receptions, and celebrations.",
      accentColor: "#ea580c",
    },
    {
      name: "Birthday Party",
      icon: Users,
      description: "Birthdays, reunions, and parties.",
      accentColor: "#ea580c",
    },
    {
      name: "Corporate Event",
      icon: Briefcase,
      description: "Conferences, seminars, and networking.",
      accentColor: "#ea580c",
    },
    {
      name: "Conference",
      icon: Mic,
      description: "Professional conferences and seminars.",
      accentColor: "#ea580c",
    },
    {
      name: "Concert",
      icon: Music,
      description: "Live music performances and shows.",
      accentColor: "#ea580c",
    },
    {
      name: "Exhibition",
      icon: Image,
      description: "Art shows and exhibitions.",
      accentColor: "#ea580c",
    },
  ];

  const handleCreateEvent = async () => {
    if (!selectedCategory || !title.trim()) {
      setError("Please select a category and enter an event title");
      return;
    }

    setLoading(true);
    try {
      const response = await eventAPI.createEvent({
        title,
        category: selectedCategory,
        description,
      });

      const eventId = response.data.event._id;
      navigate(`/user/event-details/${eventId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-[#ea580c] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
              1
            </div>
            <h1 className="text-4xl font-bold text-gray-800">Select Event Category</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Choose a category to help us tailor your event creation experience.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Event Title Input */}
        <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-gray-700 font-semibold mb-2">Event Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your event title..."
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition"
          />
        </div>

        {/* Event Description Input */}
        <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <label className="block text-gray-700 font-semibold mb-2">Event Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your event..."
            rows="3"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition"
          />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.name;
            return (
              <div
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-6 rounded-lg border cursor-pointer transition-all transform hover:scale-[1.02] ${isSelected
                    ? "border-[#ea580c] bg-orange-50/40 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-lg ${isSelected ? "bg-[#ea580c] text-white" : "bg-gray-100 text-[#ea580c]"}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">
                    {category.name}
                  </h3>
                </div>
                <p className={`text-sm ${isSelected ? "text-gray-700" : "text-gray-500"}`}>
                  {category.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateEvent}
            disabled={loading}
            className="px-8 py-3 rounded-lg bg-[#ea580c] hover:bg-[#d97706] text-white font-semibold shadow-sm transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Creating..." : "Next Step"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Highlight */}
        <div className="mt-12 p-6 bg-orange-50 border border-orange-100 rounded-lg">
          <h4 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
            <span className="text-[#ea580c]">💡</span> Pro Tip
          </h4>
          <p className="text-gray-600 text-sm">
            Your event details automatically sync with all team members and resource managers across your
            organization.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventCategory;