import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Standard Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPackages from "./admin/pages/AdminPackages";
import ReviewManagement from "./admin/pages/ReviewManagement";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail"; // --- IMPORTED NEW PAGE LINK HERE ---
import CompletedEventDetails from "./pages/CompletedEventDetails";
import EventBookingForm from "./pages/EventBookingForm";
import GuestRSVP from "./pages/GuestRSVP";

// Main User Dashboard Components
import Dashboard from "./user-dashboard/pages/Dashboard";

import SelectDate from "./user-dashboard/pages/SelectDate";
import EventType from "./user-dashboard/pages/EventType";
import EventTypeRequest from "./user-dashboard/pages/EventTypeRequest";
import SelectVenue from "./user-dashboard/pages/SelectVenue";
import ClientVenueDetails from "./user-dashboard/pages/ClientVenueDetails";
import StudioDetails from "./user-dashboard/pages/StudioDetails";
import HomeFunction from "./user-dashboard/pages/HomeFunction";
import Decoration from "./user-dashboard/pages/Decoration";
import CustomDecorationRequest from "./user-dashboard/pages/CustomDecorationRequest";
import PackageOverview from "./user-dashboard/pages/PackageOverview";
import Catering from "./user-dashboard/pages/Catering";
import GuestListStep from "./user-dashboard/pages/GuestListStep";
import ExpectedGuests from "./user-dashboard/pages/ExpectedGuests";
import ComboDetails from "./user-dashboard/pages/ComboDetails";
import CakeDetails from "./user-dashboard/pages/CakeDetails";
import AdditionalServices from "./user-dashboard/pages/AdditionalServices";

import DJService from "./user-dashboard/pages/DJService";
import DJDetails from "./user-dashboard/pages/DJDetails";
import TransportService from "./user-dashboard/pages/TransportService";
import VehicleDetails from "./user-dashboard/pages/VehicleDetails";
import GuestRooms from "./user-dashboard/pages/GuestRooms";
import RoomDetails from "./user-dashboard/pages/RoomDetails";
import StayDateTime from "./user-dashboard/pages/StayDateTime";
import SeatingArrangement from "./user-dashboard/pages/SeatingArrangement";
import SmartAssistant from "./user-dashboard/pages/SmartAssistant";

import BookingSummary from "./user-dashboard/pages/BookingSummary";

import BrowseEvents from "./user-dashboard/pages/EventCategories";
import BrowseVenues from "./user-dashboard/pages/BrowseVenues";
import MyBookings from "./user-dashboard/pages/MyBookings";
import Wishlist from "./user-dashboard/pages/Wishlist";
import Payments from "./user-dashboard/pages/payments";
import PaymentSuccess from "./user-dashboard/pages/PaymentSuccess";
import Profile from "./user-dashboard/pages/Profile";
import ChangePassword from "./user-dashboard/pages/ChangePassword";
import Settings from "./user-dashboard/pages/Settings";
import HelpSupport from "./user-dashboard/pages/HelpSupport";
import Feedback from "./user-dashboard/pages/Feedback";
import Notification from "./user-dashboard/pages/Notification";
import StaffLayout from "./Vendor&staffManagement/staff/components/StaffLayout";
import StaffDashboard from "./Vendor&staffManagement/staff/pages/StaffDashboard";
import StaffEvents from "./Vendor&staffManagement/staff/pages/StaffEvents";
import StaffTasks from "./Vendor&staffManagement/staff/pages/StaffTasks";
import StaffAttendance from "./Vendor&staffManagement/staff/pages/StaffAttendance";
import StaffSchedule from "./Vendor&staffManagement/staff/pages/StaffSchedule";
import StaffProfile from "./Vendor&staffManagement/staff/pages/StaffProfile";
import StaffNotifications from "./Vendor&staffManagement/staff/pages/StaffNotifications";
import VendorDashboard from "./Vendor&staffManagement/vendor/pages/VendorDashboard";

// Event Management Layout and Base Workflow Pages
import EventManagementDashboard from "./pages/events/EventManagementDashboard";
import EventCategory from "./pages/events/EventCategory";
import EventDetails from "./pages/events/EventDetails";
import EventResources from "./pages/events/EventResources";
import ResourcesPage from "./pages/events/ResourcesPage";
import EventDashboard from "./pages/events/EventDashboard";
import EventsPage from "./pages/events/EventsPage";
import CalendarPage from "./pages/events/CalendarPage";

// New Help Centre Component
import HelpCentre from "./pages/events/HelpCentre";

// Route Guard Components
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute";


function getAuthRole() {
  return localStorage.getItem("userRole") || "client";
}

function UserProtectedRoute({ children }) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");
  const role = getAuthRole();
  const location = useLocation();

  if (!loggedInUser || !token) {
    if (location.pathname.startsWith("/user/event-management")) {
      return <Navigate to="/login?from=event-management" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  if (role === "vendor" && !location.pathname.startsWith("/vendor")) {
    return <Navigate to="/vendor/dashboard" replace />;
  }

  if (role === "staff" && !location.pathname.startsWith("/staff")) {
    return <Navigate to="/staff/dashboard" replace />;
  }

  return children;
}

function RoleProtectedRoute({ allowedRoles, children }) {
  const loggedInUser = localStorage.getItem("loggedInUser");
  const token = localStorage.getItem("token");
  const role = getAuthRole();

  if (!loggedInUser || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Routes>
      {/* --- Public Routes --- */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* --- EMAIL CONFIRMATION LINK PUBLIC LANDING ROUTE --- */}
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/completed-events" element={<CompletedEventDetails />} />
      
      {/* --- GUEST DIGITAL RSVP PAGE --- */}
      <Route path="/rsvp/:token" element={<GuestRSVP />} />

      <Route
        path="/staff"
        element={
          <RoleProtectedRoute allowedRoles={["staff"]}>
            <StaffLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="events" element={<StaffEvents />} />
        <Route path="tasks" element={<StaffTasks />} />
        <Route path="attendance" element={<StaffAttendance />} />
        <Route path="schedule" element={<StaffSchedule />} />
        <Route path="profile" element={<StaffProfile />} />
        <Route path="notifications" element={<StaffNotifications />} />
      </Route>

      <Route
        path="/vendor/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["vendor"]}>
            <VendorDashboard />
          </RoleProtectedRoute>
        }
      />

      {/* The generic /user/ routes have been removed and replaced by /client/ routes below */}


      {/* --- Client Dashboard Routes --- */}
      <Route
        path="/client/dashboard"
        element={
          <UserProtectedRoute>
            <Dashboard />
          </UserProtectedRoute>
        }
      />
      
      {/* --- Restored Premium Flow Routes --- */}
      <Route path="/client/dashboard" element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} />
      <Route path="/client/packages" element={<UserProtectedRoute><PackageOverview /></UserProtectedRoute>} />
      <Route path="/client/select-date" element={<UserProtectedRoute><SelectDate /></UserProtectedRoute>} />
      <Route path="/client/event-type" element={<UserProtectedRoute><EventType /></UserProtectedRoute>} />
      <Route path="/client/event-type-request" element={<UserProtectedRoute><EventTypeRequest /></UserProtectedRoute>} />
      <Route path="/client/select-venue" element={<UserProtectedRoute><SelectVenue /></UserProtectedRoute>} />
      <Route path="/client/venue-details/:id" element={<UserProtectedRoute><ClientVenueDetails /></UserProtectedRoute>} />
      <Route path="/client/home-function" element={<UserProtectedRoute><HomeFunction /></UserProtectedRoute>} />
      <Route path="/client/decoration" element={<UserProtectedRoute><Decoration /></UserProtectedRoute>} />
      <Route path="/client/custom-decoration-request" element={<UserProtectedRoute><CustomDecorationRequest /></UserProtectedRoute>} />
      <Route path="/client/guests" element={<UserProtectedRoute><GuestListStep /></UserProtectedRoute>} />
      <Route path="/client/expected-guests" element={<UserProtectedRoute><ExpectedGuests /></UserProtectedRoute>} />
      <Route path="/client/catering" element={<UserProtectedRoute><Catering /></UserProtectedRoute>} />
      <Route path="/client/catering/combo-details/:comboId" element={<UserProtectedRoute><ComboDetails /></UserProtectedRoute>} />
      <Route path="/client/catering/cake-details/:cakeId" element={<UserProtectedRoute><CakeDetails /></UserProtectedRoute>} />
      <Route path="/client/services" element={<UserProtectedRoute><AdditionalServices /></UserProtectedRoute>} />
      <Route path="/client/studio-details/:type/:id" element={<UserProtectedRoute><StudioDetails /></UserProtectedRoute>} />
      <Route path="/client/summary" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />
      <Route path="/client/wishlist" element={<UserProtectedRoute><Wishlist /></UserProtectedRoute>} />

      <Route path="/client/dj-service" element={<UserProtectedRoute><DJService /></UserProtectedRoute>} />
      <Route path="/client/dj-details/:id" element={<UserProtectedRoute><DJDetails /></UserProtectedRoute>} />
      <Route path="/client/transport-service" element={<UserProtectedRoute><TransportService /></UserProtectedRoute>} />
      <Route path="/client/vehicle-details/:type/:id" element={<UserProtectedRoute><VehicleDetails /></UserProtectedRoute>} />
      <Route path="/client/guest-rooms" element={<UserProtectedRoute><GuestRooms /></UserProtectedRoute>} />
      <Route path="/client/room-details/:id" element={<UserProtectedRoute><RoomDetails /></UserProtectedRoute>} />
      <Route path="/client/stay-date-time" element={<UserProtectedRoute><StayDateTime /></UserProtectedRoute>} />
      <Route path="/client/seating-arrangement" element={<UserProtectedRoute><SeatingArrangement /></UserProtectedRoute>} />
      <Route path="/client/booking-summary" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />

      <Route path="/client/confirmation" element={<UserProtectedRoute><BookingSummary /></UserProtectedRoute>} />
      <Route path="/client/smart-assistant" element={<UserProtectedRoute><SmartAssistant /></UserProtectedRoute>} />

      <Route
        path="/client/browse-events"
        element={
          <UserProtectedRoute>
            <BrowseEvents />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/browse-venues"
        element={
          <UserProtectedRoute>
            <BrowseVenues />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/my-bookings"
        element={
          <UserProtectedRoute>
            <MyBookings />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/wishlist"
        element={
          <UserProtectedRoute>
            <Wishlist />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/payments"
        element={
          <UserProtectedRoute>
            <Payments />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/payment-success"
        element={
          <UserProtectedRoute>
            <PaymentSuccess />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/profile"
        element={
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/change-password"
        element={
          <UserProtectedRoute>
            <ChangePassword />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/settings"
        element={
          <UserProtectedRoute>
            <Settings />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/help-support"
        element={
          <UserProtectedRoute>
            <HelpSupport />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/notification"
        element={
          <UserProtectedRoute>
            <Notification />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/notifications"
        element={
          <UserProtectedRoute>
            <Notification />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/notifications"
        element={
          <UserProtectedRoute>
            <Notification />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/client/feedback"
        element={
          <UserProtectedRoute>
            <Feedback />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/client/event/:eventId"
        element={
          <UserProtectedRoute>
            <EventDetails />
          </UserProtectedRoute>
        }
      />

      <Route
        path="/client/book-event/:eventId"
        element={
          <UserProtectedRoute>
            <EventBookingForm />
          </UserProtectedRoute>
        }
      />

      {/* --- Event Creation & Inner Management Workflow --- */}
      <Route
        path="/user/create-event"
        element={
          <UserProtectedRoute>
            <EventCategory />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/event/:eventId"
        element={
          <UserProtectedRoute>
            <EventDetails />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/event-details/:eventId"
        element={
          <UserProtectedRoute>
            <EventDetails />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/event-resources/:eventId"
        element={
          <UserProtectedRoute>
            <EventResources />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/event-dashboard/:eventId"
        element={
          <UserProtectedRoute>
            <EventDashboard />
          </UserProtectedRoute>
        }
      />

      {/* --- Main Nested Layout Route For Event Management --- */}
      <Route
        path="/user/event-management"
        element={
          <UserProtectedRoute>
            <EventManagementDashboard />
          </UserProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EventDashboard />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="categories" element={<EventCategory />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="analytics" element={<Payments />} />
        <Route path="help-centre" element={<HelpCentre />} />
      </Route>

      {/* --- Admin Panel Routes --- */}
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/event-management"
        element={
          <AdminProtectedRoute>
            <EventManagementDashboard embedded />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/venue-management/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/packages/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminProtectedRoute>
            <ReviewManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <AdminProtectedRoute>
            <ReviewManagement />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/accounts-finance/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/vendor-management/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/resource-management/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications/*"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />


      {/* --- Fallback Catch-All Route --- */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
