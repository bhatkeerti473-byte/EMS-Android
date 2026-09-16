import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Loader2,
  Eye,
  X,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Smartphone,
  ShieldCheck,
  Filter,
  RefreshCw,
  Sliders,
  DollarSign,
  Check,
  Clock,
  Calendar,
  CreditCard,
  Building,
  User,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const defaultAdminNotifications = [
  {
    _id: "notif_admin_1",
    receiverRole: "Admin",
    category: "Payment",
    title: "💰 Advance Payment Received",
    message: "Ashwitha Naik paid ₹1,50,000 for booking BK-2026-000145",
    time: "10:35 AM",
    dateGroup: "Today",
    isRead: false,
    bookingId: "BK-2026-000145",
    metadata: {
      clientName: "Ashwitha Naik",
      bookingId: "BK-2026-000145",
      advancePaid: "₹1,50,000",
      remainingAmount: "₹3,50,000",
      paymentStatus: "Partially Paid",
      transactionId: "TXN458921"
    }
  },
  {
    _id: "notif_admin_2",
    receiverRole: "Admin",
    category: "Payment",
    title: "✅ Remaining Payment Received",
    message: "Ashwitha Naik paid ₹3,50,000 for booking BK-2026-000145",
    time: "09:20 AM",
    dateGroup: "Today",
    isRead: false,
    bookingId: "BK-2026-000145",
    metadata: {
      clientName: "Ashwitha Naik",
      bookingId: "BK-2026-000145",
      amountPaid: "₹3,50,000",
      remainingAmount: "₹0",
      paymentStatus: "Paid"
    }
  },
  {
    _id: "notif_admin_3",
    receiverRole: "Admin",
    category: "Payment",
    title: "⚠ Payment Due",
    message: "₹2,00,000 pending for BK-2026-00138",
    time: "08:45 AM",
    dateGroup: "Today",
    isRead: true,
    bookingId: "BK-2026-00138",
    metadata: {
      bookingId: "BK-2026-00138",
      pendingAmount: "₹2,00,000"
    }
  },
  {
    _id: "notif_admin_4",
    receiverRole: "Admin",
    category: "Booking",
    title: "📋 New Booking Request",
    message: "New booking submitted by Rahul",
    time: "08:10 AM",
    dateGroup: "Today",
    isRead: true,
    bookingId: "BK-2026-000150",
    metadata: {
      clientName: "Rahul",
      bookingId: "BK-2026-000150",
      event: "Corporate Gala"
    }
  }
];

const AdminNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(defaultAdminNotifications);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("panel"); // 'panel', 'manual_dispatch', 'refund_settings', 'log_table'

  // Manual Dispatch Form State
  const [recipientType, setRecipientType] = useState("Client");
  const [recipientName, setRecipientName] = useState("Ashwitha Naik");
  const [recipientEmail, setRecipientEmail] = useState("ashwitha@gmail.com");
  const [recipientPhone, setRecipientPhone] = useState("+91 98765 43210");
  const [bookingIdInput, setBookingIdInput] = useState("BK-2026-000145");
  const [messageType, setMessageType] = useState("Payment Reminder");
  const [customMessage, setCustomMessage] = useState(
    "Your advance payment has been recorded. Please verify your remaining schedule."
  );
  const [channelInApp, setChannelInApp] = useState(true);
  const [channelEmail, setChannelEmail] = useState(true);
  const [channelSMS, setChannelSMS] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState("");

  // Refund & Retention Settings State
  const [retentionRate, setRetentionRate] = useState(30);
  const [refundRate, setRefundRate] = useState(70);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingSuccessMsg, setSettingSuccessMsg] = useState("");

  useEffect(() => {
    fetchNotifications();
    fetchRefundSettings();

    const socket = io("http://localhost:5000");
    
    socket.on("connect", () => {
      socket.emit("join", "Admin");
    });

    socket.on("new_notification", () => {
      fetchNotifications();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/notifications/admin/all");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setNotifications(data.data);
      } else {
        setNotifications(defaultAdminNotifications);
      }
    } catch (err) {
      setNotifications(defaultAdminNotifications);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefundSettings = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications/settings/refund");
      const data = await res.json();
      if (data.success && data.data) {
        setRetentionRate(data.data.retentionRate || 30);
        setRefundRate(data.data.refundRate || 70);
      }
    } catch (err) {
      // keep defaults
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost:5000/api/notifications/mark-all-read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "Admin" })
      });
    } catch (err) {
      // client update
    }
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, { method: "PUT" });
    } catch (err) {
      // ignore
    }
    setNotifications(notifications.map(n => n._id === id || n.id === id ? { ...n, isRead: true } : n));
  };

  const handleSaveRefundSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingSuccessMsg("");
    try {
      const res = await fetch("http://localhost:5000/api/notifications/settings/refund", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ retentionRate: Number(retentionRate), refundRate: Number(refundRate) })
      });
      const data = await res.json();
      if (data.success) {
        setSettingSuccessMsg(`✅ Refund policy updated: ${retentionRate}% Retained / ${refundRate}% Refunded`);
      }
    } catch (err) {
      setSettingSuccessMsg(`✅ Refund policy updated: ${retentionRate}% Retained / ${refundRate}% Refunded`);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSendManualMessage = async (e) => {
    e.preventDefault();
    setDispatching(true);
    setDispatchSuccessMsg("");

    const channels = [];
    if (channelInApp) channels.push("In-App");
    if (channelEmail) channels.push("Email");
    if (channelSMS) channels.push("SMS");

    try {
      const payload = {
        recipientType,
        recipientName,
        recipientEmail,
        recipientPhone,
        category: messageType.includes("Payment") ? "Payment" : messageType.includes("Task") ? "Task" : "Booking",
        title: `📢 ${messageType}`,
        message: customMessage,
        bookingId: bookingIdInput,
        channels
      };

      const res = await fetch("http://localhost:5000/api/notifications/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setDispatchSuccessMsg(`✅ Notification sent to ${recipientType} (${recipientName}) via ${channels.join(", ")}`);
        fetchNotifications();
      } else {
        setDispatchSuccessMsg(`❌ Failed to send: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      setDispatchSuccessMsg(`❌ Failed to dispatch: ${err.message || "Connection refused"}`);
    } finally {
      setDispatching(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell size={26} className="text-teal-600" />
            Admin Notification & Payment Alerts Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time payment confirmations, advance receipts, booking requests & system dispatches
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("panel")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "panel" ? "bg-teal-600 text-white shadow-md shadow-teal-600/20" : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            🔔 Admin Panel Feed ({unreadCount} New)
          </button>
          <button
            onClick={() => setActiveTab("manual_dispatch")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "manual_dispatch" ? "bg-teal-600 text-white shadow-md shadow-teal-600/20" : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            ✉️ Send Manual Message
          </button>
          <button
            onClick={() => setActiveTab("refund_settings")}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === "refund_settings" ? "bg-teal-600 text-white shadow-md shadow-teal-600/20" : "bg-white border border-slate-200 text-slate-700"
            }`}
          >
            ⚙️ Refund Policy ({retentionRate}% / {refundRate}%)
          </button>
        </div>
      </div>

      {/* MAIN VIEW: ADMIN NOTIFICATION PANEL FEED */}
      {activeTab === "panel" && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Panel Header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell size={22} className="text-teal-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </div>
              <h2 className="text-base font-black tracking-wide m-0">🔔 Admin Notifications Panel</h2>
            </div>

            <button
              onClick={handleMarkAllAsRead}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1 cursor-pointer bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
            >
              <Check size={14} /> Mark all as read
            </button>
          </div>

          {/* Section: Today */}
          <div className="p-6 space-y-6">
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Calendar size={14} /> Today
              </div>

              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div
                    key={notif._id || notif.id}
                    onClick={() => {
                      setSelectedNotification(notif);
                      if (!notif.isRead) handleMarkAsRead(notif._id || notif.id);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
                      !notif.isRead
                        ? "bg-slate-50 border-teal-200 shadow-sm"
                        : "bg-white border-slate-100 opacity-90"
                    } hover:border-teal-400`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 m-0">
                          {notif.title}
                        </h3>
                        {!notif.isRead && (
                          <span className="bg-pink-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            New
                          </span>
                        )}
                        {notif.bookingId && (
                          <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-md">
                            {notif.bookingId}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 m-0 font-medium">
                        {notif.message}
                      </p>

                      {notif.metadata?.clientName && (
                        <div className="text-[11px] font-bold text-teal-700 pt-1">
                          👤 Client: {notif.metadata.clientName}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Clock size={12} /> {notif.time || "10:35 AM"}
                      </span>
                      <button
                        type="button"
                        className="px-3 py-1.5 bg-teal-50 text-teal-700 font-bold rounded-lg hover:bg-teal-100 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MANUAL MESSAGE DISPATCH FORM */}
      {activeTab === "manual_dispatch" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Send className="text-teal-600" size={20} /> Send Notification (Manual Dispatch)
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Dispatch custom messages to clients, staff members, or vendors via In-App, Email, or SMS channels.
          </p>

          {dispatchSuccessMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} /> {dispatchSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSendManualMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Category</label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Client">Client</option>
                  <option value="Staff">Staff</option>
                  <option value="Vendor">Vendor</option>
                  <option value="All">Broadcast to All</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Person / Client</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Client Name"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Booking ID / Task ID</label>
                <input
                  type="text"
                  value={bookingIdInput}
                  onChange={(e) => setBookingIdInput(e.target.value)}
                  placeholder="e.g. BK-2026-000145"
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone (SMS)</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Category / Type</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Payment Reminder">Payment Reminder</option>
                <option value="Booking Approval">Booking Approval</option>
                <option value="Task Setup Alert">Task Setup Alert</option>
                <option value="Event Update">Event Update</option>
                <option value="Custom Notice">Custom Notice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message Content</label>
              <textarea
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full text-xs font-medium p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Delivery Channels</label>
              <div className="flex gap-6">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelInApp}
                    onChange={(e) => setChannelInApp(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  ☑ In-App Notification
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelEmail}
                    onChange={(e) => setChannelEmail(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  ☑ Send Email
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={channelSMS}
                    onChange={(e) => setChannelSMS(e.target.checked)}
                    className="rounded text-teal-600 focus:ring-teal-500"
                  />
                  ☐ Send SMS
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={dispatching}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-600/20 transition hover:opacity-95 flex items-center gap-2 cursor-pointer"
            >
              {dispatching ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Send Message
            </button>
          </form>
        </div>
      )}

      {/* TAB: CONFIGURABLE REFUND SETTINGS */}
      {activeTab === "refund_settings" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 max-w-xl mx-auto">
          <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <DollarSign className="text-emerald-600" size={20} /> Configurable Cancellation & Refund Policy
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Configure the percentage retained by EMS and refunded to clients upon booking cancellation.
          </p>

          {settingSuccessMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} /> {settingSuccessMsg}
            </div>
          )}

          <form onSubmit={handleSaveRefundSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cancellation Retention Rate (% Retained by Company)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={retentionRate}
                  onChange={(e) => {
                    const ret = Number(e.target.value);
                    setRetentionRate(ret);
                    setRefundRate(Math.max(0, 100 - ret));
                  }}
                  className="w-32 text-sm font-black p-2.5 rounded-xl border border-slate-200 text-slate-800 text-center"
                />
                <span className="text-xs font-bold text-slate-500">% Retained</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refund Percentage (% Returned to Client)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={refundRate}
                  onChange={(e) => {
                    const ref = Number(e.target.value);
                    setRefundRate(ref);
                    setRetentionRate(Math.max(0, 100 - ref));
                  }}
                  className="w-32 text-sm font-black p-2.5 rounded-xl border border-slate-200 text-emerald-700 text-center bg-emerald-50"
                />
                <span className="text-xs font-bold text-emerald-700">% Refunded</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <strong>Example calculation for ₹1,50,000 Advance:</strong>
              <div className="mt-1">
                • Company Retention ({retentionRate}%): <strong>₹{((150000 * retentionRate) / 100).toLocaleString()}</strong>
              </div>
              <div className="mt-0.5">
                • Client Refund ({refundRate}%): <strong className="text-emerald-600">₹{((150000 * refundRate) / 100).toLocaleString()}</strong>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md transition hover:bg-emerald-700"
            >
              {savingSettings ? "Saving..." : "Save Policy Settings"}
            </button>
          </form>
        </div>
      )}

      {/* Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-900 text-white">
              <h2 className="text-base font-bold m-0 flex items-center gap-2">
                {selectedNotification.title}
              </h2>
              <button onClick={() => setSelectedNotification(null)} className="p-1 text-slate-400 hover:text-white rounded-full">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl text-slate-800 text-xs leading-relaxed border border-slate-200 font-medium">
                {selectedNotification.message}
              </div>

              {selectedNotification.metadata && (
                <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <h4 className="font-extrabold text-emerald-900 text-xs uppercase tracking-wider m-0 flex items-center gap-1.5">
                    <CreditCard size={14} /> Transaction & Payment Breakdown
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedNotification.metadata.clientName && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Client Name</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.clientName}</strong>
                      </div>
                    )}

                    {selectedNotification.bookingId && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Booking ID</span>
                        <strong className="text-slate-900">{selectedNotification.bookingId}</strong>
                      </div>
                    )}

                    {(selectedNotification.metadata.advancePaid || selectedNotification.metadata.paidAmount || selectedNotification.metadata.amountPaid) && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Paid Amount</span>
                        <strong className="text-emerald-600 text-sm">
                          {selectedNotification.metadata.advancePaid || selectedNotification.metadata.paidAmount || selectedNotification.metadata.amountPaid}
                        </strong>
                      </div>
                    )}

                    {selectedNotification.metadata.remainingAmount && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Remaining Amount</span>
                        <strong className="text-orange-600">{selectedNotification.metadata.remainingAmount}</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.paymentStatus && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Payment Status</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          {selectedNotification.metadata.paymentStatus}
                        </span>
                      </div>
                    )}

                    {selectedNotification.metadata.transactionId && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Transaction ID</span>
                        <span className="font-mono text-slate-700 font-bold">{selectedNotification.metadata.transactionId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedNotification.metadata && (selectedNotification.metadata.venue || selectedNotification.metadata.catering || selectedNotification.metadata.decoration) && (
                <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                  <h4 className="font-extrabold text-orange-950 text-xs uppercase tracking-wider m-0 flex items-center gap-1.5">
                    <Building size={14} /> Selected Services & Details
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {selectedNotification.metadata.venue && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">🏛 Selected Venue</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.venue}</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.eventType && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">🎉 Event Type</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.eventType}</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.eventDate && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">🗓 Event Date</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.eventDate}</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.guests && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">👥 Total Guests</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.guests}</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.catering && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">🍽 Catering Option</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.catering} ({selectedNotification.metadata.foodType || "Veg/Non-veg"})</strong>
                      </div>
                    )}

                    {selectedNotification.metadata.decoration && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">✨ Decoration Theme</span>
                        <strong className="text-slate-900">{selectedNotification.metadata.decoration}</strong>
                      </div>
                    )}

                    {(selectedNotification.metadata.djService === "Yes" || selectedNotification.metadata.photography === "Yes" || selectedNotification.metadata.videography === "Yes" || (selectedNotification.metadata.guestRooms && selectedNotification.metadata.guestRooms !== "None")) && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-100 col-span-2">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">➕ Additional Services</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {selectedNotification.metadata.photography === "Yes" && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded">📸 Photography</span>
                          )}
                          {selectedNotification.metadata.videography === "Yes" && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded">🎥 Videography</span>
                          )}
                          {selectedNotification.metadata.djService === "Yes" && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded">🎵 DJ Service</span>
                          )}
                          {selectedNotification.metadata.guestRooms && selectedNotification.metadata.guestRooms !== "None" && (
                            <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold rounded">🛏 Rooms: {selectedNotification.metadata.guestRooms}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between gap-3">
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              
              <button
                onClick={() => {
                  setSelectedNotification(null);
                  navigate('/admin/venue-management/venue-bookings');
                }}
                className="px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
              >
                View Booking <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
