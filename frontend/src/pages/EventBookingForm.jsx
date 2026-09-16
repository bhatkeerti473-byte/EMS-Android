import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    Calendar,
    Check,
    ChefHat,
    Clock,
    Home,
    Info,
    Loader,
    MapPin,
    Phone,
    Briefcase,
    Users,
    ShieldCheck,
    Building,
    Edit2,
    Gift,
    Heart,
    Baby,
    Flame,
    UserPlus,
    Sparkles,
    MoreHorizontal,
    Camera,
    Video,
    Music,
    Brush,
    Shield,
    CheckCircle,
    Mic,
    PenTool,
    CalendarCheck,
    Truck,
    Speaker,
    Coffee,
    X,
    ClipboardList,
    User,
    CreditCard,
    Download
} from "lucide-react";
import html2pdf from "html2pdf.js";
import bookingAPI from "../services/bookingApi";
import RazorpayPayment from "./RazorpayPayment";
import Invoice from "./Invoice";
import LiveVenueCalendar from "./LiveVenueCalendar";
import "./styles/EventBookingForm.css";

const venueOptions = [
    { id: 1, name: "Palace Garden Estate", price: 150000, capacity: 500, location: "Gurugram, Haryana" },
    { id: 2, name: "Ocean View Hall", price: 120000, capacity: 300, location: "Goa, India" },
    { id: 3, name: "Town Hall Convention Center", price: 80000, capacity: 200, location: "Jaipur, Rajasthan" },
    { id: 4, name: "Kapu Beach Resort", price: 200000, capacity: 1000, location: "Udupi, Karnataka" },
];

const cateringOptions = [
    { id: 1, name: "Vegetarian - Premium", pricePerPlate: 500 },
    { id: 2, name: "Non-Vegetarian - Premium", pricePerPlate: 700 },
    { id: 3, name: "Mixed - Premium", pricePerPlate: 600 },
    { id: 4, name: "Economy Buffet", pricePerPlate: 300 },
];

const guestRangeOptions = [
    { label: "50 - 100 guests", value: 75 },
    { label: "100 - 200 guests", value: 150 },
    { label: "200 - 300 guests", value: 250 },
    { label: "300 - 400 guests", value: 350 },
    { label: "400 - 500 guests", value: 450 },
];

const staffTypes = [
    { id: 1, name: "Event Coordinators", pricePerHead: 2000, ratio: 100 },
    { id: 2, name: "Security Staff", pricePerHead: 1500, ratio: 50 },
    { id: 3, name: "Catering Staff", pricePerHead: 1000, ratio: 20 },
    { id: 4, name: "Technical Support", pricePerHead: 2500, ratio: 150 },
];

const MOCK_BOOKED_DATES = {
    "2026-07-15": [{ type: "Full Day" }],
    "2026-07-20": [{ start: "09:00", end: "14:00" }],
    "2026-07-22": [{ start: "17:00", end: "22:00" }],
};

const BASE_PACKAGE_PRICE = 10000;
const FALLBACK_VENUE_IMAGE =
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80";

function formatMoney(value) {
    return `\u20B9${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDisplayDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function EventBookingForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventId } = useParams();

    const eventData = location.state?.event || {
        title: eventId ? eventId.replace(/[-_]/g, " ") : "Event Booking Request",
        subtitle: "Complete the details below to reserve your date.",
    };

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const registeredUser = JSON.parse(localStorage.getItem("registeredUser") || "{}");
    const currentUserEmail = (loggedInUser.email || registeredUser.email || "").trim().toLowerCase();
    const currentUserName = loggedInUser.name || registeredUser.name || registeredUser.username || "Client";
    const currentUserId = loggedInUser._id || loggedInUser.id || loggedInUser.userId || registeredUser._id || registeredUser.id || "";

    const [formData, setFormData] = useState({
        phone_number: loggedInUser.phone || loggedInUser.phoneNumber || loggedInUser.phone_number || "",
        address: "",
        event_date: "",
        start_time: "",
        end_time: "",
        is_full_day: false,
        venue_id: location.state?.venue?._id || location.state?.venue?.id || (eventId && eventId !== "custom" ? eventId : ""),
        custom_venue_name: "",
        is_home_event: eventId === "custom" || !location.state?.venue,
        catering_type: "",
        guest_count: "",
        require_staff: false,
        staff_requirements: {},
        home_event_type: "",
        other_home_event_type: "",
        home_indoor_outdoor: "Indoor",
        home_expected_attendance: "",
        home_special_notes: "",
        home_setup_requirements: [],
        home_other_setup: "",
        home_services: [],
        home_other_services: "",
    });

    const [clientId, setClientId] = useState("");
    const [loading, setLoading] = useState(false);
    const [bookingType, setBookingType] = useState("pay_now");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const summaryRef = useRef(null);

    const handleDownloadSummary = () => {
        if (!summaryRef.current) return;
        const element = summaryRef.current;

        // Temporarily hide the close button and actions for the PDF
        const actions = element.querySelector('.summary-modal-actions');
        const closeBtn = element.querySelector('.summary-close-btn');
        const headerTitle = element.querySelector('.summary-modal-header-actions'); // wrapper for download button

        if (actions) actions.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'none';
        if (headerTitle) headerTitle.style.display = 'none';

        const opt = {
            margin: 0.5,
            filename: `Booking_Summary_${formData.phone_number || 'Client'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
            // Restore buttons after PDF is generated
            if (actions) actions.style.display = 'flex';
            if (closeBtn) closeBtn.style.display = 'block';
            if (headerTitle) headerTitle.style.display = 'flex';
        });
    };

    useEffect(() => {
        const initialStaff = staffTypes.reduce((acc, staff) => {
            acc[staff.id] = 0;
            return acc;
        }, {});
        setFormData((prev) => ({ ...prev, staff_requirements: initialStaff }));
    }, []);

    useEffect(() => {
        if (formData.require_staff && Number(formData.guest_count) > 0) {
            const guests = Number(formData.guest_count);
            const autoCalculatedStaff = {};
            staffTypes.forEach((staff) => {
                autoCalculatedStaff[staff.id] = Math.max(1, Math.ceil(guests / staff.ratio));
            });
            setFormData((prev) => ({ ...prev, staff_requirements: autoCalculatedStaff }));
            return;
        }

        if (!formData.require_staff) {
            const clearedStaff = staffTypes.reduce((acc, staff) => {
                acc[staff.id] = 0;
                return acc;
            }, {});
            setFormData((prev) => ({ ...prev, staff_requirements: clearedStaff }));
        }
    }, [formData.guest_count, formData.require_staff]);

    useEffect(() => {
        if (formData.phone_number) {
            const timestamp = Date.now().toString().slice(-6);
            const phonePrefix = formData.phone_number.slice(-4);
            setClientId(`CLIENT_${timestamp}_${phonePrefix}`);
        } else {
            setClientId("");
        }
    }, [formData.phone_number]);

    useEffect(() => {
        if (formData.is_home_event) {
            setFormData((prev) => ({
                ...prev,
                venue_id: "none",
                custom_venue_name: prev.address ? `Home Event: ${prev.address}` : "Home Event Address",
            }));
        }
    }, [formData.is_home_event, formData.address]);

    const selectedVenue = useMemo(() => {
        if (formData.venue_id === "none" || formData.is_home_event) {
            return {
                name: "Home / Custom Venue",
                location: formData.custom_venue_name || formData.address || "Your chosen location",
                image: location.state?.venue?.images?.[0] || eventData?.image || FALLBACK_VENUE_IMAGE,
            };
        }

        if (location.state?.venue) {
            return {
                name: location.state.venue.name || "Selected Venue",
                location: location.state.venue.location || "Venue address will be shared after confirmation",
                image: location.state.venue.images?.[0] || FALLBACK_VENUE_IMAGE,
            };
        }

        const venue = venueOptions.find((item) => item.id === Number(formData.venue_id));
        return {
            name: venue?.name || "Selected Venue",
            location: venue?.location || "Venue address will be shared after confirmation",
            image: eventData?.image || FALLBACK_VENUE_IMAGE,
        };
    }, [eventData?.image, formData.address, formData.custom_venue_name, formData.is_home_event, formData.venue_id, location.state?.venue]);

    const getVenuePrice = () => {
        if (formData.venue_id === "none" || formData.is_home_event) return 0;
        const venue = venueOptions.find((v) => v.id === Number(formData.venue_id));
        return venue ? venue.price : 0;
    };

    const getCateringCost = () => {
        const catering = cateringOptions.find((c) => c.id === Number(formData.catering_type));
        const guestCount = Number(formData.guest_count) || 0;
        return catering ? catering.pricePerPlate * guestCount : 0;
    };

    const getStaffCost = () => {
        if (!formData.require_staff) return 0;
        let totalStaffCost = 0;
        Object.entries(formData.staff_requirements).forEach(([staffId, count]) => {
            const staff = staffTypes.find((s) => s.id === Number(staffId));
            if (staff && Number(count) > 0) {
                totalStaffCost += staff.pricePerHead * Number(count);
            }
        });
        return totalStaffCost;
    };

    const getHomeSetupCost = () => {
        if (!formData.is_home_event) return 0;
        let cost = 0;
        const pricing = {
            "Stage Required": 3000,
            "Sound System": 1500,
            "Lighting Required": 1000,
            "Dance Floor": 2000,
            "Seating Arrangement": 1500,
            "Decoration Required": 2500,
            "Backup Generator": 2000,
        };
        formData.home_setup_requirements.forEach(req => {
            if (pricing[req]) cost += pricing[req];
        });
        return cost;
    };

    const getHomeServicesCost = () => {
        if (!formData.is_home_event) return 0;
        let cost = 0;
        const pricing = {
            "Photography": 5000,
            "Videography": 7000,
            "DJ / Music": 4000,
            "Makeup": 3000,
            "Security Staff": 2000,
            "Cleaning Staff": 1000,
            "Event Anchor": 4000,
            "Mehendi Artist": 2000,
        };
        formData.home_services.forEach(req => {
            if (pricing[req]) cost += pricing[req];
        });
        return cost;
    };

    const totalCost = formData.is_home_event
        ? BASE_PACKAGE_PRICE + getCateringCost() + getStaffCost() + getHomeSetupCost() + getHomeServicesCost()
        : BASE_PACKAGE_PRICE + getVenuePrice() + getCateringCost() + getStaffCost();
    const advanceDeposit = totalCost * 0.3;

    const activeTimeConflict = useMemo(() => {
        if (!formData.event_date || formData.venue_id === "none") return null;
        return checkTimeConflicts(formData.event_date, formData.is_full_day, formData.start_time, formData.end_time);
    }, [formData.event_date, formData.end_time, formData.is_full_day, formData.start_time, formData.venue_id]);

    function checkTimeConflicts(date, isFullDay, start, end) {
        if (formData.venue_id === "none") return { conflict: false };

        const dayReservations = MOCK_BOOKED_DATES[date];
        if (!dayReservations) return { conflict: false };

        for (const res of dayReservations) {
            if (res.type === "Full Day" || isFullDay) {
                return { conflict: true, reason: "This day is completely booked out at our standard venue slots." };
            }

            if (start && end && res.start && res.end && start < res.end && end > res.start) {
                return { conflict: true, reason: `Overlaps an existing entry (${res.start} - ${res.end}).` };
            }
        }

        return { conflict: false };
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => {
            if (name === "phone_number" && value && !/^\d*$/.test(value)) {
                return prev;
            }

            const updated = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
                ...(name === "is_full_day" && checked ? { start_time: "", end_time: "" } : {}),
            };

            if (name === "venue_id" && value !== "none") {
                updated.is_home_event = false;
                updated.custom_venue_name = "";
            }

            if (name === "is_home_event" && !checked) {
                updated.venue_id = "";
                updated.custom_venue_name = "";
            }

            if (updated.event_date) {
                const check = checkTimeConflicts(updated.event_date, updated.is_full_day, updated.start_time, updated.end_time);
                setError(check.conflict ? `Warning: ${check.reason}` : "");
            }

            return updated;
        });
    };

    const handleSetupChange = (setup) => {
        setFormData((prev) => {
            const isSelected = prev.home_setup_requirements.includes(setup);
            return {
                ...prev,
                home_setup_requirements: isSelected
                    ? prev.home_setup_requirements.filter((s) => s !== setup)
                    : [...prev.home_setup_requirements, setup],
            };
        });
    };

    const handleServiceChange = (service) => {
        setFormData((prev) => {
            const isSelected = prev.home_services.includes(service);
            return {
                ...prev,
                home_services: isSelected
                    ? prev.home_services.filter((s) => s !== service)
                    : [...prev.home_services, service],
            };
        });
    };

    const handleGuestRangeChange = (e) => {
        if (e.target.value) {
            setFormData((prev) => ({ ...prev, guest_count: e.target.value }));
        }
    };

    const handleStaffChange = (staffId, value) => {
        setFormData((prev) => ({
            ...prev,
            staff_requirements: { ...prev.staff_requirements, [staffId]: Math.max(0, Number(value)) },
        }));
        setError("");
    };

    const validateForm = () => {
        if (!formData.phone_number || !/^[0-9]{10}$/.test(formData.phone_number)) {
            setError("Please enter a valid 10-digit phone number.");
            return false;
        }

        if (!formData.address.trim()) {
            setError("Client address field is required.");
            return false;
        }

        if (!formData.event_date) {
            setError("Event date is required.");
            return false;
        }

        if (!formData.is_full_day) {
            if (!formData.start_time || !formData.end_time) {
                setError("Please define start and end times, or check Full Day.");
                return false;
            }

            if (formData.start_time >= formData.end_time) {
                setError("End time must fall strictly after start time.");
                return false;
            }
        }

        if (!formData.venue_id) {
            setError("Venue selection is required.");
            return false;
        }

        if (formData.venue_id === "none" && !formData.custom_venue_name.trim()) {
            setError("Please specify the custom venue address or name.");
            return false;
        }

        if (!formData.catering_type) {
            setError("Catering configuration is required.");
            return false;
        }

        if (!formData.guest_count || Number(formData.guest_count) < 1) {
            setError("Please enter a valid guest amount.");
            return false;
        }

        const conflict = checkTimeConflicts(formData.event_date, formData.is_full_day, formData.start_time, formData.end_time);
        if (conflict.conflict) {
            setError(`Warning: ${conflict.reason}`);
            return false;
        }

        setError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Instead of directly paying, show the summary modal
        setShowSummaryModal(true);
    };

    const confirmAndPay = async () => {
        setLoading(true);
        setError("");

        try {
            const submissionData = {
                client_id: clientId,
                phone_number: formData.phone_number,
                userId: currentUserId || currentUserEmail || clientId,
                clientName: currentUserName,
                clientEmail: currentUserEmail,
                client_name: currentUserName,
                client_email: currentUserEmail,
                address: formData.address,
                event_type: eventData?.title || "General Event",
                eventTitle: eventData?.title || "General Event",
                event_date: formData.event_date,
                time_slot: formData.is_full_day ? "Full Day" : `${formData.start_time} - ${formData.end_time}`,
                venue_id: formData.venue_id,
                venueName:
                    formData.venue_id === "none"
                        ? formData.custom_venue_name
                        : venueOptions.find((v) => v.id === Number(formData.venue_id))?.name,
                venue_name:
                    formData.venue_id === "none"
                        ? formData.custom_venue_name
                        : venueOptions.find((v) => v.id === Number(formData.venue_id))?.name,
                catering_details: {
                    type: formData.catering_type,
                    guest_count: Number(formData.guest_count),
                },
                staff_requirements: formData.require_staff ? formData.staff_requirements : {},
                total_cost: totalCost,
                image: selectedVenue.image,
            };

            setBookingData(submissionData);
            const response = await bookingAPI.checkAndReserve(submissionData);
            const bookingDataWithId = { ...submissionData, booking_id: response.data.booking_id || response.data.data?._id };
            setBookingData(bookingDataWithId);

            setShowSummaryModal(false); // Close the summary modal

            setShowPaymentModal(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to finalize booking request.");
        } finally {
            setLoading(false);
        }
    };

    const confirmPayLater = async () => {
        setLoading(true);
        setError("");

        try {
            const submissionData = {
                client_id: clientId,
                phone_number: formData.phone_number,
                userId: currentUserId || currentUserEmail || clientId,
                clientName: currentUserName,
                clientEmail: currentUserEmail,
                client_name: currentUserName,
                client_email: currentUserEmail,
                address: formData.address,
                event_type: eventData?.title || "General Event",
                eventTitle: eventData?.title || "General Event",
                event_date: formData.event_date,
                time_slot: formData.is_full_day ? "Full Day" : `${formData.start_time} - ${formData.end_time}`,
                venue_id: formData.venue_id,
                venueName:
                    formData.venue_id === "none"
                        ? formData.custom_venue_name
                        : venueOptions.find((v) => v.id === Number(formData.venue_id))?.name,
                venue_name:
                    formData.venue_id === "none"
                        ? formData.custom_venue_name
                        : venueOptions.find((v) => v.id === Number(formData.venue_id))?.name,
                catering_details: {
                    type: formData.catering_type,
                    guest_count: Number(formData.guest_count),
                },
                staff_requirements: formData.require_staff ? formData.staff_requirements : {},
                total_cost: totalCost,
                image: selectedVenue.image,
            };

            setBookingData(submissionData);
            const response = await bookingAPI.checkAndReserve(submissionData);
            const bookingDataWithId = { ...submissionData, booking_id: response.data.booking_id || response.data.data?._id };
            setBookingData(bookingDataWithId);

            setShowSummaryModal(false);
            setBookingConfirmed(true);
            setShowInvoice(true);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to finalize booking request.");
        } finally {
            setLoading(false);
        }
    };

    const isEventDetailsComplete = Boolean(
        formData.phone_number &&
        formData.address &&
        formData.event_date &&
        (formData.is_full_day || (formData.start_time && formData.end_time))
    );

    const isVenueSelectionComplete = Boolean(
        formData.venue_id && !activeTimeConflict?.conflict
    );

    const stepItems = [
        { label: "Event Details", active: isEventDetailsComplete },
        { label: "Venue Selection", active: isVenueSelectionComplete },
        { label: "Review & Payment", active: showPaymentModal || bookingConfirmed },
        { label: "Confirmation", active: bookingConfirmed },
    ];

    if (!eventData) {
        return (
            <div className="booking-page-shell booking-empty-state">
                <button className="back-link" type="button" onClick={() => navigate(-1)}>
                    <ArrowLeft size={16} />
                    Back
                </button>
                <h1>Booking request unavailable</h1>
                <p>We could not load the event details for this request.</p>
            </div>
        );
    }

    return (
        <div className="booking-page-shell">
            <div className="booking-page-glow booking-page-glow-left" />
            <div className="booking-page-glow booking-page-glow-right" />

            <header className="booking-page-header">
                <div className="booking-header-copy">
                    <button onClick={() => navigate(-1)} className="back-link" type="button">
                        <ArrowLeft size={16} />
                        Back to Venues
                    </button>
                    <div className="booking-title-row">
                        <div className="booking-icon-badge">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h1>Book Your Event</h1>
                            <p>{eventData.subtitle || `Fill in your event details and secure the booking for ${eventData.title}.`}</p>
                        </div>
                    </div>
                </div>

                <div className="booking-stepper" aria-label="Booking progress">
                    {stepItems.map((step, index) => (
                        <div key={step.label} className={`booking-step ${step.active ? "is-active" : ""}`}>
                            <div className="booking-step-line" />
                            <div className="booking-step-circle">
                                <Check size={14} />
                            </div>
                            <span>{step.label}</span>
                            {index < stepItems.length - 1 && <div className="booking-step-line booking-step-line-right" />}
                        </div>
                    ))}
                </div>
            </header>

            <main className="booking-layout">
                <form id="booking-form" onSubmit={handleSubmit} className="booking-form">
                    <section className="form-section">
                        <div className="section-heading">
                            <span className="section-number">1</span>
                            <div>
                                <h2>Contact & Client Details</h2>
                                <p>Start with the contact information used for booking confirmation.</p>
                            </div>
                        </div>

                        <div className="form-grid form-grid-2">
                            <div className="field">
                                <label htmlFor="phone_number">Phone Number *</label>
                                <div className="input-icon">
                                    <Phone size={16} />
                                    <input
                                        id="phone_number"
                                        type="tel"
                                        name="phone_number"
                                        placeholder="Enter your phone number"
                                        value={formData.phone_number}
                                        onChange={handleInputChange}
                                        maxLength={10}
                                    />
                                </div>
                                {clientId && <small className="field-hint">Client ID: {clientId}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="address">Home Address *</label>
                                <div className="input-icon">
                                    <MapPin size={16} />
                                    <input
                                        id="address"
                                        type="text"
                                        name="address"
                                        placeholder="Enter your complete address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-heading">
                            <span className="section-number">2</span>
                            <div>
                                <h2>Event Schedule Setup</h2>
                                <p>Choose the day and time window for your booking.</p>
                            </div>
                        </div>

                        <div className="form-grid form-grid-2">
                            <div className="field">
                                <label htmlFor="event_date">Event Date *</label>
                                <div className="input-icon">
                                    <Calendar size={16} />
                                    <input
                                        id="event_date"
                                        type="date"
                                        name="event_date"
                                        value={formData.event_date}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>
                            </div>

                            <div className="field field-checkbox">
                                <label className="checkbox-pill">
                                    <input type="checkbox" name="is_full_day" checked={formData.is_full_day} onChange={handleInputChange} />
                                    <span>Book for Full Day</span>
                                </label>
                                <small className="field-hint">Your event will be booked for the entire day.</small>
                            </div>
                        </div>

                        {!formData.is_full_day && (
                            <div className="form-grid form-grid-2">
                                <div className="field">
                                    <label htmlFor="start_time">Start Time *</label>
                                    <div className="input-icon">
                                        <Clock size={16} />
                                        <input id="start_time" type="time" name="start_time" value={formData.start_time} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="field">
                                    <label htmlFor="end_time">End Time *</label>
                                    <div className="input-icon">
                                        <Clock size={16} />
                                        <input id="end_time" type="time" name="end_time" value={formData.end_time} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="form-section">
                        <div className="section-heading">
                            <span className="section-number">3</span>
                            <div>
                                <h2>Venue Selection</h2>
                                <p>Choose where you want to host your event.</p>
                            </div>
                        </div>

                        <div className="field">
                            <label>Program is at *</label>
                            <div className="venue-type-toggle">
                                <label className={`venue-type-card ${formData.is_home_event ? 'active' : ''}`}>
                                    <input type="radio" name="is_home_event" checked={formData.is_home_event} onChange={() => handleInputChange({ target: { name: 'is_home_event', type: 'checkbox', checked: true } })} />
                                    <div className="venue-type-icon"><Home size={20} /></div>
                                    <div className="venue-type-text">
                                        <strong>At Home</strong>
                                        <span>Host the event at your home address</span>
                                    </div>
                                    <div className="venue-type-radio"></div>
                                </label>
                                <label className={`venue-type-card ${!formData.is_home_event ? 'active' : ''}`}>
                                    <input type="radio" name="is_home_event" checked={!formData.is_home_event} onChange={() => handleInputChange({ target: { name: 'is_home_event', type: 'checkbox', checked: false } })} />
                                    <div className="venue-type-icon"><Building size={20} /></div>
                                    <div className="venue-type-text">
                                        <strong>At Venue</strong>
                                        <span>Host the event at a venue/ hall</span>
                                    </div>
                                    <div className="venue-type-radio"></div>
                                </label>
                            </div>
                        </div>

                        {formData.is_home_event && (
                            <div className="home-event-types-section" style={{ marginTop: "24px" }}>
                                <label style={{ display: "block", marginBottom: "12px", fontWeight: "700", color: "#374151", fontSize: "0.95rem" }}>Select Event Type / Occasion <span style={{ color: "#ef4444" }}>*</span></label>
                                <div className="event-type-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px" }}>
                                    {[
                                        { id: "birthday", label: "Birthday Party", icon: Gift },
                                        { id: "wedding", label: "Wedding (At Home)", icon: Heart },
                                        { id: "anniversary", label: "Anniversary", icon: Heart },
                                        { id: "engagement", label: "Engagement", icon: Users },
                                        { id: "baby_shower", label: "Baby Shower", icon: Baby },
                                        { id: "housewarming", label: "Housewarming", icon: Home },
                                        { id: "festival_puja", label: "Festival / Puja", icon: Flame },
                                        { id: "corporate", label: "Corporate Event", icon: Briefcase },
                                        { id: "naming", label: "Naming Ceremony", icon: UserPlus },
                                        { id: "get_together", label: "Get Together", icon: Users },
                                        { id: "haldi_mehendi", label: "Haldi / Mehendi", icon: Sparkles },
                                        { id: "other", label: "Other", icon: MoreHorizontal },
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        const isActive = formData.home_event_type === type.id;
                                        return (
                                            <label key={type.id} className={`event-type-card ${isActive ? 'active' : ''}`} style={{
                                                display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
                                                border: isActive ? "2px solid #ea580c" : "1px solid #e2e8f0",
                                                borderRadius: "12px", cursor: "pointer", background: isActive ? "#fff7ed" : "#fff",
                                                color: isActive ? "#5b21b6" : "#475569", fontWeight: isActive ? "700" : "600",
                                                transition: "all 0.2s ease"
                                            }}>
                                                <input
                                                    type="radio"
                                                    name="home_event_type"
                                                    value={type.id}
                                                    checked={isActive}
                                                    onChange={handleInputChange}
                                                    style={{ display: "none" }}
                                                />
                                                <Icon size={18} />
                                                <span style={{ flex: 1, fontSize: "0.85rem" }}>{type.label}</span>
                                                {isActive && <div style={{ width: "16px", height: "16px", borderRadius: "50%", background: "#ea580c", border: "4px solid #ede9fe" }}></div>}
                                            </label>
                                        );
                                    })}
                                </div>

                                {formData.home_event_type === "other" && (
                                    <div className="field" style={{ marginTop: "20px" }}>
                                        <label htmlFor="other_home_event_type">Other Event Type (Please Specify)</label>
                                        <input
                                            id="other_home_event_type"
                                            type="text"
                                            name="other_home_event_type"
                                            placeholder="e.g. Retirement Party, Farewell, Kitty Party etc."
                                            value={formData.other_home_event_type}
                                            onChange={handleInputChange}
                                            style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", marginTop: "8px" }}
                                        />
                                    </div>
                                )}

                                <div className="home-event-details-panel" style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #e2e8f0" }}>
                                    <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>Home Event Details</h3>
                                    <div className="form-grid form-grid-2">
                                        <div className="field">
                                            <label htmlFor="home_indoor_outdoor">Indoor / Outdoor <span style={{ color: "#ef4444" }}>*</span></label>
                                            <select id="home_indoor_outdoor" name="home_indoor_outdoor" value={formData.home_indoor_outdoor} onChange={handleInputChange} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", width: "100%", background: "#fff", color: "#0f172a", fontSize: "0.95rem" }}>
                                                <option value="Indoor">Indoor</option>
                                                <option value="Outdoor">Outdoor</option>
                                                <option value="Both">Both</option>
                                            </select>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="home_expected_attendance">Expected Guests <span style={{ color: "#ef4444" }}>*</span></label>
                                            <div className="input-icon">
                                                <Users size={16} />
                                                <input id="home_expected_attendance" type="number" name="home_expected_attendance" value={formData.home_expected_attendance} onChange={handleInputChange} min="1" placeholder="e.g. 150" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field" style={{ marginTop: "24px" }}>
                                        <label htmlFor="home_special_notes">Special Notes / Instructions</label>
                                        <textarea id="home_special_notes" name="home_special_notes" value={formData.home_special_notes} onChange={handleInputChange} rows="3" placeholder="Please arrange stage in living area and dining arrangement for 150 guests." style={{ padding: "16px", borderRadius: "12px", border: "1px solid #cbd5e1", width: "100%", background: "#fff", resize: "vertical", color: "#0f172a", fontFamily: "inherit" }}></textarea>
                                    </div>
                                </div>

                                <div className="home-setup-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #e2e8f0" }}>
                                    <div className="setup-requirements">
                                        <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>Event Setup Requirements</h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                                            {["Stage Required", "Decoration Required", "Sound System", "Backup Generator", "Lighting Required", "Dance Floor", "Seating Arrangement", "Others (Specify)"].map(setup => (
                                                <label key={setup} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", color: "#334155" }}>
                                                    <input type="checkbox" checked={formData.home_setup_requirements.includes(setup)} onChange={() => handleSetupChange(setup)} style={{ width: "20px", height: "20px", accentColor: "#ea580c", borderRadius: "6px", cursor: "pointer" }} />
                                                    <span style={{ fontWeight: formData.home_setup_requirements.includes(setup) ? "700" : "500", fontSize: "0.95rem" }}>{setup}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {formData.home_setup_requirements.includes("Others (Specify)") && (
                                            <div className="field" style={{ marginTop: "20px" }}>
                                                <input type="text" name="home_other_setup" placeholder="Please specify other requirements" value={formData.home_other_setup} onChange={handleInputChange} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", width: "100%" }} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="site-inspection">
                                        <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>Site Inspection (Recommended)</h3>
                                        <div style={{ padding: "24px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0", height: "calc(100% - 40px)", display: "flex", flexDirection: "column" }}>
                                            <p style={{ color: "#475569", fontSize: "0.95rem", marginBottom: "auto", lineHeight: "1.6" }}>We recommend a site visit to better understand your space and requirements.</p>
                                            <button type="button" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", border: "1.5px solid #ea580c", color: "#ea580c", background: "#ffffff", borderRadius: "10px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s", marginTop: "24px" }} onMouseOver={e => e.currentTarget.style.background = "#fff7ed"} onMouseOut={e => e.currentTarget.style.background = "#ffffff"}>
                                                <CalendarCheck size={18} /> Schedule Site Visit
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="home-services-section" style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid #e2e8f0" }}>
                                    <h3 style={{ marginBottom: "20px", color: "#1e293b", fontSize: "1.15rem", fontWeight: "700" }}>Select Services (Optional)</h3>
                                    <div className="event-type-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
                                        {[
                                            { id: "Catering", icon: ChefHat },
                                            { id: "Photography", icon: Camera },
                                            { id: "Videography", icon: Video },
                                            { id: "DJ / Music", icon: Music },
                                            { id: "Makeup", icon: Brush },
                                            { id: "Security Staff", icon: Shield },
                                            { id: "Cleaning Staff", icon: CheckCircle },
                                            { id: "Event Anchor", icon: Mic },
                                            { id: "Mehendi Artist", icon: PenTool },
                                            { id: "Others", icon: MoreHorizontal },
                                        ].map(service => {
                                            const Icon = service.icon;
                                            const isActive = formData.home_services.includes(service.id);
                                            return (
                                                <label key={service.id} className={`event-type-card ${isActive ? 'active' : ''}`} style={{
                                                    display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px",
                                                    border: isActive ? "2px solid #ea580c" : "1px solid #e2e8f0",
                                                    borderRadius: "12px", cursor: "pointer", background: isActive ? "#fff7ed" : "#fff",
                                                    color: isActive ? "#5b21b6" : "#475569", fontWeight: isActive ? "700" : "600",
                                                    transition: "all 0.2s ease"
                                                }}>
                                                    <input type="checkbox" checked={isActive} onChange={() => handleServiceChange(service.id)} style={{ display: "none" }} />
                                                    <Icon size={18} />
                                                    <span style={{ flex: 1, fontSize: "0.9rem" }}>{service.id}</span>
                                                    {isActive && <CheckCircle size={18} color="#ea580c" fill="#ede9fe" />}
                                                    {!isActive && <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px solid #cbd5e1" }}></div>}
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {formData.home_services.includes("Others") && (
                                        <div className="field" style={{ marginTop: "20px" }}>
                                            <input type="text" name="home_other_services" placeholder="Specify other services" value={formData.home_other_services} onChange={handleInputChange} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #cbd5e1", width: "100%" }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!formData.is_home_event && (
                            <div className="selected-venue-box">
                                <label>Selected Venue *</label>
                                <div className="venue-box-content">
                                    <img src={selectedVenue.image} alt={selectedVenue.name} />
                                    <div className="venue-box-details">
                                        <strong>{selectedVenue.name}</strong>
                                        <p><MapPin size={14} /> {selectedVenue.location}</p>
                                        <div className={`venue-status-pill ${activeTimeConflict?.conflict ? "is-blocked" : "is-available"}`}>
                                            <Check size={14} />
                                            <span>{activeTimeConflict?.conflict ? "Venue conflict" : "Venue Available"}</span>
                                            <small>{formData.event_date ? formatDisplayDate(formData.event_date) : "Select a date"} • {formData.start_time} - {formData.end_time}</small>
                                        </div>
                                    </div>
                                    <button type="button" className="change-venue-btn" onClick={() => navigate('/client/browse-venues', { state: { prefilter: eventData.title } })}>
                                        <Edit2 size={14} /> Change Venue
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="form-section">
                        <div className="section-heading section-heading-split">
                            <div>
                                <span className="section-number">4</span>
                                <div>
                                    <h2>Catering & Guests</h2>
                                    <p>Pick the food package and expected guest count.</p>
                                </div>
                            </div>
                            <div className="section-action">
                                <span className="section-action-icon">
                                    <ChefHat size={16} />
                                </span>
                            </div>
                        </div>

                        <div className="form-grid form-grid-2">
                            <div className="field">
                                <label htmlFor="catering_type">Catering Type *</label>
                                <div className="input-icon">
                                    <ChefHat size={16} />
                                    <select id="catering_type" name="catering_type" value={formData.catering_type} onChange={handleInputChange}>
                                        <option value="">Select catering type</option>
                                        {cateringOptions.map((catering) => (
                                            <option key={catering.id} value={catering.id}>
                                                {catering.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="guest_count">Number of Guests *</label>
                                <div className="guest-combo">
                                    <div className="input-icon">
                                        <Users size={16} />
                                        <input
                                            id="guest_count"
                                            type="number"
                                            name="guest_count"
                                            placeholder="Enter number of guests"
                                            value={formData.guest_count}
                                            onChange={handleInputChange}
                                            min="1"
                                        />
                                    </div>
                                    <select className="guest-range" onChange={handleGuestRangeChange} defaultValue="">
                                        <option value="" disabled>
                                            Quick range
                                        </option>
                                        {guestRangeOptions.map((range) => (
                                            <option key={range.label} value={range.value}>
                                                {range.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="form-section">
                        <div className="section-heading section-heading-split">
                            <div>
                                <span className="section-number">5</span>
                                <div>
                                    <h2>Staff Requirements</h2>
                                    <p>Optional support for operations and coordination.</p>
                                </div>
                            </div>
                            <label className="checkbox-pill">
                                <input type="checkbox" name="require_staff" checked={formData.require_staff} onChange={handleInputChange} />
                                <span>Add Staffing Support</span>
                            </label>
                        </div>

                        {formData.require_staff ? (
                            <>
                                {!formData.guest_count && (
                                    <div className="inline-note">
                                        <Info size={16} />
                                        <p>Provide a guest count above and we will suggest a starting staff allocation.</p>
                                    </div>
                                )}

                                <div className="staff-grid">
                                    {staffTypes.map((staff) => (
                                        <div className="staff-card" key={staff.id}>
                                            <div className="staff-card-copy">
                                                <strong>{staff.name}</strong>
                                                <span>{formatMoney(staff.pricePerHead)} each</span>
                                            </div>
                                            <input
                                                type="number"
                                                min="0"
                                                value={formData.staff_requirements[staff.id] || 0}
                                                onChange={(e) => handleStaffChange(staff.id, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="staff-disabled">
                                <p>Staff requirements skipped. Turn on support if your event needs manual operations assistance.</p>
                            </div>
                        )}
                    </section>

                    {error && (
                        <div className="alert alert-error">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <Check size={18} />
                            <span>{success}</span>
                        </div>
                    )}

                    <section className="form-section">
                        <div className="section-heading">
                            <span className="section-number">6</span>
                            <div>
                                <h2>Live Venue Occupancy Calendar</h2>
                            </div>
                        </div>

                        <LiveVenueCalendar
                            selectedDate={formData.event_date}
                            onDateSelect={(date) => handleInputChange({ target: { name: 'event_date', value: date } })}
                        />
                    </section>
                </form>

                <aside className="booking-sidebar">
                    {formData.is_home_event ? (
                        <div className="home-sidebar-wrapper">
                            <div className="home-sidebar-pill">
                                <Home size={14} /> <span>AT HOME</span>
                            </div>

                            <div className="home-sidebar-summary">
                                <div className="home-sidebar-img-wrapper">
                                    <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" alt="Home Venue" />
                                </div>
                                <div className="home-sidebar-meta">
                                    <div className="meta-row">
                                        <span className="meta-label">Event Type</span>
                                        <strong className="meta-value event-type">
                                            {formData.home_event_type ? formData.home_event_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) : "Event Type"}
                                        </strong>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label"><Calendar size={14} /> Event Date & Time</span>
                                        <span className="meta-value">
                                            {formData.event_date ? formatDisplayDate(formData.event_date) : "TBD"}, {formData.is_full_day ? "Full Day" : `${formData.start_time || "10:00 AM"} - ${formData.end_time || "06:00 PM"}`}
                                        </span>
                                    </div>
                                    <div className="meta-row">
                                        <span className="meta-label"><MapPin size={14} /> Location</span>
                                        <span className="meta-value">{formData.address || "Address not provided"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="home-cost-breakdown-card">
                                <h3 className="cost-title">Cost Details</h3>
                                <div className="cost-table">
                                    <div className="cost-header">
                                        <span>Description</span>
                                        <span>Amount (₹)</span>
                                    </div>

                                    <div className="cost-row">
                                        <div className="cost-info">
                                            <div className="cost-icon"><Briefcase size={14} /></div>
                                            <div>
                                                <strong>Base Package (Home Event)</strong>
                                                <span>Event planning & management</span>
                                            </div>
                                        </div>
                                        <strong className="cost-amt">{formatMoney(BASE_PACKAGE_PRICE)}</strong>
                                    </div>

                                    {formData.home_setup_requirements.length > 0 && (
                                        <div className="cost-row">
                                            <div className="cost-info">
                                                <div className="cost-icon"><Truck size={14} /></div>
                                                <div>
                                                    <strong>Setup & Logistics Requirements</strong>
                                                    <span>{formData.home_setup_requirements.join(", ")}</span>
                                                </div>
                                            </div>
                                            <strong className="cost-amt">{formatMoney(getHomeSetupCost())}</strong>
                                        </div>
                                    )}

                                    {formData.home_services.length > 0 && (
                                        <div className="cost-row">
                                            <div className="cost-info">
                                                <div className="cost-icon"><Sparkles size={14} /></div>
                                                <div>
                                                    <strong>Optional Services</strong>
                                                    <span>{formData.home_services.join(", ")}</span>
                                                </div>
                                            </div>
                                            <strong className="cost-amt">{formatMoney(getHomeServicesCost())}</strong>
                                        </div>
                                    )}

                                    {formData.catering_type && formData.guest_count && getCateringCost() > 0 && (
                                        <div className="cost-row">
                                            <div className="cost-info">
                                                <div className="cost-icon"><ChefHat size={14} /></div>
                                                <div>
                                                    <strong>Catering Services</strong>
                                                    <span>Food and beverage for {formData.guest_count} guests</span>
                                                </div>
                                            </div>
                                            <strong className="cost-amt">{formatMoney(getCateringCost())}</strong>
                                        </div>
                                    )}

                                    {formData.require_staff && getStaffCost() > 0 && (
                                        <div className="cost-row">
                                            <div className="cost-info">
                                                <div className="cost-icon"><Users size={14} /></div>
                                                <div>
                                                    <strong>Staff Support</strong>
                                                    <span>Manpower, servers & coordination</span>
                                                </div>
                                            </div>
                                            <strong className="cost-amt">{formatMoney(getStaffCost())}</strong>
                                        </div>
                                    )}
                                </div>

                                <div className="cost-total-row">
                                    <span>Total Cost</span>
                                    <strong>{formatMoney(totalCost)}</strong>
                                </div>
                            </div>

                            <div className="home-deposit-card">
                                <div className="deposit-info">
                                    <CalendarCheck size={24} color="#ea580c" />
                                    <div>
                                        <strong>30% Advance Deposit Due</strong>
                                        <span>Secure your booking by paying advance</span>
                                    </div>
                                </div>
                                <strong className="deposit-amount">{formatMoney(advanceDeposit)}</strong>
                            </div>

                            <div className="home-inclusions-card">
                                <strong>What's Included in Home Setup?</strong>
                                <div className="inclusions-grid">
                                    <span><Check size={14} color="#22c55e" /> Manpower & Coordination</span>
                                    <span><Check size={14} color="#22c55e" /> Basic Furniture Setup</span>
                                    <span><Check size={14} color="#22c55e" /> Sound & Lighting Basic Setup</span>
                                    <span><Check size={14} color="#22c55e" /> On-site Management</span>
                                    <span><Check size={14} color="#22c55e" /> Utilities & Support</span>
                                </div>
                            </div>

                            <div className="home-note-card">
                                <Info size={16} color="#d97706" />
                                <p><strong>Note:</strong> Final cost may vary based on guest count, additional services, customizations and on-site requirements.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <section className="summary-card summary-venue">
                                <div className="summary-heading">
                                    <div>
                                        <span className="summary-kicker">Selected Venue</span>
                                        <h3>{selectedVenue.name}</h3>
                                    </div>
                                </div>

                                <img className="venue-image" src={selectedVenue.image} alt={selectedVenue.name} />
                                <div className="venue-meta">
                                    <h4>{selectedVenue.name}</h4>
                                    <p>
                                        <MapPin size={14} />
                                        <span>{selectedVenue.location}</span>
                                    </p>
                                </div>

                                <div className={`venue-status ${activeTimeConflict?.conflict ? "is-blocked" : "is-available"}`}>
                                    <div className="venue-status-row">
                                        <Check size={16} />
                                        <span>{activeTimeConflict?.conflict ? "Venue conflict detected" : "Venue available"}</span>
                                    </div>
                                    <p>
                                        {formData.event_date ? formatDisplayDate(formData.event_date) : "Select a date"}{" "}
                                        {formData.is_full_day ? " - Full Day" : formData.start_time && formData.end_time ? ` - ${formData.start_time} to ${formData.end_time}` : ""}
                                    </p>
                                </div>

                                <div className="program-is-at-summary" style={{ marginTop: '24px' }}>
                                    <h4 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>Program is at</h4>
                                    <div className="program-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: '#fff7ed', color: '#ea580c', borderRadius: '12px', fontWeight: '700' }}>
                                        <Building size={18} />
                                        <span>At Venue</span>
                                    </div>
                                </div>
                            </section>

                            <section className="summary-card">
                                <div className="summary-heading">
                                    <div>
                                        <span className="summary-kicker">Cost Breakdown</span>
                                        <h3>Review your estimate</h3>
                                    </div>
                                </div>

                                <div className="breakdown-list">
                                    <div className="breakdown-row">
                                        <span>Base Package</span>
                                        <strong>{formatMoney(BASE_PACKAGE_PRICE)}</strong>
                                    </div>
                                    <div className="breakdown-row">
                                        <span>Venue Logistics Fee</span>
                                        <strong>{getVenuePrice() > 0 ? formatMoney(getVenuePrice()) : formatMoney(0)}</strong>
                                    </div>
                                    <div className="breakdown-note">Custom / Home venue</div>
                                    <div className="breakdown-row">
                                        <span>Catering</span>
                                        <strong>{formData.catering_type && formData.guest_count ? formatMoney(getCateringCost()) : formatMoney(0)}</strong>
                                    </div>
                                    <div className="breakdown-row">
                                        <span>Staff Support</span>
                                        <strong>{formData.require_staff ? formatMoney(getStaffCost()) : formatMoney(0)}</strong>
                                    </div>
                                </div>

                                <div className="total-card">
                                    <span>Total Cost</span>
                                    <strong>{formatMoney(totalCost)}</strong>
                                </div>

                                <div className="deposit-card">
                                    <p>30% Advance Deposit Due</p>
                                    <strong>{formatMoney(advanceDeposit)}</strong>
                                </div>
                            </section>
                        </>
                    )}

                    <div className="cta-stack">
                        <button type="submit" form="booking-form" className="cta-primary" disabled={loading} onClick={() => setBookingType("pay_now")}>
                            {loading && bookingType === "pay_now" ? <Loader size={18} className="spin" /> : <ArrowRight size={18} />}
                            <span>Proceed to Payment</span>
                            <small>Pay advance & confirm your booking</small>
                        </button>

                        <button type="submit" form="booking-form" className="cta-secondary" disabled={loading} onClick={() => setBookingType("pay_later")}>
                            {loading && bookingType === "pay_later" ? <Loader size={18} className="spin" /> : <Calendar size={18} />}
                            <span>Book Now</span>
                            <small>Book now & pay later</small>
                        </button>
                    </div>

                </aside>
            </main>

            <footer className="payment-strip">
                <div className="security-copy">
                    <ShieldCheck size={28} />
                    <div>
                        <strong>Secure & Hassle-Free Booking</strong>
                        <p>Your advance payment is 100% secure. You can cancel your booking as per our cancellation policy.</p>
                    </div>
                </div>
                <div className="payment-logos">
                    <span className="pay-brand">Razorpay</span>
                    <span className="pay-brand visa">VISA</span>
                    <span className="pay-brand mc"><div className="mc-red"></div><div className="mc-yellow"></div></span>
                    <span className="pay-brand upi">UPI</span>
                </div>
            </footer>

            {showSummaryModal && (
                <div className="summary-modal-overlay">
                    <div className="summary-modal-content" ref={summaryRef}>
                        <div className="summary-modal-header">
                            <div>
                                <h2>
                                    <ClipboardList size={22} color="#ea580c" />
                                    Booking Summary
                                </h2>
                                <p>Please review your booking before payment.</p>
                            </div>
                            <div className="summary-modal-header-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                    className="summary-download-btn"
                                    onClick={handleDownloadSummary}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        border: '1px solid #fdba74',
                                        background: 'transparent',
                                        color: '#9a3412',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fff7ed'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Download size={16} /> Download
                                </button>
                                <button className="summary-close-btn" onClick={() => setShowSummaryModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="summary-modal-body">
                            {/* Event Details */}
                            <div className="summary-section">
                                <div className="summary-section-title">
                                    <Calendar size={16} />
                                    <strong>Event Details</strong>
                                </div>
                                <div className="summary-grid">
                                    <div className="summary-grid-row">
                                        <span>Event Type</span>
                                        <strong>
                                            {formData.is_home_event
                                                ? formData.home_event_type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                                                : eventData?.title || "General Event"}
                                        </strong>
                                    </div>
                                    <div className="summary-grid-row">
                                        <span>Event Location</span>
                                        <strong>{formData.is_home_event ? "Home" : venueOptions.find((v) => v.id === Number(formData.venue_id))?.name || "Venue"}</strong>
                                    </div>
                                    <div className="summary-grid-row">
                                        <span>Event Date</span>
                                        <strong>{formData.event_date ? formatDisplayDate(formData.event_date) : ""}</strong>
                                    </div>
                                    <div className="summary-grid-row">
                                        <span>Time</span>
                                        <strong>{formData.is_full_day ? "Full Day" : `${formData.start_time} - ${formData.end_time}`}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Client Details */}
                            <div className="summary-section">
                                <div className="summary-section-title">
                                    <User size={16} />
                                    <strong>Client Details</strong>
                                </div>
                                <div className="summary-grid">
                                    <div className="summary-grid-row">
                                        <span>Name</span>
                                        <strong>{loggedInUser.name || loggedInUser.firstName || "Client Name"}</strong>
                                    </div>
                                    <div className="summary-grid-row">
                                        <span>Phone</span>
                                        <strong>{formData.phone_number}</strong>
                                    </div>
                                </div>
                            </div>

                            {/* Services Selected */}
                            <div className="summary-section">
                                <div className="summary-section-title">
                                    <CheckCircle size={16} />
                                    <strong>Services Selected</strong>
                                </div>
                                <div className="summary-services-list">
                                    {formData.catering_type && formData.guest_count > 0 && (
                                        <div className="summary-service-item">
                                            <Check size={16} color="#22c55e" />
                                            <span>Catering</span>
                                        </div>
                                    )}
                                    {formData.require_staff && formData.guest_count > 0 && (
                                        <div className="summary-service-item">
                                            <Check size={16} color="#22c55e" />
                                            <span>Staff Support</span>
                                        </div>
                                    )}
                                    {formData.is_home_event && formData.home_setup_requirements.map(req => (
                                        <div className="summary-service-item" key={req}>
                                            <Check size={16} color="#22c55e" />
                                            <span>{req}</span>
                                        </div>
                                    ))}
                                    {formData.is_home_event && formData.home_services.map(req => (
                                        <div className="summary-service-item" key={req}>
                                            <Check size={16} color="#22c55e" />
                                            <span>{req}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cost Summary */}
                            <div className="summary-section summary-cost-section">
                                <div className="summary-section-title">
                                    <CreditCard size={16} />
                                    <strong>Cost Summary</strong>
                                </div>
                                <div className="summary-cost-row total-cost">
                                    <span>Total Cost</span>
                                    <strong>{formatMoney(totalCost)}</strong>
                                </div>
                                <div className="summary-cost-row advance-cost">
                                    <span>Advance Payment (30%)</span>
                                    <strong>{formatMoney(advanceDeposit)}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="summary-modal-actions">
                            <button className="summary-edit-btn" onClick={() => setShowSummaryModal(false)}>
                                <ArrowLeft size={16} />
                                Edit Booking
                            </button>
                            {bookingType === "pay_now" ? (
                                <button className="summary-confirm-btn" onClick={confirmAndPay} disabled={loading}>
                                    {loading ? <Loader size={16} className="spin" /> : "Confirm & Proceed to Payment"}
                                    {!loading && <ArrowRight size={16} />}
                                </button>
                            ) : (
                                <button className="summary-confirm-btn" onClick={confirmPayLater} disabled={loading}>
                                    {loading ? <Loader size={16} className="spin" /> : "Confirm Booking (Pay Later)"}
                                    {!loading && <Check size={16} />}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showPaymentModal && !bookingConfirmed && (
                <RazorpayPayment
                    bookingData={bookingData}
                    advanceAmount={(bookingData.total_cost * 0.3).toFixed(2)}
                    onPaymentSuccess={(data) => {
                        setPaymentData(data);
                        setShowInvoice(true);
                        setShowPaymentModal(false);
                        setBookingConfirmed(true);
                    }}
                    onPaymentClose={() => setShowPaymentModal(false)}
                />
            )}

            {showInvoice && bookingData && (
                <Invoice
                    bookingData={bookingData}
                    paymentData={paymentData}
                    onClose={() => {
                        setShowInvoice(false);
                        navigate("/client/my-bookings");
                    }}
                />
            )}
        </div>
    );
}
