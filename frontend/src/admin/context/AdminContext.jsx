import React, { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState({
    isAuthenticated: !!localStorage.getItem("adminToken"),
    email: localStorage.getItem("adminEmail") || "",
    token: localStorage.getItem("adminToken") || "",
  });

  const login = (email, token) => {
    setAdmin({
      isAuthenticated: true,
      email,
      token,
    });
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminEmail", email);
  };

  const logout = () => {
    setAdmin({
      isAuthenticated: false,
      email: "",
      token: "",
    });
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
