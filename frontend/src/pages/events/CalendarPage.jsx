import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, AlertCircle, Plus } from "lucide-react";

function CalendarPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 28)); // May 28, 2026
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?from=event-management");
      return;
    }

    fetchUserEvents();
  }, [navigate]);

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem("token");
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

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDate = (day) => {
    return events.filter((event) => {
      const eventDate = new Date(event.createdAt || event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    // REMOVED: Outer layout flex container and <EventManagementSidebar />
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Event Calendar</h2>
          <p className="text-gray-600 text-sm">View and manage your events by date</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Grid Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={getPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft size={24} className="text-gray-600" />
              </button>
              <h3 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={getNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isToday =
                  day &&
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div
                    key={idx}
                    onClick={() => day && setSelectedDate(day)}
                    className={`min-h-24 p-2 rounded-lg border cursor-pointer transition ${!day
                        ? "bg-gray-50 border-gray-100"
                        : isToday
                          ? "bg-indigo-50 border-indigo-300"
                          : selectedDate === day
                            ? "bg-blue-50 border-blue-300"
                            : dayEvents.length > 0
                              ? "bg-green-50 border-green-300"
                              : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    {day && (
                      <>
                        <div className={`font-semibold mb-1 ${isToday ? "text-indigo-600" : "text-gray-800"}`}>
                          {day}
                        </div>
                        <div className="text-xs space-y-1">
                          {dayEvents.slice(0, 2).map((event, i) => (
                            <div
                              key={i}
                              className="bg-indigo-500 text-white px-2 py-1 rounded text-xs truncate cursor-pointer hover:bg-indigo-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/user/event-dashboard/${event._id}`);
                              }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-gray-600">+{dayEvents.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Agenda Sidebar Panel */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {selectedDate
                ? `Events on ${monthNames[currentDate.getMonth()]} ${selectedDate}`
                : "Select a date"}
            </h3>

            {selectedDate ? (
              <div className="space-y-4">
                {getEventsForDate(selectedDate).length > 0 ? (
                  getEventsForDate(selectedDate).map((event, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-800 mb-2">{event.title}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Category:</strong> {event.category}</p>
                        <p><strong>Status:</strong> {event.status}</p>
                        <p><strong>Date:</strong> {new Date(event.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/user/event-dashboard/${event._id}`)}
                        className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-semibold"
                      >
                        View Details
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-gray-600 text-sm">No events on this date</p>
                    <button
                      onClick={() => navigate("/user/create-event")}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold text-sm mt-2"
                    >
                      Create event
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="text-gray-600 text-sm">Click on a date to view events</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;