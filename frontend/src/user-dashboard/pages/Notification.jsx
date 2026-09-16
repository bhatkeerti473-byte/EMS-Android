import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MessageSquare,
  Sparkles,
  Eye,
  X,
  Building,
  Wrench,
  User,
  Download,
  Receipt,
  ArrowLeft
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import {
  getClientDisplayName,
  getCurrentClient,
} from "../services/clientSession";
import { io } from "socket.io-client";
import "../styles/dashboard.css";

const categoryList = [
  "All",
  "Unread",
  "Booking",
  "Payment",
  "Event",
  "Venue",
  "Service",
  "Staff",
  "Vendor",
  "Task",
  "Reminder",
  "System"
];



const Notification = () => {
  const navigate = useNavigate();
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);

  const [activeCategory, setActiveCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClientNotifications();

    const userId = currentClient?.id || currentClient?._id;
    if (!userId) return;

    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      socket.emit("join", userId.toString());
    });

    socket.on("new_notification", (notif) => {
      fetchClientNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchClientNotifications = async () => {
    try {
      setLoading(true);
      const userId = currentClient?.id || currentClient?._id;
      const res = await fetch(`http://localhost:5000/api/notifications/${userId}?role=Client`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const mapped = data.data.map(item => ({
          id: item._id,
          title: item.title,
          message: item.message,
          category: item.category || "System",
          bookingId: item.bookingId || item.metadata?.bookingId || "BK-2026-000145",
          time: new Date(item.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
          }),
          createdAt: item.createdAt,
          isRead: item.isRead,
          metadata: item.metadata || {}
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn("Using default notifications fallback", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const userId = currentClient?.id || currentClient?._id;
      await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: "Client" })
      });
    } catch (err) {
      console.error(err);
    }
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: "PUT" });
    } catch (err) {
      console.error(err);
    }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const openDetails = (notif) => {
    setSelectedNotif(notif);
    if (!notif.isRead) {
      handleMarkRead(notif.id);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Unread") return !n.isRead;
    return (n.category || "").toLowerCase() === activeCategory.toLowerCase();
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getCategoryRoute = (category) => {
    switch ((category || "").toLowerCase()) {
      case "payment":
        return "/client/payments";
      case "venue":
        return "/client/select-venue";
      case "service":
      case "decoration":
      case "catering":
      case "vendor":
        return "/client/services";
      case "feedback":
        return "/client/feedback";
      case "booking":
      case "event":
      case "task":
      default:
        return "/client/my-bookings";
    }
  };

  const handleNavigateToRelatedPage = (notif) => {
    if (notif?.bookingId) {
      localStorage.setItem("selected_booking_id", notif.bookingId);
      const targetRoute = getCategoryRoute(notif?.category);
      if (targetRoute === "/client/my-bookings") {
        navigate(`/client/my-bookings?bookingId=${notif.bookingId}`);
      } else {
        navigate(targetRoute);
      }
    } else {
      const targetRoute = getCategoryRoute(notif?.category);
      navigate(targetRoute);
    }
    setSelectedNotif(null);
  };

  const getCategoryIcon = (category) => {
    switch ((category || "").toLowerCase()) {
      case "payment": return CreditCard;
      case "venue": return Building;
      case "service": return Sparkles;
      case "reminder": return CalendarDays;
      case "booking": return CheckCircle2;
      case "task": return Wrench;
      case "vendor": return User;
      default: return Bell;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content client-module-content" style={{ backgroundColor: "#f8fafc", padding: "0 0 60px" }}>
        <Topbar title="Event Notifications" />

        <div style={{ padding: "24px 32px" }}>
          {/* Title Bar */}
        <section className="profile-title-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <button
              type="button"
              onClick={() => navigate('/client/dashboard')}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "white",
                border: "1px solid #cbd5e1",
                borderRadius: "10px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                cursor: "pointer",
                marginBottom: "12px"
              }}
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </button>

            <h1 style={{ display: "flex", alignItems: "center", gap: "10px", margin: 0 }}>
              <Bell className="text-pink-500" size={28} />
              Notification Center
            </h1>
            <p style={{ color: "#64748b", margin: "4px 0 0", fontSize: "14px" }}>
              Real-time booking, payment, service updates & event alerts for {clientName}
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span style={{
              background: unreadCount > 0 ? "#fef2f2" : "#f0fdf4",
              color: unreadCount > 0 ? "#dc2626" : "#166534",
              border: unreadCount > 0 ? "1px solid #fecaca" : "1px solid #bbf7d0",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "700"
            }}>
              🔔 {unreadCount} Unread Alerts
            </span>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: "#ec4899",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)"
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </section>

        {/* Category Filters */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "20px 0 24px" }}>
          {categoryList.map(cat => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "7px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  border: isActive ? "none" : "1px solid #cbd5e1",
                  background: isActive ? "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" : "white",
                  color: isActive ? "white" : "#475569",
                  cursor: "pointer",
                  boxShadow: isActive ? "0 4px 10px rgba(236, 72, 153, 0.3)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {cat === "All" ? "📋 All" : cat === "Unread" ? `🔴 Unread (${unreadCount})` : cat}
              </button>
            );
          })}
        </div>

        {/* Notification Feed */}
        <section className="profile-panel" style={{ background: "white", borderRadius: "20px", padding: "24px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
              Recent Alerts ({filteredNotifications.length})
            </h3>
            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Updated automatically</span>
          </div>

          {loading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
              <p style={{ margin: 0, fontWeight: "600" }}>Loading your notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#94a3b8" }}>
              <Bell size={40} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <p style={{ margin: 0, fontWeight: "600" }}>
                {activeCategory === "All" ? "No new notifications" : `No notifications found in ${activeCategory} category.`}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filteredNotifications.map((notif) => {
                const CategoryIcon = getCategoryIcon(notif.category);
                return (
                  <article
                    key={notif.id}
                    onClick={() => openDetails(notif)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "16px",
                      padding: "16px",
                      borderRadius: "14px",
                      border: notif.isRead ? "1px solid #f1f5f9" : "1.5px solid #fbcfe8",
                      background: notif.isRead ? "#ffffff" : "#fdf2f8",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      position: "relative"
                    }}
                  >
                    {!notif.isRead && (
                      <span style={{ position: "absolute", top: "14px", right: "16px", height: "9px", width: "9px", borderRadius: "50%", background: "#ec4899" }} />
                    )}

                    <div style={{
                      padding: "10px",
                      borderRadius: "12px",
                      background: notif.isRead ? "#f1f5f9" : "#fce7f3",
                      color: notif.isRead ? "#475569" : "#db2777",
                      flexShrink: 0
                    }}>
                      <CategoryIcon size={22} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "15px", color: "#0f172a", fontWeight: "800" }}>{notif.title}</strong>
                        {notif.bookingId && (
                          <span style={{ fontSize: "11px", fontWeight: "700", background: "#e2e8f0", color: "#334155", padding: "2px 8px", borderRadius: "6px" }}>
                            {notif.bookingId}
                          </span>
                        )}
                        <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#64748b", padding: "2px 8px", borderRadius: "6px" }}>
                          {notif.category || "System"}
                        </span>
                      </div>

                      <p style={{ margin: "6px 0 8px", fontSize: "13px", color: "#475569", lineHeight: "1.5" }}>
                        {notif.message}
                      </p>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#94a3b8" }}>
                        <span>🕒 {notif.time}</span>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigateToRelatedPage(notif);
                            }}
                            style={{
                              background: "#f1f5f9",
                              color: "#334155",
                              border: "1px solid #cbd5e1",
                              borderRadius: "8px",
                              padding: "4px 10px",
                              fontSize: "11px",
                              fontWeight: "700",
                              cursor: "pointer"
                            }}
                          >
                            Open Module 🚀
                          </button>
                          <span style={{ color: "#ec4899", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                            View Details <Eye size={13} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Detailed Notification Modal */}
        {selectedNotif && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}>
            <div style={{
              background: "white",
              borderRadius: "24px",
              maxWidth: "550px",
              width: "100%",
              padding: "28px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
              position: "relative"
            }}>
              <button
                type="button"
                onClick={() => setSelectedNotif(null)}
                style={{ position: "absolute", top: "20px", right: "20px", background: "#f1f5f9", border: "none", borderRadius: "50%", padding: "8px", cursor: "pointer" }}
              >
                <X size={18} />
              </button>

              <div style={{ display: "flex", itemsCenter: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", background: "#fce7f3", color: "#ec4899", padding: "4px 10px", borderRadius: "8px" }}>
                  {selectedNotif.category || "Notification"}
                </span>
                {selectedNotif.bookingId && (
                  <span style={{ fontSize: "12px", fontWeight: "800", background: "#f1f5f9", color: "#334155", padding: "4px 10px", borderRadius: "8px" }}>
                    ID: {selectedNotif.bookingId}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 12px" }}>
                {selectedNotif.title}
              </h2>

              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "14px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#334155", lineHeight: "1.6" }}>
                  {selectedNotif.message}
                </p>
                <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginTop: "10px" }}>
                  Received: {selectedNotif.time}
                </span>
              </div>

              {/* Payment Receipt Card Details if available */}
              {selectedNotif.metadata && selectedNotif.metadata.paidAmount && (
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "16px", padding: "16px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#166534", fontWeight: "800", marginBottom: "12px" }}>
                    <Receipt size={18} /> Payment Receipt Breakdown
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "12px" }}>
                    <div>
                      <span style={{ color: "#64748b", display: "block" }}>Invoice No:</span>
                      <strong style={{ color: "#0f172a" }}>{selectedNotif.metadata.invoiceNumber || "INV-2026-00125"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", display: "block" }}>Transaction ID:</span>
                      <strong style={{ color: "#0f172a" }}>{selectedNotif.metadata.transactionId || "TXN458921"}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", display: "block" }}>Paid Amount:</span>
                      <strong style={{ color: "#16a34a", fontSize: "14px" }}>{selectedNotif.metadata.paidAmount}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#64748b", display: "block" }}>Remaining Amount:</span>
                      <strong style={{ color: "#ea580c" }}>{selectedNotif.metadata.remainingAmount || "₹3,50,000"}</strong>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setSelectedNotif(null)}
                  style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", background: "white", color: "#475569", fontWeight: "700", cursor: "pointer" }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigateToRelatedPage(selectedNotif)}
                  style={{ flex: 1.5, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)", color: "white", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)" }}
                >
                  Open Related Page 🚀
                </button>
                {selectedNotif.metadata?.paidAmount && (
                  <button
                    type="button"
                    onClick={() => alert(`Downloading Payment Receipt ${selectedNotif.metadata?.invoiceNumber || "INV-2026-00125"} PDF`)}
                    style={{ flex: 1.2, padding: "12px", borderRadius: "12px", border: "none", background: "#059669", color: "white", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Download size={16} /> Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Notification;
