import React from 'react';
import { 
  Calendar, Check, Hourglass, CalendarDays, Clock, User, 
  MessageSquare, ArrowLeft, ArrowRight
} from 'lucide-react';

function Step5BookingTimeline({ bookingId, onBackToDashboard, onPrevious, onNext }) {
  const data = {
    bookingId: bookingId || "BK-2026-000145",
    clientId: "CL-00058",
    status: "Working"
  };

  const timelineData = [
    {
      id: 1,
      status: "completed",
      step: "Booking Created",
      date: "18 July 2026",
      time: "09:20 AM",
      updatedBy: { name: "System", role: "" },
      remarks: "Booking successfully created."
    },
    {
      id: 2,
      status: "completed",
      step: "Client Submitted Request",
      date: "18 July 2026",
      time: "09:45 AM",
      updatedBy: { name: "Ashwitha Naik", role: "Client" },
      remarks: "Wedding booking submitted."
    },
    {
      id: 3,
      status: "completed",
      step: "Admin Reviewed",
      date: "18 July 2026",
      time: "11:30 AM",
      updatedBy: { name: "Admin", role: "Super Admin" },
      remarks: "All documents verified."
    },
    {
      id: 4,
      status: "completed",
      step: "Venue Reserved",
      date: "19 July 2026",
      time: "10:00 AM",
      updatedBy: { name: "Venue Manager", role: "Royal Palace" },
      remarks: "Royal Palace Hall reserved."
    },
    {
      id: 5,
      status: "completed",
      step: "Vendors Assigned",
      date: "20 July 2026",
      time: "02:15 PM",
      updatedBy: { name: "Operations Manager", role: "EMS Team" },
      remarks: "Photography, DJ, Decoration\nand Catering assigned."
    },
    {
      id: 6,
      status: "completed",
      step: "Advance Payment Received",
      date: "20 July 2026",
      time: "05:10 PM",
      updatedBy: { name: "Accounts", role: "Finance Team" },
      remarks: "₹1,50,000 received."
    },
    {
      id: 7,
      status: "warning",
      step: "Remaining Payment Pending",
      dateLabel: "Due Date",
      date: "25 July 2026",
      time: "-",
      updatedBy: { name: "Accounts Team", role: "Finance Team" },
      remarks: "Pending Amount: ₹2,40,000\nReminder sent to client."
    },
    {
      id: 8,
      status: "completed",
      step: "Reminder Sent",
      date: "23 July 2026",
      time: "09:00 AM",
      updatedBy: { name: "System", role: "" },
      remarks: "SMS and Email reminder sent."
    },
    {
      id: 9,
      status: "pending",
      step: "Final Payment Received",
      date: "-",
      time: "-",
      updatedBy: { name: "-", role: "" },
      remarks: "Waiting for final payment."
    },
    {
      id: 10,
      status: "pending",
      step: "Event Completed",
      date: "-",
      time: "-",
      updatedBy: { name: "-", role: "" },
      remarks: "Will be updated after\nevent completion."
    }
  ];

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1500px]">
      
      {/* Header & Breadcrumbs */}
      <div>
        <div className="flex flex-wrap items-center gap-2 text-[14px] mb-4">
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Dashboard</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={onBackToDashboard}>Booking Management</span>
          <span className="text-gray-400">›</span>
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => onPrevious(3)}>Booking Details</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Step 5 – Booking Timeline</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-6 text-[13px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Booking ID :</span>
            <span className="font-black text-orange-500">{data.bookingId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Client ID :</span>
            <span className="font-black text-blue-600">{data.clientId}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-500">Booking Status :</span>
            <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-[11px] font-black rounded border border-green-200">
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between relative overflow-hidden h-[120px]">
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center border border-blue-100">
            <CalendarDays size={28} />
          </div>
          <div>
            <h2 className="text-[22px] font-black text-indigo-900 leading-tight">Booking Timeline</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-1">Track all important steps and activities of this booking.</p>
          </div>
        </div>
        
        {/* Decorative graphic representation based on design */}
        <div className="absolute right-0 top-0 bottom-0 w-[400px] pointer-events-none opacity-50 flex items-center justify-end pr-10">
          <div className="w-48 h-32 bg-indigo-50/50 rounded-2xl relative">
            <div className="absolute top-4 left-4 right-4 h-6 bg-blue-100 rounded-t-lg"></div>
            <div className="absolute top-12 left-4 right-4 bottom-4 bg-white rounded-b-lg border border-indigo-50"></div>
            <div className="absolute -bottom-4 right-10 w-16 h-16 rounded-full bg-blue-100/50 flex items-center justify-center border-2 border-white shadow-sm">
              <Clock size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-4 pl-12 pr-4 font-bold text-gray-900 text-[13px] w-[350px]">Timeline Step</th>
              <th className="py-4 px-4 font-bold text-gray-900 text-[13px]">Date</th>
              <th className="py-4 px-4 font-bold text-gray-900 text-[13px]">Time</th>
              <th className="py-4 px-4 font-bold text-gray-900 text-[13px]">Updated By</th>
              <th className="py-4 px-4 font-bold text-gray-900 text-[13px]">Remarks</th>
            </tr>
          </thead>
          <tbody className="relative">
            {/* The vertical dashed line */}
            <div className="absolute left-[26px] top-4 bottom-10 w-[2px] border-l-2 border-dashed border-gray-200 z-0"></div>

            {timelineData.map((item, index) => {
              const isWarning = item.status === "warning";
              const isCompleted = item.status === "completed";
              const isPending = item.status === "pending";

              return (
                <tr 
                  key={item.id} 
                  className={`
                    relative z-10 transition-colors
                    ${isWarning ? 'bg-orange-50/50' : 'hover:bg-gray-50/50'}
                  `}
                >
                  <td className="py-5 pl-12 pr-4 relative">
                    {/* Node Icon */}
                    <div className={`
                      absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-10
                      ${isCompleted ? 'bg-[#00b050] text-white shadow-sm' : ''}
                      ${isWarning ? 'bg-orange-500 text-white shadow-sm' : ''}
                      ${isPending ? 'bg-white border-2 border-gray-300' : ''}
                    `}>
                      {isCompleted && <Check size={14} strokeWidth={3} />}
                      {isWarning && <Hourglass size={12} strokeWidth={3} />}
                    </div>

                    {/* Warning Left Border Overlay */}
                    {isWarning && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
                    )}

                    <span className={`text-[13px] font-bold ${isWarning ? 'text-orange-500' : 'text-gray-800'}`}>
                      {item.step}
                    </span>
                  </td>
                  
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      {item.date !== "-" && <Calendar size={14} className={isWarning ? "text-orange-500" : "text-gray-400"} />}
                      <div>
                        {item.dateLabel && <p className="text-[10px] font-bold text-orange-500">{item.dateLabel}</p>}
                        <span className={`text-[13px] font-medium ${isWarning ? 'text-orange-500' : 'text-gray-600'}`}>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2">
                      {item.time !== "-" && <Clock size={14} className="text-gray-400" />}
                      <span className={`text-[13px] font-medium ${isWarning ? 'text-orange-500' : 'text-gray-600'}`}>
                        {item.time}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-5 px-4">
                    <div className="flex items-start gap-2">
                      {item.updatedBy.name !== "-" && <User size={14} className="text-gray-400 mt-0.5" />}
                      <div>
                        <p className={`text-[13px] font-bold ${isWarning ? 'text-gray-900' : 'text-gray-800'}`}>
                          {item.updatedBy.name}
                        </p>
                        {item.updatedBy.role && (
                          <p className="text-[11px] font-medium text-gray-500">{item.updatedBy.role}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="py-5 px-4">
                    <div className="flex items-start gap-2">
                      {item.remarks && item.remarks !== "-" && <MessageSquare size={14} className={isWarning ? "text-orange-500 mt-0.5" : "text-gray-400 mt-0.5"} />}
                      <div className={`text-[13px] whitespace-pre-line ${isWarning ? 'font-bold text-orange-500' : 'font-medium text-gray-800'}`}>
                        {item.remarks}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onPrevious(4)}
          className="flex items-center gap-2 px-6 py-2.5 border border-orange-200 rounded-lg text-[13px] font-bold text-orange-500 hover:bg-orange-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Previous
        </button>
        
        <button 
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          Next
          <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}

export default Step5BookingTimeline;
