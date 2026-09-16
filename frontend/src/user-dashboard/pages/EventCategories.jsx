import React from "react";
import Sidebar from "../styles/components/Sidebar";
import Topbar from "../styles/components/Topbar";
import FeaturedOfferPackages from "../../components/FeaturedOfferPackages";
import "../styles/dashboard.css";
import "../styles/Decoration.css";
import "./BrowseEvents.css";

export default function EventCategories() {
  return (
    <div className="premium-dashboard">
      <Sidebar />
      <div className="premium-main">
        <Topbar title="Event Categories & Featured Packages" />

        <main className="premium-content-scroll" style={{ backgroundColor: "#f8fafc", padding: "24px 32px 80px" }}>
          <FeaturedOfferPackages
            title="Featured Special Event Packages ⭐"
            subtitle="🎉 Select from our 6 curated event packages or customize every service through the normal booking workflow"
          />
        </main>
      </div>
    </div>
  );
}