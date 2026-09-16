import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ChevronRight, Heart, Ticket, WalletCards } from "lucide-react";

const actions = [
  { label: "Browse Events", icon: CalendarDays, path: "/client/browse-events" },
  { label: "My Bookings", icon: Ticket, path: "/client/my-bookings" },
  { label: "Saved Events", icon: Heart, path: "/client/wishlist" },
  { label: "Payments", icon: WalletCards, path: "/client/payments" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="quick-action-list">
        {actions.map(({ label, icon: Icon, path }) => (
          <button key={label} type="button" onClick={() => navigate(path)}>
            <span>
              <Icon size={18} />
              {label}
            </span>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
