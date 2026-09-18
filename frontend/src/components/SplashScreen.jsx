import React, { useEffect, useState } from "react";
import logoImg from "./PremiumLogo/ems_logo.png";

/**
 * SplashScreen Component
 * Displays the official round EMS crown logo on app startup for 5 seconds.
 * Features a smooth zoom-in and zoom-out breathing animation with enlarged logo size.
 */
function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // 5 seconds total: start fade-out at 4.5 seconds, unmount at 5.0 seconds
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 4500);

    const endTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050814] transition-opacity duration-500 select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <style>{`
        @keyframes splashZoomInOut {
          0% {
            transform: scale(0.88);
            filter: drop-shadow(0 0 15px rgba(245, 158, 11, 0.4));
          }
          50% {
            transform: scale(1.16);
            filter: drop-shadow(0 0 45px rgba(245, 158, 11, 0.85));
          }
          100% {
            transform: scale(0.92);
            filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));
          }
        }
        .splash-zoom-animation {
          animation: splashZoomInOut 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient background glow ring */}
      <div className="absolute w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute w-64 h-64 rounded-full bg-yellow-400/10 blur-2xl pointer-events-none"></div>

      {/* Main Logo Container (Enlarged with Zoom In & Zoom Out animation) */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-60 h-60 sm:w-72 sm:h-72 rounded-full flex items-center justify-center p-2 splash-zoom-animation">
          <img
            src={logoImg}
            alt="EMS Logo"
            className="w-full h-full object-contain rounded-full"
          />
        </div>

        {/* Title */}
        <div className="mt-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.28em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 drop-shadow-md">
            EVENT
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-bold uppercase tracking-[0.45em] text-amber-200/85">
            Management System
          </p>
        </div>

        {/* Loading dots indicator */}
        <div className="mt-10 flex gap-2 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce"></span>
        </div>
      </div>
    </div>
  );
}

export default SplashScreen;
