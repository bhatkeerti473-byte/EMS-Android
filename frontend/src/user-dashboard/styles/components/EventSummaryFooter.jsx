import React, { useState, useEffect } from "react";
import { Sparkles, Utensils, MapPin, Calendar, Users, Music, Gift, Camera, CheckCircle2 } from "lucide-react";

export const calculateEventSummary = (overrides = {}) => {
  const parseNum = (val) => {
    if (!val) return 0;
    const num = parseInt(val.toString().replace(/[^0-9]/g, ""), 10);
    return isNaN(num) ? 0 : num;
  };

  const packagePrice = overrides.packagePrice !== undefined
    ? parseNum(overrides.packagePrice)
    : parseNum(localStorage.getItem("booking_package_price"));

  const venuePrice = overrides.venuePrice !== undefined
    ? parseNum(overrides.venuePrice)
    : parseNum(localStorage.getItem("booking_venue_price"));

  const decorationTotal = overrides.decorationTotal !== undefined
    ? parseNum(overrides.decorationTotal)
    : parseNum(localStorage.getItem("booking_decoration_total"));

  const guestCount = overrides.guestCount !== undefined
    ? parseNum(overrides.guestCount)
    : (parseNum(localStorage.getItem("booking_guest_count")) || 250);

  let cateringPricePerPlate = overrides.cateringPricePerPlate !== undefined
    ? parseNum(overrides.cateringPricePerPlate)
    : parseNum(localStorage.getItem("booking_catering_price_per_plate"));

  const hasCateringSelection = overrides.cateringPricePerPlate !== undefined
    ? Boolean(overrides.cateringPricePerPlate)
    : (Boolean(localStorage.getItem("booking_catering_combo_name")) || Boolean(localStorage.getItem("booking_food_type")));

  if (!cateringPricePerPlate && hasCateringSelection) {
    const foodType = overrides.foodType || localStorage.getItem("booking_food_type");
    if (foodType) {
      cateringPricePerPlate = foodType === "both" ? 350 : foodType === "nonveg" ? 300 : 250;
    }
  }

  const cateringTotal = hasCateringSelection ? (guestCount * cateringPricePerPlate) : 0;

  const cakePrice = overrides.cakePrice !== undefined
    ? parseNum(overrides.cakePrice)
    : parseNum(localStorage.getItem("booking_cake_price"));

  const photographyPrice = overrides.photographyPrice !== undefined
    ? parseNum(overrides.photographyPrice)
    : parseNum(localStorage.getItem("booking_photography_price"));

  const videographyPrice = overrides.videographyPrice !== undefined
    ? parseNum(overrides.videographyPrice)
    : parseNum(localStorage.getItem("booking_videography_price"));

  const djPrice = overrides.djPrice !== undefined
    ? parseNum(overrides.djPrice)
    : parseNum(localStorage.getItem("booking_dj_price"));

  const transportPrice = overrides.transportPrice !== undefined
    ? parseNum(overrides.transportPrice)
    : parseNum(localStorage.getItem("booking_transport_price"));

  const roomTotal = overrides.roomTotal !== undefined
    ? parseNum(overrides.roomTotal)
    : parseNum(localStorage.getItem("booking_room_total"));

  const subTotal = packagePrice + venuePrice + decorationTotal + cateringTotal + cakePrice + photographyPrice + videographyPrice + djPrice + transportPrice + roomTotal;

  const gst = Math.round(subTotal * 0.18);
  const serviceCharge = Math.round(subTotal * 0.05);
  const totalAmount = subTotal > 0 ? (subTotal + gst + serviceCharge) : 0;

  return {
    packagePrice,
    venuePrice,
    decorationTotal,
    guestCount,
    cateringPricePerPlate,
    cateringTotal,
    cakePrice,
    photographyPrice,
    videographyPrice,
    djPrice,
    transportPrice,
    roomTotal,
    subTotal,
    gst,
    serviceCharge,
    totalAmount
  };
};

const EventSummaryFooter = ({
  overrides = {},
  customDetails = null,
  title = "Selected Summary",
  icon: IconComponent = Sparkles,
  className = "",
  style = {}
}) => {
  const [summary, setSummary] = useState(() => calculateEventSummary(overrides));

  useEffect(() => {
    setSummary(calculateEventSummary(overrides));
  }, [JSON.stringify(overrides)]);

  // Auto-build summary item tags if customDetails is not provided
  const buildDefaultDetails = () => {
    const items = [];
    const eventType = localStorage.getItem("booking_event_type_title") || localStorage.getItem("booking_event_type");
    if (eventType) {
      items.push(
        <span key="evt">
          Event: <strong style={{ fontWeight: "600", color: "#475569" }}>{eventType}</strong>
        </span>
      );
    }

    const venueName = localStorage.getItem("booking_venue_name");
    if (summary.venuePrice > 0 || venueName) {
      items.push(
        <span key="venue">
          Venue: <strong style={{ fontWeight: "600", color: "#475569" }}>{venueName || "Selected"} (₹{summary.venuePrice.toLocaleString()})</strong>
        </span>
      );
    }

    if (summary.decorationTotal > 0) {
      items.push(
        <span key="dec">
          Decoration: <strong style={{ fontWeight: "600", color: "#475569" }}>₹{summary.decorationTotal.toLocaleString()}</strong>
        </span>
      );
    }

    if (summary.cateringTotal > 0) {
      items.push(
        <span key="cat">
          Catering ({summary.guestCount} Plates): <strong style={{ fontWeight: "600", color: "#475569" }}>₹{summary.cateringTotal.toLocaleString()}</strong>
        </span>
      );
    }

    if (summary.cakePrice > 0) {
      items.push(
        <span key="cake">
          Cake: <strong style={{ fontWeight: "600", color: "#475569" }}>₹{summary.cakePrice.toLocaleString()}</strong>
        </span>
      );
    }

    const addServicesTotal = summary.photographyPrice + summary.videographyPrice + summary.djPrice + summary.transportPrice + summary.roomTotal;
    if (addServicesTotal > 0) {
      items.push(
        <span key="addservices">
          Additional Services: <strong style={{ fontWeight: "600", color: "#475569" }}>₹{addServicesTotal.toLocaleString()}</strong>
        </span>
      );
    }

    if (items.length === 0) {
      return <span>Select options above to calculate your event total</span>;
    }

    return items;
  };

  return (
    <div className={`catering-summary-footer ${className}`} style={{ marginTop: "24px", marginBottom: "24px", ...style }}>
      <div className="summary-left">
        <div className="summary-icon-large bg-purple-light text-purple" style={{ backgroundColor: "#f3e8ff", color: "#9333ea" }}>
          <IconComponent size={24} />
        </div>
        <div className="summary-text-block">
          <div className="summary-title" style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{title}</div>
          <div className="summary-details-row" style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "#64748b" }}>
            {customDetails || buildDefaultDetails()}
          </div>
        </div>
      </div>

      <div className="summary-right">
        <div className="total-block text-right" style={{ textAlign: "right" }}>
          <div className="total-label" style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>Total Amount</div>
          <div className="total-amount-large text-purple-700" style={{ fontSize: "24px", fontWeight: "800", color: "#7e22ce" }}>
            ₹{summary.totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="total-inclusive" style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>(All Inclusive)</div>
        </div>
      </div>
    </div>
  );
};

export default EventSummaryFooter;
