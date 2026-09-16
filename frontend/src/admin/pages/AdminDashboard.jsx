import React, { useEffect, useMemo, useState } from "react";
import AddVendor from "../vendor-management/pages/AddVendor";
import { Home, ChevronLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Menu,
  X,
  LogOut,
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  Store,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Upload,
  Loader2,
  ShieldCheck,
  Eye,
  Package,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  ClipboardList,
  Palette,
  Utensils,
  Filter,
  DownloadCloud,
  ArrowLeft,
  MessageSquare,
  Printer,
  Ban,
  Bookmark
} from "lucide-react";

// Existing Module Components
import VenueDashboard from "../venue-management/pages/VenueDashboard";
import AddVenue from "../venue-management/pages/AddVenue";
import AllVenues from "../venue-management/pages/AllVenues";
import VenueBookings from "../venue-management/pages/VenueBookings";
import MaintenanceRecords from "../venue-management/pages/MaintenanceRecords";
import SeatingArrangements from "../venue-management/pages/SeatingArrangements";
import VenueDetails from "../venue-management/pages/VenueDetails";
import AvailabilityCalendar from "../venue-management/pages/AvailabilityCalendar";
import BillingDashboard from "../venue-management/pages/BillingDashboard";
import BookingWizardModal from "../components/BookingWizardModal";
import AdminNotifications from "../notifications/AdminNotifications";

// Resource Management Components
import ResourceDashboard from "../resource-management/pages/ResourceDashboard";
import ResourceCategories from "../resource-management/pages/ResourceCategories";
import AddResource from "../resource-management/pages/AddResource";
import PremiumLogo from "../../components/PremiumLogo/PremiumLogo";
import ResourceList from "../resource-management/pages/ResourceList";
import InventoryStock from "../resource-management/pages/InventoryStock";
import ResourceAllocation from "../resource-management/pages/ResourceAllocation";
import ResourceReturn from "../resource-management/pages/ResourceReturn";
import MaintenanceManagement from "../resource-management/pages/MaintenanceManagement";
import LowStockAlerts from "../resource-management/pages/LowStockAlerts";
import ResourceReports from "../resource-management/pages/ResourceReports";
import DecorationManagement from "./DecorationManagement";
import CateringManagement from "./CateringManagement";
import PhotographyManagement from "./PhotographyManagement";
import DJManagement from "./DJManagement";
import VehicleManagement from "./VehicleManagement";
import GuestRoomManagement from "./GuestRoomManagement";
import Invoice from "../../pages/Invoice";
import StaffAttendance from "../staff-management/pages/StaffAttendance";
import ClientDashboard from "../client-management/pages/ClientDashboard";
import EventDashboard from "../event-management/pages/EventDashboard";
import BookingDashboard from "../booking-management/pages/BookingDashboard";

// Accounts & Finance Components
import FinanceDashboard from "../finance-management/pages/FinanceDashboard";
import LedgerManagement from "../finance-management/pages/LedgerManagement";
import IncomeExpenseTracking from "../finance-management/pages/IncomeExpenseTracking";
import ProfitLossReport from "../finance-management/pages/ProfitLossReport";
import TransactionHistory from "../finance-management/pages/TransactionHistory";
import AllPackages from "../package-management/pages/AllPackages";
import AddPackage from "../package-management/pages/AddPackage";

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    navigate("/admin-login");
  };

  // ==========================================
  // 1. PURE UTILITY & TEXT FORMATTING HELPERS 
  // ==========================================
  const formatDate = (value) => {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const formatDateTime = (value, timeSlot) => {
    const formattedDate = formatDate(value);
    if (!timeSlot) return formattedDate;
    return `${formattedDate} • ${timeSlot}`;
  };

  const normalizeBookingEvent = (booking) => {
    const rawEventName = booking.eventTitle || booking.event_type || "Booked Event";
    const rawVenueName = booking.venueName || booking.location || booking.venue_id || booking.venue_name || "Unknown Venue";
    const eventNameLower = String(rawEventName).toLowerCase();
    const venueNameLower = String(rawVenueName).toLowerCase();

    const eventLooksLikeVenue = /hall|venue|banquet|auditorium|center|centre/i.test(rawEventName);
    const rawEventEqualsRawVenue = eventNameLower === venueNameLower;
    const hasEventTypeTitle = Boolean(booking.event_type && booking.event_type !== rawEventName);

    if ((eventLooksLikeVenue || rawEventEqualsRawVenue) && (hasEventTypeTitle || /hall|venue|banquet|auditorium|center|centre/i.test(rawVenueName))) {
      const finalEventName = booking.event_type || booking.eventTitle || rawEventName.replace(/\s+(Hall|Venue|Banquet|Auditorium|Center|Centre)$/i, "").trim() || rawEventName;
      return {
        name: finalEventName,
        venue: rawVenueName,
      };
    }

    return {
      name: rawEventName,
      venue: rawVenueName,
    };
  };

  const getVendorInitials = (name) =>
    name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2) || "NV";

  const buildVendorRecord = (vendorData, existingVendor = null) => ({
    id: existingVendor?.id || Date.now(),
    initials: getVendorInitials(vendorData.vendorName || existingVendor?.name || "New Vendor"),
    name: vendorData.vendorName || existingVendor?.name || "New Vendor",
    category: vendorData.category || existingVendor?.category || "Catering",
    phone: vendorData.phone || "",
    email: vendorData.email || "",
    address: vendorData.address || existingVendor?.address || "",
    contactPerson: vendorData.contactPerson || existingVendor?.contactPerson || "",
    contractStartDate: vendorData.contractStartDate || existingVendor?.contractStartDate || "",
    contractEndDate: vendorData.contractEndDate || existingVendor?.contractEndDate || "",
    contractStatus: vendorData.status || existingVendor?.contractStatus || "Active",
    status: vendorData.status || existingVendor?.status || "Active",
    assignedEvents: existingVendor?.assignedEvents ?? 0,
    contractPrice: Number(vendorData.contractPrice || existingVendor?.contractPrice || 0),
    contractBasis: vendorData.contractBasis || existingVendor?.contractBasis || "Per Event",
    bankAccountNumber: vendorData.bankAccountNumber || existingVendor?.bankAccountNumber || "",
    ifscCode: vendorData.ifscCode || existingVendor?.ifscCode || "",
    upiId: vendorData.upiId || existingVendor?.upiId || "",
    paidAmounts: vendorData.paidAmounts || existingVendor?.paidAmounts || [],
  });

  const getRecordId = (record) => record?._id || record?.id || record?.bookingId || "";

  // ==========================================
  // 2. STATE DECLARATIONS
  // ==========================================
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [venueOpen, setVenueOpen] = useState(location.pathname.startsWith("/admin/venue-management"));
  const [resourceOpen, setResourceOpen] = useState(location.pathname.startsWith("/admin/resource-management"));
  const [accountsFinanceOpen, setAccountsFinanceOpen] = useState(location.pathname.startsWith("/admin/accounts-finance"));

  const [additionalServicesSubTab, setAdditionalServicesSubTab] = useState("photography");
  const [cateringSubTab, setCateringSubTab] = useState("packages");
  const [staffSubTab, setStaffSubTab] = useState("staff-management");
  const [isAddStaff, setIsAddStaff] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [staffErrors, setStaffErrors] = useState({});
  const [newStaffMember, setNewStaffMember] = useState({
    staffId: "STF" + Math.floor(100 + Math.random() * 900),
    name: "",
    personalEmail: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    department: "",
    emergencyContact: "",
    experience: "",
    joiningDate: "",
    salary: "",
    employmentType: "Full-time",
    bankAccountNumber: "",
    ifscCode: "",
    upiId: "",
    availability: "",
    photo: null,
    password: "",
    status: "Active",
  });
  const [credentialsSentData, setCredentialsSentData] = useState(null);

  const [staffMembers, setStaffMembers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const [adminBilling, setAdminBilling] = useState({ summary: {}, invoices: [], payments: [], dailyTransactions: [] });
  const [billingLoading, setBillingLoading] = useState(true);

  useEffect(() => {
    const fetchVendorsEventsAndResources = async () => {
      try {
        const vendorRes = await fetch("http://localhost:5000/api/vendors");
        const vendorData = await vendorRes.json();
        setVendors(vendorData);

        const resourceRes = await fetch("http://localhost:5000/api/resources");
        const resourceData = await resourceRes.json();
        setResources(resourceData);

        const eventRes = await fetch("http://localhost:5000/api/events");
        const eventData = await eventRes.json();
        if (Array.isArray(eventData)) {
          setEvents(eventData.map((ev) => ({ ...ev, id: ev._id || ev.id })));
        }

        const staffRes = await fetch("http://localhost:5000/api/staff");
        const staffData = await staffRes.json();
        if (Array.isArray(staffData)) {
          setStaffMembers(staffData);
        } else {
          console.warn("Expected staff array but got:", staffData);
          setStaffMembers([]);
        }
      } catch (error) {
        console.error("Failed to fetch vendors, resources, staff, or events:", error);
      }
    };
    fetchVendorsEventsAndResources();
  }, []);

  const [vendorEditingId, setVendorEditingId] = useState(null);
  const [vendorDraft, setVendorDraft] = useState(null);

  const [resources, setResources] = useState([]);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [newResource, setNewResource] = useState({ name: "", category: "Equipment", quantity: 1, unitCost: 0, status: "Available" });

  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", venue: "", status: "Planning" });
  const [reportDownloading, setReportDownloading] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("Bank Transfer");
  const [payRef, setPayRef] = useState("");
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("admin_system_settings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    return {
      appName: "Event Management System",
      supportPhone: "+919876543210",
      supportEmail: "support@ems.com",
      emailNotifications: true,
      pushNotifications: false,
      bookingAlerts: true,
      gstRate: 18,
      serviceCharge: 5,
      maintenanceMode: false,
      currencySymbol: "₹",
      currentPassword: "",
      newPassword: ""
    };
  });

  // ==========================================
  // 3. MEMOIZED ANALYTICAL METRICS
  // ==========================================
  const dashboardStats = useMemo(() => {
    const totalEvents = bookedEvents.length;
    const today = new Date();
    const upcomingEvents = bookedEvents.filter((event) => {
      const parsed = new Date(event.rawDate || event.date);
      if (Number.isNaN(parsed.getTime())) return false;
      return parsed >= new Date(today.toDateString());
    }).length;

    const revenueThisMonthValue = bookings.reduce((sum, booking) => {
      const bookingDate = new Date(booking.event_date);
      if (Number.isNaN(bookingDate.getTime())) return sum;
      if (bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear()) {
        return sum + (booking.total_cost || booking.amount || 0);
      }
      return sum;
    }, 0);

    const pendingPayments = bookings.filter((booking) => {
      const status = (booking.booking_status || booking.status || "").toLowerCase();
      return status !== "confirmed" && status !== "approved - awaiting payment" && status !== "approved";
    }).length;

    return {
      totalEvents,
      upcomingEvents,
      revenueThisMonth: `₹${revenueThisMonthValue.toLocaleString("en-IN")}`,
      revenueGrowth: totalEvents > 0 ? `${Math.round((upcomingEvents / totalEvents) * 100)}%` : "0%",
      pendingPayments,
    };
  }, [bookings, bookedEvents]);

  const eventDistribution = useMemo(() => {
    const counts = { Conferences: 0, Weddings: 0, Corporate: 0, Social: 0 };
    bookedEvents.forEach((event) => {
      const value = (event.title || event.name || "").toLowerCase();
      if (value.includes("wedding")) counts.Weddings += 1;
      else if (value.includes("conference")) counts.Conferences += 1;
      else if (value.includes("corporate")) counts.Corporate += 1;
      else counts.Social += 1;
    });
    return [
      { name: "Conferences", value: counts.Conferences, color: "#3b82f6" },
      { name: "Weddings", value: counts.Weddings, color: "#ec4899" },
      { name: "Corporate", value: counts.Corporate, color: "#8b5cf6" },
      { name: "Social", value: counts.Social, color: "#10b981" },
    ];
  }, [bookedEvents]);

  // ==========================================
  // 4. ROUTE TITLES & DYNAMIC PAGE TITLE CONFIG
  // ==========================================
  const routeTitles = {
    "/admin/venue-management/overview": "Overview",
    "/admin/venue-management/add-venue": "Add Venue",
    "/admin/venue-management/all-venues": "All Venues",
    "/admin/venue-management/venue-bookings": "Venue Bookings",
    "/admin/venue-management/availability-calendar": "Availability Calendar",
    "/admin/venue-management/seating-layout": "Seating Arrangements",
    "/admin/venue-management/maintenance": "Maintenance Records",
    "/admin/venue-management/venue-revenue": "Venue Revenue",
    "/admin/venue-management/billing": "Billing Dashboard",
    "/admin/accounts-finance/overview": "Financial Overview",
    "/admin/accounts-finance/ledger": "Debit & Credit Ledger",
    "/admin/accounts-finance/income-expense": "Income & Expense Tracking",
    "/admin/accounts-finance/profit-loss": "Profit & Loss Reports",
    "/admin/accounts-finance/history": "Transaction History",
  };

  const pageTitle = location.pathname.startsWith("/admin/venue-management") ||
    location.pathname.startsWith("/admin/vendor-management") ||
    location.pathname.startsWith("/admin/resource-management") ||
    location.pathname.startsWith("/admin/accounts-finance")
    ? routeTitles[location.pathname] || (
      location.pathname.startsWith("/admin/vendor-management") ? "Vendor Management" :
        location.pathname.startsWith("/admin/resource-management") ? "Resource Management" :
          location.pathname.startsWith("/admin/accounts-finance") ? "Accounts & Finance" :
            "Venue Management"
    )
    : activeTab === "events"
      ? "Manage Events"
      : activeTab === "resources"
        ? "Manage Resources"
        : activeTab === "clients"
          ? "Manage Clients"
          : activeTab === "staff"
            ? "Staff & Vendors Management"
            : activeTab === "bookings"
              ? "Bookings Dashboard"
              : activeTab === "payments"
                ? "Payment Ledger"
                : activeTab === "reports"
                  ? "Reports"
                  : activeTab === "settings"
                    ? "System Settings"
                    : activeTab === "decorations"
                      ? "Decoration Management"
                      : "Dashboard Overview";

  // ==========================================
  // 5. LIFECYCLE SIDE EFFECTS
  // ==========================================
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      navigate("/admin-login");
    }
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/venue-management")) {
      setVenueOpen(true);
    } else {
      setVenueOpen(false);
    }

    if (location.pathname.startsWith("/admin/resource-management")) {
      setResourceOpen(true);
    } else {
      setResourceOpen(false);
    }

    if (location.pathname.startsWith("/admin/vendor-management")) {
      setActiveTab("staff");
      setStaffSubTab("vendor-management");
    }

    if (location.pathname.startsWith("/admin/packages")) {
      setActiveTab("packages");
    }

    if (location.pathname === "/admin" || location.pathname === "/admin/dashboard") {
      setActiveTab("overview");
    }
  }, [location.pathname]);

  useEffect(() => {
    const isDashboardRoute = location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    if (!isDashboardRoute) return undefined;

    window.history.pushState({ adminDashboardBackGuard: true }, "", window.location.href);

    const handleBrowserBack = () => {
      navigate("/admin-login", { replace: true });
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => window.removeEventListener("popstate", handleBrowserBack);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const fetchAdminBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings?status=all", { cache: "no-store" });
        const data = await response.json();
        const currentBookings = data?.data || [];
        setBookings(currentBookings);

        setBookedEvents(
          currentBookings.map((booking) => {
            const normalized = normalizeBookingEvent(booking);
            return {
              id: booking._id,
              name: normalized.name,
              bookingId: booking._id,
              date: formatDate(booking.event_date),
              rawDate: booking.event_date,
              timeSlot: booking.time_slot || "Full Day",
              venue: normalized.venue,
              status: booking.status || booking.booking_status || "Pending",
              client: booking.clientName || booking.client_id || booking.phone_number || "Client",
              amount: booking.total_cost || booking.amount || 0,
            };
          })
        );

        const clientMap = new Map();
        currentBookings.forEach((booking) => {
          const key = booking.clientEmail || booking.client_id || booking.phone_number || booking.userId || booking._id;
          const formattedLastBooking = formatDateTime(booking.event_date, booking.time_slot);

          const bookingCost = Number(booking.total_cost || booking.amount || 0);
          const advancePaid = Number(booking.advance_paid || 0);

          const bServices = [];
          if (booking.venueName) bServices.push(`Venue: ${booking.venueName}`);
          if (booking.decorationPackage) bServices.push(`Decor: ${booking.decorationPackage}`);
          if (booking.cateringPackage) bServices.push(`Catering: ${booking.cateringPackage}`);
          if (booking.seatingArrangement?.seatingType) bServices.push(`Seating: ${booking.seatingArrangement.seatingType}`);
          if (booking.additionalServices?.photography) bServices.push("Photography");
          if (booking.additionalServices?.videography) bServices.push("Videography");
          if (booking.additionalServices?.dj) bServices.push("DJ Service");
          if (booking.additionalServices?.travel) bServices.push("Transportation");
          if (booking.additionalServices?.rooms) bServices.push("Guest Rooms");

          const venueDisplay = booking.isOwnVenue && booking.ownVenueDetails?.name
            ? booking.ownVenueDetails.name
            : booking.venueName || booking.venue_name || booking.location || booking.address || "TBD";

          const normalizedBooking = {
            id: booking._id,
            title: booking.eventTitle || booking.event_type || "Event",
            venue: venueDisplay,
            date: formatDate(booking.event_date),
            rawDate: booking.event_date,
            timeSlot: booking.time_slot || "Full Day",
            amount: bookingCost,
            advancePaid: advancePaid,
            pending: bookingCost - advancePaid,
            status: booking.booking_status || booking.status || "Pending Approval",
            services: bServices
          };

          if (!clientMap.has(key)) {
            clientMap.set(key, {
              id: key,
              bookingIds: [booking._id].filter(Boolean),
              name: booking.clientName || booking.client_id || "Client",
              phone: booking.phone_number || "N/A",
              email: booking.clientEmail || "N/A",
              location: booking.location || booking.venueName || "N/A",
              dob: "N/A",
              gender: "N/A",
              address: booking.location || "N/A",
              city: booking.location || "N/A",
              state: "N/A",
              pin: "N/A",
              img: `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.clientName || booking.client_id || "Client")}&background=random`,
              bookingsList: [normalizedBooking],
              totalBookings: 1,
              totalPaid: advancePaid,
              pendingAmount: bookingCost - advancePaid,
              totalSpent: bookingCost,
              lastBooking: formattedLastBooking,
            });
          } else {
            const existing = clientMap.get(key);
            existing.totalBookings += 1;
            if (booking._id && !existing.bookingIds.includes(booking._id)) {
              existing.bookingIds.push(booking._id);
            }
            existing.totalPaid += advancePaid;
            existing.totalSpent += bookingCost;
            existing.pendingAmount += (bookingCost - advancePaid);
            existing.bookingsList.push(normalizedBooking);
            if (new Date(booking.event_date) > new Date(existing.lastBooking)) {
              existing.lastBooking = formattedLastBooking || existing.lastBooking;
            }
          }
        });
        setClients(Array.from(clientMap.values()));

        const eventRes = await fetch("http://localhost:5000/api/events", { cache: "no-store" });
      } catch (error) {
        console.error("Failed to load admin booking summary:", error);
      }
    };

    const loadAdminBookings = () => {
      fetchAdminBookings();
    };

    loadAdminBookings();
    window.addEventListener("focus", loadAdminBookings);
    const bookingInterval = window.setInterval(loadAdminBookings, 30000);
    return () => {
      window.removeEventListener("focus", loadAdminBookings);
      window.clearInterval(bookingInterval);
    };
  }, []);

  const combinedEvents = useMemo(() => {
    const formattedEvents = events.map(ev => ({
      id: ev._id || ev.id,
      bookingId: ev._id || ev.id,
      name: ev.title || ev.name || "Event",
      date: ev.date ? formatDate(ev.date) : "TBD",
      rawDate: ev.date || ev.createdAt,
      timeSlot: ev.timeSlot || "TBD",
      venue: ev.venue || "TBD",
      status: ev.status || "Planning",
      client: ev.client || "Admin",
      amount: ev.revenue || ev.amount || 0,
      isEventOnly: true
    }));
    return [...bookedEvents, ...formattedEvents].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [bookedEvents, events]);

  useEffect(() => {
    const loadBilling = async () => {
      try {
        setBillingLoading(true);
        const response = await fetch("http://localhost:5000/api/payments/dashboard");
        const data = await response.json();
        setAdminBilling(data || { summary: {}, invoices: [], payments: [], dailyTransactions: [] });
      } catch (error) {
        console.error("Failed to load admin billing dashboard:", error);
        setAdminBilling({ summary: {}, invoices: [], payments: [], dailyTransactions: [] });
      } finally {
        setBillingLoading(false);
      }
    };

    loadBilling();
    window.addEventListener("focus", loadBilling);
    const billingInterval = window.setInterval(loadBilling, 30000);
    return () => {
      window.removeEventListener("focus", loadBilling);
      window.clearInterval(billingInterval);
    };
  }, []);

  // ==========================================
  // 6. OPERATIONAL ACTION HANDLERS & INTERNAL VALIDATION
  // ==========================================
  const validateStaffMember = () => {
    const nextErrors = {};
    const emailValue = newStaffMember.email.trim();
    const phoneValue = newStaffMember.phone.trim();

    if (!newStaffMember.name.trim()) {
      nextErrors.name = "Name is required";
    }

    if (!newStaffMember.personalEmail.trim()) {
      nextErrors.personalEmail = "Personal email is required";
    } else if (!/\S+@\S+\.\S+/.test(newStaffMember.personalEmail)) {
      nextErrors.personalEmail = "Personal email is invalid";
    }

    if (!newStaffMember.email.trim()) {
      nextErrors.email = "Login email is required";
    } else if (!/\S+@\S+\.\S+/.test(newStaffMember.email)) {
      nextErrors.email = "Login email is invalid";
    } else if (
      (Array.isArray(staffMembers) ? staffMembers : []).some(
        (member) => member.email.toLowerCase() === emailValue.toLowerCase() && member.id !== editingStaffId
      )
    ) {
      nextErrors.email = "Email already exists";
    }

    if (!phoneValue) {
      nextErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(phoneValue)) {
      nextErrors.phone = "Phone number must be 10 digits";
    } else if (
      (Array.isArray(staffMembers) ? staffMembers : []).some((member) => member.phone.trim() === phoneValue && member.id !== editingStaffId)
    ) {
      nextErrors.phone = "Phone number already exists";
    }

    if (!newStaffMember.address.trim()) {
      nextErrors.address = "Address is required";
    }

    if (!newStaffMember.role) {
      nextErrors.role = "Role is required";
    }

    return nextErrors;
  };

  const handleStaffSave = async (isSendCredentials = false) => {
    const nextErrors = validateStaffMember();
    setStaffErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      const finalPassword = newStaffMember.password.trim() || ("EMS@" + Math.floor(1000 + Math.random() * 9000));

      if (editingStaffId) {
        const response = await fetch(`http://localhost:5000/api/staff/${editingStaffId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newStaffMember.name.trim(),
            personalEmail: newStaffMember.personalEmail.trim(),
            email: newStaffMember.email.trim(),
            phone: newStaffMember.phone.trim(),
            password: finalPassword,
            role: newStaffMember.role,
            address: newStaffMember.address.trim(),
            status: newStaffMember.status,
            photo: newStaffMember.photo,
            salary: Number(newStaffMember.salary || 0),
            employmentType: newStaffMember.employmentType || "Full-time",
            bankAccountNumber: newStaffMember.bankAccountNumber || "",
            ifscCode: newStaffMember.ifscCode || "",
            upiId: newStaffMember.upiId || "",
          }),
        });

        if (response.ok) {
          const updatedStaff = await response.json();
          setStaffMembers((current) => current.map((member) => (member.id === editingStaffId ? updatedStaff : member)));
          setEditingStaffId(null);
          alert("Staff member successfully saved!");
        } else {
          console.error("Failed to update staff");
          alert("Failed to update staff member. Please check backend connection.");
          return;
        }
      } else {
        const response = await fetch("http://localhost:5000/api/staff", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newStaffMember.name.trim(),
            personalEmail: newStaffMember.personalEmail.trim(),
            email: newStaffMember.email.trim(),
            phone: newStaffMember.phone.trim(),
            password: finalPassword,
            role: newStaffMember.role,
            department: newStaffMember.department,
            staffId: newStaffMember.staffId,
            emergencyContact: newStaffMember.emergencyContact,
            address: newStaffMember.address.trim(),
            status: newStaffMember.status,
            photo: newStaffMember.photo,
            salary: Number(newStaffMember.salary || 0),
            employmentType: newStaffMember.employmentType || "Full-time",
            bankAccountNumber: newStaffMember.bankAccountNumber || "",
            ifscCode: newStaffMember.ifscCode || "",
            upiId: newStaffMember.upiId || "",
          }),
        });

        if (response.ok) {
          const addedStaff = await response.json();
          setStaffMembers((current) => [...current, addedStaff]);
          alert("Staff member successfully saved!");
        } else {
          console.error("Failed to add staff");
          alert("Failed to add staff member. Please check backend connection.");
          return;
        }
      }

      if (isSendCredentials) {
        localStorage.setItem("mockStaffEmail", newStaffMember.email.trim());
        localStorage.setItem("mockStaffPassword", finalPassword);
        localStorage.removeItem("staffPasswordChanged");

        setCredentialsSentData({
          name: newStaffMember.name,
          personalEmail: newStaffMember.personalEmail,
          email: newStaffMember.email,
          phone: newStaffMember.phone,
          password: finalPassword,
        });
        setTimeout(() => setCredentialsSentData(null), 10000);
      } else {
        alert("Staff member successfully saved!");
      }

      setNewStaffMember({ staffId: "STF" + Math.floor(100 + Math.random() * 900), name: "", email: "", phone: "", address: "", role: "", department: "", emergencyContact: "", experience: "", joiningDate: "", salary: "", employmentType: "Full-time", bankAccountNumber: "", ifscCode: "", upiId: "", availability: "", photo: null, password: "", status: "Active" });
      setStaffErrors({});
      setIsAddStaff(false);
    } catch (error) {
      console.error("Error saving staff:", error);
      alert("An error occurred while saving the staff member.");
    }
  };

  const handleEditStaff = (staff) => {
    setNewStaffMember(staff);
    setEditingStaffId(staff.id);
    setIsAddStaff(true);
    setStaffSubTab("staff-management");
  };

  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/staff/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setStaffMembers((prev) => prev.filter((staff) => staff.id !== id));
        } else {
          console.error("Failed to delete staff");
        }
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };

  const handleEditVendor = (vendor) => {
    setVendorEditingId(vendor.id);
    setVendorDraft(vendor);
    navigate("/admin/vendor-management/add-vendor");
  };

  const handleDeleteVendor = async (id) => {
    if (window.confirm("Are you sure you want to remove this vendor?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/vendors/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          setVendors((prev) => prev.filter((vendor) => vendor.id !== id));
        } else {
          alert(data.message || "Failed to delete vendor.");
        }
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("An error occurred while deleting the vendor.");
      }
    }
  };

  const handleDeleteEvent = async (eventOrId) => {
    const id = typeof eventOrId === "object" ? getRecordId(eventOrId) : eventOrId;
    if (!id) {
      alert("Error: Missing event ID target.");
      return;
    }
    if (window.confirm("Are you sure you want to permanently delete this event from the database?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok || data.success) {
          alert("Event successfully deleted.");
          setEvents((prev) => prev.filter((event) => event.id !== id && event._id !== id));
          setBookings((prev) => prev.filter((booking) => getRecordId(booking) !== id));
          setBookedEvents((prev) => prev.filter((event) => getRecordId(event) !== id));
        } else {
          alert(`Error: ${data.message || "Failed to remove event."}`);
        }
      } catch (error) {
        console.error("Database communication error:", error);
        alert("Failed to connect to the backend server.");
      }
    }
  };

  const handleDeleteClient = (clientOrId) => {
    const id = typeof clientOrId === "object" ? getRecordId(clientOrId) : clientOrId;
    if (window.confirm("Are you sure you want to remove this client from the admin view?")) {
      setClients((prev) => prev.filter((client) => getRecordId(client) !== id));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type === "application/pdf") {
      alert("PDFs are not allowed. Please upload a JPG or PNG image.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewStaffMember(prev => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        const response = await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingEvent),
        });
        const data = await response.json();
        if (data.success || response.ok) {
          setEvents((current) => current.map((ev) => (ev.id === editingEvent.id ? { ...editingEvent } : ev)));
        }
        setEditingEvent(null);
      } else {
        const created = { ...newEvent };
        const response = await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(created),
        });
        const data = await response.json();
        if (response.ok) {
          const savedEvent = data.event || data;
          savedEvent.id = savedEvent._id || savedEvent.id || Date.now();
          setEvents((current) => [...current, savedEvent]);
        }
        setNewEvent({ name: "", date: "", venue: "", status: "Planning" });
      }
      setIsEventModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
      alert("An error occurred while saving the event.");
    }
  };

  const handleSaveResource = async (e) => {
    e.preventDefault();
    try {
      if (editingResource) {
        const response = await fetch(`http://localhost:5000/api/resources/${editingResource.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingResource),
        });
        const data = await response.json();
        if (data.success) {
          setResources((current) => current.map((r) => (r.id === editingResource.id ? data.resource : r)));
        }
        setEditingResource(null);
      } else {
        const response = await fetch("http://localhost:5000/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newResource),
        });
        const data = await response.json();
        if (data.success) {
          setResources((current) => [...current, data.resource]);
        }
        setNewResource({ name: "", category: "Equipment", quantity: 1, unitCost: 0, status: "Available" });
      }
      setIsResourceModalOpen(false);
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("Failed to save resource");
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm("Are you sure you want to remove this resource?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/resources/${id}`, { method: "DELETE" });
        const data = await response.json();
        if (data.success) {
          setResources((prev) => prev.filter((r) => r.id !== id));
        }
      } catch (error) {
        console.error("Error deleting resource:", error);
      }
    }
  };

  const generateReport = (reportName) => {
    setReportDownloading(reportName);
    setTimeout(() => {
      setReportDownloading(null);
      let headers = [];
      let rows = [];

      if (reportName.includes("Revenue")) {
        headers = ["Booking ID", "Client Name", "Event Title", "Event Type", "Venue", "Event Date", "Total Cost (INR)", "Advance Paid (INR)", "Balance Due (INR)", "Payment Status", "Booking Date"];
        if (bookings && bookings.length > 0) {
          rows = bookings.map((b) => {
            const { name, venue } = normalizeBookingEvent(b);
            const total = Number(b.total_cost || b.totalCost || b.totalAmount || 0);
            const paid = Number(b.amount_paid || b.advancePaid || b.advance_pay || Math.round(total * 0.3));
            const balance = Math.max(0, total - paid);
            return [
              `"${b._id || b.id || 'BK-101'}"`,
              `"${b.clientName || b.client_id || 'Client'}"`,
              `"${String(name).replace(/"/g, '""')}"`,
              `"${b.event_type || 'Custom Event'}"`,
              `"${String(venue).replace(/"/g, '""')}"`,
              `"${formatDate(b.event_date || b.eventDate)}"`,
              `"${total}"`,
              `"${paid}"`,
              `"${balance}"`,
              `"${b.payment_status || b.status || 'Paid'}"`,
              `"${formatDate(b.createdAt || new Date())}"`
            ];
          });
        } else {
          rows = [
            ['"BK-2026-001"', '"Ananya Sharma"', '"Grand Wedding Reception"', '"Wedding"', '"Grand Hyatt Banquet"', '"15/10/2026"', '"450000"', '"135000"', '"315000"', '"Paid (Advance)"', '"01/09/2026"'],
            ['"BK-2026-002"', '"Rajesh Patel"', '"Corporate Annual Gala"', '"Corporate Event"', '"Taj Mahal Palace Ballroom"', '"20/11/2026"', '"680000"', '"680000"', '"0"', '"Completed"', '"28/08/2026"'],
            ['"BK-2026-003"', '"Priya Verma"', '"25th Birthday Celebration"', '"Birthday"', '"The Leela Resort Garden"', '"05/12/2026"', '"180000"', '"54000"', '"126000"', '"Confirmed"', '"10/09/2026"'],
            ['"BK-2026-004"', '"Vikram Singh"', '"Sangeet & Mehendi Night"', '"Sangeet"', '"JW Marriott Lawns"', '"18/10/2026"', '"320000"', '"96000"', '"224000"', '"Paid (Advance)"', '"05/09/2026"']
          ];
        }
      } else if (reportName.includes("Event")) {
        headers = ["Event ID", "Event Title", "Event Type", "Event Date", "Time Slot", "Venue Name", "Guest Count", "Catering Package", "Decoration Package", "Total Cost (INR)", "Status"];
        if (bookings && bookings.length > 0) {
          rows = bookings.map((b) => {
            const { name, venue } = normalizeBookingEvent(b);
            return [
              `"${b._id || b.id || 'EV-101'}"`,
              `"${String(name).replace(/"/g, '""')}"`,
              `"${b.event_type || 'Custom Event'}"`,
              `"${formatDate(b.event_date || b.eventDate)}"`,
              `"${b.time_slot || 'Flexible'}"`,
              `"${String(venue).replace(/"/g, '""')}"`,
              `"${b.catering_details?.guest_count || b.guestCount || 250}"`,
              `"${b.cateringPackage || 'Premium Menu'}"`,
              `"${b.decorationPackage || 'Royal Mandap Theme'}"`,
              `"${b.total_cost || b.totalCost || 250000}"`,
              `"${b.status || 'Confirmed'}"`
            ];
          });
        } else {
          rows = [
            ['"EV-101"', '"Grand Wedding Reception"', '"Wedding"', '"15/10/2026"', '"Evening (6 PM - 11 PM)"', '"Grand Hyatt Banquet"', '"350"', '"Royal Feast Buffet"', '"Luxury Gold & Floral Theme"', '"450000"', '"Confirmed"'],
            ['"EV-102"', '"Corporate Leadership Summit"', '"Corporate"', '"20/11/2026"', '"Full Day"', '"Taj Palace Ballroom"', '"200"', '"Premium Executive Lunch"', '"Corporate Minimalist Blue"', '"680000"', '"Confirmed"'],
            ['"EV-103"', '"Golden Jubilee Birthday"', '"Birthday"', '"05/12/2026"', '"Evening"', '"Leela Palace Lawns"', '"150"', '"Gourmet Veg & Non-Veg"', '"Vintage Fairy Light Theme"', '"180000"', '"Planning"'],
            ['"EV-104"', '"Bollywood Sangeet Night"', '"Sangeet"', '"18/10/2026"', '"Night"', '"JW Marriott Lawns"', '"250"', '"Live Counter & Snacks"', '"Neon LED Stage Setup"', '"320000"', '"Confirmed"']
          ];
        }
      } else if (reportName.includes("Staff")) {
        headers = ["Staff ID", "Staff Name", "Role / Designation", "Department", "Employment Type", "Monthly Salary (INR)", "Assigned Events", "Tasks Completed", "Performance Rating", "Status"];
        if (staffMembers && staffMembers.length > 0) {
          rows = staffMembers.map((s) => [
            `"${s.staffId || s._id || 'STF-01'}"`,
            `"${String(s.name || 'Staff').replace(/"/g, '""')}"`,
            `"${String(s.role || 'Coordinator').replace(/"/g, '""')}"`,
            `"${String(s.department || 'Operations').replace(/"/g, '""')}"`,
            `"${s.employmentType || 'Full-time'}"`,
            `"${s.salary || 35000}"`,
            `"${s.assignedEventsCount || s.assignedEvents || 8}"`,
            `"${s.completedTasksCount || 24}"`,
            `"${s.rating || '4.8/5'}"`,
            `"${s.status || 'Active'}"`
          ]);
        } else {
          rows = [
            ['"STF-101"', '"Ramesh Kumar"', '"Senior Event Manager"', '"Operations"', '"Full-time"', '"45000"', '"12"', '"38"', '"4.9/5"', '"Active"'],
            ['"STF-102"', '"Sunita Verma"', '"Catering & Hospitality Lead"', '"Catering"', '"Full-time"', '"38000"', '"10"', '"30"', '"4.8/5"', '"Active"'],
            ['"STF-103"', '"Amitabh Joshi"', '"Stage & Decor Supervisor"', '"Decoration"', '"Full-time"', '"35000"', '"14"', '"42"', '"4.7/5"', '"Active"'],
            ['"STF-104"', '"Pooja Reddy"', '"Sound & AV Technician"', '"AV & Tech"', '"Part-time"', '"25000"', '"8"', '"20"', '"4.9/5"', '"Active"']
          ];
        }
      } else if (reportName.includes("Vendor")) {
        headers = ["Vendor ID", "Business Name", "Category", "Contact Person", "Phone", "Contract Basis", "Contract Price (INR)", "Assigned Events", "Payment Status", "Contract Status"];
        if (vendors && vendors.length > 0) {
          rows = vendors.map((v) => [
            `"${v.id || v._id || 'VND-01'}"`,
            `"${String(v.name || v.vendorName || 'Vendor').replace(/"/g, '""')}"`,
            `"${String(v.category || 'General').replace(/"/g, '""')}"`,
            `"${String(v.contactPerson || v.name || '').replace(/"/g, '""')}"`,
            `"${v.phone || ''}"`,
            `"${v.contractBasis || 'Per Event'}"`,
            `"${v.contractPrice || 45000}"`,
            `"${v.assignedEvents || 5}"`,
            `"${v.status === 'Active' ? 'Paid' : 'Pending'}"`,
            `"${v.status || 'Active'}"`
          ]);
        } else {
          rows = [
            ['"VND-101"', '"Royal Caterers & Banquet"', '"Catering"', '"Sanjay Kapoor"', '"+91 98765 43210"', '"Per Event"', '"120000"', '"8"', '"Paid"', '"Active"'],
            ['"VND-102"', '"Sonic Beats DJ & Lighting"', '"DJ / Audio"', '"DJ Rahul"', '"+91 98123 45678"', '"Per Event"', '"35000"', '"12"', '"Paid"', '"Active"'],
            ['"VND-103"', '"Floral Blooms Decorators"', '"Decoration"', '"Anita Roy"', '"+91 97654 32109"', '"Per Event"', '"85000"', '"10"', '"Paid"', '"Active"'],
            ['"VND-104"', '"Pixel Perfect Studios"', '"Photography"', '"Karan Malhotra"', '"+91 99887 76655"', '"Per Event"', '"65000"', '"6"', '"Paid"', '"Active"']
          ];
        }
      } else {
        headers = ["Report Name", "Generated Date", "Total Records", "Export Status"];
        rows = [[`"${reportName}"`, `"${new Date().toLocaleString()}"`, '"100+"', '"Success"']];
      }

      const csvString = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", `${reportName.toLowerCase().replace(/\s+/g, "_")}_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 1200);
  };

  // ==========================================
  // 7. VISUAL RENDER CHART DATA STRUCTS
  // ==========================================
  const revenueData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    const monthlyMap = months.reduce((acc, month) => {
      acc[month] = { revenue: 0, target: 45000 };
      return acc;
    }, {});

    bookings.forEach((booking) => {
      if (!booking.event_date) return;
      const date = new Date(booking.event_date);
      if (date.getFullYear() === currentYear) {
        const monthName = months[date.getMonth()];
        const amountPaid = Number(booking.advance_paid) || Number(booking.amount) || 0;
        if (monthlyMap[monthName]) {
          monthlyMap[monthName].revenue += amountPaid;
        }
      }
    });

    return months.map(month => ({
      month,
      revenue: monthlyMap[month].revenue,
      target: monthlyMap[month].target
    }));
  }, [bookings]);

  const venueMenu = [
    { key: "overview", label: "Overview" },
    { key: "add-venue", label: "Add Venue" },
    { key: "all-venues", label: "All Venues" },
    { key: "venue-bookings", label: "Venue Bookings" },
    { key: "availability-calendar", label: "Availability Calendar" },
    { key: "seating-layout", label: "Seating Arrangements" },
    { key: "maintenance", label: "Maintenance Records" },
    { key: "venue-revenue", label: "Venue Revenue" },
    { key: "billing", label: "Billing Dashboard" },
  ];

  const resourceMenu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "categories", label: "Categories" },
    { key: "add-resource", label: "Add Resource" },
    { key: "resource-list", label: "Manage Resources" },
    { key: "inventory", label: "Inventory Stock" },
    { key: "allocate", label: "Allocate Resources" },
    { key: "returns", label: "Returns" },
    { key: "maintenance", label: "Maintenance" },
    { key: "low-stock", label: "Low Stock Alerts" },
    { key: "reports", label: "Reports" },
  ];

  const accountsFinanceMenu = [
    { key: "overview", label: "Financial Overview" },
    { key: "ledger", label: "Debit & Credit Ledger" },
    { key: "income-expense", label: "Income & Expense Tracking" },
    { key: "profit-loss", label: "Profit & Loss Reports" },
    { key: "history", label: "Transaction History" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "packages":
        if (location.pathname.includes("/admin/packages/add")) {
          return <AddPackage />;
        }
        return <AllPackages />;
      case "decorations":
        return <DecorationManagement />;
      case "catering":
        return <CateringManagement initialTab={cateringSubTab} key={cateringSubTab} />;
      case "additional-services":
        if (additionalServicesSubTab === "photography") {
          return <PhotographyManagement />;
        } else if (additionalServicesSubTab === "dj") {
          return <DJManagement />;
        } else if (additionalServicesSubTab === "vehicle") {
          return <VehicleManagement />;
        } else if (additionalServicesSubTab === "guest-room") {
          return <GuestRoomManagement />;
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container font-sans antialiased text-gray-900 bg-gray-50">
      <div className={`${sidebarOpen ? "w-[260px]" : "w-20"} bg-[#0f172a] text-white transition-all duration-300 flex flex-col overflow-hidden relative z-20 shrink-0`}>
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between z-10 relative">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <PremiumLogo size="50px" />
              <div style={{ textAlign: "left" }}>
                <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>Event</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] golden-text-animate" style={{ margin: 0, lineHeight: 1.2 }}>
                  Management System
                </p>
              </div>
            </div>
          ) : (
            <div className="mr-3">
              <PremiumLogo size="35px" />
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white transition-colors border border-gray-600 rounded-full p-1 bg-[#1e293b]">
            {sidebarOpen ? <ChevronLeft size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* SIDEBAR NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto z-10 relative scrollbar-hide">
          <button
            onClick={() => {
              setActiveTab("overview");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "overview" && !venueOpen && !resourceOpen ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Home size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Dashboard</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("events");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "events" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Calendar size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Manage Events</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("packages");
              navigate("/admin/packages");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "packages" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Package size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Offer Packages</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("clients");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "clients" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Users size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Manage Clients</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("decorations");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "decorations" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Palette size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Manage Decoration</span>}
          </button>

          {/* Manage Catering Dropdown */}
          <React.Fragment>
            <button
              onClick={() => {
                if (activeTab === "catering") {
                  setActiveTab("overview");
                } else {
                  setActiveTab("catering");
                  setCateringSubTab("packages");
                  navigate("/admin/dashboard");
                }
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "catering" ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
            >
              <div className="flex items-center space-x-3">
                <Utensils size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Manage Catering</span>}
              </div>
              {sidebarOpen && (
                <span className="ml-auto">
                  {activeTab === "catering" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              )}
            </button>
            {sidebarOpen && activeTab === "catering" && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => {
                    setActiveTab("catering");
                    setCateringSubTab("packages");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${cateringSubTab === "packages" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  📦 Combo Packages
                </button>
                <button
                  onClick={() => {
                    setActiveTab("catering");
                    setCateringSubTab("custom_items");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center gap-2 cursor-pointer ${cateringSubTab === "custom_items" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  🍲 Custom Menu Items
                </button>
              </div>
            )}
          </React.Fragment>

          {/* Additional Services Dropdown */}
          <React.Fragment>
            <button
              onClick={() => {
                if (activeTab === "additional-services") {
                  setActiveTab("overview");
                } else {
                  setActiveTab("additional-services");
                  setAdditionalServicesSubTab("photography");
                  navigate("/admin/dashboard");
                }
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "additional-services" ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center space-x-3">
                <ClipboardList size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Additional Services</span>}
              </div>
              {sidebarOpen && <span className="ml-auto">{activeTab === "additional-services" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
            </button>
            {sidebarOpen && activeTab === "additional-services" && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => {
                    setActiveTab("additional-services");
                    setAdditionalServicesSubTab("photography");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${additionalServicesSubTab === "photography" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Photography & Videography
                </button>
                <button
                  onClick={() => {
                    setActiveTab("additional-services");
                    setAdditionalServicesSubTab("dj");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${additionalServicesSubTab === "dj" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  DJ / Sound / Lighting
                </button>
                <button
                  onClick={() => {
                    setActiveTab("additional-services");
                    setAdditionalServicesSubTab("vehicle");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${additionalServicesSubTab === "vehicle" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Vehicle Management
                </button>
                <button
                  onClick={() => {
                    setActiveTab("additional-services");
                    setAdditionalServicesSubTab("guest-room");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${additionalServicesSubTab === "guest-room" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Guest Room Management
                </button>
              </div>
            )}
          </React.Fragment>

          <button
            onClick={() => {
              setActiveTab("packages");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "packages" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Package size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Manage Packages</span>}
          </button>

          <button
            onClick={() => {
              setActiveTab("manage-bookings");
              navigate("/admin/dashboard");
            }}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "manage-bookings" ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
          >
            <Bookmark size={20} className="text-gray-400" />
            {sidebarOpen && <span className="font-medium text-[15px]">Manage Bookings</span>}
          </button>

          {/* Staff & Vendors Dropdown */}
          <React.Fragment>
            <button
              onClick={() => {
                setActiveTab("staff");
                setStaffSubTab("staff-management");
                navigate("/admin/dashboard");
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === "staff" ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center space-x-3">
                <Users size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Staff & Vendors</span>}
              </div>
              {sidebarOpen && <span className="ml-auto">{activeTab === "staff" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
            </button>
            {sidebarOpen && activeTab === "staff" && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                <button
                  onClick={() => {
                    setActiveTab("staff");
                    setStaffSubTab("staff-management");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${staffSubTab === "staff-management" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Staff Management
                </button>
                <button
                  onClick={() => {
                    setActiveTab("staff");
                    setStaffSubTab("attendance");
                    navigate("/admin/dashboard");
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${staffSubTab === "attendance" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Staff Attendance
                </button>
                <button
                  onClick={() => {
                    setActiveTab("staff");
                    setStaffSubTab("vendor-management");
                    setVendorDraft(null);
                    setVendorEditingId(null);
                    navigate("/admin/vendor-management/overview");
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${staffSubTab === "vendor-management" ? "bg-amber-600 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                >
                  Vendor Management
                </button>
              </div>
            )}
          </React.Fragment>

          {sidebarOpen && <div className="px-4 text-xs font-bold uppercase tracking-wider text-gray-500 pt-4">Modules</div>}

          {/* Resource & Inventory Accordion */}
          <React.Fragment>
            <button
              onClick={() => {
                setResourceOpen((r) => !r);
                navigate("/admin/resource-management/dashboard");
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${resourceOpen ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center space-x-3">
                <Package size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Resource & Inventory</span>}
              </div>
              {sidebarOpen && <span className="ml-auto">{resourceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
            </button>
            {sidebarOpen && resourceOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                {resourceMenu.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(`/admin/resource-management/${item.key}`)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/admin/resource-management/${item.key}`
                      ? "bg-amber-600 text-white font-medium"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>

          {/* Venue Management Accordion */}
          <React.Fragment>
            <button
              onClick={() => {
                setVenueOpen((v) => !v);
                navigate("/admin/venue-management/overview");
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${venueOpen ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center space-x-3">
                <Home size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Venue Management</span>}
              </div>
              {sidebarOpen && <span className="ml-auto">{venueOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
            </button>
            {sidebarOpen && venueOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                {venueMenu.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(`/admin/venue-management/${item.key}`)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/admin/venue-management/${item.key}`
                      ? "bg-amber-600 text-white font-medium"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>

          {/* Accounts & Finance Accordion */}
          <React.Fragment>
            <button
              onClick={() => {
                setAccountsFinanceOpen((prev) => !prev);
                navigate("/admin/accounts-finance/overview");
              }}
              className={`w-full flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-colors ${accountsFinanceOpen ? "bg-amber-600/20 text-amber-500 font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
            >
              <div className="flex items-center space-x-3">
                <DollarSign size={20} className="text-gray-400" />
                {sidebarOpen && <span className="font-medium text-[15px]">Accounts & Finance</span>}
              </div>
              {sidebarOpen && <span className="ml-auto">{accountsFinanceOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</span>}
            </button>
            {sidebarOpen && accountsFinanceOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3">
                {accountsFinanceMenu.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(`/admin/accounts-finance/${item.key}`)}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/admin/accounts-finance/${item.key}`
                      ? "bg-amber-600 text-white font-medium"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </React.Fragment>

          {/* Utilities Sidebar Footer Group */}
          <div className="space-y-2 border-t border-gray-700 pt-4">
            {[
              { id: "bookings", label: "Bookings", icon: Clock },
              { id: "payments", label: "Payments", icon: DollarSign },
              {
                id: "notifications",
                label: "Notifications",
                icon: Bell,
                onClick: () => navigate("/admin/notifications"),
              },
              { id: "reports", label: "Reports", icon: TrendingUp },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.onClick || (() => {
                  setActiveTab(item.id);
                  navigate("/admin/dashboard");
                })}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${activeTab === item.id && !venueOpen && !resourceOpen ? "bg-amber-600 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700/50 z-10 relative bg-[#0f172a]/80 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">


        {isResourceModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{editingResource ? "Edit Resource" : "Add New Resource"}</h3>
                <button onClick={() => { setIsResourceModalOpen(false); setEditingResource(null); }} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSaveResource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f59e0b] focus:ring-[#f59e0b] outline-none" value={editingResource ? editingResource.name : newResource.name} onChange={(e) => editingResource ? setEditingResource({ ...editingResource, name: e.target.value }) : setNewResource({ ...newResource, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f59e0b] focus:ring-[#f59e0b] outline-none" value={editingResource ? editingResource.category : newResource.category} onChange={(e) => editingResource ? setEditingResource({ ...editingResource, category: e.target.value }) : setNewResource({ ...newResource, category: e.target.value })}>
                    <option value="Equipment">Equipment</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input required type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f59e0b] focus:ring-[#f59e0b] outline-none" value={editingResource ? editingResource.quantity : newResource.quantity} onChange={(e) => editingResource ? setEditingResource({ ...editingResource, quantity: parseInt(e.target.value) }) : setNewResource({ ...newResource, quantity: parseInt(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost (₹)</label>
                    <input required type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f59e0b] focus:ring-[#f59e0b] outline-none" value={editingResource ? editingResource.unitCost : newResource.unitCost} onChange={(e) => editingResource ? setEditingResource({ ...editingResource, unitCost: parseFloat(e.target.value) }) : setNewResource({ ...newResource, unitCost: parseFloat(e.target.value) })} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#f59e0b] focus:ring-[#f59e0b] outline-none" value={editingResource ? editingResource.status : newResource.status} onChange={(e) => editingResource ? setEditingResource({ ...editingResource, status: e.target.value }) : setNewResource({ ...newResource, status: e.target.value })}>
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => { setIsResourceModalOpen(false); setEditingResource(null); }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-[#f59e0b] hover:bg-[#d97706] rounded-lg">Save Resource</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* WORKSPACE VIEWS */}
        <div className={activeTab === "overview" ? "h-full" : "p-8"}>
          {renderContent()}
          {location.pathname === "/admin/venue-management/overview" ? (
            <VenueDashboard />
          ) : location.pathname === "/admin/venue-management/add-venue" || location.pathname.startsWith("/admin/venue-management/edit-venue/") ? (
            <AddVenue />
          ) : location.pathname === "/admin/vendor-management/add-vendor" ? (
            <AddVendor
              initialVendor={vendorDraft}
              existingVendors={vendors}
              editingVendorId={vendorEditingId}
              onSave={async (vendorData) => {
                const existingVendor = vendors.find((vendor) => vendor.id === vendorEditingId);
                const nextVendor = typeof buildVendorRecord === "function"
                  ? buildVendorRecord(vendorData, existingVendor || vendorDraft)
                  : {
                    ...vendorData,
                    name: vendorData.vendorName || vendorData.name,
                    vendorName: vendorData.vendorName || vendorData.name,
                    category: vendorData.category,
                    phone: vendorData.phone,
                    email: vendorData.email,
                    address: vendorData.address,
                    contactPerson: vendorData.contactPerson,
                    contractStartDate: vendorData.contractStartDate,
                    contractEndDate: vendorData.contractEndDate,
                    status: vendorData.status || "Active",
                    contractBasis: vendorData.contractBasis || "Per Event",
                    contractPrice: Number(vendorData.contractPrice) || 0
                  };

                try {
                  if (existingVendor) {
                    const response = await fetch(`http://localhost:5000/api/vendors/${existingVendor.id}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(nextVendor),
                    });
                    const data = await response.json();
                    if (data.success && data.vendor) {
                      setVendors((current) => current.map((v) => (v.id === existingVendor.id ? data.vendor : v)));
                    } else {
                      setVendors((current) => current.map((v) => (v.id === existingVendor.id ? { ...existingVendor, ...nextVendor } : v)));
                    }
                  } else {
                    const response = await fetch("http://localhost:5000/api/vendors", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(nextVendor),
                    });
                    const data = await response.json();
                    if (data.success && data.vendor) {
                      setVendors((current) => [...current, data.vendor]);
                    } else {
                      setVendors((current) => [...current, { ...nextVendor, id: `v_${Date.now()}` }]);
                    }
                  }
                } catch (error) {
                  console.error("Error saving vendor to server:", error);
                  if (existingVendor) {
                    setVendors((current) => current.map((v) => (v.id === existingVendor.id ? { ...existingVendor, ...nextVendor } : v)));
                  } else {
                    setVendors((current) => [...current, { ...nextVendor, id: `v_${Date.now()}` }]);
                  }
                }
                setVendorDraft(null);
                setVendorEditingId(null);
                navigate("/admin/vendor-management/overview");
              }}
              onCancel={() => {
                setVendorDraft(null);
                setVendorEditingId(null);
                navigate("/admin/vendor-management/overview");
              }}
              saveLabel={vendorEditingId ? "Update Vendor" : "Save Vendor"}
              title={vendorEditingId ? "Edit Vendor" : "Add Vendor"}
            />
          ) : location.pathname === "/admin/venue-management/all-venues" ? (
            <AllVenues />
          ) : location.pathname === "/admin/venue-management/venue-bookings" ? (
            <VenueBookings />
          ) : location.pathname === "/admin/venue-management/availability-calendar" ? (
            <AvailabilityCalendar />
          ) : location.pathname === "/admin/venue-management/maintenance" ? (
            <MaintenanceRecords />
          ) : location.pathname === "/admin/venue-management/seating-layout" ? (
            <SeatingArrangements />
          ) : location.pathname === "/admin/venue-management/venue-revenue" ? (
            <VenueDetails />
          ) : location.pathname === "/admin/venue-management/billing" ? (
            <BillingDashboard />
          ) : location.pathname === "/admin/notifications" || location.pathname === "/admin/notifications/" ? (
            <AdminNotifications />
          ) : location.pathname === "/admin/resource-management/dashboard" ? (
            <ResourceDashboard />
          ) : location.pathname === "/admin/resource-management/categories" ? (
            <ResourceCategories />
          ) : location.pathname === "/admin/resource-management/add-resource" ? (
            <AddResource />
          ) : location.pathname === "/admin/resource-management/resource-list" ? (
            <ResourceList />
          ) : location.pathname === "/admin/resource-management/inventory" ? (
            <InventoryStock />
          ) : location.pathname === "/admin/resource-management/allocate" ? (
            <ResourceAllocation />
          ) : location.pathname === "/admin/resource-management/returns" ? (
            <ResourceReturn />
          ) : location.pathname === "/admin/resource-management/maintenance" ? (
            <MaintenanceManagement />
          ) : location.pathname === "/admin/resource-management/low-stock" ? (
            <LowStockAlerts />
          ) : location.pathname === "/admin/resource-management/reports" ? (
            <ResourceReports />
          ) : location.pathname === "/admin/accounts-finance/overview" ? (
            <FinanceDashboard />
          ) : location.pathname === "/admin/accounts-finance/ledger" ? (
            <LedgerManagement />
          ) : location.pathname === "/admin/accounts-finance/income-expense" ? (
            <IncomeExpenseTracking />
          ) : location.pathname === "/admin/accounts-finance/profit-loss" ? (
            <ProfitLossReport />
          ) : location.pathname === "/admin/accounts-finance/history" ? (
            <TransactionHistory />
          ) : location.pathname.startsWith("/admin/accounts-finance") ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900">Accounts & Finance</h3>
                <p className="text-gray-500 mt-2">
                  Use the Accounts & Finance submenu to access Overview, Debit & Credit Ledger, Income & Expense Tracking, Profit & Loss Reports, and Transaction History.
                </p>
              </div>
            </div>
          ) : location.pathname.startsWith("/admin/venue-management") ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900">Venue Management</h3>
                <p className="text-gray-500 mt-2">
                  Use the Venue Management submenu to access Overview, Add Venue, All Venues, Venue Bookings, Availability Calendar, Seating Layout, Maintenance, and Venue Revenue.
                </p>
              </div>
            </div>
          ) : location.pathname.startsWith("/admin/resource-management") ? (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900">Resource & Inventory Management</h3>
                <p className="text-gray-500 mt-2">
                  Use the Resource & Inventory submenu to manage resources, categories, inventory, allocations, returns, and maintenance.
                </p>
              </div>
            </div>
          ) : activeTab === "overview" ? (
            <div className="flex-1 flex flex-col h-full bg-[#f8fafc] overflow-hidden relative">
              {/* TOP HEADER */}
              <div className="h-20 bg-white border-b border-gray-200 px-6 flex justify-between items-center shrink-0 z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <Menu size={24} />
                  </button>
                </div>

                <div className="flex-1 flex justify-end max-w-2xl mx-6">
                  <div className="relative w-full max-w-md">
                    <input type="text" placeholder="Search anything..." className="w-full pl-10 pr-16 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-sm" />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-400 shadow-sm">
                      Ctrl + /
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                    <Bell size={22} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold shadow-sm">5</span>
                  </button>

                  <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-900 leading-tight">{localStorage.getItem("adminEmail") || "admin@gmail.com"}</p>
                      <p className="text-[11px] text-gray-500 font-medium">Administrator</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-sm border-2 border-white">
                      A
                    </div>
                  </div>
                </div>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-[1600px] mx-auto space-y-6">

                  {/* Page Title */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-sm text-gray-500 mt-1">Monday, July 21, 2026</p>
                  </div>

                  {/* 3 KPI CARDS GRID */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Total Clients */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100">
                        <Users size={24} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Clients</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">145</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-1.5"><span className="text-green-500">↑ 12%</span> from last month</p>
                      </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Bookings</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">78</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-1.5"><span className="text-green-500">↑ 8%</span> from last month</p>
                      </div>
                    </div>


                    {/* Total Revenue */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                      <div className="w-14 h-14 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-gray-500 mb-0.5">Total Revenue</p>
                        <h3 className="text-2xl font-black text-gray-900 leading-none">₹12,75,000</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-1.5"><span className="text-green-500">↑ 18%</span> from last month</p>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE SECTION: 3 COLUMNS (Revenue, Events, Calendar) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    {/* Revenue Overview Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col xl:col-span-2">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-bold text-gray-900">Revenue Overview</h3>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-[12px] font-bold text-gray-600">This Month</span>
                          <ChevronDown size={14} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-h-[220px] w-full">
                        <ResponsiveContainer width="99%" height={220}>
                          <LineChart data={[
                            { name: '1 Jul', rev: 10000 }, { name: '5 Jul', rev: 40000 }, { name: '10 Jul', rev: 80000 },
                            { name: '15 Jul', rev: 130000 }, { name: '20 Jul', rev: 145000 }, { name: '25 Jul', rev: 100000 }, { name: '31 Jul', rev: 90000 },
                          ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }} />
                            <Line type="monotone" dataKey="rev" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} fillOpacity={1} fill="url(#colorRev)" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>


                    {/* Revenue by Category (Pie Chart) */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col xl:col-span-1">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-bold text-gray-900">Revenue by Category</h3>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-[12px] font-bold text-gray-600">This Month</span>
                          <ChevronDown size={14} className="text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-center mb-2">
                        <div className="w-[180px] h-[180px]">
                          <ResponsiveContainer width={180} height={180}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Venue Booking', value: 620000, color: '#3b82f6' },
                                  { name: 'Catering', value: 280000, color: '#22c55e' },
                                  { name: 'Decoration', value: 190000, color: '#f59e0b' },
                                  { name: 'Additional Services', value: 125000, color: '#8b5cf6' },
                                  { name: 'Others', value: 60000, color: '#ec4899' },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                              >
                                {[
                                  { name: 'Venue Booking', value: 620000, color: '#3b82f6' },
                                  { name: 'Catering', value: 280000, color: '#22c55e' },
                                  { name: 'Decoration', value: 190000, color: '#f59e0b' },
                                  { name: 'Additional Services', value: 125000, color: '#8b5cf6' },
                                  { name: 'Others', value: 60000, color: '#ec4899' },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '12px' }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        {[
                          { name: 'Venue Booking', value: '₹6,20,000', pct: '48.6%', color: '#3b82f6' },
                          { name: 'Catering', value: '₹2,80,000', pct: '22.0%', color: '#22c55e' },
                          { name: 'Decoration', value: '₹1,90,000', pct: '14.9%', color: '#f59e0b' },
                          { name: 'Additional Services', value: '₹1,25,000', pct: '9.8%', color: '#8b5cf6' },
                          { name: 'Others', value: '₹60,000', pct: '4.7%', color: '#ec4899' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                              <span className="text-[12px] font-semibold text-gray-700">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-[12px] font-bold text-gray-900">{item.value}</span>
                              <span className="text-[11px] font-bold text-gray-400 w-8 text-right">{item.pct}</span>
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                          <span className="text-[12px] font-bold text-gray-900 ml-4">Total Revenue</span>
                          <span className="text-[13px] font-black text-gray-900 pr-12">₹12,75,000</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RECENT BOOKINGS ROW (FULL WIDTH) */}
                  <div className="grid grid-cols-1 gap-6 pb-6 mt-6">

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-bold text-gray-900">Recent Bookings</h3>
                        <button className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm transition-colors">View All</button>
                      </div>
                      <div className="flex-1 overflow-auto custom-scrollbar -mx-2">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-gray-100">
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Booking ID</th>
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Client Name</th>
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Event</th>
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Date</th>
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Amount</th>
                              <th className="px-2 pb-3 pt-1 text-[11px] font-bold text-gray-500 uppercase">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { id: "BK-10078", name: "Rahul Sharma", event: "Wedding Ceremony", date: "21 Jul 2026", amount: "₹1,20,000", status: "Confirmed", sc: "green" },
                              { id: "BK-10077", name: "Priya Patel", event: "Corporate Event", date: "20 Jul 2026", amount: "₹85,000", status: "Pending", sc: "orange" },
                              { id: "BK-10076", name: "Amit Verma", event: "Birthday Party", date: "19 Jul 2026", amount: "₹45,000", status: "Confirmed", sc: "green" },
                              { id: "BK-10075", name: "Neha Singh", event: "Engagement", date: "18 Jul 2026", amount: "₹95,000", status: "Pending", sc: "orange" },
                              { id: "BK-10074", name: "Vikram Reddy", event: "Conference", date: "17 Jul 2026", amount: "₹1,50,000", status: "Cancelled", sc: "red" },
                            ].map((b, i) => (
                              <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                                <td className="px-2 py-4 text-[12px] font-bold text-gray-900 align-middle">{b.id}</td>
                                <td className="px-2 py-4 text-[12px] font-semibold text-gray-600 align-middle">{b.name}</td>
                                <td className="px-2 py-4 text-[12px] font-semibold text-gray-600 align-middle">{b.event}</td>
                                <td className="px-2 py-4 text-[12px] font-semibold text-gray-600 align-middle">{b.date}</td>
                                <td className="px-2 py-4 text-[12px] font-bold text-gray-900 align-middle">{b.amount}</td>
                                <td className="px-2 py-4 align-middle">
                                  <span className={`px-2 py-1 rounded text-[10px] font-bold border border-${b.sc}-200 text-${b.sc}-600 bg-${b.sc}-50`}>
                                    {b.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM SECTION (Notifications & Calendar Widget) */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-12">

                    {/* Latest Notifications */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col xl:col-span-2">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[16px] font-bold text-gray-900">Latest Notifications</h3>
                        <button className="text-xs font-bold text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm transition-colors">View All</button>
                      </div>
                      <div className="space-y-6">
                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 border border-green-200 mt-1 shadow-sm">
                            <CheckCircle2 size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">New booking received from <span className="text-gray-900">Priya Patel</span></p>
                            <p className="text-[12px] font-semibold text-gray-500 mt-1.5">Booking ID: BK-10077</p>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">10 mins ago</span>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0 border border-yellow-200 mt-1 shadow-sm">
                            <AlertCircle size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">Payment of ₹45,000 is pending</p>
                            <p className="text-[12px] font-semibold text-gray-500 mt-1.5">Booking ID: BK-10076</p>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">35 mins ago</span>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center shrink-0 border border-blue-200 mt-1 shadow-sm">
                            <Calendar size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">Event "Corporate Conference" scheduled for tomorrow</p>
                            <p className="text-[12px] font-semibold text-gray-500 mt-1.5">22 Jul 2026</p>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">1 hour ago</span>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center shrink-0 border border-purple-200 mt-1 shadow-sm">
                            <Users size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">New client registered: <span className="text-gray-900">Vikram Reddy</span></p>
                            <p className="text-[12px] font-semibold text-gray-500 mt-1.5">Client ID: CL-1045</p>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">3 hours ago</span>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 border border-red-200 mt-1 shadow-sm">
                            <XCircle size={18} />
                          </div>
                          <div className="flex-1">
                            <p className="text-[14px] font-bold text-gray-900 leading-tight">Event "Annual Day" has been cancelled</p>
                            <p className="text-[12px] font-semibold text-gray-500 mt-1.5">Booking ID: BK-10065</p>
                          </div>
                          <span className="text-[11px] font-bold text-gray-400 shrink-0">5 hours ago</span>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Widget */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center xl:col-span-1">
                      <div className="flex justify-between items-center w-full mb-6">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"><ChevronLeft size={20} /></button>
                        <h3 className="text-[16px] font-bold text-gray-900">July 2026</h3>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"><ChevronRight size={20} /></button>
                      </div>

                      <div className="w-full">
                        <div className="grid grid-cols-7 mb-3 text-center">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                            <div key={d} className="text-[12px] font-bold text-gray-900">{d}</div>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center">
                          {/* Calendar Days Dummy */}
                          {[
                            { d: 28, m: 'p' }, { d: 29, m: 'p' }, { d: 30, m: 'p' }, { d: 1, m: 'c' }, { d: 2, m: 'c' }, { d: 3, m: 'c', event: true }, { d: 4, m: 'c' },
                            { d: 5, m: 'c', event: true }, { d: 6, m: 'c' }, { d: 7, m: 'c', event: true }, { d: 8, m: 'c', booked: true }, { d: 9, m: 'c' }, { d: 10, m: 'c', event: true }, { d: 11, m: 'c' },
                            { d: 12, m: 'c' }, { d: 13, m: 'c' }, { d: 14, m: 'c' }, { d: 15, m: 'c', booked: true }, { d: 16, m: 'c', event: true }, { d: 17, m: 'c', booked: true }, { d: 18, m: 'c' },
                            { d: 19, m: 'c' }, { d: 20, m: 'c' }, { d: 21, m: 'c', active: true }, { d: 22, m: 'c' }, { d: 23, m: 'c', event: true }, { d: 24, m: 'c', event: true }, { d: 25, m: 'c' },
                            { d: 26, m: 'c' }, { d: 27, m: 'c' }, { d: 28, m: 'c' }, { d: 29, m: 'c' }, { d: 30, m: 'c' }, { d: 31, m: 'c' }, { d: 1, m: 'n' },
                          ].map((day, i) => (
                            <div key={i} className="flex flex-col items-center justify-center relative h-9">
                              <span className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-bold z-10 ${day.m !== 'c' ? 'text-gray-300' : day.active ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors'
                                }`}>
                                {day.d}
                              </span>
                              {/* Dots underneath */}
                              {(day.event || day.booked) && (
                                <div className="absolute bottom-0.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: day.booked ? '#ef4444' : '#22c55e' }}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-5 mt-auto pt-8 text-[12px] font-bold text-gray-500 w-full justify-center">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm"></div> Event</div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm"></div> Booked</div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></div> Unavailable</div>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          ) : activeTab === "events" ? (
            <EventDashboard />
          ) : activeTab === "clients" ? (
            <ClientDashboard clients={clients} bookings={bookings} />
          ) : activeTab === "manage-bookings" ? (
            <BookingDashboard />
          ) : activeTab === "staff" ? (
            staffSubTab === "attendance" ? (
              <StaffAttendance />
            ) : staffSubTab === "staff-management" ? (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Staff Management</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage your organization staff members</p>
                    </div>
                    <button
                      onClick={() => {
                        setStaffSubTab("staff-management");
                        setIsAddStaff(true);
                        setEditingStaffId(null);
                        setStaffErrors({});
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-[#5b2ceb] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4e25b5] transition-all"
                    >
                      <Plus size={16} />
                      Add Staff
                    </button>
                  </div>

                  {isAddStaff ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-[#1a237e]">Add New Staff</h3>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details to add a new staff member</p>
                      </div>
                      <h4 className="text-md font-bold text-[#1a237e] mb-6">Staff Information</h4>
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 flex-shrink-0">
                          <input type="file" id="staff-photo-upload" className="hidden" accept="image/jpeg, image/png" onChange={handlePhotoUpload} />
                          <label htmlFor="staff-photo-upload" className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center h-48 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden relative">
                            {newStaffMember.photo ? (
                              <img src={newStaffMember.photo} alt="Staff Preview" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <>
                                <Upload size={24} className="text-gray-400 mb-3" />
                                <p className="font-semibold text-[#1a237e] text-sm">Upload Photo</p>
                                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 2MB</p>
                              </>
                            )}
                          </label>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Full Name *</label>
                            <input type="text" required value={newStaffMember.name || ""} onChange={(e) => { const val = e.target.value.replace(/\d/g, ''); setNewStaffMember(c => ({ ...c, name: val, email: val ? `${val.toLowerCase().replace(/\s+/g, '')}staff@gmail.com` : "", password: val ? `${val.substring(0, 3).toLowerCase()}staff@123` : "" })); setStaffErrors(c => ({ ...c, name: "" })); }} placeholder="Enter full name" className={`w-full px-4 py-2.5 rounded-lg border ${staffErrors.name ? 'border-red-500' : 'border-gray-200'} text-sm text-gray-700 outline-none`} />
                            {staffErrors.name && <p className="text-red-500 text-xs mt-1">{staffErrors.name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Personal Email (For Notifications) *</label>
                            <input type="email" required value={newStaffMember.personalEmail || ""} onChange={(e) => { setNewStaffMember(c => ({ ...c, personalEmail: e.target.value })); setStaffErrors(c => ({ ...c, personalEmail: "" })); }} placeholder="e.g. naikashwitha08@gmail.com" className={`w-full px-4 py-2.5 rounded-lg border ${staffErrors.personalEmail ? 'border-red-500' : 'border-gray-200'} text-sm text-gray-700 outline-none`} />
                            {staffErrors.personalEmail && <p className="text-red-500 text-xs mt-1">{staffErrors.personalEmail}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Phone Number *</label>
                            <input type="tel" required value={newStaffMember.phone || ""} onChange={(e) => { const val = e.target.value.replace(/\D/g, '').slice(0, 10); setNewStaffMember(c => ({ ...c, phone: val })); setStaffErrors(c => ({ ...c, phone: "" })); }} placeholder="Enter phone number" className={`w-full px-4 py-2.5 rounded-lg border ${staffErrors.phone ? 'border-red-500' : 'border-gray-200'} text-sm text-gray-700 outline-none`} />
                            {staffErrors.phone && <p className="text-red-500 text-xs mt-1">{staffErrors.phone}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Address *</label>
                            <input type="text" required value={newStaffMember.address || ""} onChange={(e) => { setNewStaffMember(c => ({ ...c, address: e.target.value })); setStaffErrors(c => ({ ...c, address: "" })); }} placeholder="Enter address" className={`w-full px-4 py-2.5 rounded-lg border ${staffErrors.address ? 'border-red-500' : 'border-gray-200'} text-sm text-gray-700 outline-none`} />
                            {staffErrors.address && <p className="text-red-500 text-xs mt-1">{staffErrors.address}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Role *</label>
                            <select required value={newStaffMember.role || ""} onChange={(e) => { setNewStaffMember(c => ({ ...c, role: e.target.value })); setStaffErrors(c => ({ ...c, role: "" })); }} className={`w-full px-4 py-2.5 rounded-lg border ${staffErrors.role ? 'border-red-500' : 'border-gray-200'} text-sm text-gray-700 outline-none`}>
                              <option value="">Select Role</option>
                              <option value="Security">Security</option>
                              <option value="Event Manager">Event Manager</option>
                              <option value="Waiter">Waiter</option>
                              <option value="Cleaner">Cleaner</option>
                              <option value="Bartender">Bartender</option>
                              <option value="Decorator">Decorator</option>
                              <option value="Technician">Technician</option>
                            </select>
                            {staffErrors.role && <p className="text-red-500 text-xs mt-1">{staffErrors.role}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Staff ID (Auto)</label>
                            <input type="text" readOnly value={newStaffMember.staffId || ""} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Employment Basis *</label>
                            <select value={newStaffMember.employmentType || "Full-time"} onChange={(e) => setNewStaffMember(c => ({ ...c, employmentType: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none">
                              <option value="Full-time">Full-time (Monthly Salary)</option>
                              <option value="Contract">Contract (Per Event / Hour)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Salary / Event Fee (₹) *</label>
                            <input type="number" required placeholder="e.g. 25000" value={newStaffMember.salary || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, salary: Number(e.target.value) }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Department</label>
                            <select value={newStaffMember.department || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, department: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none">
                              <option value="">Select Department</option>
                              <option value="Operations">Operations</option>
                              <option value="Management">Management</option>
                              <option value="Security">Security</option>
                              <option value="Logistics">Logistics</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Emergency Contact</label>
                            <input type="tel" value={newStaffMember.emergencyContact || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, emergencyContact: e.target.value }))} placeholder="Emergency phone" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">Bank Account Number</label>
                            <input type="text" value={newStaffMember.bankAccountNumber || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, bankAccountNumber: e.target.value }))} placeholder="e.g. 123456789012" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">IFSC Code</label>
                            <input type="text" value={newStaffMember.ifscCode || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, ifscCode: e.target.value.toUpperCase() }))} placeholder="e.g. SBIN0001234" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none" />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-[#1a237e] mb-1.5">UPI ID</label>
                            <input type="text" value={newStaffMember.upiId || ""} onChange={(e) => setNewStaffMember(c => ({ ...c, upiId: e.target.value }))} placeholder="e.g. staffname@upi" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none" />
                          </div>
                          <div className="col-span-full mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-4">
                            <h4 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2">Generated Login Credentials</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-semibold text-blue-900 mb-1.5">Login Email (Auto)</label>
                                <input type="email" readOnly value={newStaffMember.email || ""} className="w-full px-4 py-2.5 rounded-lg border border-blue-200 bg-white text-sm text-blue-900 outline-none font-medium" />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-blue-900 mb-1.5">Temporary Password (Auto)</label>
                                <div className="flex gap-2">
                                  <input type="text" readOnly value={newStaffMember.password || ""} placeholder="Auto-generated" className="flex-1 px-4 py-2.5 rounded-lg border border-blue-200 bg-white text-sm text-blue-900 outline-none font-medium" />
                                  <button type="button" onClick={() => {
                                    const baseName = newStaffMember.name ? newStaffMember.name.toLowerCase().replace(/\s+/g, '') : "staff";
                                    const shortName = baseName.substring(0, 3);
                                    setNewStaffMember(c => ({
                                      ...c,
                                      email: `${baseName}staff@gmail.com`,
                                      password: `${shortName}staff@${Math.floor(100 + Math.random() * 900)}`
                                    }));
                                  }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold whitespace-nowrap hover:bg-blue-700 transition-colors">Regenerate</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                        <button type="button" onClick={() => { setIsAddStaff(false); setEditingStaffId(null); setStaffErrors({}); setNewStaffMember({ staffId: "STF" + Math.floor(100 + Math.random() * 900), name: "", personalEmail: "", email: "", phone: "", address: "", role: "", department: "", emergencyContact: "", experience: "", joiningDate: "", salary: "", availability: "", photo: null, password: "", status: "Active" }); }} className="px-6 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={() => handleStaffSave(false)} className="px-6 py-2.5 rounded-lg border border-[#f97316] text-sm font-semibold text-[#f97316] shadow-sm hover:bg-orange-50">Save Staff</button>
                        <button type="button" onClick={() => handleStaffSave(true)} className="px-6 py-2.5 rounded-lg bg-[#f97316] text-sm font-semibold text-white shadow-sm hover:bg-[#ea580c] flex items-center gap-2">Send Credentials & Save</button>
                      </div>

                      {/* Mock Credentials Sent Modal */}
                      {credentialsSentData && (
                        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
                          <div className="bg-white rounded-xl p-6 max-w-2xl w-full flex flex-col md:flex-row gap-6 shadow-2xl">
                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-5">
                              <h4 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Email Notification (Sent to {credentialsSentData.personalEmail || "Personal Email"})</h4>
                              <p className="text-xs text-gray-500 mb-4"><strong>Subject:</strong> Welcome to Event Management System</p>
                              <div className="text-sm text-gray-700 space-y-3 font-mono bg-white p-3 rounded border border-gray-100">
                                <p>Hello {credentialsSentData.name || "Staff"},</p>
                                <p>Your staff account has been created.</p>
                                <div>
                                  <p><strong>Login Email:</strong></p>
                                  <p className="text-blue-600">{credentialsSentData.email}</p>
                                </div>
                                <div>
                                  <p><strong>Temporary Password:</strong></p>
                                  <p className="font-bold text-black">{credentialsSentData.password}</p>
                                </div>
                                <p>Please login and change your password.</p>
                                <p>Thank you.</p>
                              </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-4">
                              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 flex-1">
                                <h4 className="text-sm font-bold text-blue-900 border-b border-blue-200 pb-2 mb-3 flex items-center gap-2">SMS Notification</h4>
                                <div className="text-sm text-blue-800 space-y-2 font-mono bg-white p-3 rounded border border-blue-100">
                                  <p><strong>EMS</strong></p>
                                  <p>Your Staff Account has been created.</p>
                                  <p>Email:<br />{credentialsSentData.email}</p>
                                  <p>Password:<br />{credentialsSentData.password}</p>
                                  <p>Login and change your password.</p>
                                </div>
                              </div>
                              <button onClick={() => setCredentialsSentData(null)} className="py-3 px-6 bg-gray-900 text-white rounded-lg text-sm font-bold w-full hover:bg-gray-800 transition-colors">Done</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                          <p className="text-sm font-medium text-gray-500">Total Staff</p>
                          <p className="mt-4 text-3xl font-bold text-gray-900">{staffMembers.length}</p>
                        </div>
                      </div>
                      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mt-6">
                        {staffMembers.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-gray-50 border-b">
                                <tr>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Staff Name</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Email</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Phone</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Role</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Basis</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Salary / Fee</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600">Total Paid</th>
                                  <th className="px-4 py-3 font-semibold text-gray-600 text-center">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y">
                                {staffMembers.map((s, i) => (
                                  <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        <img src={s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}`} alt={s.name} />
                                      </div>
                                      <span className="font-medium text-gray-900">{s.name}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{s.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                                    <td className="px-4 py-3 text-gray-600">
                                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold">
                                        {s.role}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 font-semibold">{s.employmentType || "Full-time"}</td>
                                    <td className="px-4 py-3 text-gray-900 font-bold">₹{(s.salary || (s.role === "Event Manager" ? 30000 : s.role === "Security" ? 18000 : 12000)).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-green-700 font-bold">₹{((s.paidSalaries || []).reduce((sum, p) => sum + (p.amount || 0), 0)).toLocaleString()}</td>
                                    <td className="px-4 py-3 text-center">
                                      <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => { setPaymentTarget({ type: "staff", data: s }); setPayAmount(s.salary || (s.role === "Event Manager" ? 30000 : s.role === "Security" ? 18000 : 12000)); setPayRef(""); }} className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded text-[11px] font-bold transition-colors flex items-center gap-0.5" title="Pay Salary">
                                          <DollarSign size={12} /> Pay
                                        </button>
                                        <button onClick={() => handleEditStaff(s)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                                          <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => handleDeleteStaff(s.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-center py-8 text-gray-400 font-medium bg-gray-50/50 rounded-lg">No organization staff records generated.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Vendor Management</h3>
                      <p className="text-sm text-gray-500 mt-1">Manage your organization vendors and service providers</p>
                    </div>
                    <button onClick={() => { setVendorDraft(null); setVendorEditingId(null); navigate("/admin/vendor-management/add-vendor"); }} className="inline-flex items-center gap-2 rounded-full bg-[#5b2ceb] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#4e25b5]">
                      <Plus size={16} /> Add Vendor
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
                    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Total Vendors</p>
                      <p className="mt-4 text-3xl font-bold text-gray-900">{vendors.length}</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 mt-6">
                    {vendors.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="px-4 py-3 font-semibold text-gray-600">Vendor Name</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Contact Person</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Phone</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Contract Basis</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Contract Price</th>
                              <th className="px-4 py-3 font-semibold text-gray-600">Total Settled</th>
                              <th className="px-4 py-3 font-semibold text-gray-600 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {vendors.map((v, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-4 py-3 flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                                    {v.initials}
                                  </div>
                                  <span className="font-medium text-gray-900">{v.name}</span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">
                                  <span className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-xs font-semibold">
                                    {v.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-gray-600">{v.contactPerson}</td>
                                <td className="px-4 py-3 text-gray-600">{v.phone}</td>
                                <td className="px-4 py-3 text-gray-600 font-semibold">{v.contractBasis || "Per Event"}</td>
                                <td className="px-4 py-3 text-gray-900 font-bold">₹{(v.contractPrice || (v.category === "Catering" ? 45000 : v.category === "Decoration" ? 25000 : v.category === "Photography" ? 35000 : 18000)).toLocaleString()}</td>
                                <td className="px-4 py-3 text-green-700 font-bold">₹{((v.paidAmounts || []).reduce((sum, p) => sum + (p.amount || 0), 0)).toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button onClick={() => { setPaymentTarget({ type: "vendor", data: v }); setPayAmount(v.contractPrice || (v.category === "Catering" ? 45000 : v.category === "Decoration" ? 25000 : v.category === "Photography" ? 35000 : 18000)); setPayRef(""); }} className="px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded text-[11px] font-bold transition-colors flex items-center gap-0.5" title="Settle Vendor Payment">
                                      <DollarSign size={12} /> Settle
                                    </button>
                                    <button onClick={() => handleEditVendor(v)} className="p-1 text-gray-400 hover:text-blue-500 transition-colors">
                                      <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteVendor(v.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-8 text-gray-400 font-medium bg-gray-50/50 rounded-lg">No external partner vendor items added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : activeTab === "bookings" ? (
            <div className="space-y-6 bg-[#f8fafc] p-6 rounded-3xl min-h-screen">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Total Bookings */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between border border-gray-50 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-semibold">Total Bookings</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.length}</h3>
                        <p className="text-gray-400 text-xs mt-1">All time bookings</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold">
                    <TrendingUp size={12} /> 12%
                  </div>
                </div>

                {/* Pending Approval */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between border border-gray-50 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-semibold">Pending Approval</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.filter(b => String(b.booking_status || b.status).toLowerCase().includes('pending')).length}</h3>
                        <p className="text-gray-400 text-xs mt-1">Awaiting approval</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-xs font-bold">
                    <TrendingUp size={12} /> 5%
                  </div>
                </div>

                {/* Confirmed */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between border border-gray-50 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 border border-green-100">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-semibold">Confirmed</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.filter(b => String(b.booking_status || b.status).toLowerCase().includes('confirm') || String(b.booking_status || b.status).toLowerCase().includes('approve')).length}</h3>
                        <p className="text-gray-400 text-xs mt-1">Confirmed bookings</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold">
                    <TrendingUp size={12} /> 18%
                  </div>
                </div>

                {/* Today's Events */}
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 flex flex-col justify-between border border-gray-50 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm font-semibold">Upcoming Events</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">{bookings.filter(b => b.event_date && new Date(b.event_date) >= new Date(new Date().setHours(0, 0, 0, 0))).length}</h3>
                        <p className="text-gray-400 text-xs mt-1">Events scheduled</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-bold">
                    <TrendingUp size={12} /> 0%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Pending Bookings Table */}
                <div className="xl:col-span-2 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-50 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Calendar size={18} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">Pending Bookings</h3>
                    </div>
                    <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700">
                      View All <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Booking ID</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Client Name</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Event</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Date</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Advance</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Status</th>
                          <th className="py-4 px-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {bookings.slice(0, 5).map((b, i) => {
                          const clientName = b.clientName || b.phone_number || "Client";
                          const initials = String(clientName).replace(/[^a-zA-Z0-9 ]/g, "").split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || "CL";
                          const status = b.booking_status || b.status || "Pending";
                          const isConfirmed = status.toLowerCase().includes('confirm') || status.toLowerCase().includes('approve');
                          const rowId = b._id || b.id;
                          return (
                            <tr key={rowId || i} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-2 text-sm text-gray-900 font-bold whitespace-nowrap">
                                {b._id ? "BK-" + b._id.substring(0, 4).toUpperCase() : `BK00${i + 1}`}
                              </td>
                              <td className="py-4 px-2 text-sm">
                                <div className="flex items-center gap-3 whitespace-nowrap">
                                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-100">
                                    {initials}
                                  </div>
                                  <span className="text-gray-600 font-medium">{clientName}</span>
                                </div>
                              </td>
                              <td className="py-4 px-2 text-sm text-gray-500 font-medium whitespace-nowrap">{b.eventTitle || b.event_type || "Event"}</td>
                              <td className="py-4 px-2 text-sm text-gray-500 flex items-center gap-1.5 whitespace-nowrap">
                                <Calendar size={14} className="text-gray-400" /> {formatDate(b.event_date)}
                              </td>
                              <td className="py-4 px-2 text-sm text-gray-900 font-bold whitespace-nowrap">
                                ₹{(b.advance_paid || 0).toLocaleString()}
                              </td>
                              <td className="py-4 px-2 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${isConfirmed ? 'text-green-600 bg-green-50 border-green-100/50' : 'text-orange-500 bg-orange-50 border-orange-100/50'}`}>
                                  {status}
                                </span>
                              </td>
                              <td className="py-4 px-2">
                                <div className="flex space-x-3">
                                  <button type="button" className="text-gray-400 hover:text-indigo-600 transition" onClick={() => { setSelectedBooking(b); setIsBookingModalOpen(true); }}>
                                    <Eye size={18} />
                                  </button>
                                  <button type="button" className="text-gray-400 hover:text-amber-500 transition" onClick={() => { setSelectedBooking(b); setIsBookingModalOpen(true); }}>
                                    <Edit3 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {bookings.length === 0 && (
                          <tr><td colSpan="7" className="text-center py-8 text-gray-500">No bookings available.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <button className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-lg text-sm font-bold border border-orange-100/50 hover:bg-orange-100 transition flex items-center gap-2">
                      View All Pending Bookings <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Today's Events */}
                {(() => {
                  const upcoming = bookings.filter(b => b.event_date && new Date(b.event_date) >= new Date(new Date().setHours(0, 0, 0, 0))).sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).slice(0, 3);
                  if (upcoming.length === 0) return null;

                  return (
                    <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-50 flex flex-col">
                      <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                          <Calendar size={18} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
                      </div>

                      <div className="space-y-4 flex-1">
                        {upcoming.map((ev, i) => (
                          <div key={i} className="flex gap-4 border border-gray-100 rounded-xl p-3 hover:shadow-md transition-shadow bg-white items-center">
                            <img
                              src={ev.image || `https://images.unsplash.com/photo-${i % 2 === 0 ? '1519167758481-83f550bb49b3' : '1464366400600-7168b8af9bc3'}?auto=format&fit=crop&w=100&h=100&q=80`}
                              className="w-16 h-16 rounded-lg object-cover shadow-sm border border-gray-100 flex-shrink-0"
                              alt="Event"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm truncate">{ev.eventTitle || ev.event_type || "Event"} - {ev.clientName || "Client"}</h4>
                              <div className="flex items-center gap-1 text-gray-500 text-xs mt-1 truncate">
                                <Store size={12} /> {ev.venueName || ev.venue_id || "Venue"}
                              </div>
                              <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                <Calendar size={12} /> {formatDate(ev.event_date)}
                              </div>
                            </div>
                            <div className="bg-purple-50 text-purple-600 px-3 py-2 rounded-lg font-bold text-xs flex flex-col items-center justify-center border border-purple-100 flex-shrink-0 whitespace-nowrap">
                              {ev.time_slot ? ev.time_slot.split(' - ')[0] : "10:00 AM"}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button className="bg-purple-50 text-purple-600 px-6 py-2.5 rounded-lg text-sm font-bold border border-purple-100/50 hover:bg-purple-100 transition flex items-center gap-2">
                          View All Events <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Bottom Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-50 flex justify-between items-center relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 border border-purple-100">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">Active Clients</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{Array.from(new Set(bookings.map(b => b.clientName || b.client_id))).filter(Boolean).length}</h3>
                      <p className="text-gray-400 text-xs mt-1">Registered clients</p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold self-start mt-2">
                    <TrendingUp size={12} className="inline" /> 8%
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-50 flex justify-between items-center relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">Total Revenue</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{bookings.reduce((sum, b) => sum + (Number(b.advance_paid) || Number(b.amount) || 0), 0).toLocaleString()}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">Total earnings</p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-600 px-2 py-1 rounded-md text-xs font-bold self-start mt-2">
                    <TrendingUp size={12} className="inline" /> 15%
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] p-6 border border-gray-50 flex justify-between items-center relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                      <DollarSign size={20} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm font-semibold">Outstanding</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">
                        ₹{bookings.reduce((sum, b) => sum + Math.max(0, (Number(b.total_cost) || 0) - (Number(b.advance_paid) || 0)), 0).toLocaleString()}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">Pending payments</p>
                    </div>
                  </div>
                  <div className="bg-red-50 text-red-600 px-2 py-1 rounded-md text-xs font-bold self-start mt-2">
                    - 6%
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "payments" ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Accounting Ledger</h3>
              {billingLoading ? (
                <p className="text-gray-500">Loading payment ledger...</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3.5 font-semibold text-gray-700 text-sm">Payment</th>
                        <th className="px-6 py-3.5 font-semibold text-gray-700 text-sm">Event</th>
                        <th className="px-6 py-3.5 font-semibold text-gray-700 text-sm">Method</th>
                        <th className="px-6 py-3.5 font-semibold text-gray-700 text-sm">Amount</th>
                        <th className="px-6 py-3.5 font-semibold text-gray-700 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminBilling.payments.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">
                            No payment records found yet.
                          </td>
                        </tr>
                      ) : (
                        adminBilling.payments.map((payment) => (
                          <tr key={payment._id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                              {payment.razorpay_payment_id || payment.razorpayPaymentId || (payment._id && payment._id.slice(-10)) || "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {payment.bookingId?.eventTitle || payment.bookingId?.event_type || "Booking"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{payment.method || payment.payment_method || "Online"}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">₹{Number(payment.amount || 0).toLocaleString("en-IN")}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{payment.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === "reports" ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["Revenue Report", "Event Analytics", "Staff Performance", "Vendor Report"].map((report) => (
                  <button key={report} onClick={() => generateReport(report)} disabled={reportDownloading !== null} className="p-5 border border-gray-200 rounded-xl hover:border-amber-500 text-left transition-all bg-white flex justify-between items-center group disabled:opacity-50">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-amber-600">{report}</p>
                      <p className="text-xs text-gray-400 mt-1">Download as CSV</p>
                    </div>
                    {reportDownloading === report ? <Loader2 className="animate-spin text-amber-600" size={20} /> : <TrendingUp size={20} className="text-gray-400" />}
                  </button>
                ))}
              </div>
            </div>
          ) : activeTab === "settings" ? (
            <div className="flex flex-col gap-6 text-left max-w-4xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure brand parameters, tax settings, and system-wide notifications.</p>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem("admin_system_settings", JSON.stringify(settings));
                alert("System Settings saved successfully!");
              }} className="space-y-6">

                {/* Brand & Contact */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-md font-bold text-gray-900 border-b pb-2">General & Contact Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Application Name</label>
                      <input type="text" value={settings.appName || ""} onChange={(e) => setSettings(c => ({ ...c, appName: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Support Phone</label>
                      <input type="text" value={settings.supportPhone || ""} onChange={(e) => setSettings(c => ({ ...c, supportPhone: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Support Email</label>
                      <input type="email" value={settings.supportEmail || ""} onChange={(e) => setSettings(c => ({ ...c, supportEmail: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-md font-bold text-gray-900 border-b pb-2">Notifications Setup</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150 cursor-pointer select-none">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-gray-900">Email Alerts</span>
                        <span className="text-[11px] text-gray-400">Notify clients on booking status</span>
                      </div>
                      <input type="checkbox" checked={settings.emailNotifications} onChange={(e) => setSettings(c => ({ ...c, emailNotifications: e.target.checked }))} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150 cursor-pointer select-none">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-gray-900">New Booking Alerts</span>
                        <span className="text-[11px] text-gray-400">Trigger immediate admin alarms</span>
                      </div>
                      <input type="checkbox" checked={settings.bookingAlerts} onChange={(e) => setSettings(c => ({ ...c, bookingAlerts: e.target.checked }))} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-150 cursor-pointer select-none">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-gray-900">Push Notifications</span>
                        <span className="text-[11px] text-gray-400">In-browser system pings</span>
                      </div>
                      <input type="checkbox" checked={settings.pushNotifications} onChange={(e) => setSettings(c => ({ ...c, pushNotifications: e.target.checked }))} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                    </label>
                  </div>
                </div>

                {/* Financial Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-md font-bold text-gray-900 border-b pb-2">Financial & Tax Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">GST Rate (%)</label>
                      <input type="number" value={settings.gstRate || 18} onChange={(e) => setSettings(c => ({ ...c, gstRate: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Service Charge Rate (%)</label>
                      <input type="number" value={settings.serviceCharge || 5} onChange={(e) => setSettings(c => ({ ...c, serviceCharge: Number(e.target.value) }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Currency Symbol</label>
                      <input type="text" value={settings.currencySymbol || "₹"} onChange={(e) => setSettings(c => ({ ...c, currencySymbol: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-md font-bold text-gray-900 border-b pb-2">Admin Account & Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Current Password</label>
                      <input type="password" placeholder="••••••••" value={settings.currentPassword || ""} onChange={(e) => setSettings(c => ({ ...c, currentPassword: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none bg-gray-50" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">New Password</label>
                      <input type="password" placeholder="Enter new password" value={settings.newPassword || ""} onChange={(e) => setSettings(c => ({ ...c, newPassword: e.target.value }))} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700 outline-none" />
                    </div>
                  </div>
                  <button type="button" onClick={() => {
                    if (!settings.currentPassword || !settings.newPassword) {
                      alert("Please fill in both current and new password fields.");
                      return;
                    }
                    alert("Password updated successfully!");
                    setSettings(c => ({ ...c, currentPassword: "", newPassword: "" }));
                  }} className="px-4 py-2 border border-blue-200 hover:bg-blue-50 text-blue-600 rounded-lg text-xs font-bold transition-all mt-2">
                    Update Password
                  </button>
                </div>

                {/* System Maintenance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="text-md font-bold text-gray-900 border-b pb-2">System Utilities</h3>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input type="checkbox" checked={settings.maintenanceMode} onChange={(e) => setSettings(c => ({ ...c, maintenanceMode: e.target.checked }))} className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">Maintenance Mode</span>
                        <span className="text-xs text-gray-400">Put client booking module offline for upgrades</span>
                      </div>
                    </label>
                    <button type="button" onClick={() => {
                      if (window.confirm("Are you sure you want to flush cached data? This won't delete bookings, but resets display configurations.")) {
                        alert("Cache cleared successfully!");
                      }
                    }} className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all self-start md:self-auto">
                      Flush System Cache
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="submit" className="px-6 py-3 bg-[#ff7b00] hover:bg-[#ff8c20] text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                    Save System Settings
                  </button>
                </div>

              </form>
            </div>
          ) : null}
        </div>
      </div>

      {isEventModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h4 className="text-lg font-bold text-gray-900">Create New Event</h4>
              <button onClick={() => setIsEventModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Name</label>
                <input type="text" required value={editingEvent ? editingEvent.name : newEvent.name} onChange={(e) => editingEvent ? setEditingEvent(c => ({ ...c, name: e.target.value })) : setNewEvent(c => ({ ...c, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2 text-sm outline-none bg-gray-50" placeholder="e.g. Corporate Meet" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-lg">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {paymentTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100 text-left">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h4 className="text-lg font-bold text-gray-900">
                {paymentTarget.type === "staff" ? "Pay Staff Salary" : "Settle Vendor Payment"}
              </h4>
              <button onClick={() => setPaymentTarget(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-3 bg-gray-50 p-4 rounded-lg text-sm">
              <p className="text-gray-700"><strong>Name:</strong> {paymentTarget.data.name}</p>
              <p className="text-gray-700">
                <strong>{paymentTarget.type === "staff" ? "Role" : "Category"}:</strong>{" "}
                {paymentTarget.type === "staff" ? paymentTarget.data.role : paymentTarget.data.category}
              </p>
              <p className="text-gray-700">
                <strong>{paymentTarget.type === "staff" ? "Basis" : "Contract"}:</strong>{" "}
                {paymentTarget.type === "staff" ? (paymentTarget.data.employmentType || "Full-time") : (paymentTarget.data.contractBasis || "Per Event")}
              </p>
              <p className="text-gray-700">
                <strong>{paymentTarget.type === "staff" ? "Standard Salary" : "Contract Value"}:</strong>{" "}
                ₹{Number(
                  paymentTarget.type === "staff"
                    ? (paymentTarget.data.salary || (paymentTarget.data.role === "Event Manager" ? 30000 : paymentTarget.data.role === "Security" ? 18000 : 12000))
                    : (paymentTarget.data.contractPrice || (paymentTarget.data.category === "Catering" ? 45000 : paymentTarget.data.category === "Decoration" ? 25000 : paymentTarget.data.category === "Photography" ? 35000 : 18000))
                ).toLocaleString()}
              </p>
              <div className="pt-2 mt-2 border-t border-gray-200 space-y-1 text-xs">
                <p className="text-blue-900 font-bold uppercase tracking-wider text-[10px]">Payment Credentials</p>
                <p className="text-gray-700"><strong>Bank A/C:</strong> {paymentTarget.data.bankAccountNumber || "Not configured"}</p>
                <p className="text-gray-700"><strong>IFSC Code:</strong> {paymentTarget.data.ifscCode || "Not configured"}</p>
                <p className="text-gray-700"><strong>UPI ID:</strong> {paymentTarget.data.upiId || "Not configured"}</p>
              </div>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              const amt = Number(payAmount);
              if (isNaN(amt) || amt <= 0) {
                alert("Please enter a valid payment amount.");
                return;
              }

              try {
                // 1. Load Razorpay Checkout Script
                const scriptLoaded = await new Promise((resolve) => {
                  if (window.Razorpay) {
                    resolve(true);
                    return;
                  }
                  const script = document.createElement("script");
                  script.src = "https://checkout.razorpay.com/v1/checkout.js";
                  script.async = true;
                  script.onload = () => resolve(true);
                  script.onerror = () => resolve(false);
                  document.body.appendChild(script);
                });

                if (!scriptLoaded) {
                  alert("Failed to load Razorpay SDK. Please check your internet connection.");
                  return;
                }

                // 2. Fetch Razorpay key ID from backend or default to test key
                let razorpayKey = "rzp_test_SGkB8sZW1kNRvT";
                try {
                  const keyRes = await fetch("http://localhost:5000/api/payments/razorpay-key");
                  const keyData = await keyRes.json();
                  if (keyData.success && keyData.key) {
                    razorpayKey = keyData.key;
                  }
                } catch (keyErr) {
                  console.warn("Using default Razorpay test key:", keyErr);
                }

                // 3. Create a payout order on backend
                const orderRes = await fetch("http://localhost:5000/api/payments/create-payout-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount: amt }),
                });

                const orderData = await orderRes.json();
                if (!orderRes.ok || !orderData.success) {
                  alert("Failed to create Razorpay payout order: " + (orderData.message || "Unknown error"));
                  return;
                }

                const isStaff = paymentTarget.type === "staff";
                const targetId = paymentTarget.data.id || paymentTarget.data._id;
                const endpoint = isStaff ? `http://localhost:5000/api/staff/${targetId}` : `http://localhost:5000/api/vendors/${targetId}`;

                // 4. Trigger Razorpay Checkout Modal
                const options = {
                  key: razorpayKey,
                  amount: orderData.amount,
                  currency: "INR",
                  name: "Event Management System",
                  description: isStaff ? `Salary Payment to ${paymentTarget.data.name}` : `Contract Settlement to ${paymentTarget.data.name}`,
                  image: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
                  order_id: orderData.order_id,
                  prefill: {
                    name: paymentTarget.data.name,
                    email: paymentTarget.data.email,
                    contact: paymentTarget.data.phone || "",
                  },
                  theme: {
                    color: "#16a34a"
                  },
                  handler: async (paymentResponse) => {
                    try {
                      // 5. Verify the payout signature and trigger email notification on backend
                      const verifyRes = await fetch("http://localhost:5000/api/payments/verify-payout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          razorpay_order_id: orderData.order_id,
                          razorpay_payment_id: paymentResponse.razorpay_payment_id,
                          razorpay_signature: paymentResponse.razorpay_signature,
                          payoutType: paymentTarget.type,
                          email: paymentTarget.data.email,
                          name: paymentTarget.data.name,
                          amount: amt,
                          roleOrCategory: isStaff ? paymentTarget.data.role : paymentTarget.data.category,
                          bankAccount: paymentTarget.data.bankAccountNumber || "N/A",
                          upiId: paymentTarget.data.upiId || "N/A"
                        })
                      });

                      const verifyData = await verifyRes.json();
                      if (!verifyRes.ok || !verifyData.success) {
                        alert("Razorpay payout signature verification failed.");
                        return;
                      }

                      // 6. Signature verified! Save the transaction log to DB
                      const payLog = {
                        amount: amt,
                        date: new Date(),
                        transactionId: paymentResponse.razorpay_payment_id
                      };

                      const updatedBody = isStaff ? {
                        paidSalaries: [...(paymentTarget.data.paidSalaries || []), payLog]
                      } : {
                        paidAmounts: [...(paymentTarget.data.paidAmounts || []), payLog]
                      };

                      const putRes = await fetch(endpoint, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedBody),
                      });

                      if (putRes.ok) {
                        alert("Congratulations! Payment completed and email sent successfully.");
                        if (isStaff) {
                          setStaffMembers(current => current.map(m => m.id === targetId ? { ...m, paidSalaries: [...(m.paidSalaries || []), payLog] } : m));
                        } else {
                          setVendors(current => current.map(v => v.id === targetId ? { ...v, paidAmounts: [...(v.paidAmounts || []), payLog] } : v));
                        }
                        setPaymentTarget(null);
                      } else {
                        alert("Payment successful but failed to log transaction history in database. Please contact support.");
                      }
                    } catch (verifyErr) {
                      console.error("Verification error:", verifyErr);
                      alert("An error occurred during payment verification.");
                    }
                  },
                  modal: {
                    ondismiss: () => {
                      alert("Payment window closed by admin.");
                    }
                  }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

              } catch (err) {
                console.error(err);
                alert("Server error initiating payment");
              }
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Amount to Pay (₹)</label>
                <input type="number" required value={payAmount} onChange={(e) => setPayAmount(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-gray-50" placeholder="e.g. 15000" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Payment Method</label>
                <select value={payMethod} onChange={(e) => setPayMethod(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-gray-50">
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / Online</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Transaction Ref / ID (Optional)</label>
                <input type="text" value={payRef} onChange={(e) => setPayRef(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none bg-gray-50" placeholder="e.g. UPI8743902342" />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setPaymentTarget(null)} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isBookingModalOpen && selectedBooking && (
        <BookingWizardModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          booking={selectedBooking}
          staffMembers={staffMembers}
          vendors={vendors}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
