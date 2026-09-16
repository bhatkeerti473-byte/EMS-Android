import React, { useState, useEffect } from "react";
import { Search, Calendar as CalendarIcon, Users, CheckCircle, UserX, CalendarDays, Download, Eye, Edit, Clock, ArrowLeft, FileText, Camera, MapPin, Monitor } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StaffAttendance() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/admin");
      const data = await res.json();
      if (data.success) {
        // Map backend data to frontend model
        const mapped = data.data.map(r => ({
          id: r._id,
          name: r.staffId?.name || "Unknown",
          email: r.staffId?.email || "",
          phone: r.staffId?.phone || "No Phone",
          role: r.staffId?.role || "Staff",
          status: r.status,
          timeIn: r.checkInTime ? new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute:'2-digit'}).format(new Date(r.checkInTime)) : "--:--",
          timeOut: r.checkOutTime ? new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute:'2-digit'}).format(new Date(r.checkOutTime)) : "--:--",
          hours: r.workingHours ? `${r.workingHours}h` : "-",
          initials: (r.staffId?.name || "U").substring(0,2).toUpperCase(),
          faceVerified: r.faceVerified,
          gpsVerified: r.gpsVerified,
          raw: r // store raw record for details modal
        }));
        setStaffList(mapped);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Present": return "text-green-700 bg-green-100";
      case "Absent": return "text-red-700 bg-red-100";
      case "On Leave": return "text-amber-700 bg-amber-100";
      default: return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "Present": return "bg-green-500";
      case "Absent": return "bg-red-500";
      case "On Leave": return "bg-amber-500";
      default: return "bg-gray-500";
    }
  };

  const summaryData = [
    { name: "Present", value: 1, color: "#22c55e" },
    { name: "Absent", value: 0, color: "#ef4444" },
    { name: "On Leave", value: 0, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6 text-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Attendance</h2>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            <span className="hover:text-amber-600 cursor-pointer">Dashboard</span>
            <span>/</span>
            <span>Staff & Vendors</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Attendance</span>
          </div>
        </div>
        <button 
          onClick={() => alert("Attendance Report exported successfully as PDF/Excel!")}
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center space-x-2 transition-all shadow-sm"
        >
          <Download size={18} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Staff */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-indigo-50 text-indigo-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Staff</p>
            <h3 className="text-2xl font-bold text-gray-800">1</h3>
            <p className="text-gray-400 text-xs mt-1">Active Staff</p>
          </div>
        </div>
        {/* Present Today */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-50 text-green-500">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Present Today</p>
            <h3 className="text-2xl font-bold text-gray-800">1</h3>
            <p className="text-gray-400 text-xs mt-1">100% Present</p>
          </div>
        </div>
        {/* Absent Today */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-red-50 text-red-500">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Absent Today</p>
            <h3 className="text-2xl font-bold text-gray-800">0</h3>
            <p className="text-gray-400 text-xs mt-1">0% Absent</p>
          </div>
        </div>
        {/* On Leave */}
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-amber-50 text-amber-500">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">On Leave</p>
            <h3 className="text-2xl font-bold text-gray-800">0</h3>
            <p className="text-gray-400 text-xs mt-1">0% On Leave</p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Side: Table Area */}
        <div className="xl:col-span-2 space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search staff name..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="w-full md:w-40">
              <select 
                value={roleFilter} 
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option>All Roles</option>
                <option>Event Manager</option>
                <option>Security</option>
              </select>
            </div>
            <div className="w-full md:w-40">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option>All Status</option>
                <option>Present</option>
                <option>Absent</option>
                <option>On Leave</option>
              </select>
            </div>
            <div className="relative w-full md:w-48">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="date" 
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px] flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Attendance List</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Name</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Face Verified</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">GPS Verified</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                      <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map((staff) => (
                      <tr key={staff.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                              {staff.initials}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                              <p className="text-xs text-gray-500">{staff.email}</p>
                              <p className="text-xs font-semibold text-gray-700 mt-0.5">📞 {staff.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(staff.status)}`}></span>
                            {staff.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {staff.faceVerified ? "✅" : "❌"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {staff.gpsVerified ? "✅" : "❌"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{staff.timeIn}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{staff.timeOut}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{staff.hours}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2 border border-gray-100 rounded-lg p-1 bg-white">
                            <button 
                              onClick={() => { setSelectedStaff(staff); setIsModalOpen(true); }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                              title="View"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => { setSelectedStaff(staff); setIsEditModalOpen(true); }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => { setSelectedStaff(staff); setIsHistoryModalOpen(true); }}
                              className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" 
                              title="History"
                            >
                              <Clock size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Showing 1 to 1 of 1 entries</p>
              <div className="flex items-center space-x-1">
                <button className="px-2.5 py-1.5 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50">«</button>
                <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                <button className="px-2.5 py-1.5 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50">»</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Calendar & Summary */}
        <div className="xl:col-span-1 space-y-6">
          {/* Attendance Calendar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-gray-800">Attendance Calendar</h3>
            </div>
            <div className="flex items-center justify-between mb-4">
              <button className="text-gray-400 hover:text-gray-600">{'<'}</button>
              <h4 className="font-semibold text-gray-800 text-sm">July 2025</h4>
              <button className="text-gray-400 hover:text-gray-600">{'>'}</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-xs text-gray-400 font-medium py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-600">
              {/* Dummy days for calendar mockup */}
              <div className="py-2 text-gray-300">29</div>
              <div className="py-2 text-gray-300">30</div>
              <div className="py-2">1</div>
              <div className="py-2">2</div>
              <div className="py-2">3</div>
              <div className="py-2">4</div>
              <div className="py-2">5</div>
              <div className="py-2">6</div>
              <div className="py-2">7</div>
              <div className="py-2">8</div>
              <div className="py-2">9</div>
              <div className="py-2">10</div>
              <div className="py-2">11</div>
              <div className="py-2">12</div>
              <div className="py-2 bg-indigo-600 text-white rounded-full font-medium mx-1 flex items-center justify-center">13</div>
              <div className="py-2">14</div>
              <div className="py-2">15</div>
              <div className="py-2">16</div>
              <div className="py-2">17</div>
              <div className="py-2">18</div>
              <div className="py-2">19</div>
              <div className="py-2">20</div>
              <div className="py-2">21</div>
              <div className="py-2">22</div>
              <div className="py-2">23</div>
              <div className="py-2">24</div>
              <div className="py-2">25</div>
              <div className="py-2">26</div>
              <div className="py-2">27</div>
              <div className="py-2">28</div>
              <div className="py-2">29</div>
              <div className="py-2">30</div>
              <div className="py-2">31</div>
              <div className="py-2 text-gray-300">1</div>
              <div className="py-2 text-gray-300">2</div>
            </div>
            <div className="flex items-center justify-between mt-6 text-xs text-gray-600">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span>Present</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>Absent</div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>On Leave</div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-bold text-gray-800 mb-6">Attendance Summary</h3>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryData}
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600">Present (1)</span>
                  </div>
                  <span className="font-semibold text-gray-800">100%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-gray-600">Absent (0)</span>
                  </div>
                  <span className="font-semibold text-gray-800">0%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-gray-600">On Leave (0)</span>
                  </div>
                  <span className="font-semibold text-gray-800">0%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm">
              <span className="text-gray-600">Total Staff: </span>
              <span className="font-bold text-gray-800">1</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Staff Details Overlay Modal */}
      {isModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-gray-50 w-full max-w-[1400px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Header & Back Button */}
            <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Staff Attendance Details</h2>
                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span>Dashboard</span>
                  <span>/</span>
                  <span>Staff & Vendors</span>
                  <span>/</span>
                  <span>Attendance</span>
                  <span>/</span>
                  <span className="text-gray-700 font-medium">Attendance Details</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Left Main Content */}
              <div className="xl:col-span-3 space-y-6">
                
                {/* Top Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-wrap gap-8 items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl">
                      {selectedStaff.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h3>
                        <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100">
                          {selectedStaff.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{selectedStaff.email}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{selectedStaff?.raw?.staffId?.phone || "No Phone"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-10">
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Employee ID</p>
                      <p className="text-sm font-bold text-gray-900">{selectedStaff?.raw?.staffId?._id?.substring(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium mb-1">Device Name</p>
                      <p className="text-sm font-medium text-gray-900">{selectedStaff?.raw?.deviceName || "Unknown Device"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">IP Address</p>
                      <p className="text-sm font-medium text-gray-900">{selectedStaff?.raw?.ipAddress || "Unknown"}</p>
                    </div>
                    <div>
                      <div className="inline-flex px-2 py-0.5 text-[10px] font-semibold text-green-700 bg-green-100 rounded-full mb-1">{selectedStaff?.raw?.staffId?.status || "Active"}</div>
                      <p className="text-xs text-gray-400 font-medium">Joined On</p>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedStaff?.raw?.staffId?.createdAt 
                          ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(selectedStaff.raw.staffId.createdAt))
                          : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200">
                  <button className="flex items-center gap-2 pb-3 border-b-2 border-indigo-600 text-indigo-600 font-semibold text-sm">
                    <FileText size={16} /> Attendance Log
                  </button>
                  <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                    <CalendarIcon size={16} /> Calendar View
                  </button>
                  <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                    <PieChart size={16} /> Monthly Summary
                  </button>
                  <button className="flex items-center gap-2 pb-3 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors">
                    <Clock size={16} /> Report History
                  </button>
                </div>

                {/* Attendance Log Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
                        <CalendarIcon size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600">01 July 2025 - 13 July 2025</span>
                      </div>
                      <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 outline-none focus:border-indigo-500">
                        <option>All Status</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => alert("Attendance Log exported successfully!")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all"
                    >
                      <Download size={16} />
                      Export Report
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Date</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Day</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Check In</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Check Out</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Working Hours</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Status</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600">Marked By</th>
                          <th className="py-3 px-4 text-xs font-semibold text-gray-600 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        <tr className="hover:bg-gray-50">
                          <td className="py-4 px-4 text-sm text-gray-700 font-medium">
                            {new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(selectedStaff?.raw?.date))}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">
                            {new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(new Date(selectedStaff?.raw?.date))}
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{selectedStaff.timeIn}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{selectedStaff.timeOut}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{selectedStaff.hours}</td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${selectedStaff.status === 'Present' ? 'text-green-700 bg-green-100 border border-green-200' : 'text-red-700 bg-red-50 border border-red-100'}`}>
                              {selectedStaff.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{selectedStaff?.raw?.faceVerified ? "Face Recognition" : "Manual"}</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-center gap-2">
                              <button className="text-gray-400 hover:text-indigo-600"><Eye size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-500">Showing 1 to 7 of 7 entries</p>
                    <div className="flex items-center space-x-1">
                      <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50">«</button>
                      <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium shadow-sm">1</button>
                      <button className="px-3 py-1.5 border border-gray-200 rounded-md text-gray-400 hover:bg-gray-50">»</button>
                    </div>
                  </div>
                </div>

                {/* Check In/Out Photos */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-4">Check In/Out Photos (13 July 2025)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Check In Photo */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Camera size={32} className="text-gray-400" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h4 className="font-semibold text-gray-800 text-sm border-b border-gray-200 pb-2">Check In Photo - 09:15 AM</h4>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <MapPin size={14} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Location</p>
                              <p className="text-xs text-gray-800 font-medium">{selectedStaff?.raw?.locationName || "Unknown Location"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Marked By</p>
                            <p className="text-xs text-gray-800 font-medium">Face Recognition</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Device</p>
                            <p className="text-xs text-gray-800 font-medium">Web Camera</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Check Out Photo */}
                    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 flex gap-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Camera size={32} className="text-gray-400" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <h4 className="font-semibold text-gray-800 text-sm border-b border-gray-200 pb-2">Check Out Photo - 05:45 PM</h4>
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <MapPin size={14} className="text-gray-400 mt-0.5" />
                            <div>
                              <p className="text-xs font-medium text-gray-500">Location</p>
                              <p className="text-xs text-gray-800 font-medium">{selectedStaff?.raw?.locationName || "Unknown Location"}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Marked By</p>
                            <p className="text-xs text-gray-800 font-medium">Face Recognition</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">Device</p>
                            <p className="text-xs text-gray-800 font-medium">Web Camera</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                
                {/* Mini Profile */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <h3 className="text-sm font-bold text-gray-800 text-left mb-4">Staff Profile</h3>
                  <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl mb-3">
                    {selectedStaff.initials}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedStaff.name}</h4>
                  <p className="text-xs font-medium text-orange-600 my-1">{selectedStaff.role}</p>
                  <p className="text-xs text-gray-500">{selectedStaff.email}</p>
                  <p className="text-xs text-gray-500 mb-3">{selectedStaff?.raw?.staffId?.phone || "No Phone"}</p>
                  <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs text-gray-600">
                    <MapPin size={12} className="text-gray-400" /> {selectedStaff?.raw?.locationName || "Unknown Location"}
                  </div>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-4">Attendance Summary (This Month)</h3>
                  <div className="space-y-3">
                    {/* Present */}
                    <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <CalendarIcon size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-green-700 font-medium">Present Days</p>
                          <p className="text-lg font-bold text-gray-900">10</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">76.92%</span>
                    </div>
                    {/* Absent */}
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                          <UserX size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-red-700 font-medium">Absent Days</p>
                          <p className="text-lg font-bold text-gray-900">2</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">15.38%</span>
                    </div>
                    {/* On Leave */}
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                          <CalendarDays size={18} />
                        </div>
                        <div>
                          <p className="text-xs text-amber-700 font-medium">On Leave</p>
                          <p className="text-lg font-bold text-gray-900">1</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-gray-500">7.69%</span>
                    </div>
                  </div>
                </div>


                {/* Working Hours Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-sm font-bold text-gray-800 mb-6">Working Hours Summary</h3>
                  <div className="flex gap-4">
                    <div className="w-32 h-32 relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full border-8 border-green-500 border-r-gray-200">
                        <span className="text-sm font-bold text-gray-900">85h 30m</span>
                        <span className="text-[10px] text-gray-500">Total</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 justify-center flex flex-col">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Present</div>
                        <span className="font-semibold text-gray-600">85h 30m (76.92%)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Absent</div>
                        <span className="font-semibold text-gray-600">-</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> On Leave</div>
                        <span className="font-semibold text-gray-600">-</span>
                      </div>
                    </div>
                  </div>
                </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Attendance Modal */}
      {isEditModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">Edit Attendance</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-sm" defaultValue={selectedStaff.status}>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Late">Late</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
                  <input type="time" defaultValue="09:15" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
                  <input type="time" defaultValue="17:45" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea rows="3" placeholder="Enter reason (e.g., Arrived late due to traffic)" className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 text-sm"></textarea>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Cancel</button>
              <button onClick={() => { alert("Changes saved successfully!"); setIsEditModalOpen(false); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History Modal */}
      {isHistoryModalOpen && selectedStaff && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Attendance History</h3>
                <p className="text-sm text-gray-500 mt-0.5">{selectedStaff.name}</p>
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Check In</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Check Out</th>
                    <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Hours</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">13 Jul 2025</td>
                    <td className="py-3 px-4"><span className="inline-flex px-2 py-1 rounded text-xs font-semibold text-green-700 bg-green-100">Present</span></td>
                    <td className="py-3 px-4 text-sm text-gray-600">09:15 AM</td>
                    <td className="py-3 px-4 text-sm text-gray-600">05:45 PM</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">8h 30m</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">12 Jul 2025</td>
                    <td className="py-3 px-4"><span className="inline-flex px-2 py-1 rounded text-xs font-semibold text-green-700 bg-green-100">Present</span></td>
                    <td className="py-3 px-4 text-sm text-gray-600">09:05 AM</td>
                    <td className="py-3 px-4 text-sm text-gray-600">05:50 PM</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">8h 45m</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">11 Jul 2025</td>
                    <td className="py-3 px-4"><span className="inline-flex px-2 py-1 rounded text-xs font-semibold text-amber-700 bg-amber-100">On Leave</span></td>
                    <td className="py-3 px-4 text-sm text-gray-400">-</td>
                    <td className="py-3 px-4 text-sm text-gray-400">-</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-400">-</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">10 Jul 2025</td>
                    <td className="py-3 px-4"><span className="inline-flex px-2 py-1 rounded text-xs font-semibold text-green-700 bg-green-100">Present</span></td>
                    <td className="py-3 px-4 text-sm text-gray-600">09:00 AM</td>
                    <td className="py-3 px-4 text-sm text-gray-600">06:00 PM</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">9h 00m</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-700">09 Jul 2025</td>
                    <td className="py-3 px-4"><span className="inline-flex px-2 py-1 rounded text-xs font-semibold text-red-700 bg-red-100">Absent</span></td>
                    <td className="py-3 px-4 text-sm text-gray-400">-</td>
                    <td className="py-3 px-4 text-sm text-gray-400">-</td>
                    <td className="py-3 px-4 text-sm font-medium text-gray-400">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setIsHistoryModalOpen(false)} className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
