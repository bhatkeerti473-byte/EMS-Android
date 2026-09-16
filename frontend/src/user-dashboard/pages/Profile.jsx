import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  Edit3,
  Gift,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import {
  getCurrentClient,
  saveClientProfile,
} from "../services/clientSession";
import { getBookings } from "../services/userApi";
import "../styles/dashboard.css";

const defaultProfile = {
  username: "Client",
  email: "client@example.com",
  phone: "",
  dateOfBirth: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  photo: "",
};

const getSavedProfile = () => {
  const profile = getCurrentClient();

  return {
    ...defaultProfile,
    ...profile,
    photo: profile.photo || "",
  };
};

const profileFields = [
  { label: "Full Name", name: "username", icon: User },
  { label: "Email Address", name: "email", icon: Mail },
  { label: "Phone Number", name: "phone", icon: Phone },
  { label: "Date of Birth", name: "dateOfBirth", icon: CalendarDays },
  { label: "Address", name: "address", icon: MapPin, wide: true },
  { label: "City", name: "city", icon: Briefcase },
  { label: "State", name: "state", icon: Briefcase },
  { label: "ZIP Code", name: "zipCode", icon: Lock },
];

const formatDate = (value, options) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString(undefined, options);
};

const formatMemberSince = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString();
};

const tabs = [
  "Personal Information",
  "Security",
  "Payment Methods",
  "Notification Preferences",
];

const resizeProfilePhoto = (photoDataUrl, onComplete) => {
  const image = new Image();

  image.onload = () => {
    const maxSize = 480;
    const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    onComplete(canvas.toDataURL("image/jpeg", 0.82));
  };

  image.onerror = () => onComplete(photoDataUrl);
  image.src = photoDataUrl;
};

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const currentClient = getCurrentClient();
  const [profile, setProfile] = useState(getSavedProfile);
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const userId = currentClient.id || currentClient._id || currentClient.userId || "";

  useEffect(() => {
    getBookings(userId)
      .then((data) => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]));
  }, [userId]);

  const profileStats = useMemo(() => {
    const approved = bookings.filter((b) => b.status === "Approved").length;
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const rejected = bookings.filter((b) => b.status === "Rejected").length;
    const total = bookings.length;

    return [
      { label: "Total Bookings", value: total.toString(), icon: CalendarDays, tone: "blue" },
      { label: "Approved Bookings", value: approved.toString(), icon: CheckCircle2, tone: "green" },
      { label: "Pending Requests", value: pending.toString(), icon: Clock3, tone: "orange" },
      { label: "Rejected Bookings", value: rejected.toString(), icon: CreditCard, tone: "red" },
      { label: "Profile Completion", value: "85%", icon: Star, tone: "yellow" },
      { label: "Upcoming Events", value: approved.toString(), icon: Gift, tone: "purple" },
    ];
  }, [bookings]);

  const displayName = profile.username || profile.name || "Client";
  const firstName = displayName.split(" ")[0] || "Client";

  const formattedLastLogin = formatDate(profile.lastLogin, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedMemberSince = profile.memberSince
    ? formatMemberSince(profile.memberSince)
    : "Not available";

  const summaryItems = [
    { label: "Last Login", value: formattedLastLogin, icon: Clock3, badge: true },
    { label: "Member Since", value: formattedMemberSince, icon: CalendarDays },
  ];

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    const updatedValue = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: updatedValue }));
    setMessage("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const selectedPhoto = String(reader.result || "");

      resizeProfilePhoto(selectedPhoto, (resizedPhoto) => {
        setProfile((currentProfile) => ({ ...currentProfile, photo: resizedPhoto }));
        setMessage("Photo selected. Click Update Profile to save it.");
      });
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const saveProfile = () => {
    const updatedProfile = {
      ...profile,
      email: profile.email.trim().toLowerCase(),
      username: profile.username.trim(),
      phone: profile.phone.trim(),
    };

    if (updatedProfile.phone && !/^\d{10}$/.test(updatedProfile.phone)) {
      setMessage("Please add a valid 10-digit phone number.");
      return;
    }

    const registeredUser = JSON.parse(localStorage.getItem("registeredUser") || "null");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "null");

    try {
      if (updatedProfile.photo) {
        saveClientProfile(updatedProfile);
      } else {
        saveClientProfile(updatedProfile);
      }

      if (registeredUser && registeredUser.email?.trim().toLowerCase() === updatedProfile.email) {
        localStorage.setItem(
          "registeredUser",
          JSON.stringify({ ...registeredUser, ...updatedProfile })
        );
      }

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...loggedInUser, ...updatedProfile })
      );
      setProfile(updatedProfile);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Profile photo is too large. Please choose a smaller image.");
    }
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
              {profile.photo ? (
                <img src={profile.photo} alt={displayName} />
              ) : (
                <div className="profile-mini-user-placeholder" aria-hidden="true"></div>
              )}
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
            <h1>My Profile</h1>
            <p>Client Dashboard &gt; Profile</p>
          </div>
          <button type="button" className="profile-edit-button" onClick={saveProfile}>
            <Edit3 size={16} />
            Update Profile
          </button>
        </section>

        <section className="profile-hero-card">
          <div className="profile-identity">
            <div className="profile-photo-wrap">
              {profile.photo ? (
                <img src={profile.photo} alt={displayName} />
              ) : (
                <div className="profile-photo-blank" aria-hidden="true"></div>
              )}
              <button
                type="button"
                aria-label="Change profile photo"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-photo-input"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="profile-main-info">
              <h2>
                {displayName}
                <ShieldCheck size={18} fill="currentColor" />
              </h2>
              <p>
                <Mail size={15} />
                {profile.email}
              </p>
              <p>
                <Phone size={15} />
                {profile.phone}
              </p>
              <p>
                <MapPin size={15} />
                {profile.address}
              </p>
              <div className="profile-badges">
                <span>Active Member</span>
                <span>{formattedMemberSince}</span>
              </div>
            </div>
          </div>

          <div className="profile-stat-list">
            {profileStats.map(({ label, value, icon: Icon, tone }) => (
              <article className={`profile-stat profile-stat-${tone}`} key={label}>
                <span>
                  <Icon size={20} />
                </span>
                <div>
                  <p>{label}</p>
                  <strong>{value}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <nav className="profile-tabs" aria-label="Profile sections">
          {tabs.map((tab, index) => (
            <button type="button" className={index === 0 ? "active" : ""} key={tab}>
              {tab}
            </button>
          ))}
        </nav>

        <div className="profile-page-grid">
          <section className="profile-panel">
            <h2>Personal Information</h2>
            {message && <p className="profile-save-message">{message}</p>}

            <div className="profile-form-grid">
              {profileFields.map(({ label, name, icon: Icon, wide }) => (
                <label className={wide ? "profile-field profile-field-wide" : "profile-field"} key={label}>
                  <span>{label}</span>
                  <div>
                    <Icon size={15} />
                    <input
                      name={name}
                      type={name === "phone" ? "tel" : name === "dateOfBirth" ? "date" : "text"}
                      inputMode={name === "phone" ? "numeric" : undefined}
                      pattern={name === "phone" ? "[0-9]*" : undefined}
                      maxLength={name === "phone" ? 10 : undefined}
                      max={name === "dateOfBirth" ? new Date().toISOString().split("T")[0] : undefined}
                      value={profile[name] || ""}
                      onChange={handleFieldChange}
                    />
                  </div>
                </label>
              ))}
            </div>
          </section>

          <aside className="profile-side-column">
            <section className="profile-panel">
              <h2>Profile Summary</h2>
              <div className="profile-summary-list">
                {summaryItems.map(({ label, value, icon: Icon, badge }) => (
                  <button type="button" key={label}>
                    <span>
                      <Icon size={16} />
                      {label}
                    </span>
                    <strong className={badge ? "summary-active" : ""}>{value}</strong>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </section>

            <section className="profile-panel">
              <h2>Quick Actions</h2>
              <div className="profile-actions">
                <button type="button" onClick={() => navigate("/client/change-password")}>
                  <Lock size={16} />
                  Change Password
                </button>
                <button type="button" onClick={saveProfile}>
                  <CheckCircle2 size={16} />
                  Update Profile
                </button>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;
