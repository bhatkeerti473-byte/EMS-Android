import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  KeyRound,
  Lock,
  Mail,
  Menu,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Sidebar from "../styles/components/Sidebar";
import "../styles/dashboard.css";
import { getCurrentClient } from "../services/clientSession";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const ChangePassword = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentClient();
  const [mode, setMode] = useState("password");
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    email: currentUser.email || "",
    otp: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const displayName = currentUser.username || currentUser.name || "Client";
  const firstName = displayName.split(" ")[0] || "Client";
  const profilePhoto =
    currentUser.photo ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setError("");
    setMessage("");
  };

  const saveNewPassword = (newPassword) => {
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser") || "null");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");
    const currentEmail = normalizeEmail(currentUser.email);

    if (registeredUser && normalizeEmail(registeredUser.email) === currentEmail) {
      const updatedRegisteredUser = { ...registeredUser, password: newPassword };
      localStorage.setItem("registeredUser", JSON.stringify(updatedRegisteredUser));
    }

    const updatedLoggedInUser = { ...loggedInUser, password: newPassword };
    localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();

    if (formData.currentPassword !== currentUser.password) {
      setError("Current password is incorrect.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    saveNewPassword(formData.newPassword);
    setFormData((currentData) => ({
      ...currentData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setMessage("Password changed successfully.");
  };

  const sendOtp = () => {
    const inputEmail = (formData.email || "").trim().toLowerCase();
    const registeredEmail = (currentUser.email || "").trim().toLowerCase();

    if (!inputEmail || inputEmail !== registeredEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: inputEmail }),
    })
      .then(async (res) => {
        const text = await res.text();
        let data = {};
        if (text) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.error("Failed to parse send-otp response as JSON:", text);
              throw new Error(text || "Invalid response from server.");
            }
          } else {
            throw new Error(text || "Invalid response from server.");
          }
        }
        return { res, data };
      })
      .then(({ res, data }) => {
        if (res.ok && data.success) {
          setMessage(data.message || `Verification code sent to ${formData.email}`);
          setError("");
          try {
            if (data.previewUrl && process.env.NODE_ENV !== 'production') {
              window.open(data.previewUrl, '_blank');
            }
          } catch (e) {
            // ignore
          }
        } else {
          setError(data?.message || "Failed to send verification code.");
        }
      })
      .catch((err) => {
        console.error("Send OTP error:", err);
        setError(err?.message || "Failed to send verification code.");
      });
  };

  const handleForgotSubmit = (event) => {
    event.preventDefault();
    const inputEmail = (formData.email || "").trim().toLowerCase();
    if (!inputEmail) {
      setError("Please provide your registered email.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    fetch(`${API_BASE_URL}/api/auth/verify-otp-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email: inputEmail, code: formData.otp, newPassword: formData.newPassword }),
    })
      .then(async (res) => {
        const text = await res.text();
        let data = {};
        if (text) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.error("Failed to parse verify-otp-reset response as JSON:", text);
              throw new Error(text || "Invalid response from server.");
            }
          } else {
            throw new Error(text || "Invalid response from server.");
          }
        }
        return { res, data };
      })
      .then(({ res, data }) => {
        if (res.ok && data.success) {
          saveNewPassword(formData.newPassword);
          setFormData((currentData) => ({
            ...currentData,
            otp: "",
            newPassword: "",
            confirmPassword: "",
          }));
          setMessage(data.message || "Password reset successfully. You can use the new password now.");
          setError("");
        } else {
          setError(data?.message || "Failed to reset password.");
        }
      })
      .catch((err) => {
        console.error("OTP verify/reset error:", err);
        setError(err?.message || "Failed to reset password.");
      });
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content profile-content">
        <header className="profile-topbar">
          <div className="profile-search-row">
            <button type="button" className="icon-only" aria-label="Open menu">
              <Menu size={18} />
            </button>

            <div className="booking-search profile-search">
              <Search size={17} />
              <input type="search" placeholder="Search events, bookings..." />
            </div>
          </div>

          <div className="booking-header-actions">
            <button type="button" className="icon-only" aria-label="Settings">
              <Settings size={18} />
            </button>
            <div className="profile-mini-user">
              <img src={profilePhoto} alt={displayName} />
              <div>
                <p>Welcome back,</p>
                <strong>{firstName}!</strong>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="profile-title-bar">
          <div>
            <h1>Change Password</h1>
            <p>Client Dashboard &gt; Profile &gt; Change Password</p>
          </div>
          <button type="button" className="profile-edit-button" onClick={() => navigate("/client/profile")}>
            Back to Profile
          </button>
        </section>

        <section className="password-page-grid">
          <article className="profile-panel password-panel">
            <div className="password-mode-tabs">
              <button
                type="button"
                className={mode === "password" ? "active" : ""}
                onClick={() => setMode("password")}
              >
                <Lock size={16} />
                Change Password
              </button>
              <button
                type="button"
                className={mode === "forgot" ? "active" : ""}
                onClick={() => setMode("forgot")}
              >
                <Mail size={16} />
                Forgot Password
              </button>
            </div>

            {message && <p className="profile-save-message">{message}</p>}
            {error && <p className="profile-error-message">{error}</p>}

            {mode === "password" ? (
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                <label className="profile-field">
                  <span>Current Password</span>
                  <div>
                    <Eye size={15} />
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>New Password</span>
                  <div>
                    <KeyRound size={15} />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>Confirm New Password</span>
                  <div>
                    <ShieldCheck size={15} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <button type="submit" className="profile-edit-button">
                  Update Password
                </button>
              </form>
            ) : (
              <form className="password-form" onSubmit={handleForgotSubmit}>
                <label className="profile-field">
                  <span>Registered Email</span>
                  <div>
                    <Mail size={15} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <button type="button" className="outline-action password-otp-button" onClick={sendOtp}>
                  Send OTP
                </button>

                <label className="profile-field">
                  <span>Enter OTP</span>
                  <div>
                    <KeyRound size={15} />
                    <input
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="6 digit OTP"
                      required
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>New Password</span>
                  <div>
                    <Lock size={15} />
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <label className="profile-field">
                  <span>Confirm New Password</span>
                  <div>
                    <ShieldCheck size={15} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </label>

                <button type="submit" className="profile-edit-button">
                  Reset Password
                </button>
              </form>
            )}
          </article>
        </section>
      </main>
    </div>
  );
};

export default ChangePassword;
