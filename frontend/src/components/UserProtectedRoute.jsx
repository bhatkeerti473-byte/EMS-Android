import React from "react";
import { Navigate } from "react-router-dom";

function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const loggedInUser = localStorage.getItem("loggedInUser");
  const user = localStorage.getItem("user");

  // If user has token OR user data from backend/Google, allow access
  if (token || loggedInUser || user) {
    return children;
  }

  // Otherwise redirect to login
  return <Navigate to="/login" replace />;
}

export default UserProtectedRoute;
