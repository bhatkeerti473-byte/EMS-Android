import React from "react";
import { LogOut, Clock, CheckCircle } from "lucide-react";

export default function CheckOutModal({ event, onClose, onCheckOutSuccess }) {
  const [success, setSuccess] = React.useState(false);

  const handleCheckOut = () => {
    // Mock checkout process
    setSuccess(true);
    setTimeout(() => {
      onCheckOutSuccess(event.id);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col relative text-center p-8">
        {!success ? (
          <>
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check Out?</h2>
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Are you sure you want to check out from <strong>{event?.title}</strong>? Your working hours will be calculated.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleCheckOut}
                className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200"
              >
                Yes, Check Out
              </button>
            </div>
          </>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Checked Out!</h2>
            <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 w-full text-left space-y-2 border border-gray-100 mt-4">
              <p className="flex justify-between"><span>Check-Out Time:</span> <strong>{new Date().toLocaleTimeString()}</strong></p>
              <p className="flex justify-between"><span>Total Hours:</span> <strong>8h 30m</strong></p>
              <p className="flex justify-between text-green-600 font-medium"><span>Status:</span> <span>Attendance Completed</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
