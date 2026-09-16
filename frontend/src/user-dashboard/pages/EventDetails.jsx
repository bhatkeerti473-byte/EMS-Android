import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { CalendarDays, MapPin } from "lucide-react";
import { getEvents } from "../services/userApi";
import "../styles/dashboard.css";

const INR = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // If route state contains the event, use it directly to avoid extra fetch
    if (location.state && location.state.event) {
      setEvent(location.state.event);
      setLoading(false);
      return;
    }

    getEvents()
      .then((events) => {
        const found = events.find((e) => String(e.id) === String(eventId));
        setEvent(found);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load event details");
        setLoading(false);
      });
  }, [eventId, location.state]);

  if (loading) return <div className="dashboard-container"><Sidebar /><main className="main-content"><p>Loading...</p></main></div>;
  if (error || !event) return <div className="dashboard-container"><Sidebar /><main className="main-content"><p>Event not found.</p></main></div>;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="main-content event-details-content">
        <button onClick={() => navigate(-1)} className="details-button" style={{width:120,marginBottom:20}}>← Back</button>
        <div className="event-details-card">
          <img src={event.image} alt={event.title} style={{width:"100%",maxWidth:500,borderRadius:8}} />
          <h1>{event.title}</h1>
          <div className="event-meta">
            <span><CalendarDays size={16} /> {event.date} {event.time && `| ${event.time}`}</span>
            <span><MapPin size={16} /> {event.location}, India</span>
          </div>
          <p style={{marginTop:16}}><strong>Category:</strong> {event.category}</p>
          <p><strong>Price:</strong> {event.price === 0 ? "Free" : INR.format(event.price)}</p>
          <p style={{marginTop:16}}><em>More event details can go here...</em></p>
        </div>
      </main>
    </div>
  );
};

export default EventDetails;
