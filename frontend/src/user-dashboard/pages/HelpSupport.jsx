import React from "react";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Headphones,
  LifeBuoy,
  Mail,
  Megaphone,
  Menu,
  MessageCircle,
  Phone,
  PlaySquare,
  Search,
  Settings,
  Shield,
  Star,
  Ticket,
  Users,
} from "lucide-react";

import Sidebar from "../styles/components/Sidebar";
import { getClientDisplayName, getClientPhoto, getCurrentClient } from "../services/clientSession";
import "../styles/dashboard.css";

const contactCards = [
  {
    title: "FAQs",
    text: "Find answers to common questions.",
    action: "View FAQs",
    icon: BookOpen,
    tone: "blue",
  },
  {
    title: "Send Us an Email",
    text: "We usually respond within 24 hours.",
    action: "Email Support",
    icon: Mail,
    tone: "green",
  },
  {
    title: "Live Chat",
    text: "Chat with our support team in real-time.",
    action: "Start Live Chat",
    icon: MessageCircle,
    tone: "purple",
  },
  {
    title: "Call Us",
    text: "Mon - Fri: 9:00 AM - 6:00 PM",
    action: "+1 987 654 3210",
    icon: Phone,
    tone: "orange",
  },
];

const helpTopics = [
  {
    title: "How to Book an Event",
    text: "Step-by-step guide to book your favorite event.",
    icon: CalendarDays,
    tone: "orange",
  },
  {
    title: "Managing Your Bookings",
    text: "Update, reschedule or cancel your bookings.",
    icon: Ticket,
    tone: "blue",
  },
  {
    title: "Payments & Refunds",
    text: "Learn about payment methods, refunds and receipts.",
    icon: CreditCard,
    tone: "green",
  },
  {
    title: "Account Settings",
    text: "Manage your profile, password and preferences.",
    icon: Shield,
    tone: "purple",
  },
  {
    title: "Event Requests",
    text: "How to create and manage event requests.",
    icon: Mail,
    tone: "red",
  },
];

const supportTickets = [
  {
    id: "#TK12345",
    title: "Issue with payment",
    time: "Updated 2 days ago",
    status: "Open",
  },
  {
    id: "#TK12344",
    title: "Refund not received",
    time: "Updated 5 days ago",
    status: "In Progress",
  },
  {
    id: "#TK12343",
    title: "Event booking confirmation",
    time: "Updated 1 week ago",
    status: "Closed",
  },
];

const resources = [
  {
    title: "Community Forum",
    text: "Connect with other users and share ideas.",
    icon: Users,
    tone: "green",
  },
  {
    title: "Video Tutorials",
    text: "Watch step-by-step video guides.",
    icon: PlaySquare,
    tone: "purple",
  },
];

const HelpSupport = () => {
  const currentClient = getCurrentClient();
  const clientName = getClientDisplayName(currentClient);
  const firstName = clientName.split(" ")[0] || "Client";
  const clientPhoto = getClientPhoto(currentClient);

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content support-content">
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

        <section className="support-title">
          <h1>Help & Support</h1>
          <p>Client Dashboard &gt; Help & Support</p>
        </section>

        <section className="support-hero">
          <div className="support-hero-graphic">
            <Headphones size={86} />
          </div>

          <div className="support-hero-search">
            <h2>How can we help you?</h2>
            <p>We are here to help and answer any question you might have.</p>
            <div>
              <input type="search" placeholder="Search for articles, topics or keywords..." />
              <button type="button">Search</button>
            </div>
          </div>

          <div className="support-contact-box">
            <h3>Need immediate help?</h3>
            <p>Our support team is available 24/7 to assist you.</p>
            <button type="button">
              <LifeBuoy size={16} />
              Contact Support
            </button>
          </div>
        </section>

        <section className="support-contact-grid">
          {contactCards.map(({ title, text, action, icon: Icon, tone }) => (
            <article className={`support-contact-card support-${tone}`} key={title}>
              <span>
                <Icon size={28} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              <button type="button">{action}</button>
            </article>
          ))}
        </section>

        <div className="support-main-grid">
          <section className="support-panel">
            <div className="support-panel-heading">
              <h2>
                <BookOpen size={16} />
                Popular Help Topics
              </h2>
              <button type="button">View All Articles</button>
            </div>

            <div className="help-topic-list">
              {helpTopics.map(({ title, text, icon: Icon, tone }) => (
                <button type="button" className="help-topic-row" key={title}>
                  <span className={`topic-icon topic-${tone}`}>
                    <Icon size={18} />
                  </span>
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                  <ChevronRight size={17} />
                </button>
              ))}
            </div>
          </section>

          <aside className="support-side-column">
            <section className="support-panel">
              <div className="support-panel-heading">
                <h2>Your Support Tickets</h2>
                <button type="button">View All</button>
              </div>

              <div className="ticket-list">
                {supportTickets.map((ticket) => (
                  <article className="ticket-card" key={ticket.id}>
                    <div>
                      <strong>{ticket.id}</strong>
                      <p>{ticket.title}</p>
                      <small>{ticket.time}</small>
                    </div>
                    <span className={`ticket-status status-${ticket.status.toLowerCase().replace(" ", "-")}`}>
                      {ticket.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section className="support-panel">
              <h2>Help Center Resources</h2>
              <div className="resource-list">
                {resources.map(({ title, text, icon: Icon, tone }) => (
                  <button type="button" key={title}>
                    <span className={`topic-icon topic-${tone}`}>
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{title}</strong>
                      <small>{text}</small>
                    </span>
                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="support-feedback">
          <div>
            <Megaphone size={46} />
            <span>
              <strong>We value your feedback!</strong>
              <p>Your feedback helps us improve our support and services.</p>
            </span>
          </div>
          <button type="button">
            <Star size={16} />
            Give Feedback
          </button>
        </section>
      </main>
    </div>
  );
};

export default HelpSupport;
