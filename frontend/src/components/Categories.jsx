import React from "react";

const categories = [
  "Wedding",
  "Birthday",
  "Conference",
  "Auditorium",
];

function Categories() {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 px-5">
      {categories.map((cat, index) => (
        <div
          key={index}
          className="bg-white p-8 rounded-2xl shadow-md text-center text-xl font-semibold hover:bg-pink-500 hover:text-white duration-300 cursor-pointer"
        >
          {cat}
        </div>
      ))}
    </div>
  );
}

export default Categories;