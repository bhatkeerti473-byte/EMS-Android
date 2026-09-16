import React from "react";
import { Link, useLocation } from "react-router-dom";
import PremiumLogo from "./PremiumLogo/PremiumLogo";

function Navbar() {
  const location = useLocation();

  // Smooth scroll handler
  const handleScroll = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex justify-between items-center px-10 py-6 text-white">
      {/* Left: Logo */}
      <PremiumLogo size="80px" />

      {/* Center: Menu */}
      <ul className="flex gap-8 text-lg">
        <li>
          {/* Updated check from "/" to "/home" to match your App.js route */}
          {location.pathname === "/home" ? (
            <span className="cursor-default text-pink-300 font-semibold border-b-2 border-pink-500 pb-1">Home</span>
          ) : (
            <Link to="/home" className="hover:text-pink-300 transition">Home</Link>
          )}
        </li>
        <li>
          <a
            href="#events"
            onClick={e => handleScroll(e, "events")}
            className="hover:text-pink-300 transition"
          >
            Events
          </a>
        </li>
        <li>
          <a
            href="#categories"
            onClick={e => handleScroll(e, "categories")}
            className="hover:text-pink-300 transition"
          >
            Categories
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={e => handleScroll(e, "about")}
            className="hover:text-pink-300 transition"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={e => handleScroll(e, "contact")}
            className="hover:text-pink-300 transition"
          >
            Contact
          </a>
        </li>
      </ul>

      {/* Right: Login button */}
      <div>
        <Link to="/login">
          <button className="bg-pink-500 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-pink-600 transition">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;