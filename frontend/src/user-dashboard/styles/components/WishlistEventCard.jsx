import React from "react";
import { CalendarDays, Clock, Heart, MapPin, Trash2 } from "lucide-react";
import { DEFAULT_EVENT_IMAGE, handleImageError } from "./imageFallback";

const getDateParts = (dateText) => {
  const text = dateText || "Jul 20, 2026";
  const [month = "", day = ""] = text.split(" ");
  return {
    day: day.replace(",", "").padStart(2, "0"),
    month: month.slice(0, 3).toUpperCase(),
  };
};

const WishlistEventCard = ({ event, onRemove, onView }) => {
  const { day, month } = getDateParts(event.date);

  return (
    <article className="wishlist-event-card">
      <div className="wishlist-image-wrap">
        <img src={event.image || DEFAULT_EVENT_IMAGE} alt={event.title} onError={handleImageError} />
        <button
          type="button"
          className="wishlist-heart"
          aria-label={`Remove ${event.title}`}
          onClick={() => onRemove && onRemove(event.id)}
        >
          <Heart size={18} fill="currentColor" />
        </button>
        <div className="wishlist-date-badge">
          <strong>{day}</strong>
          <span>{month}</span>
        </div>
      </div>

      <div className="wishlist-event-body">
        <h3>{event.title}</h3>

        <div className="wishlist-meta">
          <span>
            <MapPin size={13} />
            {event.location}
          </span>
          <span>
            <Clock size={13} />
            {event.time}
          </span>
          <span>
            <CalendarDays size={13} />
            {event.status}
          </span>
        </div>

        <div className="wishlist-card-footer">
          <strong>{event.price === 0 ? "Free" : `₹${event.price.toLocaleString('en-IN')}`}</strong>
          <button type="button" className="details-button" onClick={() => onView && onView(event)}>
            View Details
          </button>
          <button
            type="button"
            className="wishlist-remove"
            onClick={() => onRemove(event.id)}
            aria-label={`Remove ${event.title} from wishlist`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default WishlistEventCard;
