import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * AndroidBackButton
 * A floating back arrow button for Android navigation.
 * Place at the top of any page that needs a back button.
 *
 * Props:
 *   - to: optional string — navigate to a specific route instead of going back
 *   - color: optional string — icon color (default white)
 *   - style: optional object — extra inline styles for the wrapper
 */
function AndroidBackButton({ to, color = "#ffffff", style = {} }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1); // go to previous page in history
    }
  };

  return (
    <button
      onClick={handleBack}
      style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        zIndex: 1000,
        background: "rgba(0,0,0,0.35)",
        border: "none",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        flexShrink: 0,
        ...style,
      }}
      aria-label="Go back"
    >
      {/* Left arrow SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
}

export default AndroidBackButton;
