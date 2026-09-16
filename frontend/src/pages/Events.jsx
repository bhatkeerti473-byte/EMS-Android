import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Events() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/events");
    setEvents(res.data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-5xl font-bold text-center mb-16">
        Events
      </h1><div className="grid md:grid-cols-3 gap-10">

        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl overflow-hidden shadow-xl"
          >

            <img
              src={event.image}
              alt=""
              className="w-full h-64 object-cover"
            />

            <div className="p-6">

              <h2 className="text-2xl font-bold">
                {event.title}
              </h2><p className="text-gray-500 mt-2">
                {event.location}
              </p>

              <p className="text-pink-500 text-2xl font-bold mt-3">
                ₹{event.price}
              </p>

              <Link to={`/event/${event.id}`}>
                <button className="mt-5 bg-pink-500 text-white px-6 py-3 rounded-full">
                  View Details
                </button>
              </Link>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
export default Events;