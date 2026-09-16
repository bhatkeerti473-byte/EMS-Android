import React, { useState, useEffect, useCallback } from "react";
import guestAPI from "../../services/guestApi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { 
  Users, UserPlus, Mail, Search, Trash2, CheckCircle, XCircle, 
  AlertCircle, Upload, Check, X, FileText, BarChart2 
} from "lucide-react";

function GuestTab({ eventId }) {
  const [guests, setGuests] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvites, setSendingInvites] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Forms state
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Guests"
  });
  const [bulkText, setBulkText] = useState("");

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [rsvpFilter, setRsvpFilter] = useState("All");

  const fetchGuestData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await guestAPI.getGuestsForEvent(eventId);
      if (response.data.success) {
        setGuests(response.data.guests || []);
        setInvitations(response.data.invitations || []);
        setAttendanceLogs(response.data.attendanceLogs || []);
      }
    } catch (err) {
      setError("Failed to fetch guest list details.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchGuestData();
  }, [fetchGuestData]);

  // Handle Add Single Guest
  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuest.name || !newGuest.email) {
      setError("Name and Email are required.");
      return;
    }
    try {
      const response = await guestAPI.addGuest({ eventId, ...newGuest });
      if (response.data.success) {
        setSuccess("Guest added successfully!");
        setNewGuest({ name: "", email: "", phone: "", category: "General Guests" });
        setShowAddModal(false);
        fetchGuestData();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add guest.");
    }
  };

  // Handle Bulk Import
  const handleBulkImport = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    // Parse CSV-like format: Name, Email, Phone, Category
    const lines = bulkText.split("\n");
    const parsedGuests = [];

    lines.forEach((line) => {
      const cols = line.split(",").map(c => c.trim());
      if (cols.length >= 2 && cols[0] && cols[1]) {
        parsedGuests.push({
          name: cols[0],
          email: cols[1],
          phone: cols[2] || "",
          category: cols[3] || "General Guests"
        });
      }
    });

    if (parsedGuests.length === 0) {
      setError("No valid guests parsed. Format should be Name,Email,Phone,Category");
      return;
    }

    try {
      const response = await guestAPI.bulkAddGuests(eventId, parsedGuests);
      if (response.data.success) {
        setSuccess(`Bulk imported ${response.data.count} guests successfully.`);
        setBulkText("");
        setShowBulkModal(false);
        fetchGuestData();
      }
    } catch (err) {
      setError("Bulk import failed.");
    }
  };

  // Handle Send Invites
  const handleSendInvites = async () => {
    try {
      setSendingInvites(true);
      setError("");
      setSuccess("");
      const response = await guestAPI.sendInvitations(eventId);
      if (response.data.success) {
        setSuccess(response.data.message);
        fetchGuestData();
      }
    } catch (err) {
      setError("Failed to send invitations.");
    } finally {
      setSendingInvites(false);
    }
  };

  // Handle Attendance Log Toggle
  const handleToggleAttendance = async (guestId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Attended" ? "Absent" : "Attended";
      const response = await guestAPI.markAttendance(guestId, eventId, newStatus);
      if (response.data.success) {
        setSuccess(`Guest check-in status updated.`);
        // Update local logs list
        if (newStatus === "Attended") {
          setAttendanceLogs(prev => [...prev, { guestId, status: "Attended" }]);
        } else {
          setAttendanceLogs(prev => prev.filter(log => log.guestId !== guestId));
        }
      }
    } catch (err) {
      setError("Failed to record attendance check-in.");
    }
  };

  // Handle Delete Guest
  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm("Are you sure you want to delete this guest?")) return;
    try {
      const response = await guestAPI.deleteGuest(guestId);
      if (response.data.success) {
        setSuccess("Guest removed successfully.");
        fetchGuestData();
      }
    } catch (err) {
      setError("Failed to remove guest.");
    }
  };

  // Helper selectors
  const getInvitationStatus = (guestId) => {
    const invite = invitations.find(i => i.guestId === guestId);
    return invite ? invite.status : "Not Sent";
  };

  const getAttendanceStatus = (guestId) => {
    const log = attendanceLogs.find(l => l.guestId === guestId);
    return log ? log.status : "Absent";
  };

  // Filter list
  const filteredGuests = guests.filter((g) => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || g.category === categoryFilter;
    const matchesRsvp = rsvpFilter === "All" || g.rsvpStatus === rsvpFilter;
    return matchesSearch && matchesCategory && matchesRsvp;
  });

  // Calculate Metrics
  const totalGuests = guests.length;
  const confirmedCount = guests.filter(g => g.rsvpStatus === "Confirmed").length;
  const pendingCount = guests.filter(g => g.rsvpStatus === "Pending").length;
  const declinedCount = guests.filter(g => g.rsvpStatus === "Declined").length;
  const attendedCount = guests.filter(g => getAttendanceStatus(g._id) === "Attended").length;

  // Chart Data
  const rsvpChartData = [
    { name: "Confirmed", value: confirmedCount, color: "#10b981" },
    { name: "Pending", value: pendingCount, color: "#f59e0b" },
    { name: "Declined", value: declinedCount, color: "#ef4444" }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      
      {/* Notifications */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
          <button onClick={() => setError("")} className="ml-auto hover:text-white font-bold">×</button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 rounded-xl text-sm animate-fadeIn">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p>{success}</p>
          <button onClick={() => setSuccess("")} className="ml-auto hover:text-white font-bold">×</button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-800/40 border border-slate-700/60 backdrop-blur p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm font-medium">Invited Guests</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-white">{totalGuests}</h3>
          <p className="text-xs text-slate-500 mt-1">Total guests on the list</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 backdrop-blur p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-emerald-300 text-sm font-medium">Confirmed RSVPs</span>
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-emerald-400">{confirmedCount}</h3>
          <p className="text-xs text-slate-500 mt-1">{totalGuests > 0 ? ((confirmedCount/totalGuests)*100).toFixed(0) : 0}% acceptance rate</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 backdrop-blur p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-amber-300 text-sm font-medium">Pending Response</span>
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-amber-400">{pendingCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Awaiting digital reply</p>
        </div>

        <div className="bg-slate-800/40 border border-slate-700/60 backdrop-blur p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-cyan-300 text-sm font-medium">Attended Event</span>
            <BarChart2 className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-3xl font-extrabold text-cyan-400">{attendedCount}</h3>
          <p className="text-xs text-slate-500 mt-1">Checked-in at venue</p>
        </div>

      </div>

      {/* Analytics Graph & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recharts Pie Chart panel */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h4 className="text-white font-semibold mb-4 self-start">RSVP Response Distribution</h4>
          {rsvpChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={rsvpChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {rsvpChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#475569", borderRadius: "8px", color: "white" }} 
                />
                <Legend layout="horizontal" align="center" verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-slate-500 my-auto">
              <Users className="w-12 h-12 mx-auto opacity-30 mb-2" />
              <p className="text-sm">No RSVP data to display yet.</p>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/20 to-slate-900/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Guest Workflow & Actions</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Upload your guest logs, divide them into categories (VIP, Family, Corporate, General), and send customized digital invitations directly via system nodemailer integrations. You can monitor actual RSVP responses and mark live entries during check-ins.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition"
            >
              <UserPlus className="w-4 h-4" />
              Add Single Guest
            </button>
            
            <button
              onClick={() => setShowBulkModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 border border-slate-700 transition"
            >
              <Upload className="w-4 h-4" />
              Bulk CSV Import
            </button>

            <button
              onClick={handleSendInvites}
              disabled={sendingInvites || totalGuests === 0}
              className="ml-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition"
            >
              {sendingInvites ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Digital Invites ({pendingCount})
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Guest List Directory */}
      <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl overflow-hidden">
        
        {/* Filter Controls Header */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-center gap-4">
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="VIP Guests">VIP Guests</option>
              <option value="Family Members">Family Members</option>
              <option value="Corporate Guests">Corporate Guests</option>
              <option value="General Guests">General Guests</option>
            </select>

            <select
              value={rsvpFilter}
              onChange={(e) => setRsvpFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All RSVP Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Contact Email</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">RSVP Status</th>
                <th className="py-4 px-6 text-center">Invite Sent</th>
                <th className="py-4 px-6 text-center">Check-In</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm text-slate-300">
              {filteredGuests.map((guest) => {
                const inviteStatus = getInvitationStatus(guest._id);
                const isAttended = getAttendanceStatus(guest._id) === "Attended";

                return (
                  <tr key={guest._id} className="hover:bg-slate-800/10 transition">
                    <td className="py-4 px-6 font-semibold text-white">{guest.name}</td>
                    <td className="py-4 px-6 text-slate-400 text-xs">
                      <div>{guest.email}</div>
                      {guest.phone && <div className="text-slate-600 mt-0.5">{guest.phone}</div>}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        guest.category === "VIP Guests" 
                          ? "bg-purple-500/10 text-purple-300 border-purple-500/20" 
                          : guest.category === "Family Members"
                          ? "bg-pink-500/10 text-pink-300 border-pink-500/20"
                          : guest.category === "Corporate Guests"
                          ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                          : "bg-slate-500/10 text-slate-400 border-slate-700/30"
                      }`}>
                        {guest.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                        guest.rsvpStatus === "Confirmed"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                          : guest.rsvpStatus === "Declined"
                          ? "bg-red-500/15 text-red-400 border-red-500/25"
                          : "bg-amber-500/15 text-amber-400 border-amber-500/25"
                      }`}>
                        {guest.rsvpStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        inviteStatus === "Sent" || inviteStatus === "Responded" || inviteStatus === "Viewed"
                          ? "bg-slate-700/60 text-slate-200"
                          : "bg-slate-900 text-slate-600 border border-slate-800"
                      }`}>
                        {inviteStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleToggleAttendance(guest._id, getAttendanceStatus(guest._id))}
                        className={`mx-auto p-1.5 rounded-full flex items-center justify-center border transition-all ${
                          isAttended
                            ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30"
                            : "bg-slate-950/40 text-slate-600 border-slate-800 hover:text-slate-400 hover:border-slate-700"
                        }`}
                        title={isAttended ? "Mark Absent" : "Mark Present"}
                      >
                        {isAttended ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleDeleteGuest(guest._id)}
                        className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                    <p className="text-sm">No guests found on the list.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Add Single Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-4">Add Event Guest</h3>
            
            <form onSubmit={handleAddGuest} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Guest Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({...newGuest, email: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. +1 555-0199"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1.5">Category Designation</label>
                <select
                  value={newGuest.category}
                  onChange={(e) => setNewGuest({...newGuest, category: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value="VIP Guests">VIP Guests</option>
                  <option value="Family Members">Family Members</option>
                  <option value="Corporate Guests">Corporate Guests</option>
                  <option value="General Guests">General Guests</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-xl text-sm transition"
                >
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk CSV Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 max-w-lg w-full p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-xl font-bold text-white mb-2">Import Guest Logs</h3>
            <p className="text-slate-400 text-xs mb-4">
              Paste your guest list directly in CSV format. Each line should contain: <code className="bg-slate-950 px-1 py-0.5 rounded text-indigo-300 font-mono">Name,Email,Phone,Category</code>
            </p>

            <form onSubmit={handleBulkImport} className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1.5">CSV Pasted Lines</label>
                <textarea
                  rows="6"
                  required
                  placeholder="Alice Smith,alice@example.com,+1234567,VIP Guests&#10;Bob Jones,bob@example.com,,General Guests"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-5 rounded-xl text-sm transition flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Parse & Insert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default GuestTab;
