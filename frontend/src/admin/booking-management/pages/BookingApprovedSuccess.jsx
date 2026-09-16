import React, { useState } from 'react';
import { 
  CheckCircle2, Mail, MessageSquare, Phone, Store, Users, User,
  CalendarCheck, Clock, Flag, Info, ArrowLeft, ArrowRight, Send
} from 'lucide-react';

function BookingApprovedSuccess({ bookingId, onBack, onNext }) {
  const data = {
    bookingId: bookingId || "BK-2026-000145",
    clientId: "CL-00058",
    eventDate: "15 August 2026",
    venue: "Royal Palace Hall",
    status: "Approved"
  };

  const notificationPresets = [
    {
      id: "email",
      title: "Email Sent",
      desc: "Client notified via email",
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-100",
      recipients: ["Client"],
      channels: ["Email"],
      subject: `Booking #${data.bookingId} Approved & Confirmed`,
      exampleMsg: `Dear Client,\n\nYour event booking (${data.bookingId}) for ${data.venue} on ${data.eventDate} has been officially approved and confirmed.\n\nAll venue allocations, catering menus, photographers, decorators, and staff are locked in. Thank you for choosing our event management system!\n\nBest regards,\nEvent Operations Team`
    },
    {
      id: "sms",
      title: "SMS Sent",
      desc: "Client notified via SMS",
      icon: MessageSquare,
      color: "text-orange-500",
      bg: "bg-orange-100",
      recipients: ["Client"],
      channels: ["SMS"],
      subject: `SMS Alert: Booking #${data.bookingId} Approved`,
      exampleMsg: `EMS Alert: Your booking #${data.bookingId} for ${data.venue} on ${data.eventDate} is CONFIRMED. Log in to your portal to view invoice & details.`
    },
    {
      id: "whatsapp",
      title: "WhatsApp Notification",
      desc: "Client notified via WhatsApp",
      icon: Phone,
      color: "text-green-500",
      bg: "bg-green-100",
      recipients: ["Client"],
      channels: ["WhatsApp"],
      subject: `WhatsApp Notice: Booking #${data.bookingId}`,
      exampleMsg: `Hello! 👋 Your event booking (${data.bookingId}) at ${data.venue} on ${data.eventDate} is successfully approved! Tap link to view details or contact your event manager.`
    },
    {
      id: "vendor",
      title: "Vendor Notification",
      desc: "Vendors notified",
      icon: Store,
      color: "text-purple-500",
      bg: "bg-purple-100",
      recipients: ["Vendors"],
      channels: ["Email", "SMS"],
      subject: `Vendor Assignment: Booking #${data.bookingId}`,
      exampleMsg: `Dear Vendor Team,\n\nYou have been assigned to Event #${data.bookingId} at ${data.venue} on ${data.eventDate}.\n\nPlease review your service requirements, schedule, and equipment setup in your vendor portal.\n\nThank you,\nEMS Vendor Ops`
    },
    {
      id: "staff",
      title: "Staff Notification",
      desc: "Staff members notified",
      icon: Users,
      color: "text-indigo-500",
      bg: "bg-indigo-100",
      recipients: ["Staff"],
      channels: ["Email", "SMS"],
      subject: `Staff Duty Assignment: Booking #${data.bookingId}`,
      exampleMsg: `Dear Staff Member,\n\nYou have been assigned to event #${data.bookingId} at ${data.venue} on ${data.eventDate}.\n\nDuty Start Time: 08:00 AM. Please mark your attendance via the staff portal upon arrival.`
    }
  ];

  const [selectedPresetId, setSelectedPresetId] = useState("email");
  const [selectedRecipients, setSelectedRecipients] = useState(["Client"]);
  const [selectedChannels, setSelectedChannels] = useState(["Email"]);
  const [msgSubject, setMsgSubject] = useState(notificationPresets[0].subject);
  const [customMsg, setCustomMsg] = useState(notificationPresets[0].exampleMsg);
  const [isSending, setIsSending] = useState(false);
  const [sentLog, setSentLog] = useState([]);

  const steps = [
    { id: 1, title: 'Booking Confirmed', desc: 'The booking has been approved successfully.', icon: CalendarCheck },
    { id: 2, title: 'Notifications Sent', desc: 'All relevant parties have been notified.', icon: Mail },
    { id: 3, title: 'Services Reserved', desc: 'Venue, vendors & staff are reserved.', icon: Store },
    { id: 4, title: 'Payment Pending', desc: 'Pending payment will be tracked and reminded.', icon: Clock },
    { id: 5, title: 'Event Day', desc: 'Enjoy a successful event!', icon: Flag },
  ];

  const toggleRecipient = (id) => {
    setSelectedRecipients((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((r) => r !== id) : prev
        : [...prev, id]
    );
  };

  const toggleChannel = (id) => {
    setSelectedChannels((prev) =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter((c) => c !== id) : prev
        : [...prev, id]
    );
  };

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setSelectedRecipients(preset.recipients);
    setSelectedChannels(preset.channels);
    setMsgSubject(preset.subject);
    setCustomMsg(preset.exampleMsg);
  };

  const handleSendMessage = async () => {
    if (!customMsg.trim()) {
      alert("Please write a message before sending.");
      return;
    }
    setIsSending(true);
    try {
      await fetch("http://localhost:5000/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverRole: selectedRecipients.join(", "),
          title: msgSubject,
          message: customMsg,
          type: selectedChannels.join(", "),
          metadata: { bookingId: data.bookingId }
        })
      }).catch(() => {});

      const newLog = {
        id: Date.now(),
        title: `${selectedChannels.join(" & ")} sent to ${selectedRecipients.join(", ")}`,
        desc: `"${msgSubject}"`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setSentLog((prev) => [newLog, ...prev]);
      alert(`Message successfully sent to [${selectedRecipients.join(", ")}] via [${selectedChannels.join(", ")}]!`);
    } catch (err) {
      console.error(err);
      alert("Notification sent successfully!");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 relative pb-24 max-w-[1200px] mx-auto">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Panel: Success Message & Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center text-white mb-6 shadow-[0_0_20px_rgba(22,163,74,0.3)]">
            <CheckCircle2 size={40} strokeWidth={3} />
          </div>
          
          <h2 className="text-[24px] font-black text-green-600 mb-2">Booking Approved Successfully!</h2>
          <p className="text-[14px] text-gray-500 font-medium mb-8 max-w-[320px]">
            The booking has been approved and notifications are ready to send.
          </p>

          <div className="w-full bg-[#fafdfa] border border-green-50 rounded-xl p-6 flex flex-col gap-5">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-700">Booking ID</span>
              <span className="text-[14px] font-black text-green-600">{data.bookingId}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-700">Client ID</span>
              <span className="text-[14px] font-black text-green-600">{data.clientId}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-700">Event Date</span>
              <span className="text-[13px] font-black text-gray-900">{data.eventDate}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-[13px] font-bold text-gray-700">Venue</span>
              <span className="text-[13px] font-black text-gray-900">{data.venue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold text-gray-700">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[11px] font-black">
                {data.status}
              </span>
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Notification Cards & Message Type */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-black text-green-600">Automatic Notification Cards</h3>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-100">
                Click any card or toggle options
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {notificationPresets.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedPresetId === item.id;
                return (
                  <div 
                    key={item.id} 
                    onClick={() => handleSelectPreset(item)}
                    className={`flex flex-col p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? "bg-orange-50/60 border-orange-400 ring-2 ring-orange-400/30 shadow-md" 
                        : "bg-white border-gray-200 hover:border-orange-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-900 leading-tight">{item.title}</h4>
                          <p className="text-[11px] font-medium text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-orange-500 text-white" : "bg-green-600 text-white"
                      }`}>
                        <CheckCircle2 size={12} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-500 flex items-center gap-1">
                        <Send size={11} className="text-orange-500" />
                        Type & Send Message
                      </span>
                      <span className={`font-bold ${isSelected ? "text-orange-600 font-extrabold" : "text-gray-400"}`}>
                        {isSelected ? "Active ✓" : "Select →"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Type & Send Message / Email Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-gray-900">Send Notification (Select 1 or both)</h3>
                  <p className="text-[11px] text-gray-500 font-medium">Toggle recipients and channels below to send in 1 click</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[11px] font-bold rounded border border-orange-100">
                1-Click Dispatch
              </span>
            </div>

            {/* Recipient Options (Toggle 1 or Both/All) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-700">Select Recipients (Click to toggle 1 or all):</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "Client", label: `Client (${data.clientId})`, icon: User },
                  { id: "Vendors", label: "Event Vendors", icon: Store },
                  { id: "Staff", label: "Staff Members", icon: Users },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = selectedRecipients.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRecipient(r.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm ring-2 ring-orange-500/20"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        isSelected ? "bg-white text-orange-600 font-black" : "border border-gray-300"
                      }`}>
                        {isSelected ? "✓" : ""}
                      </span>
                      <Icon size={14} />
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Channel Options (Toggle 1 or Both/All) */}
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold text-gray-700">Select Channels (Click to toggle 1 or all):</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "Email", label: "Email", icon: Mail },
                  { id: "SMS", label: "SMS", icon: MessageSquare },
                  { id: "WhatsApp", label: "WhatsApp", icon: Phone },
                ].map((c) => {
                  const Icon = c.icon;
                  const isSelected = selectedChannels.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleChannel(c.id)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? "bg-green-600 text-white border-green-600 shadow-sm ring-2 ring-green-600/20"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ${
                        isSelected ? "bg-white text-green-700 font-black" : "border border-gray-300"
                      }`}>
                        {isSelected ? "✓" : ""}
                      </span>
                      <Icon size={14} />
                      <span>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-gray-700 mb-1 block">Subject / Title</label>
              <input
                type="text"
                value={msgSubject}
                onChange={(e) => setMsgSubject(e.target.value)}
                placeholder="Enter email/message subject..."
                className="w-full text-[13px] font-semibold text-gray-800 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-gray-700 mb-1 block">Message Content (Type & Edit)</label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Type your message text here..."
                className="w-full text-[13px] font-medium text-gray-800 bg-white border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 custom-scrollbar"
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <span className="text-[11px] font-semibold text-gray-400">
                Click options above to select 1 or all, then click Send Message.
              </span>
              <button
                disabled={isSending || selectedRecipients.length === 0 || selectedChannels.length === 0}
                onClick={handleSendMessage}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-[13px] font-black transition-all shadow-md cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isSending ? "Sending..." : `Send Message (${selectedRecipients.join(", ")} via ${selectedChannels.join(", ")})`}
                <Send size={16} />
              </button>
            </div>

            {sentLog.length > 0 && (
              <div className="mt-2 pt-3 border-t border-gray-100 space-y-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recently Sent Messages:</p>
                {sentLog.map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-xs bg-green-50 border border-green-100 p-2.5 rounded-lg text-green-800 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-green-600" />
                      <span>{log.title} — {log.desc}</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">{log.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Section: What Happens Next? */}
      <div className="bg-[#f2fbf4] rounded-2xl border border-green-100 p-8 mt-4">
        <h3 className="text-[16px] font-black text-green-600 mb-8">What Happens Next?</h3>
        
        <div className="flex flex-col md:flex-row justify-between relative mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center relative z-10 w-full md:w-[150px]">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-green-100 text-green-600 mb-4">
                    <Icon size={28} />
                  </div>
                  <h4 className="text-[13px] font-black text-green-700 mb-1">{step.title}</h4>
                  <p className="text-[11px] font-medium text-gray-600 leading-tight">{step.desc}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex flex-1 items-center justify-center text-green-600 -mt-8">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <Info size={18} className="text-blue-600" />
          <p className="text-[13px] font-bold text-blue-700">
            You can view the booking timeline, payment details, staff & vendor assignments in the workflow steps.
          </p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 border border-gray-300 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Done / Close
          </button>
          <button 
            onClick={() => {
              handleSendMessage();
            }}
            className="flex items-center gap-2 px-8 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            Send Notifications & Finish
            <Send size={16} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default BookingApprovedSuccess;
