import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, XCircle, Search, X } from "lucide-react";
import { getAllVenueBookings, updateBookingStatus } from "../../../user-dashboard/services/userApi";

const fallbackBookings = [
  {
    _id: "VBK001",
    clientName: "Apex Events",
    clientEmail: "events@apex.com",
    venueName: "Royal Palace Hall",
    eventTitle: "Wedding Ceremony",
    eventType: "Wedding",
    eventDate: "2026-06-12",
    guests: 220,
    location: "Bangalore",
    notes: "Need stage lighting and live band setup.",
    status: "Pending",
    rejectionReason: "",
  },
  {
    _id: "VBK002",
    clientName: "TechCorp",
    clientEmail: "hello@techcorp.com",
    venueName: "Grand Conference Center",
    eventTitle: "Corporate Meetup",
    eventType: "Conference",
    eventDate: "2026-06-15",
    guests: 120,
    location: "New York",
    notes: "Require projector and simultaneous translation support.",
    status: "Pending",
    rejectionReason: "",
  },
  {
    _id: "VBK003",
    clientName: "Priya & Group",
    clientEmail: "priya.group@example.com",
    venueName: "Sunshine Banquet",
    eventTitle: "Engagement",
    eventType: "Private Party",
    eventDate: "2026-06-18",
    guests: 80,
    location: "Mumbai",
    notes: "Need vegetarian buffet and photo booth.",
    status: "Rejected",
    rejectionReason: "Venue unavailable on selected date.",
  },
];

export default function VenueBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllVenueBookings()
      .then((data) => setBookings(data.length ? data : fallbackBookings))
      .catch(() => setBookings(fallbackBookings));
  }, []);

  const bookingRequests = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (!term) return true;
      return (
        booking.clientName.toLowerCase().includes(term) ||
        booking.venueName.toLowerCase().includes(term) ||
        booking.eventTitle.toLowerCase().includes(term) ||
        booking.eventType.toLowerCase().includes(term) ||
        booking.eventDate.toLowerCase().includes(term)
      );
    });
  }, [bookings, searchTerm]);

  const selectedBooking = useMemo(
    () => bookingRequests.find((booking) => booking._id === selectedBookingId) || bookingRequests[0] || null,
    [bookingRequests, selectedBookingId]
  );

  useEffect(() => {
    if (!selectedBookingId && bookingRequests.length > 0) {
      setSelectedBookingId(bookingRequests[0]._id);
    }
  }, [bookingRequests, selectedBookingId]);

  const counts = useMemo(() => {
    const approved = bookings.filter((booking) => booking.status === "Approved").length;
    const pending = bookings.filter((booking) => booking.status === "Pending").length;
    const rejected = bookings.filter((booking) => booking.status === "Rejected").length;
    return {
      total: bookings.length,
      approved,
      pending,
      rejected,
    };
  }, [bookings]);

  const handleStatusChange = async (bookingId, status) => {
    const payload = { status };
    if (status === "Rejected") {
      payload.rejectionReason = rejectionReason;
    }
    if (status === "Approved") {
      payload.approvedAt = new Date().toISOString();
    }
    if (status === "Rejected") {
      payload.rejectedAt = new Date().toISOString();
    }

    try {
      const updated = await updateBookingStatus(bookingId, payload);
      setBookings((current) => current.map((booking) => ((booking._id || booking.id) === (updated._id || updated.id) ? updated : booking)));
      setRejectionReason("");
    } catch {
      // Fallback update for demo data or offline mode
      setBookings((current) =>
        current.map((booking) => {
          if ((booking._id || booking.id) === bookingId) {
            return { ...booking, ...payload };
          }
          return booking;
        })
      );
      setRejectionReason("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">Booking Requests</h2>
        <p className="mt-1 text-sm text-slate-500">Review new event booking requests from clients.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: counts.total.toString(), icon: CalendarDays, tone: "blue" },
          { label: "Approved", value: counts.approved.toString(), icon: CheckCircle2, tone: "emerald" },
          { label: "Pending", value: counts.pending.toString(), icon: Clock3, tone: "amber" },
          { label: "Rejected", value: counts.rejected.toString(), icon: XCircle, tone: "rose" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className={`text-${item.tone}-500`} size={20} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Booking Requests</h3>
            <p className="mt-1 text-sm text-slate-500">Search and review venue booking requests.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search bookings..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)] overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b text-slate-500">
            <tr>
              <th className="py-3 pr-4">Request ID</th>
              <th className="py-3 pr-4">Client</th>
              <th className="py-3 pr-4">Event Type</th>
              <th className="py-3 pr-4">Venue</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3">Status</th>
              <th className="py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingRequests.map((booking) => (
              <tr
                key={booking._id || booking.id}
                className={`border-b last:border-0 cursor-pointer transition hover:bg-slate-50 ${booking._id === selectedBookingId ? "bg-slate-100" : ""
                  }`}
                onClick={() => setSelectedBookingId(booking._id)}
              >
                <td className="py-4 pr-4 font-semibold text-blue-600">{booking._id?.slice(-8) || booking.id}</td>
                <td className="py-4 pr-4 text-slate-700">{booking.clientName || booking.client}</td>
                <td className="py-4 pr-4 text-slate-700">{booking.eventType || booking.type || "—"}</td>
                <td className="py-4 pr-4 text-slate-700">{booking.venueName || booking.venue}</td>
                <td className="py-4 pr-4 text-slate-500">{booking.eventDate || booking.date}</td>
                <td className="py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${booking.status === "Approved" ? "bg-emerald-100 text-emerald-700" : booking.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-4 text-right">
                  {booking.status === "Pending" && (
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 text-xs font-semibold"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleStatusChange(booking._id, "Approved");
                        }}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 text-xs font-semibold"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedBookingId(booking._id);
                          handleStatusChange(booking._id, "Rejected");
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedBooking && (
        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
          <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Selected Booking</h3>
                <p className="mt-1 text-sm text-slate-500">Review request details before approval or rejection.</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${selectedBooking.status === "Approved" ? "bg-emerald-100 text-emerald-700" : selectedBooking.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                }`}>
                {selectedBooking.status}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[.24em] text-slate-400">Client</p>
                <p className="text-sm font-semibold text-slate-900">{selectedBooking.clientName}</p>
                <p className="text-sm text-slate-500">{selectedBooking.clientEmail}</p>
              </div>
              <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[.24em] text-slate-400">Venue</p>
                <p className="text-sm font-semibold text-slate-900">{selectedBooking.venueName}</p>
                <p className="text-sm text-slate-500">{selectedBooking.location || selectedBooking.city || "—"}</p>
              </div>
              <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[.24em] text-slate-400">Event</p>
                <p className="text-sm font-semibold text-slate-900">{selectedBooking.eventTitle}</p>
                <p className="text-sm text-slate-500">{selectedBooking.eventType}</p>
              </div>
              <div className="space-y-3 rounded-3xl border border-slate-200 p-4">
                <p className="text-xs uppercase tracking-[.24em] text-slate-400">When</p>
                <p className="text-sm font-semibold text-slate-900">{selectedBooking.eventDate}</p>
                <p className="text-sm text-slate-500">{selectedBooking.guests ? `${selectedBooking.guests} guests` : "Guest count not provided"}</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h4 className="text-sm font-semibold text-slate-900">Additional Notes</h4>
              <p className="mt-3 text-sm leading-6 text-slate-600">{selectedBooking.notes || "No special requests provided."}</p>
            </div>
          </div>

          <aside className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
            <h3 className="text-lg font-semibold text-slate-900">Review Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Approve or reject this booking request with an optional reason.</p>

            <div className="mt-6 space-y-4">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                onClick={() => handleStatusChange(selectedBooking._id, "Approved")}
              >
                <CheckCircle2 size={16} />
                Approve Request
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
                onClick={() => handleStatusChange(selectedBooking._id, "Rejected")}
              >
                <X size={16} />
                Reject Request
              </button>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-900" htmlFor="rejectionReason">
                Rejection Reason
              </label>
              <textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(event) => setRejectionReason(event.target.value)}
                placeholder="Provide a reason if rejecting this booking"
                className="mt-2 h-32 w-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
              />
            </div>

            {selectedBooking.status === "Rejected" && selectedBooking.rejectionReason && (
              <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <p className="font-semibold">Saved rejection reason</p>
                <p className="mt-2">{selectedBooking.rejectionReason}</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
