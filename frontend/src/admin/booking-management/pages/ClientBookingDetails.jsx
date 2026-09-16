import React, { useState } from 'react';
import { 
  Calendar, MapPin, CheckCircle2, Clock, Settings, FileText, 
  MessageSquare, Users, Store, ShieldCheck, UserCircle, Wallet, 
  BellRing, Star, Download, IndianRupee, MessageCircle, AlertCircle, 
  LayoutDashboard, Info, ArrowLeft
} from 'lucide-react';

function ClientBookingDetails({ onBackToDashboard }) {
  const [activeTab, setActiveTab] = useState('overview');

  const data = {
    bookingId: "BK-2026-000145",
    eventDate: "15 August 2026",
    venue: "Royal Palace Hall",
    payment: {
      status: "Partially Paid",
      total: "₹ 5,85,000",
      paid: "₹ 3,00,000",
      pending: "₹ 2,85,000"
    },
    eventSummary: {
      name: "Wedding Ceremony",
      type: "Wedding",
      guests: "350",
      time: "6:00 PM - 11:00 PM",
      daysLeft: "Event Completed",
      hallType: "AC Hall"
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'staff', label: 'Staff & Vendor', icon: Users },
    { id: 'feedback', label: 'Client Feedback', icon: MessageSquare },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'docs', label: 'Documents & Notes', icon: FileText },
  ];

  const approvals = [
    { id: 1, title: 'Client Approval', desc: 'You have approved the booking', date: '10 May 2026', icon: UserCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { id: 2, title: 'Staff Approval', desc: 'All assigned staff have approved', date: '12 Aug 2026', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { id: 3, title: 'Vendor Approval', desc: 'All selected vendors have approved', date: '12 Aug 2026', icon: Store, color: 'text-orange-600', bg: 'bg-orange-100' },
    { id: 4, title: 'Admin Approval', desc: 'Admin has approved the project', date: '12 Aug 2026', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
  ];

  const notifications = [
    { id: 1, title: 'Admin has approved your booking.', date: '12 Aug 2026, 10:30 AM', timeAgo: '2 days ago', icon: CheckCircle2, color: 'text-green-600' },
    { id: 2, title: 'All staff have been assigned to your event.', date: '12 Aug 2026, 11:15 AM', timeAgo: '2 days ago', icon: Users, color: 'text-purple-600' },
    { id: 3, title: 'All vendors have been confirmed.', date: '12 Aug 2026, 12:00 PM', timeAgo: '2 days ago', icon: Store, color: 'text-orange-600' },
    { id: 4, title: 'Advance payment received.', date: '10 May 2026, 09:45 AM', timeAgo: '1 month ago', icon: Wallet, color: 'text-blue-600' },
    { id: 5, title: 'Pending payment reminder sent.', date: '18 Aug 2026, 10:00 AM', timeAgo: '-', icon: BellRing, color: 'text-yellow-600' },
  ];

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1500px]">
      
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap items-center gap-2 text-[14px]">
            <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Dashboard</span>
            <span className="text-gray-400">›</span>
            <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>My Bookings</span>
            <span className="text-gray-400">›</span>
            <span className="font-black text-gray-900">Booking Details</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <div className="relative cursor-pointer">
              <BellRing size={20} className="text-gray-600" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border border-white">
                8
              </div>
            </div>
            <div className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200">
              <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="John Doe" className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-[13px] font-black text-gray-900 leading-tight">John Doe</p>
                <p className="text-[11px] font-bold text-gray-500">Client</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Summary Banner */}
      <div className="bg-[#fcfaf8] rounded-xl border border-gray-100 p-6 shadow-sm flex flex-col xl:flex-row gap-8">
        
        {/* Left: Booking Info */}
        <div className="xl:w-[250px] shrink-0">
          <p className="text-[13px] font-bold text-gray-500 mb-1">Booking ID</p>
          <h2 className="text-[24px] font-black text-orange-500 mb-6">{data.bookingId}</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[11px] font-bold text-gray-500 mb-1">Event Date</p>
              <div className="flex items-center gap-2 text-gray-900 font-black text-[14px]">
                <Calendar size={16} /> {data.eventDate}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500 mb-1">Venue</p>
              <div className="flex items-center gap-2 text-gray-900 font-black text-[14px]">
                <MapPin size={16} /> {data.venue}
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Status Timeline */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Clock size={18} className="text-green-600" />
            <span className="text-[13px] font-bold text-gray-700">Booking Status</span>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-[11px] font-bold">
              Not Completed
            </span>
          </div>

          <div className="relative max-w-2xl mx-auto px-4 sm:px-10">
            <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-gray-200"></div>
            <div className="absolute top-4 left-[10%] right-[50%] h-[2px] bg-green-500 z-0"></div>

            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                  <Calendar size={14} />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-black text-gray-900">Booked</p>
                  <p className="text-[11px] font-bold text-gray-500">05 May 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 size={14} />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-black text-gray-900">Confirmed</p>
                  <p className="text-[11px] font-bold text-gray-500">10 May 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 border border-orange-200 flex items-center justify-center shadow-[0_0_0_4px_rgba(249,115,22,0.1)] -mt-1">
                  <Settings size={20} className="animate-spin-slow" />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-black text-gray-900">In Progress</p>
                  <p className="text-[11px] font-bold text-gray-500">14 Aug 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center border border-blue-200">
                  <Calendar size={14} />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-black text-gray-500">Event Day</p>
                  <p className="text-[11px] font-bold text-gray-400">15 Aug 2026</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center">
                  <CheckCircle2 size={14} />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-black text-gray-400">Completed</p>
                  <p className="text-[11px] font-bold text-gray-400">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Financials */}
        <div className="xl:w-[280px] shrink-0 bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <span className="text-[13px] font-bold text-gray-600">Payment Status</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[11px] font-black">
              {data.payment.status}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-bold text-gray-600">Total Amount</span>
            <span className="text-[14px] font-black text-gray-900">{data.payment.total}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[13px] font-bold text-gray-600">Paid Amount</span>
            <span className="text-[14px] font-black text-gray-900">{data.payment.paid}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-[13px] font-black text-gray-900">Pending Amount</span>
            <span className="text-[15px] font-black text-red-500">{data.payment.pending}</span>
          </div>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200 bg-white rounded-t-xl px-2 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[13px] font-bold whitespace-nowrap transition-colors relative
                ${isActive ? 'text-orange-500' : 'text-gray-500 hover:text-gray-800'}
              `}
            >
              <Icon size={16} />
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500 rounded-t-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Main Content Area */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Project Approval Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-[16px] font-black text-gray-900 mb-1">Project Approval Status</h3>
            <p className="text-[12px] font-medium text-gray-500 mb-6">See who has approved the booking and project.</p>
            
            <div className="flex flex-col gap-6 flex-1">
              {approvals.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bg} ${item.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-gray-900">{item.title}</h4>
                        <p className="text-[11px] font-medium text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2.5 py-1 bg-green-100 text-green-600 rounded-md text-[10px] font-black leading-none">
                        Approved
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-[11px] font-bold text-blue-600 leading-relaxed">
              Note: The event is not completed yet. You can view details, communicate and provide feedback.
            </div>
          </div>

          {/* Middle Column: Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
            <h3 className="text-[16px] font-black text-gray-900 mb-1">Notifications</h3>
            <p className="text-[12px] font-medium text-gray-500 mb-6">Stay updated with latest notifications.</p>
            
            <div className="flex flex-col gap-5 flex-1">
              {notifications.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="flex items-start justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Icon size={18} className={`mt-0.5 ${item.color}`} />
                      <div>
                        <h4 className="text-[12px] font-bold text-gray-900 mb-1 leading-tight">{item.title}</h4>
                        <p className="text-[11px] font-medium text-gray-400">{item.date}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-2 mt-1">{item.timeAgo}</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 text-center">
              <button className="px-6 py-2 border border-orange-200 text-orange-500 rounded-lg text-[12px] font-bold hover:bg-orange-50 transition-colors">
                View All Notifications
              </button>
            </div>
          </div>

          {/* Right Column: Feedback & Quick Actions */}
          <div className="flex flex-col gap-6">
            
            {/* Client Feedback Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-[15px] font-black text-gray-900 mb-4">Client Feedback</h3>
              <div className="bg-[#fff9eb] rounded-xl border border-yellow-100 p-6 flex flex-col items-center justify-center text-center">
                <div className="relative mb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white relative z-10 shadow-sm border-2 border-white">
                    <MessageSquare size={24} />
                  </div>
                  <div className="w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center text-white absolute -bottom-2 -right-4 z-0 border-2 border-white">
                    <MessageSquare size={14} />
                  </div>
                </div>
                
                <div className="flex gap-1 text-yellow-400 mb-3">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                
                <h4 className="text-[14px] font-black text-orange-600 mb-1">Event not completed yet</h4>
                <p className="text-[11px] font-medium text-gray-500 leading-tight px-4">
                  You can submit your feedback after the event is completed.
                </p>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
              <h3 className="text-[15px] font-black text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">Message Admin</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IndianRupee size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">Make Payment</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">View Invoice</span>
                </button>
                <button className="flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-sm transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Download size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-gray-700 text-center leading-tight">Download Contract</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Event Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-2">
        <h3 className="text-[16px] font-black text-gray-900 mb-6">Event Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
          <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-600 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Event Name</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <UserCircle size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Event Type</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Guest Count</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.guests}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Event Time</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-100 pr-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Days Left</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.daysLeft}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Store size={18} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-500">Hall Type</p>
              <p className="text-[13px] font-black text-gray-900">{data.eventSummary.hallType}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-lg py-3 px-4 flex items-center justify-center gap-2">
          <Info size={16} className="text-blue-500" />
          <p className="text-[12px] font-bold text-blue-600">
            The event is in progress. Please make sure all arrangements are going as planned.
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 flex items-center justify-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-8 py-3 bg-[#1e293b] hover:bg-gray-800 text-white rounded-lg text-[14px] font-bold transition-colors shadow-sm"
        >
          <ArrowLeft size={18} />
          Go Back to Dashboard
        </button>
      </div>

    </div>
  );
}

export default ClientBookingDetails;
