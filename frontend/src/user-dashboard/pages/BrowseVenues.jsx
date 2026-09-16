import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Heart, MapPin, Ticket } from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import { getClientDisplayName, getClientInitial, getCurrentClient } from "../services/clientSession";
import { getVenues } from "../services/userApi";
import "../styles/dashboard.css";

const BrowseVenues = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const clientInitial = getClientInitial(currentClient);

  const [venues, setVenues] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch (e) {
      return [];
    }
  });

  const locationState = useLocation().state;
  const [searchTerm, setSearchTerm] = useState(locationState?.prefilter || "");
  const [sortBy, setSortBy] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    getVenues()
      .then(setVenues)
      .catch(() => setVenues([]))
      .finally(() => setIsLoading(false));
  }, []);

  // Fixed lists of custom categories requested
  const customTypes = ["Home", "Birthday's Hall", "Small gatherings Hall"];

  // Compile unique venue types from API + custom choices
  const venueTypes = useMemo(() => {
    const dynamicTypes = venues.map((venue) => venue.type);
    return [...new Set([...dynamicTypes, ...customTypes])];
  }, [venues]);

  // Fallback structural mock items for Birthday & Small gatherings if database comes up short
  const fallbackCards = useMemo(() => [
    {
      id: "fallback-birthday-1",
      name: "Celebrations Banquet Hall",
      type: "Birthday's Hall",
      location: currentClient?.address || "Downtown Hub",
      capacity: 150,
      price: 45000,
      status: "Available",
      description: "Perfect vibrant setup for milestone birthday parties, complete with standard lighting and sound systems.",
      images: ["https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=700&q=80"]
    },
    {
      id: "fallback-gathering-1",
      name: "The Cozy Corner Lounge",
      type: "Small gatherings Hall",
      location: currentClient?.address || "Udupi Midtown",
      capacity: 50,
      price: 25000,
      status: "Available",
      description: "An intimate setting tailored for family gatherings, closely-knit reunions, and private micro-events.",
      images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=700&q=80"]
    }
  ], [currentClient]);

  // Combine database data with the custom fallback items
  const allVenuesCombined = useMemo(() => {
    return [...venues, ...fallbackCards];
  }, [venues, fallbackCards]);

  const filteredVenues = useMemo(() => {
    const searchText = searchTerm.trim().toLowerCase();

    return allVenuesCombined
      .filter((venue) => {
        return (
          venue.name.toLowerCase().includes(searchText) ||
          venue.type.toLowerCase().includes(searchText) ||
          venue.location.toLowerCase().includes(searchText)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now());
      });
  }, [allVenuesCombined, searchTerm, sortBy]);

  const isSaved = (venue) => wishlist.some((w) => w.id === (venue._id || venue.id));

  const toWishlistEvent = (venue) => ({
    id: venue._id || venue.id || Date.now(),
    title: venue.name,
    date: venue.availableDate || "TBD 01, 2026",
    time: venue.time || "",
    location: venue.location || "",
    price: venue.price || 0,
    status: "Saved",
    image: venue.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80",
  });

  const toggleWishlist = (venue, e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const id = venue._id || venue.id || Date.now();
    if (isSaved(venue)) {
      setWishlist((current) => {
        const next = current.filter((it) => it.id !== id);
        localStorage.setItem("wishlist", JSON.stringify(next));
        return next;
      });
    } else {
      const entry = toWishlistEvent(venue);
      setWishlist((current) => {
        const next = [entry, ...current];
        localStorage.setItem("wishlist", JSON.stringify(next));
        return next;
      });
    }
  };

  // Dedicated click handler for filtering by Venue Type
  const handleTypeClick = (type) => {
    if (type === "Home") {
      // Pull address dynamically from currentClient object if provided
      const userHomeAddress = currentClient?.address || currentClient?.homeAddress || "My Home Address";

      // Save it immediately to LocalStorage
      localStorage.setItem("clientHomeAddress", userHomeAddress);

      // Route directly to the EventBookingForm path with parameters setup for home event
      navigate("/client/book-event/custom", {
        state: {
          event: {
            title: "Home Event Booking",
            subtitle: "Complete the details below to reserve your date for an at-home gathering."
          },
          venue: null // Sending null triggers your form's fallback home configuration logic
        }
      });
    } else {
      setSearchTerm(type);
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content browse-content">
        <header className="browse-topbar">
          <div>
            <h1>Browse Venues</h1>
            <p>Client Dashboard &gt; Browse Venues</p>
          </div>

          <div className="profile-box">
            <div>
              <h4>{currentClient?.email || "client@example.com"}</h4>
              <p>Welcome back, {clientName}!</p>
            </div>
            <div className="avatar">{clientInitial}</div>
          </div>
        </header>

        {/* Cleaned layout: location, date, and filter controls are removed */}
        <section className="browse-toolbar">
          <div className="search-control" style={{ width: "100%" }}>
            <Search size={18} />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search venues, locations, or types..."
            />
          </div>
        </section>

        <div className="browse-layout">
          <aside className="filters-column">
            <section className="filter-panel">
              <h2>Venue Type</h2>
              <div className="category-list">
                {venueTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={searchTerm.toLowerCase() === type.toLowerCase() ? "active" : ""}
                    onClick={() => handleTypeClick(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>
          </aside>

          <section className="events-results">
            <div className="results-header">
              <p>{isLoading ? "Loading venues..." : `${filteredVenues.length} Venues Found`}</p>

              <label>
                Sort by:
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="latest">Newest</option>
                  <option value="price-low">Price - Low to High</option>
                  <option value="price-high">Price - High to Low</option>
                </select>
              </label>
            </div>

            <div className="browse-event-grid">
              {filteredVenues.map((venue) => (
                <article className="browse-event-card" key={venue._id || venue.id}>
                  <div className="event-image-wrap">
                    <img
                      src={venue.images?.[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80"}
                      alt={venue.name}
                    />
                    <span className={venue.status === "Available" ? "status-badge" : "status-badge offline"}>
                      {venue.status || "Available"}
                    </span>
                    <button
                      type="button"
                      aria-label={`Save ${venue.name}`}
                      onClick={(e) => toggleWishlist(venue, e)}
                      className="wishlist-toggle"
                    >
                      <Heart size={18} className={isSaved(venue) ? "text-red-500" : "text-white"} />
                    </button>
                  </div>

                  <div className="browse-event-body">
                    <h3>{venue.name}</h3>

                    <div className="browse-event-meta">
                      <span>
                        <MapPin size={14} />
                        {venue.location}
                      </span>
                      <span>
                        <Ticket size={14} />
                        {venue.capacity} guests
                      </span>
                    </div>

                    <div className="event-card-footer">
                      <span className="category-pill">{venue.type}</span>
                      <strong>{venue.price ? `\u20B9${venue.price.toLocaleString('en-IN')}` : "Request quote"}</strong>
                    </div>

                    <p className="event-description">{venue.description?.slice(0, 110) || "Comfortable venue with flexible capacity and amenities."}</p>

                    <div className="browse-event-actions">
                      <button type="button" className="details-button" onClick={() => navigate(`/client/book-event/${venue._id || venue.id}`, { state: { event: { title: venue.type }, venue } })}>
                        Request Booking
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BrowseVenues;