import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import guestAPI from "../services/guestApi";
import { Calendar, MapPin, Check, X, Sparkles, AlertCircle, Loader } from "lucide-react";

function GuestRSVP() {
  const { token } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState(null); // 'Confirmed' or 'Declined'
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchRSVPDetails();
  }, [token]);

  const fetchRSVPDetails = async () => {
    try {
      setLoading(true);
      const response = await guestAPI.getRSVPDetails(token);
      if (response.data.success) {
        setDetails(response.data);
        if (response.data.guest?.rsvpStatus !== "Pending") {
          setRsvpStatus(response.data.guest.rsvpStatus);
          setSubmitted(true);
        }
      } else {
        setError(response.data.message || "Failed to load RSVP invitation details.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired invitation link.");
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async (status) => {
    try {
      setSubmitting(true);
      const response = await guestAPI.submitRSVP(token, status);
      if (response.data.success) {
        setRsvpStatus(status);
        setSubmitted(true);
      } else {
        setError("Failed to submit response. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while submitting your RSVP.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Loading invitation details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/60 border border-red-500/20 backdrop-blur-xl max-w-md w-full p-8 rounded-2xl text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Error</h1>
          <p className="text-slate-300 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Retry Check
          </button>
        </div>
      </div>
    );
  }

  const { guest, event, schedule } = details;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 relative overflow-y-auto py-8">
      {/* Decorative background glow circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/40">
          
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          {/* Invitation Intro */}
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-wider bg-indigo-500/10 text-indigo-300 font-bold px-3 py-1.5 rounded-full border border-indigo-500/20">
              Exclusive Invitation
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
              Hello, {guest.name}!
            </h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">
              You are cordially invited to attend the upcoming celebration.
            </p>
          </div>

          {/* Event Details Card */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
              {event.title}
            </h2>
            
            {event.description && (
              <p className="text-slate-400 text-sm mb-6 leading-relaxed border-b border-slate-800 pb-4">
                {event.description}
              </p>
            )}

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Date & Time</span>
                  <p className="text-sm font-semibold text-slate-200">
                    {schedule?.startDate
                      ? new Date(schedule.startDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "To be confirmed"}
                  </p>
                  {schedule?.startTime && (
                    <p className="text-xs text-indigo-300 font-medium mt-0.5">
                      Starts at {schedule.startTime} ({schedule.timezone || "EST"})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Location Venue</span>
                  <p className="text-sm font-semibold text-slate-200">
                    {schedule?.venue?.name || "Venue Details Pending"}
                  </p>
                  {schedule?.venue?.address && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {schedule.venue.address}, {schedule.venue.city || ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action RSVP Options */}
          {!submitted ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRSVP("Confirmed")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 active:scale-[0.98] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Check className="w-5 h-5" />
                  Accept
                </button>
                
                <button
                  onClick={() => handleRSVP("Declined")}
                  disabled={submitting}
                  className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.98] text-slate-200 font-semibold py-3.5 px-4 rounded-xl border border-slate-700 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <X className="w-5 h-5" />
                  Decline
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                By confirming, you authorize updates to be shared with the event coordinator.
              </p>
            </div>
          ) : (
            <div className="text-center animate-fadeIn">
              <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                rsvpStatus === "Confirmed" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}>
                {rsvpStatus === "Confirmed" ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
              </div>
              
              <h3 className="text-xl font-bold text-white">
                {rsvpStatus === "Confirmed" ? "Going! 🎉" : "Declined RSVP"}
              </h3>
              
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                {rsvpStatus === "Confirmed"
                  ? "Thank you for confirming your attendance. We look forward to seeing you there!"
                  : "Thank you for letting us know. You will be missed, but we appreciate the response."}
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Change my RSVP response
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default GuestRSVP;
