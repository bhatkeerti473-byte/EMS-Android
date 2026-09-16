import React from "react";
import { CalendarDays } from "lucide-react";
import { DEFAULT_EVENT_IMAGE, handleImageError } from "./imageFallback";

const BookingCard = ({ image, title, date, status }) => {
  return (
    <div className="booking-card">
      <img src={image || DEFAULT_EVENT_IMAGE} alt={title} onError={handleImageError} />

      <div>
        <h3>{title}</h3>
        <p>
          <CalendarDays size={13} />
          {date}
        </p>
      </div>

      <span className={`booking-status status-${status.toLowerCase()}`}>
        {status}
      </span>
    </div>
  );
};

export default BookingCard;
