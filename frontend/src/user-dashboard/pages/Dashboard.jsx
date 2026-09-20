import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle,
  CreditCard,
  MessageSquare,
  Users,
  Utensils,
  Crown,
  ChevronRight,
  MapPin,
  Clock,
  Bot,
  Sparkles
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import { getClientDisplayName, getCurrentClient } from "../services/clientSession";
import { getBookings } from "../services/userApi";
import FeaturedOfferPackages from "../../components/FeaturedOfferPackages";
import RobotAssistantImg from "../../assets/robot-assistant.jpg";

import "../styles/premium-dashboard.css";
import "../styles/Decoration.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const [bookings, setBookings] = useState([]);
  const [robotImgError, setRobotImgError] = useState(false);
  const userId = currentClient.id || currentClient._id || currentClient.userId || "";

  useEffect(() => {
    const savedLocal = (() => {
      try {
        return JSON.parse(localStorage.getItem("client_bookings") || "[]");
      } catch {
        return [];
      }
    })();

    getBookings(userId)
      .then((data) => {
        const apiData = Array.isArray(data) ? data : [];
        const map = new Map();
        [...savedLocal, ...apiData].forEach(item => {
          const key = String(item.id || item._id || item.eventTitle);
          if (!map.has(key)) map.set(key, item);
        });
        setBookings(Array.from(map.values()));
      })
      .catch(() => {
        setBookings(savedLocal);
      });
  }, [userId]);

  const storedVenueImage = localStorage.getItem("booking_venue_image");
  const storedVenueName = localStorage.getItem("booking_venue_name");

  const formatDate = (dateString) => {
    if (!dateString) return "17 Jul 2026";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const upcomingBookings = React.useMemo(() => {
    let list = bookings.map(b => ({
      id: b.id || b._id,
      title: b.eventTitle || b.title || b.event_type || "Selected Event",
      date: formatDate(b.event_date || b.eventDate || b.date),
      rawDate: b.event_date || b.eventDate || b.date || new Date().toISOString(),
      status: b.status || "Approved",
      venueName: storedVenueName || b.venueName || b.venue_name || b.location || "Royal Celebration Hall, Banjara Hills",
      guests: b.guests || b.catering_details?.guest_count || 250,
      eventType: b.event_type || b.eventType || "Event",
      catering: b.cateringPackage || b.catering_details?.type || "Veg & Non-Veg Buffet",
      totalAmount: b.total_cost || b.amount || 277365,
      image: storedVenueImage || b.venueImg || b.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
    }));

    if (list.length === 0) {
      list.push({
        id: "mock1",
        title: "Shree's Birthday Party Celebration",
        date: "17 Jul 2026",
        rawDate: "2026-07-17T00:00:00Z",
        status: "Approved",
        venueName: storedVenueName || "Royal Celebration Hall, Banjara Hills",
        guests: 250,
        eventType: "Birthday Party",
        catering: "Veg & Non-Veg Royal Buffet",
        totalAmount: 277365,
        image: storedVenueImage || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
      });
      list.push({
        id: "mock2",
        title: "Kids Theme Birthday Party",
        date: "10 Sep 2026",
        rawDate: "2026-09-10T00:00:00Z",
        status: "Pending",
        venueName: "Grand Ball Room, Koramangala",
        guests: 120,
        eventType: "Birthday Party",
        catering: "Kids Menu & Snacks",
        totalAmount: 45000,
        image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80"
      });
    }

    const now = new Date().getTime();
    let futureEvents = list.filter(event => new Date(event.rawDate).getTime() >= now);
    
    if (futureEvents.length > 0) {
      // Sort ascending so the closest future event is first
      futureEvents.sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
      return futureEvents.slice(0, 2);
    } else {
      // Fallback: Sort by event date descending (most recent past first)
      list.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
      return list.slice(0, 2);
    }
  }, [bookings, storedVenueName, storedVenueImage]);

  const [countdown, setCountdown] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);

  useEffect(() => {
    const confirmedEvents = upcomingBookings.filter(b => b.status === "Approved" || b.status === "Confirmed");
    const now = new Date();
    
    let closest = null;
    let minDiff = Infinity;

    confirmedEvents.forEach(b => {
      const eventDate = new Date(b.date);
      // set to end of day so it remains active on the day of the event
      eventDate.setHours(23, 59, 59, 999); 
      const diff = eventDate.getTime() - now.getTime();
      
      // Look for the closest future event (or event happening today)
      if (diff > 0 && diff < minDiff) { 
        closest = b;
        minDiff = diff;
      }
    });

    setNextEvent(closest);

    if (!closest) {
      setCountdown(null);
      return;
    }

    const targetTime = new Date(closest.date).getTime();

    const updateCountdown = () => {
      const currentTime = new Date().getTime();
      const difference = targetTime - currentTime;

      if (difference <= 0) {
        setCountdown({ finished: true });
      } else {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          finished: false
        });
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [upcomingBookings]);

  const recentActivities = React.useMemo(() => {
    if (!bookings || bookings.length === 0) {
      return [
        {
          id: 'dummy1',
          icon: <CreditCard size={16}/>,
          color: 'green',
          text: <>Your payment of <strong>₹1,36,346</strong> was received</>,
          time: '2 hours ago'
        },
        {
          id: 'dummy2',
          icon: <CalendarDays size={16}/>,
          color: 'purple',
          text: <>Your booking for <strong>Anjali & Rohan Wedding</strong> is confirmed</>,
          time: '1 day ago'
        },
        {
          id: 'dummy3',
          icon: <MessageSquare size={16}/>,
          color: 'yellow',
          text: <>You submitted feedback for <strong>Riya's Birthday Party</strong></>,
          time: '3 days ago'
        }
      ];
    }
    
    const timeAgo = (dateStr) => {
      if (!dateStr) return 'recently';
      const diff = Date.now() - new Date(dateStr).getTime();
      if (isNaN(diff)) return 'recently';
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    };

    const sorted = [...bookings].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.created_at || a.eventDate || a.event_date || Date.now());
      const dateB = new Date(b.createdAt || b.created_at || b.eventDate || b.event_date || Date.now());
      return dateB - dateA;
    });

    return sorted.slice(0, 3).map((b, i) => {
      const isConfirmed = b.status === 'Approved' || b.status === 'Confirmed';
      const eventName = b.eventTitle || b.title || b.event_type || 'Event';
      
      return {
        id: b.id || b._id || `act-${i}`,
        icon: <CalendarDays size={16}/>,
        color: isConfirmed ? 'green' : 'purple',
        text: <>Your booking for <strong>{eventName}</strong> is {isConfirmed ? 'confirmed' : 'pending'}</>,
        time: timeAgo(b.createdAt || b.created_at)
      };
    });
  }, [bookings]);

  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar />
        
        <div className="premium-content-scroll" style={{ paddingBottom: "60px" }}>
          
          <div className="welcome-banner" style={{ background: "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat", padding: "40px", borderRadius: "16px", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(to right, rgba(255,255,255,0.95) 40%, rgba(255,255,255,0.4) 100%)" }}></div>
            <div className="welcome-content" style={{ position: "relative", zIndex: 1 }}>
              <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#0f172a", marginBottom: "8px" }}>Welcome back, {clientName}! 👋</h2>
              <p style={{ color: "#475569", fontSize: "14px" }}>Here's what's happening with your events & budget-friendly packages.</p>
            </div>
            <div className="hidden md:block" style={{ position: "absolute", right: "20px", top: "20px", zIndex: 1 }}>
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=300&q=80" alt="Event Special" style={{ width: "200px", borderRadius: "12px", border: "4px solid white", transform: "rotate(3deg)", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
            </div>
          </div>
            
          <div className="kpi-grid">
            {/* Total Bookings */}
            <div className="kpi-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div>
                <div className="kpi-header">
                  <div className="kpi-icon purple" style={{ background: "#f3e8ff", color: "#9333ea", padding: "8px", borderRadius: "8px" }}>
                    <CalendarDays size={20} />
                  </div>
                </div>
                <div className="kpi-title" style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>Total Bookings</div>
                <div className="kpi-value" style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "4px" }}>8</div>
              </div>
              <Link to="/client/my-bookings" className="kpi-link" style={{ color: "#3b82f6", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", marginTop: "12px", textDecoration: "none" }}>View All Bookings <ChevronRight size={14} /></Link>
            </div>

            {/* Confirmed Bookings */}
            <div className="kpi-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div>
                <div className="kpi-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div className="kpi-icon green" style={{ background: "#dcfce7", color: "#16a34a", padding: "8px", borderRadius: "8px" }}>
                    <CheckCircle size={20} />
                  </div>
                  <span className="kpi-badge" style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" }}>↑ 12%</span>
                </div>
                <div className="kpi-title" style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>Confirmed Bookings</div>
                <div className="kpi-value" style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "4px" }}>5</div>
              </div>
              <Link to="/client/my-bookings" className="kpi-link" style={{ color: "#3b82f6", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", marginTop: "12px", textDecoration: "none" }}>View Confirmed <ChevronRight size={14} /></Link>
            </div>

            {/* Total Spent */}
            <div className="kpi-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div>
                <div className="kpi-header">
                  <div className="kpi-icon orange" style={{ background: "#ffedd5", color: "#ea580c", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", fontWeight: "bold" }}>
                    <span>₹</span>
                  </div>
                </div>
                <div className="kpi-title" style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>Total Spent</div>
                <div className="kpi-value" style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "4px" }}>₹ 8,45,250</div>
              </div>
              <Link to="/client/payments" className="kpi-link" style={{ color: "#3b82f6", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", marginTop: "12px", textDecoration: "none" }}>View Payments <ChevronRight size={14} /></Link>
            </div>

            {/* Average Rating */}
            <div className="kpi-card" style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div>
                <div className="kpi-header">
                  <div className="kpi-icon blue" style={{ background: "#dbeafe", color: "#2563eb", padding: "8px", borderRadius: "8px" }}>
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div className="kpi-title" style={{ fontSize: "13px", color: "#64748b", marginTop: "12px" }}>Average Rating</div>
                <div className="kpi-value" style={{ fontSize: "24px", fontWeight: "bold", color: "#0f172a", marginTop: "4px" }}>4.5 / 5</div>
              </div>
              <Link to="/client/feedback" className="kpi-link" style={{ color: "#3b82f6", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "600", marginTop: "12px", textDecoration: "none" }}>View Reviews <ChevronRight size={14} /></Link>
            </div>
          </div>

          {/* Full Width Smart Assistant Banner */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", marginBottom: "24px", padding: "32px", borderRadius: "16px", border: "1px solid #ffedd5", background: "linear-gradient(90deg, #fff7ed 0%, #fff7ed 50%, #e0f2fe 100%)", boxShadow: "0 4px 15px -3px rgba(234, 88, 12, 0.15)", position: "relative" }}>
            
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "24px", width: "100%", flex: "1 1 50%", minWidth: "300px" }}>
              <div style={{ width: "160px", height: "160px", flexShrink: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {robotImgError ? (
                  <div style={{ width: "140px", height: "140px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 25px -5px rgba(234,88,12,0.3)" }}>
                    <Bot size={80} color="#ea580c" strokeWidth={1.5} />
                  </div>
                ) : (
                  <img 
                    src={RobotAssistantImg} 
                    alt="AI Assistant" 
                    style={{ width: "160%", height: "auto", objectFit: "contain", transform: "scale(1.2)", mixBlendMode: "multiply", filter: "contrast(1.1)" }}
                  />
                )}
              </div>
              
              <div style={{ position: "relative", zIndex: 10, flex: "1 1 300px" }}>
                <div style={{ background: "#ffedd5", color: "#ea580c", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Crown size={12} fill="#ea580c" /> AI Event Assistant
                </div>
                <h3 style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>Smart <span style={{ color: "#ea580c" }}>Event Assistant</span></h3>
                <p style={{ fontSize: "14px", color: "#475569", marginBottom: "20px", lineHeight: "1.5", maxWidth: "90%" }}>
                  Plan your perfect event with our AI-powered assistant.
                </p>
                
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                  <span style={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}>
                    <CheckCircle size={16} fill="#ea580c" color="white" /> Find venues & services
                  </span>
                  <span style={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}>
                    <CheckCircle size={16} fill="#ea580c" color="white" /> Compare options
                  </span>
                  <span style={{ fontSize: "13px", color: "#475569", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}>
                    <CheckCircle size={16} fill="#ea580c" color="white" /> Stay within your budget
                  </span>
                </div>

                <div className="hidden sm:inline-block" style={{ position: "relative", marginRight: "140px" }}>
                  <Link 
                    to="/client/smart-assistant" 
                    style={{ 
                      background: "#ea580c", 
                      color: "white", 
                      padding: "12px 28px", 
                      borderRadius: "50px", 
                      fontWeight: "bold", 
                      fontSize: "15px", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "8px",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)",
                      transition: "transform 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <MessageSquare size={18} /> Start Chatting <ChevronRight size={18} strokeWidth={3} />
                  </Link>
                  <div style={{ position: "absolute", left: "100%", marginLeft: "15px", top: "5px", transform: "rotate(-8deg)", fontFamily: "'Caveat', cursive, sans-serif", fontSize: "18px", color: "#2563eb", fontWeight: "600", whiteSpace: "nowrap", lineHeight: "1.1" }}>
                    Let's plan<br/>something amazing!
                  </div>
                </div>
                {/* Mobile version without the overlapping text */}
                <div className="inline-block sm:hidden">
                  <Link 
                    to="/client/smart-assistant" 
                    style={{ 
                      background: "#ea580c", 
                      color: "white", 
                      padding: "12px 28px", 
                      borderRadius: "50px", 
                      fontWeight: "bold", 
                      fontSize: "15px", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "8px",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(234, 88, 12, 0.3)"
                    }}
                  >
                    <MessageSquare size={18} /> Start Chatting <ChevronRight size={18} strokeWidth={3} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions Side */}
            <div style={{ width: "100%", flex: "1 1 35%", minWidth: "300px" }}>
              <div style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#eab308", fontSize: "18px" }}>⚡</span> Quick Actions
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
                {[
                  { icon: "🏛️", text: "Find a wedding hall", color: "#9333ea", bg: "#f3e8ff" },
                  { icon: "₹", text: "Plan within ₹2 lakh", color: "#16a34a", bg: "#dcfce7" },
                  { icon: "🍽️", text: "Show food options", color: "#ca8a04", bg: "#fef9c3" },
                  { icon: "🌸", text: "Show decoration options", color: "#db2777", bg: "#fce7f3" },
                  { icon: "🏷️", text: "Make my plan cheaper", color: "#4f46e5", bg: "#e0e7ff" },
                  { icon: "📍", text: "Find available venues", color: "#2563eb", bg: "#dbeafe" },
                  { icon: "📋", text: "Plan a complete event", color: "#0d9488", bg: "#ccfbf1" },
                  { icon: "🎁", text: "Show event packages", color: "#7c3aed", bg: "#ede9fe" }
                ].map((action, i) => (
                  <button key={i} onClick={() => navigate('/client/smart-assistant')} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "rgba(255, 255, 255, 0.9)", border: "1px solid white", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", width: "100%", textAlign: "left" }} onMouseOver={(e) => { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)"; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = "white"; e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.02)"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", background: action.bg, color: action.color, fontSize: "14px" }}>{action.icon}</span>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#334155", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{action.text}</span>
                    </div>
                    <ChevronRight size={14} color="#94a3b8" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EVENT COUNTDOWN BLOCK */}
          {nextEvent && (
            <div className="countdown-wrapper mb-8 mx-0 sm:mx-8">
              <div className="countdown-card" style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", padding: "24px", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)", position: "relative", overflow: "hidden" }}>
                
                <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "150px", height: "150px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
                <div style={{ position: "absolute", bottom: "-30px", left: "-30px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>

                <div className="flex flex-col md:flex-row justify-between items-center relative z-10 gap-6">
                  <div className="flex-1 w-full text-center md:text-left">
                    <div className="text-orange-400 font-semibold mb-1 flex items-center justify-center md:justify-start gap-2">
                      <Clock size={16}/> 🎉 Your Upcoming Event
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{nextEvent.title}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-gray-300 text-sm">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {nextEvent.venueName}</span>
                      <span className="flex items-center gap-1"><CalendarDays size={14}/> {nextEvent.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full flex flex-col items-center md:items-end">
                    {countdown && !countdown.finished ? (
                      <>
                        <div className="text-gray-300 text-sm mb-2">{countdown.days > 0 ? `${countdown.days} Days Left` : 'Happening Soon!'}</div>
                        <div className="flex gap-4 text-center">
                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[70px]">
                            <div className="text-3xl font-bold text-white">{String(countdown.days).padStart(2, '0')}</div>
                            <div className="text-xs text-orange-300 uppercase tracking-wider">Days</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[70px]">
                            <div className="text-3xl font-bold text-white">{String(countdown.hours).padStart(2, '0')}</div>
                            <div className="text-xs text-orange-300 uppercase tracking-wider">Hours</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[70px]">
                            <div className="text-3xl font-bold text-white">{String(countdown.minutes).padStart(2, '0')}</div>
                            <div className="text-xs text-orange-300 uppercase tracking-wider">Mins</div>
                          </div>
                          <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[70px]">
                            <div className="text-3xl font-bold text-white">{String(countdown.seconds).padStart(2, '0')}</div>
                            <div className="text-xs text-orange-300 uppercase tracking-wider">Secs</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-4 rounded-xl flex items-center gap-3">
                        <CheckCircle size={24} />
                        <div className="text-lg font-bold">Event Completed</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FEATURED OFFER PACKAGES SECTION ⭐ */}
          <FeaturedOfferPackages
            title="Featured Offer Packages ⭐"
            subtitle="🎉 Special Event Packages - View details, select recommended or custom venue, and book in a few clicks"
          />

          <div className="premium-dashboard-grid">
            <div className="grid-left">
              
              <div>
                <div className="section-title">
                  My Upcoming & Recent Bookings
                  <Link to="/client/my-bookings">View All Bookings <ChevronRight size={14} /></Link>
                </div>
                
                <div className="bookings-horizontal-list">
                  {upcomingBookings.map((booking, idx) => (
                    <div className="booking-card-hz" key={booking.id || idx}>
                      <div className="booking-card-image" style={{backgroundImage: `url(${booking.image || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'})`}}>
                        <div className={`booking-status-badge ${booking.status === 'Approved' ? 'status-confirmed' : 'status-pending'}`}>
                          {booking.status === 'Approved' ? 'Confirmed' : booking.status}
                        </div>
                      </div>
                      
                      <div className="booking-card-content">
                        <h3>{booking.title || booking.eventTitle}</h3>
                        <p>{booking.venueName || booking.location}</p>
                        
                        <div className="booking-details-grid">
                          <div className="detail-item"><CalendarDays size={12}/> {booking.date || "17 Jul 2026"}</div>
                          <div className="detail-item"><Users size={12}/> {booking.guests || 100} Guests</div>
                        </div>
                        
                        <div className="detail-item" style={{marginBottom: "16px"}}><Utensils size={12}/> Catering: {booking.catering || "Not selected"}</div>
                        
                        <div className="booking-card-footer">
                          <div>
                            <span className="amount-label">Total Amount</span>
                            <span className="amount-val">₹ {(booking.totalAmount || 0).toLocaleString()}</span>
                          </div>
                          <button className="btn-outline">View Details <ChevronRight size={12} style={{display: "inline", verticalAlign: "middle"}}/></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>



            </div>

            <div className="grid-right">
              <div className="highlight-package">
                <div className="highlight-title"><Crown size={16}/> Highlight Package</div>
                <img className="highlight-image" src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80" alt="Royal Wedding" />
                <h4>Royal Wedding Package</h4>
                <p>Premium wedding package with decoration, catering, and additional services.</p>
                
                <ul className="package-features">
                  <li><CheckCircle size={14} /> Luxury Decoration</li>
                  <li><CheckCircle size={14} /> Premium Catering (Veg & Non-Veg)</li>
                  <li><CheckCircle size={14} /> Photography & Videography</li>
                  <li><CheckCircle size={14} /> DJ, Lighting & More</li>
                </ul>
                
                <div className="package-footer">
                  <div className="package-price"><span>From</span> ₹ 5,50,000</div>
                  <button className="btn-outline" onClick={() => navigate("/client/browse-events")}>View All Packages</button>
                </div>
              </div>



            </div>
          </div>

          <div className="bottom-panels">
            <div className="activity-panel">
              <div className="section-title">
                Recent Activity
                <Link to="#">View All <ChevronRight size={14} /></Link>
              </div>
              
              <div className="activity-list">
                {recentActivities.map((act) => (
                  <div className="activity-item" key={act.id}>
                    <div className={`activity-icon ${act.color}`}>{act.icon}</div>
                    <div className="activity-text">{act.text}</div>
                    <div className="activity-time">{act.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="feedback-panel">
              <div className="section-title">
                Feedback Summary
                <Link to="#">View All <ChevronRight size={14} /></Link>
              </div>
              
              <div className="feedback-summary">
                <div className="rating-big">
                  <h2>4.8</h2>
                  <div className="stars">★★★★★</div>
                  <p>Based on 3 Feedbacks</p>
                </div>
                
                <div className="rating-bars">
                  <div className="bar-row">5 ★ <div className="bar-track"><div className="bar-fill" style={{width: '66%'}}></div></div> 2</div>
                  <div className="bar-row">4 ★ <div className="bar-track"><div className="bar-fill" style={{width: '33%'}}></div></div> 1</div>
                  <div className="bar-row">3 ★ <div className="bar-track"></div> 0</div>
                  <div className="bar-row">2 ★ <div className="bar-track"></div> 0</div>
                  <div className="bar-row">1 ★ <div className="bar-track"></div> 0</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;