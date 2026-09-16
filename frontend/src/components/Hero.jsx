import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleCreateEvent = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    // Check if the user is authenticated
    if (loggedInUser && token) {
      if (userRole === "client") {
        navigate('/client/dashboard');
      } else {
        // Directly go to the event management dashboard
        navigate('/user/event-management/dashboard');
      }
    } else {
      // Redirect to login page if unauthenticated
      navigate('/login?from=event-management');
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30')",
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-6xl font-extrabold max-w-4xl leading-tight">
          CREATE EVENTS AND START SELLING TICKETS
        </h1>

        <p className="mt-6 text-xl max-w-2xl text-gray-200">
          Discover amazing events, book tickets and create unforgettable memories.
        </p>

        <button
          onClick={handleCreateEvent}
          className="mt-8 bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-full text-xl font-semibold transition"
        >
          CREATE AN EVENT
        </button>
      </div>
    </div>
  );
}

export default Hero;