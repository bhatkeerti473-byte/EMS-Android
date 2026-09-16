import React from "react";

function Footer() {
  return (
    <footer className="bg-black text-white py-12 mt-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10 px-5">

        <div>
          <h1 className="text-3xl font-bold text-pink-500 mb-4">
            EVENT
          </h1>

          <p>
            Discover, book and manage amazing events around you.
          </p>
        </div>

        <div>
          <h2 className="text-2xl mb-4 font-semibold">
            Quick Links
          </h2><ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>Events</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl mb-4 font-semibold">
            Support
          </h2>

          <ul className="space-y-2 text-gray-300">
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
          </ul>
        </div><div>
          <h2 className="text-2xl mb-4 font-semibold">
            Newsletter
          </h2>

          <input
            type="email"
            placeholder="Enter email"
            className="w-full p-4 rounded-xl text-black"
          />

          <button className="w-full bg-pink-500 mt-4 py-4 rounded-xl">
            Subscribe
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;