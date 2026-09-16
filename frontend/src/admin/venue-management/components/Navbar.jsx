import React from "react";

export default function Navbar({ title = "Venue Dashboard", subtitle = "Venue Management Module" }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
