import React, { useState } from 'react';
import { 
  FileText, User, CalendarDays, Calendar, MapPin, Users, 
  CircleDollarSign, Wallet, FileEdit, Check, X, Lock, 
  Ban, MessageSquare, ArrowLeft, ArrowRight, Save
} from 'lucide-react';

function Step6Approval({ bookingId, onBackToDashboard, onPrevious, onNext }) {
  const [selectedAction, setSelectedAction] = useState('approve');
  const [reason, setReason] = useState('');
  const [suggestedAlternative, setSuggestedAlternative] = useState('');
  const [loading, setLoading] = useState(false);

  const data = {
    bookingId: bookingId || "BK-2026-000145",
    clientId: "CL-00058",
    status: "Pending Approval"
  };

  const actionCards = [
    { 
      id: 'approve', 
      title: 'Approve Booking', 
      desc: 'Approve this booking and confirm all details.', 
      icon: Check, 
      color: 'text-green-500', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      activeBorder: 'border-green-500',
      activeShadow: 'ring-1 ring-green-500',
      radioBorder: 'border-green-500',
      radioBg: 'bg-green-500'
    },
    { 
      id: 'reject', 
      title: 'Reject Booking', 
      desc: 'Reject this booking request and cancel the process.', 
      icon: X, 
      color: 'text-red-500', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      activeBorder: 'border-red-500',
      activeShadow: 'ring-1 ring-red-500',
      radioBorder: 'border-red-500',
      radioBg: 'bg-red-500'
    },
    { 
      id: 'block', 
      title: 'Block Booking', 
      desc: 'Block this booking to prevent any further actions.', 
      icon: Lock, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-50', 
      borderColor: 'border-orange-200',
      activeBorder: 'border-orange-500',
      activeShadow: 'ring-1 ring-orange-500',
      radioBorder: 'border-orange-500',
      radioBg: 'bg-orange-500'
    },
    { 
      id: 'cancel', 
      title: 'Cancel Booking', 
      desc: 'Cancel this booking due to unavailability or other reasons.', 
      icon: Ban, 
      color: 'text-purple-500', 
      bgColor: 'bg-purple-50', 
      borderColor: 'border-purple-200',
      activeBorder: 'border-purple-500',
      activeShadow: 'ring-1 ring-purple-500',
      radioBorder: 'border-purple-500',
      radioBg: 'bg-purple-500'
    },
    { 
      id: 'request_changes', 
      title: 'Request Changes', 
      desc: 'Request client to make changes in the booking.', 
      icon: MessageSquare, 
      color: 'text-blue-500', 
      bgColor: 'bg-blue-50', 
      borderColor: 'border-blue-200',
      activeBorder: 'border-blue-500',
      activeShadow: 'ring-1 ring-blue-500',
      radioBorder: 'border-blue-500',
      radioBg: 'bg-blue-500'
    },
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
          <span className="font-bold text-gray-800 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => onPrevious(4)}>Booking Details</span>
          <span className="text-gray-400">›</span>
          <span className="font-black text-gray-900">Step 6 – Approval</span>
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
            <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-600 text-[11px] font-black rounded border border-yellow-200">
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-[18px] font-black text-gray-900">Booking Summary</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Review booking details before taking action.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Booking ID</p>
              <h4 className="text-[15px] font-black text-gray-900">BK-2026-000145</h4>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
              <User size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Client Name</p>
              <h4 className="text-[15px] font-black text-gray-900">Ashwitha Naik</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center shrink-0 border border-yellow-100">
              <CalendarDays size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Event Type</p>
              <h4 className="text-[15px] font-black text-gray-900">Wedding Reception</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
              <Calendar size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Event Date & Time</p>
              <h4 className="text-[15px] font-black text-gray-900">25 July 2026, 06:00 PM</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Venue</p>
              <h4 className="text-[15px] font-black text-gray-900">Royal Grand Palace</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0 border border-teal-100">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Guest Count</p>
              <h4 className="text-[15px] font-black text-gray-900">250 Guests</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 border border-green-100">
              <CircleDollarSign size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Total Amount</p>
              <h4 className="text-[15px] font-black text-green-600">₹ 5,57,300</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-1">Pending Amount</p>
              <h4 className="text-[15px] font-black text-red-500">₹ 2,40,000</h4>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
              <FileEdit size={18} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-gray-500 mb-2">Booking Status</p>
              <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-600 text-[11px] font-black rounded border border-yellow-200">
                Pending Approval
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Decision */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100">
            <FileEdit size={24} />
          </div>
          <div>
            <h2 className="text-[18px] font-black text-gray-900">Admin Decision</h2>
            <p className="text-[13px] text-gray-500 font-medium mt-0.5">Choose an action for this booking request.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {actionCards.map(card => {
            const isSelected = selectedAction === card.id;
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                onClick={() => setSelectedAction(card.id)}
                className={`relative rounded-xl border p-5 cursor-pointer transition-all duration-200
                  ${isSelected ? `${card.activeBorder} ${card.activeShadow} ${card.bgColor}` : `border-gray-200 hover:border-gray-300 hover:bg-gray-50`}
                `}
              >
                <div className="absolute top-4 left-4">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                    ${isSelected ? card.radioBorder : 'border-gray-300'}
                  `}>
                    {isSelected && <div className={`w-2 h-2 rounded-full ${card.radioBg}`}></div>}
                  </div>
                </div>
                
                <div className="flex flex-col items-center text-center mt-2">
                  <div className={`w-12 h-12 rounded-full ${card.bgColor} ${card.color} flex items-center justify-center mb-4 border ${card.borderColor}`}>
                    <Icon size={24} />
                  </div>
                  <h4 className={`text-[13px] font-black mb-1 ${isSelected ? card.color : 'text-gray-900'}`}>{card.title}</h4>
                  <p className="text-[11px] font-medium text-gray-500 leading-tight">{card.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mb-8">
          <label className="block text-[13px] font-bold text-gray-700 mb-2">
            Reason <span className="text-gray-500 font-medium">(Required for Reject / Block / Cancel / Request Changes)</span>
          </label>
          <div className="relative">
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for your decision..."
              className="w-full border border-gray-200 rounded-xl p-4 text-[13px] text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 min-h-[120px] resize-y"
            ></textarea>
            <div className="absolute bottom-3 right-3 text-[11px] font-bold text-gray-400">
              {reason.length} / 500
            </div>
          </div>
        </div>

        {selectedAction === 'request_changes' && (
          <div className="mb-8">
            <label className="block text-[13px] font-bold text-gray-700 mb-2">
              Suggested Alternative <span className="text-gray-500 font-medium">(Optional)</span>
            </label>
            <input 
              type="text"
              value={suggestedAlternative}
              onChange={(e) => setSuggestedAlternative(e.target.value)}
              placeholder="e.g. Grand Palace 2 is available for +₹5,000"
              className="w-full border border-gray-200 rounded-xl p-4 text-[13px] text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={async () => {
              setLoading(true);
              try {
                let endpoint = `http://localhost:5000/api/bookings/${data.bookingId}`;
                if (selectedAction === 'approve') endpoint += '/approve';
                else if (selectedAction === 'reject') endpoint += '/reject';
                else if (selectedAction === 'request_changes') endpoint += '/request-changes';

                const payload = {};
                if (selectedAction !== 'approve') payload.reason = reason;
                if (selectedAction === 'request_changes') payload.suggestedAlternative = suggestedAlternative;

                const res = await fetch(endpoint, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                  alert('Action completed successfully!');
                  if (onNext) onNext();
                } else {
                  alert('Action failed.');
                }
              } catch (err) {
                alert('Error processing action.');
              }
              setLoading(false);
            }}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-[#00b050] hover:bg-green-600 text-white py-3 px-8 rounded-lg text-[13px] font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Save size={16} /> {loading ? "Processing..." : "Submit Decision"}
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 xl:left-64 bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex items-center justify-between z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => onPrevious(5)}
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

export default Step6Approval;
