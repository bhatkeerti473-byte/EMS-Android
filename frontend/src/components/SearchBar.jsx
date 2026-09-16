import React from "react";

function SearchBar() {
  return (
    <div className="bg-white shadow-xl rounded-3xl p-8 max-w-6xl mx-auto -mt-20 relative z-20">
      <h2 className="text-center text-3xl font-bold mb-8 text-gray-800">
        DISCOVER SOMETHING NEW
      </h2>

      <div className="grid md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search events"
          className="border p-4 rounded-xl"
        />

        <input
          type="text"
          placeholder="Location"
          className="border p-4 rounded-xl"
        /> <input
          type="date"
          className="border p-4 rounded-xl"
        />

        <a href="/login" className="w-full">
          <button className="bg-pink-500 text-white rounded-xl text-lg font-semibold w-full">
            SEARCH
          </button>
        </a>
      </div>
    </div>
  );
}

export default SearchBar;