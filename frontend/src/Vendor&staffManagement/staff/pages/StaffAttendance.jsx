import React, { useEffect, useRef, useState } from "react";
import { ScanFace, FileText, CheckCircle2, CalendarDays, Camera, MapPin, Clock, AlertCircle, Info, LogOut } from "lucide-react";

// Haversine formula to calculate distance between two coordinates in meters
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000; // Distance in meters
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export default function StaffAttendance() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  const [now, setNow] = useState(new Date());
  const [user, setUser] = useState(null);
  
  // States for verification
  const [faceDetected, setFaceDetected] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [locationDetails, setLocationDetails] = useState(null);
  const [distanceFromVenue, setDistanceFromVenue] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  
  // Status states
  const [attendanceRecord, setAttendanceRecord] = useState(null); // The record from DB
  const [attendanceHistory, setAttendanceHistory] = useState([]); // All records
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock venue coords (for demo) - Ideally fetched from Event/Venue DB
  const VENUE_LAT = 13.340881; 
  const VENUE_LON = 74.742142; // Manipal/Udupi coords for demo
  const ALLOWED_RADIUS = 500000; // 500km for demo purposes, normally 100m

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("loggedInUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyAttendance();
    }
  }, [user]);

  const fetchMyAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/attendance/staff/${user._id || user.id}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        setAttendanceHistory(data.data);
        // Find today's attendance
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecord = data.data.find(r => r.date === todayStr);
        if (todayRecord) {
          setAttendanceRecord(todayRecord);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleStartScan = async () => {
    setErrorMsg("");
    setIsScanning(true);
    setFaceDetected(false);
    setGpsVerified(false);

    try {
      // 1. Start Camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Mock face detection taking 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFaceDetected(true);

      // 2. Get GPS Location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          // Calculate distance
          const dist = getDistanceFromLatLonInKm(lat, lon, VENUE_LAT, VENUE_LON);
          setDistanceFromVenue(Math.round(dist));
          
          if (dist > ALLOWED_RADIUS) {
            setErrorMsg(`You are outside the event location. Distance: ${Math.round(dist)}m. Allowed: ${ALLOWED_RADIUS}m`);
            setIsScanning(false);
            stopCamera();
            return;
          }
          setGpsVerified(true);

          // 3. Reverse Geocode for City name
          let cityName = "Unknown Location";
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const geoData = await geoRes.json();
            cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || "Unknown";
            setLocationDetails({ lat, lon, name: cityName });
          } catch(e) { console.error("Geocoding failed", e); }

          // 4. Call Check-In API
          await submitCheckIn(lat, lon, cityName);
          
        },
        (err) => {
          setErrorMsg("Failed to get GPS location. Please enable location services.");
          setIsScanning(false);
          stopCamera();
        }
      );

    } catch (err) {
      setErrorMsg("Camera error or permission denied.");
      setIsScanning(false);
    }
  };

  const submitCheckIn = async (lat, lon, cityName) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const payload = {
        staffId: user._id || user.id,
        eventId: "647f1b2c3d4e5f6a7b8c9d0e", // Mock Event ID for demo
        date: todayStr,
        checkInTime: new Date().toISOString(),
        faceVerified: true,
        gpsVerified: true,
        deviceName: navigator.userAgent,
        ipAddress: "192.168.1.1", // Mock IP
        latitude: lat,
        longitude: lon,
        locationName: cityName
      };

      const res = await fetch("http://localhost:5000/api/attendance/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setAttendanceRecord(data.data);
      } else {
        setErrorMsg(data.message || "Failed to check in");
      }
    } catch(err) {
      setErrorMsg("Server error checking in");
    } finally {
      setIsScanning(false);
      stopCamera();
    }
  };

  const handleCheckOut = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const payload = {
        staffId: user._id || user.id,
        date: todayStr,
        checkOutTime: new Date().toISOString()
      };

      const res = await fetch("http://localhost:5000/api/attendance/check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (res.ok) {
        setAttendanceRecord(data.data);
      } else {
        setErrorMsg(data.message || "Failed to check out");
      }
    } catch(err) {
      setErrorMsg("Server error checking out");
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(date);
  };

  const formatTime = (date) => {
    if (!date) return "--:--";
    return new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }).format(new Date(date));
  };

  if (!user || loading) return <div className="p-10 text-center text-gray-500">Loading Attendance Data...</div>;

  const isCheckedIn = !!attendanceRecord;
  const isCheckedOut = attendanceRecord && attendanceRecord.checkOutTime;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-orange-50/50 border border-orange-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl border border-orange-200 text-orange-500 shadow-sm">
            <ScanFace size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Face Recognition & GPS Attendance</h2>
            <p className="text-sm text-gray-600 mt-1">
              Mark your attendance using face recognition and GPS location verification.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Action Area */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mark Attendance</h3>

            <div className="flex w-full justify-between gap-4">
              <div className="flex flex-col items-center flex-1">
                <div className="relative w-48 h-48 rounded-full bg-gray-100 border-4 border-gray-50 overflow-hidden flex items-center justify-center shadow-inner">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  {!streamRef.current?.active && <ScanFace size={48} className="text-gray-300 absolute" />}
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-sm">
                    {faceDetected && <CheckCircle2 size={16} />}
                    <span>{faceDetected ? "Face Verified ✓" : (isScanning ? "Scanning Face..." : "Ready")}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm">
                    {gpsVerified && <MapPin size={16} />}
                    <span>{gpsVerified ? "GPS Verified ✓" : (isScanning && faceDetected ? "Checking GPS..." : "")}</span>
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isCheckedIn ? (
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className={`w-full mt-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm ${
                  isScanning ? "bg-gray-400 text-white cursor-not-allowed" : "bg-[#ff6b00] hover:bg-[#e66000] text-white"
                }`}
              >
                <Camera size={20} />
                {isScanning ? "Verifying..." : "Check In"}
              </button>
            ) : !isCheckedOut ? (
              <button
                onClick={handleCheckOut}
                className="w-full mt-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm bg-red-500 hover:bg-red-600 text-white"
              >
                <LogOut size={20} />
                Check Out
              </button>
            ) : (
              <div className="w-full mt-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200">
                <CheckCircle2 size={20} />
                Attendance Completed for Today
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Record</h3>
            
            {attendanceRecord ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Check-In Time</p>
                    <p className="font-bold text-gray-900">{formatTime(attendanceRecord.checkInTime)}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Check-Out Time</p>
                    <p className="font-bold text-gray-900">{formatTime(attendanceRecord.checkOutTime)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                  <MapPin className="text-blue-500 shrink-0" size={20} />
                  <div>
                    <p className="text-xs text-blue-600 font-semibold">Location Recorded</p>
                    <p className="font-bold text-gray-900">{attendanceRecord.locationName}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{attendanceRecord.latitude}, {attendanceRecord.longitude}</p>
                  </div>
                </div>

                {attendanceRecord.checkOutTime && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Working Hours</p>
                      <p className="text-lg font-black text-emerald-600">{attendanceRecord.workingHours} hrs</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Overtime</p>
                      <p className="text-lg font-black text-orange-500">{attendanceRecord.overtime} hrs</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <Clock size={40} className="mx-auto mb-3 opacity-50" />
                <p>You haven't checked in today.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Attendance History</h3>
        {attendanceHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record) => (
                  <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900">{formatDate(new Date(record.date))}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${record.status === 'Present' ? 'text-emerald-700 bg-emerald-100' : record.status === 'Absent' ? 'text-red-700 bg-red-100' : 'text-amber-700 bg-amber-100'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{formatTime(record.checkInTime)}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{record.checkOutTime ? formatTime(record.checkOutTime) : "--:--"}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{record.locationName || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <CalendarDays size={32} className="mx-auto mb-2 opacity-50" />
            <p>No attendance history found.</p>
          </div>
        )}
      </div>

    </div>
  );
}
