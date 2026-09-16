import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import {
  LayoutGrid,
  CalendarDays,
  CheckCircle,
  MapPin,
  Utensils,
  Gift,
  FileText,
  CreditCard,
  CheckSquare,
  LogOut,
  Phone,
  Heart,
  Users,
  Bell,
  Sparkles
} from "lucide-react";

import PremiumLogo from "../../../components/PremiumLogo/PremiumLogo";
import "../premium-dashboard.css";

const isActiveRoute = (item, pathname) => {
  if (item.path === pathname) return true;
  if (item.path === "/client/dashboard" && pathname === "/client") return true;
  if (item.subItems) {
    return item.subItems.some(sub => isActiveRoute(sub, pathname));
  }
  return false;
};

const validateSidebarNavigation = (targetPath) => {
  if (targetPath === "/client/event-type") {
    const eventDate = localStorage.getItem("booking_event_date");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/select-venue") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/decoration") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/guests") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/catering") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    const contactPhone = localStorage.getItem("booking_contact_phone");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
    if (!contactPhone) {
      alert("Please select the guest list options to proceed");
      return false;
    }
  }
  
  const additionalServicesPaths = [
    "/client/services",
    "/client/dj-service",
    "/client/transport-service",
    "/client/guest-rooms",
    "/client/stay-date-time"
  ];
  if (additionalServicesPaths.includes(targetPath)) {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    const contactPhone = localStorage.getItem("booking_contact_phone");
    const cateringComboName = localStorage.getItem("booking_catering_combo_name");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
    if (!contactPhone) {
      alert("Please select the guest list options to proceed");
      return false;
    }
    if (!cateringComboName) {
      alert("Please select the catering to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/summary") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    const contactPhone = localStorage.getItem("booking_contact_phone");
    const cateringComboName = localStorage.getItem("booking_catering_combo_name");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
    if (!contactPhone) {
      alert("Please select the guest list options to proceed");
      return false;
    }
    if (!cateringComboName) {
      alert("Please select the catering to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/payments") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    const contactPhone = localStorage.getItem("booking_contact_phone");
    const cateringComboName = localStorage.getItem("booking_catering_combo_name");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
    if (!contactPhone) {
      alert("Please select the guest list options to proceed");
      return false;
    }
    if (!cateringComboName) {
      alert("Please select the catering to proceed");
      return false;
    }
  }
  
  if (targetPath === "/client/confirmation") {
    const eventDate = localStorage.getItem("booking_event_date");
    const eventType = localStorage.getItem("booking_event_type_id");
    const venueName = localStorage.getItem("booking_venue_name");
    const decorationTotal = localStorage.getItem("booking_decoration_total");
    const contactPhone = localStorage.getItem("booking_contact_phone");
    const cateringComboName = localStorage.getItem("booking_catering_combo_name");
    if (!eventDate) {
      alert("Please select the date to proceed");
      return false;
    }
    if (!eventType) {
      alert("Please select the event type to proceed");
      return false;
    }
    if (!venueName) {
      alert("Please select the venue to proceed");
      return false;
    }
    if (!decorationTotal) {
      alert("Please select the decoration to proceed");
      return false;
    }
    if (!contactPhone) {
      alert("Please select the guest list options to proceed");
      return false;
    }
    if (!cateringComboName) {
      alert("Please select the catering to proceed");
      return false;
    }
  }
  
  return true;
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const menuItems = [
    { label: "Overview", icon: LayoutGrid, path: "/client/dashboard" },
    { label: "My Bookings", icon: FileText, path: "/client/my-bookings" },
    {
      label: "Book an event",
      icon: Sparkles,
      path: "/client/select-date",
      subItems: [
        { label: "Packages", icon: Sparkles, path: "/client/packages" },
        { label: "Select Date", icon: CalendarDays, path: "/client/select-date" },
        { label: "Event Type", icon: CheckCircle, path: "/client/event-type" },
        { label: "Expected Guests", icon: Users, path: "/client/expected-guests" },
        { label: "Select Venue", icon: MapPin, path: "/client/select-venue" },
        { label: "Decoration", icon: Utensils, path: "/client/decoration" },
        { label: "Catering", icon: Utensils, path: "/client/catering" },
        { 
          label: "Additional Services", 
          icon: Gift, 
          path: "/client/services",
          subItems: [
            { label: "Photography & Video", path: "/client/services" },
            { label: "DJ Service", path: "/client/dj-service" },
            { label: "Transport Service", path: "/client/transport-service" },
            { label: "Guest Rooms", path: "/client/guest-rooms" },
            { label: "Stay Date & Time", path: "/client/stay-date-time" }
          ]
        },
        { label: "Booking Summary", icon: FileText, path: "/client/summary" },
        { label: "Payment", icon: CreditCard, path: "/client/payments" },
        { label: "Confirmation", icon: CheckSquare, path: "/client/confirmation" },
      ]
    },
    { label: "Wishlist", icon: Heart, path: "/client/wishlist" },
    { label: "Notifications", icon: Bell, path: "/client/notifications", badge: "2" },
  ];

  useEffect(() => {
    // Check which parent menus contain the current active path and auto-expand them
    const newExpanded = { ...expandedMenus };
    let changed = false;
    
    const checkAndExpand = (items) => {
      items.forEach(item => {
        if (item.subItems) {
          const isChildActive = item.subItems.some(sub => isActiveRoute(sub, location.pathname));
          if (isChildActive && !expandedMenus[item.label]) {
            newExpanded[item.label] = true;
            changed = true;
          }
          checkAndExpand(item.subItems);
        }
      });
    };
    
    checkAndExpand(menuItems);
    if (changed) {
      setExpandedMenus(newExpanded);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderMenuItem = (item, depth = 0) => {
    const { label, icon: Icon, path, badge, subItems } = item;
    const isExpanded = expandedMenus[label];
    const isItemActive = isActiveRoute(item, location.pathname);

    if (subItems) {
      return (
        <li key={label} style={{ marginBottom: '4px' }}>
          <div
            onClick={(e) => {
              e.preventDefault();
              setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
              if (path) {
                if (validateSidebarNavigation(path)) {
                  navigate(path);
                }
              }
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              padding: depth === 0 ? '12px 16px' : '8px 16px 8px 8px', 
              color: isItemActive || isExpanded ? '#ffffff' : (depth === 0 ? '#cbd5e1' : '#cbd5e1'), 
              cursor: 'pointer',
              fontSize: depth === 0 ? '13px' : '12px', 
              fontWeight: depth === 0 ? '500' : '400', 
              borderRadius: depth === 0 ? '8px' : '6px', 
              background: depth === 0 && isExpanded ? 'rgba(255,255,255,0.05)' : (depth > 0 && isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent') 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {Icon ? (
                <Icon size={depth === 0 ? 18 : 14} style={{ marginRight: '12px', color: isItemActive || isExpanded ? (depth === 0 ? '#ffffff' : '#f97316') : '#cbd5e1' }} />
              ) : (
                <span style={{ 
                  width: '4px', 
                  height: '4px', 
                  borderRadius: '50%', 
                  backgroundColor: isItemActive || isExpanded ? '#f97316' : '#64748b',
                  marginRight: '8px'
                }}></span>
              )}
              {label}
              {badge && <span className="notification-badge">{badge}</span>}
            </div>
            {isExpanded ? <ChevronDown size={depth === 0 ? 16 : 14} style={{ color: isItemActive || isExpanded ? '#ffffff' : '#cbd5e1' }} /> : <ChevronRight size={depth === 0 ? 16 : 14} style={{ color: isItemActive || isExpanded ? '#ffffff' : '#cbd5e1' }} />}
          </div>
          {isExpanded && (
            <ul style={{ listStyle: 'none', padding: `4px 0 4px ${depth === 0 ? '16px' : '12px'}`, margin: 0 }}>
              {subItems.map(subItem => renderMenuItem(subItem, depth + 1))}
            </ul>
          )}
        </li>
      );
    }

    const isLinkActive = location.pathname === path;
    return (
      <li key={label} style={{ marginBottom: '2px' }}>
        <Link 
          to={path} 
          className={depth === 0 && isLinkActive ? "active-solid" : ""} 
          onClick={(e) => {
            if (!validateSidebarNavigation(path)) {
              e.preventDefault();
            }
          }}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: depth === 0 ? '12px 16px' : '8px 16px', 
            color: isLinkActive ? (depth === 0 ? '#ffffff' : '#f97316') : (depth === 0 ? '#cbd5e1' : '#94a3b8'), 
            textDecoration: 'none', 
            fontSize: depth === 0 ? '13px' : '12px', 
            fontWeight: isLinkActive ? '600' : '400',
            borderRadius: depth === 0 ? '8px' : '6px',
            background: depth === 0 && isLinkActive ? '#f97316' : (isLinkActive ? 'rgba(249, 115, 22, 0.1)' : 'transparent')
          }}
        >
          {Icon ? (
            <Icon size={depth === 0 ? 18 : 14} style={{ marginRight: '12px', color: isLinkActive ? (depth === 0 ? '#ffffff' : '#f97316') : '#94a3b8' }} />
          ) : (
            <span style={{ 
              width: '4px', 
              height: '4px', 
              borderRadius: '50%', 
              backgroundColor: isLinkActive ? '#f97316' : '#64748b',
              marginRight: '8px'
            }}></span>
          )}
          {label}
          {badge && <span className="notification-badge">{badge}</span>}
        </Link>
      </li>
    );
  };

  return (
    <aside className="premium-sidebar">
      <div className="sidebar-logo flex items-center gap-3" style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <PremiumLogo size="50px" />
        <div style={{ textAlign: "left" }}>
          <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>Event</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>
            Management System
          </p>
        </div>
      </div>

      <div style={{ padding: "0 16px", color: "#64748b", fontSize: "10px", fontWeight: "700", letterSpacing: "1px", marginBottom: "8px" }}>
        CLIENT MODULE
      </div>

      <ul className="premium-menu">
        {menuItems.map(item => renderMenuItem(item, 0))}
      </ul>

      <div className="sidebar-support" style={{ margin: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h4 style={{ color: "#f97316", fontSize: "13px", margin: "0 0 4px", fontWeight: "600" }}>Need Help?</h4>
        <p style={{ color: "white", fontSize: "11px", margin: "0 0 12px" }}>Call us anytime</p>
        <div className="contact-item" style={{ display: "flex", alignItems: "center", fontSize: "12px", color: "white", fontWeight: "600" }}>
          <Phone size={14} style={{ marginRight: "8px", color: "#f97316" }} />
          +91 98765 43210
        </div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#cbd5e1', textDecoration: 'none', fontSize: '13px', fontWeight: '500', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: "1px solid rgba(255,255,255,0.05)" }}>
          <LogOut size={18} style={{ marginRight: '12px' }} />
          Logout
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;