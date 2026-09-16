import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Store, CalendarDays, Users, CircleDollarSign, X, UploadCloud, MonitorPlay } from "lucide-react";
import { useNavigate } from "react-router-dom";

const placeholderImage = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=200&q=60";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000"
    : "");

export default function AllVenues() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [venueList, setVenueList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedVenue, setSelectedVenue] = useState(null);

  const [editImageFiles, setEditImageFiles] = useState([]);
  const [editVideoFile, setEditVideoFile] = useState(null);
  const editImageRef = useRef(null);
  const editVideoRef = useRef(null);

  const formatCurrency = useCallback((value) => {
    if (typeof value === "number") return `${value.toLocaleString()} ₹`;
    if (!value) return "N/A";
    const digits = String(value).replace(/[^0-9.-]/g, "");
    return digits ? `${Number(digits).toLocaleString()} ₹` : "N/A";
  }, []);

  const normalizeVenue = useCallback(
    (venue) => ({
      ...venue,
      id: venue._id || venue.id,
      price: typeof venue.price === "number" ? venue.price : Number(String(venue.price).replace(/[^0-9.-]/g, "")) || 0,
      priceDisplay: formatCurrency(venue.price),
      image: venue.images?.[0] || venue.image || placeholderImage,
      status: venue.status || "Available",
    }),
    [formatCurrency]
  );

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    setFetchError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/venues`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load venues");
      }

      setVenueList(data.venues.map(normalizeVenue));
    } catch (error) {
      setFetchError(error.message || "Unable to fetch venues.");
    } finally {
      setLoading(false);
    }
  }, [normalizeVenue]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const filtered = useMemo(
    () => venueList.filter((v) => `${v.name} ${v.type} ${v.location}`.toLowerCase().includes(query.toLowerCase())),
    [query, venueList]
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this venue?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/venues/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete venue");
      }

      await fetchVenues();
    } catch (error) {
      setFetchError(error.message || "Unable to delete venue.");
    }
  };


  const handleViewClick = (venue) => {
    setSelectedVenue(venue);
  };

  const handleViewClose = () => {
    setSelectedVenue(null);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditClick = (venue) => {
    navigate(`/admin/venue-management/edit-venue/${venue._id || venue.id}`);
  };

  const handleEditCancel = () => {
    // Deprecated: Editing is now handled via AddVenue page
  };

  // Case-insensitive status counter formatting with catch-all logic
  const availableCount = venueList.filter((v) => ["available", "active"].includes(String(v.status || "").trim().toLowerCase())).length;
  const maintenanceCount = venueList.filter((v) => ["maintenance", "under maintenance"].includes(String(v.status || "").trim().toLowerCase())).length;

  // Fallback calculations: Total - (Available + Maintenance)
  const bookedCount = venueList.length - (availableCount + maintenanceCount);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        <h2 className="text-2xl font-extrabold text-slate-900">All Venues</h2>
        <p className="mt-1 text-sm text-slate-500">Search, filter, sort, and manage all venue records.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Venues", value: venueList.length.toString(), icon: Store },
          { label: "Available", value: availableCount.toString(), icon: CalendarDays },
          { label: "Booked", value: bookedCount >= 0 ? bookedCount.toString() : "0", icon: Users },
          { label: "Under Maintenance", value: maintenanceCount.toString(), icon: CircleDollarSign },
          { label: "Avg Price", value: venueList.length ? `${Math.round(venueList.reduce((sum, venue) => sum + (Number(venue.price) || 0), 0) / venueList.length).toLocaleString()} ₹` : "0 ₹", icon: CircleDollarSign },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-2xl bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">{item.label}</p>
                <Icon className="text-orange-500" size={20} />
              </div>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_rgba(15,23,42,0.08)]">
        {fetchError ? (
          <div className="mb-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">
            {fetchError}
          </div>
        ) : null}
        {loading ? (
          <div className="mb-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">Loading venues...</div>
        ) : null}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search venue..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none focus:border-orange-500"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b text-slate-500">
              <tr>
                <th className="py-3 pr-4">Venue Image</th>
                <th className="py-3 pr-4">Venue Name</th>
                <th className="py-3 pr-4">Venue Type</th>
                <th className="py-3 pr-4">Location</th>
                <th className="py-3 pr-4">Capacity</th>
                <th className="py-3 pr-4">Price</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((venue) => {
                const normalizedStatus = String(venue.status || "").trim().toLowerCase();
                const isAvailable = ["available", "active"].includes(normalizedStatus);
                const isMaintenance = ["maintenance", "under maintenance"].includes(normalizedStatus);

                // Determine styling dynamically if database string varies
                let badgeClass = "bg-blue-100 text-blue-700"; // default fallback to Booked styling
                if (isAvailable) badgeClass = "bg-emerald-100 text-emerald-700";
                if (isMaintenance) badgeClass = "bg-amber-100 text-amber-700";

                return (
                  <tr key={venue.id} className="border-b last:border-0">
                    <td className="py-4 pr-4"><img src={venue.image} alt={venue.name} className="h-12 w-12 rounded-lg object-cover" /></td>
                    <td className="py-4 pr-4 font-semibold text-slate-900">{venue.name}</td>
                    <td className="py-4 pr-4 text-slate-600">{venue.type}</td>
                    <td className="py-4 pr-4 text-slate-600">{venue.location}</td>
                    <td className="py-4 pr-4 text-slate-600">{venue.capacity}</td>
                    <td className="py-4 pr-4 text-slate-600">{venue.priceDisplay}</td>
                    <td className="py-4 pr-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}>
                        {venue.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-3 text-orange-600 font-semibold">
                        <button
                          className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900"
                          onClick={() => handleViewClick(venue)}
                        >
                          <Eye size={14} />View
                        </button>
                        <button
                          className="inline-flex items-center gap-1 hover:text-slate-900"
                          onClick={() => handleEditClick(venue)}
                        >
                          <Pencil size={14} />Edit
                        </button>
                        <button
                          className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700"
                          onClick={() => handleDelete(venue.id)}
                        >
                          <Trash2 size={14} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {filtered.length} of {venueList.length} venues</p>
          <div className="flex items-center gap-2">
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500"><ChevronLeft size={18} /></button>
            <button className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white">1</button>
            <button className="rounded-xl border border-slate-200 p-2 text-slate-500"><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {selectedVenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Venue Details</h3>
                <p className="text-sm text-slate-500">Review the venue information and current status.</p>
              </div>
              <button
                onClick={handleViewClose}
                className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <img src={selectedVenue.image} alt={selectedVenue.name} className="mb-4 h-60 w-full rounded-3xl object-cover" />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900">{selectedVenue.name}</h4>
                    <p className="text-sm text-slate-500">{selectedVenue.type} · {selectedVenue.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Capacity</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{selectedVenue.capacity || "N/A"}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Price</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{selectedVenue.priceDisplay}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Status</p>
                      <p className="mt-2 font-semibold text-slate-900">{selectedVenue.status}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Location</p>
                      <p className="mt-2 font-semibold text-slate-900">{selectedVenue.location}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
                    <p className="text-sm text-slate-600">{selectedVenue.description || "No description provided."}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Facilities</h4>
                {selectedVenue.facilities?.length ? (
                  <div className="grid gap-2">
                    {selectedVenue.facilities.map((facility) => (
                      <span key={facility} className="rounded-full bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No facilities listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}