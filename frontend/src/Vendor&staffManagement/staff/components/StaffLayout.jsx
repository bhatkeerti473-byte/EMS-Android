import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  Clock3,
  Home,
  LogOut,
  Menu,
  User,
  ChevronDown,
} from "lucide-react";
import PremiumLogo from "../../../components/PremiumLogo/PremiumLogo";

export default function StaffLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState({
    name: "",
    role: "staff",
    email: "",
    designation: "Staff Member",
    photo: null
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(prev => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          photo: parsed.photo || null,
          designation: parsed.role === "staff" ? "Security Staff" : (parsed.designation || prev.designation)
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // Paths list for matching
  const menuItems = [
    { label: "Dashboard", icon: Home, path: "/staff/dashboard" },
    { label: "My Events", icon: CalendarDays, path: "/staff/events" },
    { label: "My Tasks", icon: ClipboardList, path: "/staff/tasks" },
    { label: "My Attendance", icon: Clock3, path: "/staff/attendance" },
    { label: "My Schedule", icon: CalendarDays, path: "/staff/schedule" },
    { label: "Notifications", icon: Bell, path: "/staff/notifications", badge: 3 },
    { label: "Profile", icon: User, path: "/staff/profile" },
  ];

  // Helper to get formatted current date
  const getFormattedDate = () => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    return new Date().toLocaleDateString('en-US', options);
  };

  // Determine header title and breadcrumbs based on pathname
  const getHeaderDetails = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) {
      return {
        isDashboard: true,
        title: `Welcome back, ${user.name} 👋`,
        subtitle: "Here's what's happening with your work today."
      };
    }
    
    let pageName = "Dashboard";
    if (path.includes("/events")) pageName = "My Events";
    else if (path.includes("/tasks")) pageName = "My Tasks";
    else if (path.includes("/attendance")) pageName = "My Attendance";
    else if (path.includes("/schedule")) pageName = "My Schedule";
    else if (path.includes("/profile")) pageName = "My Profile";
    else if (path.includes("/notifications")) pageName = "Notifications";

    return {
      isDashboard: false,
      title: pageName,
      breadcrumb: `Dashboard > ${pageName}`
    };
  };

  const header = getHeaderDetails();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <div className="flex min-h-screen overflow-hidden">
        
        {/* --- Collapsible Sidebar --- */}
        <aside
          className={`shrink-0 z-20 border-r border-slate-800 bg-[#0b1e3d] text-white transition-all duration-300 flex flex-col justify-between ${
            sidebarOpen ? "w-[280px]" : "w-[90px]"
          }`}
        >
          <div>
            {/* Sidebar Logo Header */}
            <div className="flex items-center justify-between px-5 py-6">
              {sidebarOpen ? (
                <div className="flex items-center gap-3">
                  <PremiumLogo size="50px" />
                  <div style={{ textAlign: "left" }}>
                    <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>Event</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>
                      Management System
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mx-auto">
                  <PremiumLogo size="40px" />
                </div>
              )}
              
              {/* Toggle button always visible */}
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/15 ${!sidebarOpen && "mx-auto mt-1"}`}
                aria-label="Toggle sidebar"
              >
                <Menu size={16} />
              </button>
            </div>

            {/* Profile Summary card in Sidebar */}
            <div className="px-4 pb-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-md">
                <div className="flex items-center gap-3">
                  <img
                    src={user.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"}
                    alt="Profile"
                    className="h-12 w-12 rounded-full border border-white/20 object-cover shrink-0"
                  />
                  {sidebarOpen && (
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate leading-tight">{user.name}</p>
                      <p className="text-xs text-blue-200/70 truncate mt-0.5">{user.designation}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span className="text-[10px] font-medium text-emerald-400">Online</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="px-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "text-blue-100/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="shrink-0" />
                      {sidebarOpen && <span>{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-600/90 text-white`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout button at the bottom */}
          <div className="px-3 pb-6">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-4 py-3 text-left text-sm font-semibold text-orange-300 transition hover:bg-white/10 hover:text-orange-200"
            >
              <LogOut size={18} className="shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        {/* --- Main Contents Area --- */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between shrink-0 shadow-sm">
            {/* Left section: breadcrumbs or dashboard greeting */}
            <div>
              {header.isDashboard ? (
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">{header.title}</h1>
                  <p className="text-sm text-slate-500 mt-0.5">{header.subtitle}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">{header.breadcrumb}</p>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">{header.title}</h1>
                </div>
              )}
            </div>

            {/* Right section: notifications, date and user dropdown */}
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigate("/staff/notifications")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <Bell size={18} />
                </button>
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center shadow">
                  2
                </span>
              </div>

              {/* Date Indicator */}
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700">
                <CalendarDays size={14} className="text-orange-500" />
                {getFormattedDate()}
              </div>

              {/* User Dropdown Profile Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img
                    src={user.photo || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80"}
                    alt="Rahul Avatar"
                    className="h-9 w-9 rounded-full border border-slate-200 object-cover"
                  />
                  <ChevronDown size={14} className={`text-slate-500 transition-transform ${profileDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5 z-30">
                    <Link
                      to="/staff/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <User size={14} />
                      My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Router Content Outlet */}
          <main className="flex-1 bg-slate-50 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
        
      </div>
    </div>
  );
}
