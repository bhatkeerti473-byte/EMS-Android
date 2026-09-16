import React, { useState, useMemo } from "react";
import { 
  ArrowLeft, Edit3, Trash2, Calendar, DollarSign, Wallet, 
  MapPin, Phone, Mail, CheckCircle2, ShoppingBag, CreditCard, Clock
} from "lucide-react";

function ClientDetails({ client, onBack }) {
  const [activeTab, setActiveTab] = useState("Personal Information");

  const tabs = [
    "Personal Information", "Booking History", "Selected Services", "Payment History"
  ];

  // Helper to normalize amount formatting
  const formatAmount = (val) => {
    return `₹ ${Number(val || 0).toLocaleString("en-IN")}`;
  };

  // Compile list of unique services taken across all bookings
  const servicesTaken = useMemo(() => {
    if (!client.bookingsList) return [];
    const unique = new Set();
    client.bookingsList.forEach(b => {
      if (b.services) {
        b.services.forEach(s => unique.add(s));
      }
    });
    return Array.from(unique);
  }, [client.bookingsList]);

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Back Button */}
      <div className="flex items-center gap-2 text-gray-500 hover:text-gray-900 cursor-pointer w-fit transition-colors" onClick={onBack}>
        <ArrowLeft size={16} />
        <span className="text-sm font-semibold">Back to Clients</span>
      </div>

      {/* Profile Header & Top Cards */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        
        {/* Profile Info */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 shrink-0">
              <img 
                src={client.img} 
                alt={client.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop";
                }}
              />
            </div>
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-600 border border-green-200">Active</span>
            </div>
            <p className="text-sm font-bold text-gray-500 mb-2">Client ID: {client.id}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {client.phone}</span>
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {client.email}</span>
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" /> {client.location || client.city}</span>
            </div>
          </div>
        </div>

        {/* Top Right KPI Summary */}
        <div className="flex flex-col gap-4 items-start xl:items-end w-full xl:w-auto">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500">Total Bookings</p>
                <p className="text-lg font-black text-gray-900 leading-none mt-1">{client.totalBookings || client.bookings}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-500 flex items-center justify-center shrink-0">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500">Total Paid</p>
                <p className="text-lg font-black text-gray-900 leading-none mt-1">{formatAmount(client.totalPaid)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-500">Pending</p>
                <p className="text-lg font-black text-gray-900 leading-none mt-1">{formatAmount(client.pendingAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex overflow-x-auto custom-scrollbar border-b border-gray-100 bg-gray-50/50">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-[#ff7b00] text-[#ff7b00] bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6">
          
          {/* TAB 1: Personal Info */}
          {activeTab === "Personal Information" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-6">Contact Profile Details</h3>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: client.name },
                    { label: "Phone Number", value: client.phone },
                    { label: "Email Address", value: client.email },
                    { label: "Registered ID / Key", value: client.id },
                    { label: "Primary Location", value: client.location || "N/A" },
                    { label: "Billing City", value: client.city || "N/A" },
                    { label: "Billing State", value: client.state || "N/A" },
                    { label: "PIN Code", value: client.pin || "N/A" },
                  ].map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 border-b border-gray-50 pb-2">
                      <div className="col-span-1 text-[13px] font-bold text-gray-500">{item.label}</div>
                      <div className="col-span-2 text-[14px] font-semibold text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-[15px] font-bold text-gray-900 mb-2">Registration Status</h4>
                  <p className="text-[13px] text-gray-500 leading-relaxed mb-4">
                    This account is synced dynamically with all booking logs submitted on this device. Updates made on client bookings reflect in real-time.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span className="text-[13px] font-bold text-gray-700">Verified System Profile</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Booking History */}
          {activeTab === "Booking History" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">Events Booked History</h3>
              {client.bookingsList && client.bookingsList.map((booking, idx) => (
                <div key={idx} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-5 rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
                  <div className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl bg-orange-50 text-[#ff7b00] flex items-center justify-center shrink-0 border border-orange-100">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-black text-gray-900 mb-1">{booking.title}</h4>
                      <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin size={13} className="text-gray-400" /> {booking.venue}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {booking.services && booking.services.map((s, si) => (
                          <span key={si} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-bold border border-gray-200 rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-6 sm:w-auto w-full">
                    <div className="text-[13px] font-bold text-gray-500 flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" /> {booking.date} ({booking.timeSlot})
                    </div>
                    <div className="text-[15px] font-black text-gray-950">{formatAmount(booking.amount)}</div>
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider ${
                      booking.status.toLowerCase().includes("confirm") ? "bg-green-50 text-green-700 border border-green-200" :
                      booking.status.toLowerCase().includes("await") ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
              {(!client.bookingsList || client.bookingsList.length === 0) && (
                <p className="text-center py-8 text-gray-500 font-medium">No bookings logged for this client.</p>
              )}
            </div>
          )}

          {/* TAB 3: Selected Services */}
          {activeTab === "Selected Services" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-bold text-gray-900 mb-2">Services & Vendors Engaged</h3>
              <p className="text-[13px] font-medium text-gray-500 mb-4">Complete list of specialized solutions requested across all bookings.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {servicesTaken.map((s, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border border-gray-100 flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100 mt-0.5">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900 leading-tight">{s.split(":")[0]}</h4>
                      <p className="text-[12px] font-semibold text-gray-500 mt-1">{s.split(":")[1] || s}</p>
                    </div>
                  </div>
                ))}
                {servicesTaken.length === 0 && (
                  <div className="col-span-full py-8 text-center text-gray-500 font-medium">No custom services recorded yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: Payment History */}
          {activeTab === "Payment History" && (
            <div className="flex flex-col gap-4">
              <h3 className="text-[16px] font-bold text-gray-900 mb-4">Catering & Booking Payment Breakdown</h3>
              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Booking Event</th>
                      <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Total Contract Value</th>
                      <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Paid (Advance)</th>
                      <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Balance Due</th>
                      <th className="px-6 py-4 text-[12px] font-black text-gray-900 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 bg-white">
                    {client.bookingsList && client.bookingsList.map((b, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-[14px] font-bold text-gray-900">{b.title}</td>
                        <td className="px-6 py-4 text-[14px] font-black text-gray-950">{formatAmount(b.amount)}</td>
                        <td className="px-6 py-4 text-[14px] font-semibold text-green-700">{formatAmount(b.advancePaid)}</td>
                        <td className="px-6 py-4 text-[14px] font-semibold text-orange-600">{formatAmount(b.pending)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider ${
                            b.status.toLowerCase().includes("confirm") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!client.bookingsList || client.bookingsList.length === 0) && (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-gray-500 font-medium">No billing entries found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ClientDetails;
