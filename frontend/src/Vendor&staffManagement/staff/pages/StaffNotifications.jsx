import React, { useState, useEffect } from "react";
import { Bell, BellRing, Check, ShieldAlert, CheckCircle, Calendar, Wrench, UserCheck } from "lucide-react";

export default function StaffNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: "s1",
      title: "📋 New Task Assigned",
      text: "You have been assigned Decoration Setup for Wedding BK-2026-000145 at Royal Grand Palace on 30 July 2026.",
      category: "Task",
      time: "2 hours ago",
      read: false,
      priority: "high"
    },
    {
      id: "s2",
      title: "👤 New Staff Account Created",
      text: "Welcome to EMS! Your staff account has been created by Admin. Login Email: staff@ems.com.",
      category: "Staff",
      time: "1 day ago",
      read: true,
      priority: "medium"
    },
    {
      id: "s3",
      title: "✅ Attendance Recorded",
      text: "Attendance checked in successfully at 8:55 AM today.",
      category: "Staff",
      time: "Today, 8:55 AM",
      read: true,
      priority: "low"
    }
  ]);

  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchStaffNotifications();
  }, []);

  const fetchStaffNotifications = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notifications?role=Staff");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const mapped = data.data.map(item => ({
          id: item._id,
          title: item.title,
          text: item.message,
          category: item.category || "Staff",
          time: new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          read: item.isRead,
          priority: item.category === "Task" ? "high" : "medium"
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.warn("Using default staff notifications", err);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = ["All", "Unread", "Task", "Staff", "System"];

  const filtered = notifications.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    return (n.category || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header Utilities */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 text-orange-500 rounded-xl">
            <BellRing size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Staff Notifications</h2>
            <p className="text-xs font-semibold text-slate-500">
              You have <span className="font-bold text-slate-800">{unreadCount}</span> unread staff alerts.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 border border-orange-200 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
          >
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${filter === cat ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-white border border-slate-200 text-slate-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-400 font-semibold text-xs">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`border rounded-3xl p-5 bg-white shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer relative overflow-hidden flex items-start gap-4 ${!item.read ? "border-l-4 border-l-orange-500 border-slate-200" : "border-slate-200 opacity-80"
                }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${item.priority === "high" ? "bg-red-50 text-red-500" : "bg-orange-50 text-orange-500"
                }`}>
                <ShieldAlert size={18} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">
                    {item.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mt-1.5">
                  {item.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
