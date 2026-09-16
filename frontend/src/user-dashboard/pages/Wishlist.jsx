import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Filter,
  Heart,
  Search,
  Settings,
  Tag,
  Ticket,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import Sidebar from "../styles/components/Sidebar";
import WishlistEventCard from "../styles/components/WishlistEventCard";
import { getClientDisplayName, getClientPhoto, getCurrentClient } from "../services/clientSession";
import "../styles/dashboard.css";

// Wishlist items are persisted in `localStorage` under key "wishlist".

const chartColors = {
  Upcoming: "#3b82f6",
  "On Sale": "#22c55e",
  "Price Drop": "#f97316",
  Others: "#a855f7",
};

const priceAlerts = [
  {
    title: "Tech Conference",
    text: "Price dropped by ₹500",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Food Festival 2026",
    text: "20% off available",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=700&q=80",
  },
  {
    title: "Sports Event Live",
    text: "Early bird offer",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80",
  },
];

const Wishlist = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const clientPhoto = getClientPhoto(currentClient);
  const [events, setEvents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wishlist") || "[]");
    } catch (e) {
      return [];
    }
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const searchText = searchTerm.trim().toLowerCase();
        return (
          event.title.toLowerCase().includes(searchText) ||
          event.category.toLowerCase().includes(searchText) ||
          event.location.toLowerCase().includes(searchText)
        );
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return b.id - a.id;
      });
  }, [events, searchTerm, sortBy]);

  const overviewData = useMemo(() => {
    const counts = {
      Upcoming: events.filter((event) => event.status === "Upcoming").length,
      "On Sale": events.filter((event) => event.status === "On Sale").length,
      "Price Drop": events.filter((event) => event.status === "Price Drop").length,
      Others: events.filter(
        (event) => !["Upcoming", "On Sale", "Price Drop"].includes(event.status)
      ).length,
    };

    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value, color: chartColors[name] }));
  }, [events]);

  const upcomingCount = events.filter((event) => event.status === "Upcoming").length;
  const onSaleCount = events.filter((event) => event.status === "On Sale").length;
  const priceDropCount = events.filter((event) => event.status === "Price Drop").length;
  const overviewTotal = Math.max(events.length, 1);

  const stats = [
    { label: "Saved Events", value: String(events.length).padStart(2, "0"), helper: "In your wishlist", icon: Heart, tone: "red" },
    { label: "Upcoming Events", value: String(upcomingCount).padStart(2, "0"), helper: "From wishlist", icon: CalendarDays, tone: "blue" },
    { label: "On Sale", value: String(onSaleCount).padStart(2, "0"), helper: "Special offers", icon: Ticket, tone: "green" },
    { label: "Price Drop", value: String(priceDropCount).padStart(2, "0"), helper: "Great discounts", icon: Tag, tone: "purple" },
  ];

  const removeEvent = (eventId) => {
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
  };

  const navigate = useNavigate();

  const viewDetails = (event) => {
    // navigate to event details and pass event data to avoid refetch/loading
    navigate(`/client/event/${event.id}`, { state: { event } });
  };

  // sync changes to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("wishlist", JSON.stringify(events));
    } catch (e) {
      // ignore write errors
    }
  }, [events]);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content wishlist-content">
        <header className="wishlist-topbar">
          <div className="page-title-row">
            <button type="button" className="icon-only" aria-label="Open menu">
              <Heart size={19} />
            </button>
            <div>
              <h1>
                My Wishlist
                <Heart size={18} />
              </h1>
              <p>Your saved events that you do not want to miss.</p>
            </div>
          </div>

          <div className="booking-header-actions">
            <div className="booking-search">
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search events, venues..."
              />
              <Search size={17} />
            </div>
            <button type="button" className="icon-only" aria-label="Settings">
              <Settings size={18} />
            </button>
            <div className="booking-user">
              <img
                src={clientPhoto}
                alt={clientName}
              />
              <div>
                <strong>{clientName}</strong>
                <p>Client</p>
              </div>
            </div>
          </div>
        </header>

        <section className="wishlist-stats-grid">
          {stats.map(({ label, value, helper, icon: Icon, tone }) => (
            <article className={`booking-stat-card booking-stat-${tone}`} key={label}>
              <span>
                <Icon size={22} />
              </span>
              <div>
                <h2>{value}</h2>
                <h3>{label}</h3>
                <p>{helper}</p>
              </div>
            </article>
          ))}
        </section>

        <div className="wishlist-page-grid">
          <section className="wishlist-list-panel">
            <div className="wishlist-panel-header">
              <h2>My Saved Events</h2>
              <div>
                <button type="button" className="wishlist-filter-button">
                  <Filter size={15} />
                  Filter
                </button>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                  <option value="recent">Recently Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <p className="booking-empty">No saved events found.</p>
            ) : (
              <div className="wishlist-event-grid">
                {filteredEvents.map((event) => (
                  <WishlistEventCard key={event.id} event={event} onRemove={removeEvent} onView={viewDetails} />
                ))}
              </div>
            )}


          </section>

          <aside className="wishlist-side-panel">
            <section className="booking-overview-card">
              <h2>Wishlist Overview</h2>
              <div className="overview-chart">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={overviewData}
                      dataKey="value"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {overviewData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="chart-center">
                  <strong>{events.length}</strong>
                  <span>Total</span>
                </div>
              </div>
              <div className="overview-legend">
                {overviewData.map((item) => (
                  <div key={item.name}>
                    <span style={{ background: item.color }}></span>
                    <p>{item.name}</p>
                    <strong>
                      {item.value} ({Math.round((item.value / overviewTotal) * 100)}%)
                    </strong>
                  </div>
                ))}
              </div>
            </section>

            <section className="booking-overview-card">
              <div className="side-card-heading">
                <h2>Price Alerts</h2>
                <button type="button">View All</button>
              </div>
              <div className="price-alert-list">
                {priceAlerts.map((alert) => (
                  <button type="button" key={alert.title}>
                    <img src={alert.image} alt={alert.title} />
                    <span>
                      <strong>{alert.title}</strong>
                      <small>{alert.text}</small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </section>

            <section className="booking-overview-card">
              <h2>Quick Actions</h2>
              <div className="booking-quick-actions">
                <button type="button">
                  <span>
                    <CalendarDays size={17} />
                    Browse Events
                  </span>
                  <ChevronRight size={17} />
                </button>
                <button type="button">
                  <span>
                    <Ticket size={17} />
                    My Bookings
                  </span>
                  <ChevronRight size={17} />
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
