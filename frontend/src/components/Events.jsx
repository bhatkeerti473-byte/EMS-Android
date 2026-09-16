import React, { useEffect, useState } from "react";
import axios from "axios";

const fallbackEvents = [
  {
    id: "ud01",
    title: "Udupi Cultural Fest",
    location: "Udupi",
    price: "5200",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "man01",
    title: "Mangalore Beach Wedding",
    location: "Mangalore",
    price: "9800",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "man02",
    title: "Mangalore Conference Expo",
    location: "Mangalore",
    price: "12500",
    image: "https://images.unsplash.com/photo-1496572789470-7b129643d5d3?auto=format&fit=crop&w=800&q=80",
  },
];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      const data = Array.isArray(res.data) ? res.data : res.data.events || [];
      setEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Unable to load events from server. Showing popular local events instead.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const popularLocations = ["udupi", "mangalore"];
  const popularEvents = events.filter((event) =>
    popularLocations.some((loc) => event.location?.toLowerCase().includes(loc))
  );
  const displayEvents = popularEvents.length > 0 ? popularEvents : fallbackEvents;

  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-500">Loading amazing events...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-xl text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      {error && (
        <div className="mb-8 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-center text-yellow-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {displayEvents.map((event) => (
          <div
            key={event._id || event.id}
            className="bg-white rounded-3xl overflow-hidden shadow-lg hover:scale-105 duration-300 border border-gray-100"
          >
            <img
              src={event.image && event.image.trim() !== "" ? event.image : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80"}
              alt={event.title || "Event Showcase"}
              className="h-64 w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80";
              }}
            />
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{event.title}</h2>
              <p className="text-gray-500 mb-3 flex items-center gap-1">📍 {event.location}</p>
              <p className="text-pink-500 font-bold text-2xl">₹{event.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;