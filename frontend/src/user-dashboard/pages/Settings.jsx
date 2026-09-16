import React, { useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Eye,
  Globe2,
  Languages,
  Lock,
  Mail,
  MapPin,
  Menu,
  Palette,
  Pencil,
  Phone,
  Save,
  Search,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import { getClientDisplayName, getClientPhoto, getCurrentClient } from "../services/clientSession";
import "../styles/dashboard.css";

const settingsMenu = [
  { label: "Account Settings", icon: User },
  { label: "Security", icon: Shield },
  { label: "Notification Settings", icon: Bell },
  { label: "Privacy Settings", icon: Lock },
  { label: "Payment Methods", icon: CreditCard },
  { label: "Email Preferences", icon: Mail },
  { label: "Appearance", icon: Palette },
  { label: "Language & Region", icon: Globe2 },
];

const notificationOptions = [
  {
    title: "Email Notifications",
    text: "Receive emails for important updates.",
    icon: Mail,
    enabled: true,
  },
  {
    title: "SMS Notifications",
    text: "Receive SMS for booking updates.",
    icon: Phone,
    enabled: true,
  },
  {
    title: "Push Notifications",
    text: "Receive push notifications.",
    icon: Bell,
    enabled: true,
  },
  {
    title: "Marketing Emails",
    text: "Receive offers and promotional emails.",
    icon: Mail,
    enabled: false,
  },
];

const preferences = [
  { label: "Language", value: "English", icon: Languages },
  { label: "Time Zone", value: "(UTC-05:00) Eastern Time (US & Canada)", icon: Globe2 },
  { label: "Date Format", value: "MM/DD/YYYY", icon: CalendarDays },
];

const Settings = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const firstName = clientName.split(" ")[0] || "Client";
  const clientPhoto = getClientPhoto(currentClient);
  const personalInfo = [
    { label: "Full Name", value: clientName, icon: User },
    { label: "Email Address", value: currentClient.email || "client@example.com", icon: Mail },
    { label: "Phone Number", value: currentClient.phone || "Not added", icon: Phone },
    { label: "Date of Birth", value: currentClient.dateOfBirth || "Not added", icon: CalendarDays },
    { label: "Address", value: currentClient.address || "Not added", icon: MapPin, wide: true },
  ];
  const [activeMenu, setActiveMenu] = useState("Account Settings");
  const [notifications, setNotifications] = useState(notificationOptions);

  const toggleNotification = (title) => {
    setNotifications((currentItems) =>
      currentItems.map((item) =>
        item.title === title ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content settings-content">
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
              <SettingsIcon size={18} />
            </button>
            <div className="profile-mini-user">
              <img
                src={clientPhoto}
                alt={clientName}
              />
              <div>
                <p>Welcome back,</p>
                <strong>{firstName}!</strong>
              </div>
              <ChevronDown size={16} />
            </div>
          </div>
        </header>

        <section className="settings-title">
          <h1>Settings</h1>
          <p>Client Dashboard &gt; Settings</p>
        </section>

        <div className="settings-layout">
          <aside className="settings-menu-card">
            <h2>Settings Menu</h2>
            <div className="settings-menu-list">
              {settingsMenu.map(({ label, icon: Icon }) => (
                <button
                  type="button"
                  key={label}
                  className={activeMenu === label ? "selected" : ""}
                  onClick={() => setActiveMenu(label)}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>
          </aside>

          <section className="settings-main-panel">
            <div className="settings-section-heading">
              <h2>{activeMenu}</h2>
              <p>Manage your personal information and account preferences.</p>
            </div>

            <article className="settings-card">
              <div className="settings-card-header">
                <h3>Personal Information</h3>
                <button type="button" className="outline-action">
                  <Pencil size={14} />
                  Edit
                </button>
              </div>

              <div className="settings-info-grid">
                {personalInfo.map(({ label, value, icon: Icon, wide }) => (
                  <div className={wide ? "settings-info-item settings-info-wide" : "settings-info-item"} key={label}>
                    <span>
                      <Icon size={18} />
                    </span>
                    <div>
                      <p>{label}</p>
                      <strong>{value}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Security</h3>
                  <p>Manage your password and account security.</p>
                </div>
                <button type="button" className="filled-action">
                  Change Password
                </button>
              </div>

              <div className="settings-security-grid">
                <div className="settings-info-item">
                  <span>
                    <Lock size={18} />
                  </span>
                  <div>
                    <p>Password</p>
                    <strong>**********</strong>
                  </div>
                </div>
                <div className="settings-info-item">
                  <span>
                    <Eye size={18} />
                  </span>
                  <div>
                    <p>Last Login</p>
                    <strong>May 21, 2026 10:30 AM</strong>
                  </div>
                </div>
                <div className="settings-info-item">
                  <span>
                    <ShieldCheck size={18} />
                  </span>
                  <div>
                    <p>Two-Factor Authentication</p>
                    <strong className="enabled-text">Enabled</strong>
                  </div>
                </div>
              </div>
            </article>

            <article className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Notification Settings</h3>
                  <p>Choose how you want to receive notifications.</p>
                </div>
                <button type="button" className="outline-action">
                  <SettingsIcon size={14} />
                  Manage
                </button>
              </div>

              <div className="settings-notification-grid">
                {notifications.map(({ title, text, icon: Icon, enabled }) => (
                  <div className="settings-notification-item" key={title}>
                    <span>
                      <Icon size={18} />
                    </span>
                    <div>
                      <h4>{title}</h4>
                      <p>{text}</p>
                    </div>
                    <button
                      type="button"
                      className={enabled ? "switch is-on" : "switch"}
                      onClick={() => toggleNotification(title)}
                      aria-label={`Toggle ${title}`}
                    >
                      <span></span>
                    </button>
                  </div>
                ))}
              </div>
            </article>

            <article className="settings-card">
              <div className="settings-card-header">
                <div>
                  <h3>Preferences</h3>
                  <p>Customize your app experience.</p>
                </div>
                <button type="button" className="filled-action">
                  <Save size={14} />
                  Save Changes
                </button>
              </div>

              <div className="settings-preferences-grid">
                {preferences.map(({ label, value, icon: Icon }) => (
                  <button type="button" className="preference-select" key={label}>
                    <span>
                      <Icon size={17} />
                    </span>
                    <div>
                      <p>{label}</p>
                      <strong>{value}</strong>
                    </div>
                    <ChevronDown size={16} />
                  </button>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
