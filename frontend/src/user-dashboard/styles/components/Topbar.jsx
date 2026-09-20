import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Calendar, 
  Search, 
  Bell, 
  LayoutGrid, 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Users, 
  MapPin, 
  Utensils, 
  Gift, 
  CreditCard, 
  Heart, 
  ShieldCheck 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getClientDisplayName,
  getCurrentClient,
} from "../../services/clientSession";
import { io } from "socket.io-client";

const Topbar = ({ title = "Client Overview", subtitle, actions = null, hideNotifications = false }) => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const clientInitial = clientName.trim().charAt(0).toUpperCase() || "C";
  const clientPhoto = typeof currentClient.photo === "string" ? currentClient.photo.trim() : "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();

  const navTabs = [
    { label: "Overview", icon: LayoutGrid, path: "/client/dashboard" },
    { label: "Book Event", icon: Sparkles, path: "/client/select-date" },
    { label: "Select Date", icon: Calendar, path: "/client/select-date" },
    { label: "Event Type", icon: CheckCircle, path: "/client/event-type" },
    { label: "Guests", icon: Users, path: "/client/expected-guests" },
    { label: "Venue", icon: MapPin, path: "/client/select-venue" },
    { label: "Decoration", icon: Utensils, path: "/client/decoration" },
    { label: "Catering", icon: Utensils, path: "/client/catering" },
    { label: "Services", icon: Gift, path: "/client/services" },
    { label: "My Bookings", icon: FileText, path: "/client/my-bookings" },
    { label: "Payments", icon: CreditCard, path: "/client/payments" },
    { label: "Wishlist", icon: Heart, path: "/client/wishlist" },
    { label: "Admin Portal", icon: ShieldCheck, path: "/admin-login" },
  ];

  useEffect(() => {
    fetchUnreadNotificationsCount();

    const userId = currentClient?.id || currentClient?._id;
    if (!userId) return;

    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      socket.emit("join", userId.toString());
    });

    socket.on("new_notification", () => {
      fetchUnreadNotificationsCount();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchUnreadNotificationsCount = async () => {
    try {
      const userId = currentClient?.id || currentClient?._id;
      const res = await fetch(`http://localhost:5000/api/notifications/${userId}?role=Client`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const unread = data.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      // Default to 2 for visual unread alert indicator
    }
  };

  // Format current date like "18 June 2026"
  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/client/browse-venues', { state: { prefilter: searchQuery } });
    }
  };

  return (
    <div className="premium-topbar-wrapper">
      <div className="premium-topbar">
        <div className="topbar-left">
          <Menu 
            className="hamburger cursor-pointer" 
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-ems-sidebar'))}
            title="Open Navigation Menu"
          />
          <h1>{title}</h1>
        </div>

        <div className="topbar-center" style={{ flex: 1, padding: "0 20px" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: "20px", padding: "6px 16px", maxWidth: "400px", margin: "0 auto" }}>
            <Search size={16} color="#64748b" style={{ marginRight: "8px" }} />
            <input 
              type="text" 
              placeholder="Search venues, events..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", width: "100%", fontSize: "14px", color: "#334155" }}
            />
          </form>
        </div>

        <div className="topbar-right" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {actions && <div className="topbar-actions">{actions}</div>}

          {/* NOTIFICATION BELL BUTTON AT THE TOP OF ALL CLIENT PAGES */}
          {!hideNotifications && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/client/notifications');
              }}
              title="Open Notification Center"
              style={{
                position: "relative",
                border: "1px solid #fbcfe8",
                background: "#ffffff",
                borderRadius: "50%",
                width: "42px",
                height: "42px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ec4899",
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                boxShadow: "0 4px 12px rgba(236, 72, 153, 0.15)",
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.background = "#fdf2f8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.background = "#ffffff";
              }}
            >
              <Bell size={20} className="text-pink-500" />
              {unreadCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  background: "#ec4899",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "900",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  border: "2px solid #ffffff",
                  boxShadow: "0 2px 6px rgba(236, 72, 153, 0.4)"
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          )}

          <div className="topbar-date">
            <Calendar size={16} />
            {formattedDate}
          </div>

          <div className="topbar-profile" onClick={() => navigate('/client/profile')} style={{ cursor: "pointer" }}>
            {clientPhoto ? (
              <div className="avatar">
                <img src={clientPhoto} alt={clientName} style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} />
              </div>
            ) : (
              <div className="avatar">
                {clientInitial}
              </div>
            )}
            <span className="name">{clientName}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: "#64748b"}}>
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SCROLLABLE TAB BAR IN HEADER SECTION */}
      <div className="header-nav-tabs">
        {navTabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === "/client/dashboard" && location.pathname === "/client");
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => navigate(tab.path)}
              className={`header-nav-tab-btn ${isActive ? "active" : ""}`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Topbar;