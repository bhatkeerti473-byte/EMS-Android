import React from "react";

export default function StatsCards({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{children}</div>;
}
