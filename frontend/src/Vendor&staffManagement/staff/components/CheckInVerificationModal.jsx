import React, { useState, useEffect } from "react";
import { Camera, MapPin, CheckCircle, ShieldAlert, X } from "lucide-react";

export default function CheckInVerificationModal({ event, onClose, onCheckInSuccess }) {
  const [step, setStep] = useState(1); // 1 = Face, 2 = GPS, 3 = Success
  const [faceStatus, setFaceStatus] = useState("scanning"); // scanning, success, fail
  const [gpsStatus, setGpsStatus] = useState("fetching"); // fetching, success, fail

  useEffect(() => {
    if (step === 1) {
      // Mock Face API scanning for 3 seconds
      const faceTimer = setTimeout(() => {
        setFaceStatus("success");
        setTimeout(() => setStep(2), 1500); // Move to GPS after success
      }, 3000);
      return () => clearTimeout(faceTimer);
    }
    if (step === 2) {
      // Mock GPS validation for 2 seconds
      const gpsTimer = setTimeout(() => {
        setGpsStatus("success");
        setTimeout(() => setStep(3), 1500); // Move to Success
      }, 2000);
      return () => clearTimeout(gpsTimer);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-10">
          <X size={20} />
        </button>

        <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Attendance Verification</h2>
          <p className="text-sm text-gray-500 mt-1">{event?.title}</p>
        </div>

        <div className="p-8 flex flex-col items-center">
          {step === 1 && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h3 className="font-semibold text-gray-700">Step 1: Face Recognition</h3>
              <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-indigo-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                {faceStatus === "scanning" && (
                  <>
                    <Camera className="text-indigo-300 animate-pulse" size={48} />
                    <div className="absolute inset-0 bg-indigo-500/20 animate-scan"></div>
                  </>
                )}
                {faceStatus === "success" && (
                  <div className="bg-green-100 w-full h-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={64} />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {faceStatus === "scanning" ? "Scanning your face... Please look at the camera." : "Face Verified! matching with profile photo."}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center space-y-6">
              <h3 className="font-semibold text-gray-700">Step 2: GPS Verification</h3>
              <div className="relative w-48 h-48 rounded-full bg-blue-50 border-4 border-blue-100 overflow-hidden flex items-center justify-center">
                {gpsStatus === "fetching" && (
                  <MapPin className="text-blue-400 animate-bounce" size={48} />
                )}
                {gpsStatus === "success" && (
                  <div className="bg-green-100 w-full h-full flex items-center justify-center">
                    <CheckCircle className="text-green-500" size={64} />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-medium mb-2">
                  {gpsStatus === "fetching" ? "Verifying your location..." : "Location Verified!"}
                </p>
                {gpsStatus === "success" && (
                  <div className="text-xs text-green-700 bg-green-50 rounded-lg p-2 border border-green-100">
                    <p>Current: City Convention Hall (45m away)</p>
                    <p>Allowed Radius: 100m</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center space-y-4 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Check-In Successful!</h3>
              <div className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 w-full text-left space-y-2 border border-gray-100">
                <p><strong>Time:</strong> {new Date().toLocaleTimeString()}</p>
                <p><strong>Face Scan:</strong> <span className="text-green-600">Verified ✓</span></p>
                <p><strong>Location:</strong> <span className="text-green-600">Verified ✓</span></p>
                <p><strong>Status:</strong> Present</p>
              </div>
              <button 
                onClick={() => onCheckInSuccess(event.id)}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-indigo-200"
              >
                Go to Workspace
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
