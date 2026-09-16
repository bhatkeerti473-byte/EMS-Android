import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, HelpCircle, LogOut } from "lucide-react";

function EventManagementSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateNewEvent = () => {
    navigate("/user/create-event");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/user/event-management/dashboard" },
    { id: "events", label: "Events", icon: "📅", path: "/user/event-management/events" },
    { id: "resources", label: "Resources", icon: "👥", path: "/user/event-management/resources" },
    { id: "categories", label: "Categories", icon: "🗓️", path: "/user/event-management/categories" },
    { id: "calendar", label: "Calendar", icon: "📆", path: "/user/event-management/calendar" },
    { id: "analytics", label: "Analytics", icon: "📈", path: "/user/event-management/analytics" },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-6 flex flex-col h-screen overflow-y-auto shrink-0">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">EventSync Pro</h1>
        <p className="text-indigo-200 text-sm">Enterprise Plan</p>
      </div>

      <button
        onClick={handleCreateNewEvent}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg mb-8 flex items-center justify-center gap-2 transition shadow-md"
      >
        <Plus size={20} />
        Create Event
      </button>

      <nav className="space-y-2 flex-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center ${isActive(item.path)
                ? "bg-indigo-600 font-semibold shadow-inner"
                : "hover:bg-indigo-700/60 text-indigo-100"
              }`}
          >
            <span className="mr-3 text-lg flex items-center justify-center">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions Footer */}
      <div className="space-y-2 pt-4 border-t border-indigo-700/50 mt-auto">
        {/* CHANGED PATH: Matches the child route defined inside App.jsx */}
        <button
          onClick={() => navigate("/user/event-management/help-centre")}
          className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${isActive("/user/event-management/help-centre")
              ? "bg-indigo-600 font-semibold shadow-inner text-white"
              : "hover:bg-indigo-700/60 text-indigo-100"
            }`}
        >
          <HelpCircle size={18} />
          Help Center
        </button>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-700/60 transition text-indigo-100 flex items-center gap-2"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </div>
  );
}

export default EventManagementSidebar;