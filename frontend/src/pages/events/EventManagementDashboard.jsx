import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Users,
  HelpCircle,
  LogOut,
  Plus,
  Eye,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import "../../styles/unified-dashboard.css";

function EventManagementDashboard({ embedded = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminView = embedded || location.pathname.startsWith("/admin");
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const user = localStorage.getItem("loggedInUser") || localStorage.getItem("user");

    // 🛡️ Secure Authentication Redirect
    if (!token) {
      navigate("/login?from=event-management");
      return;
    }

    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Fixed close click handler to route administrators directly back to the main admin control console dashboard
  const handleCloseSidebar = () => {
    navigate("/admin/dashboard");
  };

  const handleCreateNewEvent = () => {
    navigate("/user/create-event");
  };

  // Helper flag to check if we are on the base route or the sub-dashboard path
  const isBaseDashboard =
    isAdminView ||
    location.pathname === "/user/event-management" ||
    location.pathname === "/user/event-management/" ||
    location.pathname === "/user/event-management/dashboard";

  // Helper flag to handle active styles for the Help Centre route
  const isHelpCentreActive = location.pathname === "/user/event-management/help-centre";

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--color-bg-main)" }}>
      {/* --- Sidebar Navigation Framework --- */}
      <div className="sidebar-unified">
        <div className="sidebar-content-unified">
          <div className="logo-section-unified">
            <div>
              <h2>EMS</h2>
              <p>Event Managements</p>
            </div>

            <button type="button" aria-label="Close sidebar" onClick={handleCloseSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 18, fontWeight: 'bold' }}>×</span>
            </button>
          </div>

          <nav className="menu-unified">
            {[
              { path: "dashboard", label: "Dashboard", icon: "📊" },
              { path: "events", label: "Events", icon: "📅" },
              { path: "resources", label: "Resources", icon: "👥" },
              { path: "categories", label: "Categories", icon: "🏷️" },
              { path: "calendar", label: "Calendar", icon: "📅" },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={`/user/event-management/${item.path}`}
                className={({ isActive }) =>
                  `menu-item-unified ${isActive || (item.path === "dashboard" && isBaseDashboard)
                    ? "menu-item-active"
                    : ""
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {!isAdminView && (
          <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.12)", paddingTop: "16px" }}>
            <NavLink
              to="/user/event-management/help-centre"
              className={`menu-item-unified ${isHelpCentreActive ? "menu-item-active" : ""}`}
            >
              <HelpCircle size={18} style={{ marginRight: "12px" }} />
              Help Center
            </NavLink>

            <button
              onClick={handleLogout}
              className="logout-unified"
              style={{ width: "100%" }}
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        )}
      </div>

      {/* --- Main Sub-Router Layout View Panel --- */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        {/* Top Header Control Strip */}
        <div className="topbar-unified">
          <div>
            <h1>{userData ? `${userData.name}'s Workspace` : "Organization Workspace"}</h1>
            <p>Operational performance for Q3 2026</p>
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <button className="btn-secondary-unified">
              Export Report
            </button>
            <button
              onClick={handleCreateNewEvent}
              className="btn-primary-unified"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Plus size={20} />
              New Event
            </button>
          </div>
        </div>

        {/* Dynamic Display Portal Container */}
        <div style={{ flex: 1 }}>
          {isBaseDashboard ? (
            <DashboardOverview
              events={events}
              handleCreateNewEvent={handleCreateNewEvent}
              navigate={navigate}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
    Secondary Sub-Component: Base Dashboard Metrics and Reports Visuals
   ========================================================================== */
function DashboardOverview({ events, handleCreateNewEvent, navigate }) {
  const revenueData = [
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
  ];

  const completedEvents = events.filter(e => e.status === "Completed").length;

  return (
    <div style={{ padding: "32px", animation: "fadeIn 0.3s ease-in" }}>
      {/* Metric Cards Grid Layout */}
      <div className="stats-grid-unified" style={{ marginBottom: "32px" }}>
        <div className="stats-card-unified">
          <div className="stats-icon-unified stats-icon-blue">
            <Calendar size={32} />
          </div>
          <div>
            {/* Wiped out dynamic logic to guarantee absolute zero display */}
            <h2>0</h2>
            <p>Upcoming Events</p>
          </div>
        </div>

        <div className="stats-card-unified">
          <div className="stats-icon-unified" style={{ background: "#e0e7ff", color: "#6366f1" }}>
            <Clock size={32} />
          </div>
          <div>
            <h2>{events.filter(e => e.status === "Ongoing").length}</h2>
            <p>Ongoing Today</p>
          </div>
        </div>

        <div className="stats-card-unified">
          <div className="stats-icon-unified stats-icon-green">
            <Users size={32} />
          </div>
          <div>
            <h2>{completedEvents}</h2>
            <p>Completed YTD</p>
          </div>
        </div>

        <div className="stats-card-unified">
          <div className="stats-icon-unified stats-icon-orange">
            <TrendingUp size={32} />
          </div>
          <div>
            <h2>0.00</h2>
            <p>Avg. Client Rating</p>
          </div>
        </div>
      </div>

      {/* Analytical Charts and Summary Breakdown Grid */}
      <div className="dashboard-grid-unified" style={{ marginBottom: "32px", gridTemplateColumns: "2fr 1fr" }}>
        <div className="panel-unified">
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "8px" }}>Revenue Performance</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "8px" }}>
              <span style={{ fontSize: "28px", fontWeight: "700", color: "var(--color-text-primary)" }}>0.00  </span>
              <span style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>Last 6 months</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{
          background: "linear-gradient(to bottom right, #0f1624, #1a2a47)",
          border: "1px solid #1a2a47",
          borderRadius: "8px",
          padding: "24px",
          boxShadow: "0 8px 28px rgba(15, 23, 42, 0.05)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between"
        }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "var(--color-secondary-orange)" }}>Quick Insight</h3>
            <p style={{ fontSize: "13px", color: "var(--color-sidebar-text)" }}>
              💡 No significant trends logged yet. Performance indicators dynamically adapt as active events get requested and processed across the system reference gateways.
            </p>
          </div>
          <button className="btn-primary-unified" style={{ width: "100%", marginTop: "24px" }}>
            View Sales Report
          </button>
        </div>
      </div>

      {/* Active Portfolio Data-Table Summary */}
      <div className="panel-unified">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-text-primary)" }}>Current Portfolio</h3>
          <button
            onClick={() => navigate("/client/dashboard")}
            className="btn-secondary-unified"
            style={{ background: "transparent", border: "none", color: "var(--color-primary-orange)", padding: "0" }}
          >
            View All
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", color: "var(--color-text-secondary)", fontSize: "13px" }}>Event Name</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", color: "var(--color-text-secondary)", fontSize: "13px" }}>Category</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", color: "var(--color-text-secondary)", fontSize: "13px" }}>Date</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", color: "var(--color-text-secondary)", fontSize: "13px" }}>Status</th>
                <th style={{ textAlign: "left", padding: "12px 16px", fontWeight: "600", color: "var(--color-text-secondary)", fontSize: "13px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 3).map((event, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "16px", color: "var(--color-text-primary)", fontWeight: "600" }}>{event.title}</td>
                  <td style={{ padding: "16px", color: "var(--color-text-secondary)" }}>{event.category}</td>
                  <td style={{ padding: "16px", color: "var(--color-text-secondary)" }}>
                    {new Date(event.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      padding: "6px 12px",
                      borderRadius: "9999px",
                      fontSize: "12px",
                      fontWeight: "600",
                      background: event.status === "Planning"
                        ? "#fed7aa"
                        : event.status === "Scheduled"
                          ? "#bfdbfe"
                          : event.status === "Ongoing"
                            ? "#bbf7d0"
                            : "#e5e7eb",
                      color: event.status === "Planning"
                        ? "#b45309"
                        : event.status === "Scheduled"
                          ? "#1e40af"
                          : event.status === "Ongoing"
                            ? "#065f46"
                            : "#6b7280"
                    }}>
                      {event.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <button
                      onClick={() => navigate(`/user/event-dashboard/${event._id}`)}
                      style={{
                        color: "var(--color-primary-orange)",
                        background: "transparent",
                        border: "none",
                        fontWeight: "600",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {events.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 32px" }}>
              <AlertCircle style={{ margin: "0 auto 8px", color: "#d1d5db" }} size={48} />
              <p style={{ color: "var(--color-text-secondary)" }}>No events created yet</p>
              <button
                onClick={handleCreateNewEvent}
                style={{
                  color: "var(--color-primary-orange)",
                  background: "transparent",
                  border: "none",
                  fontWeight: "600",
                  marginTop: "8px",
                  cursor: "pointer"
                }}
              >
                Create your first event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventManagementDashboard;