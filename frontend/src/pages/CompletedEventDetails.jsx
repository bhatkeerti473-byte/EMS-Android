import { useLocation, useNavigate } from "react-router-dom";
import { Star, ArrowLeft, MessageCircle, Users, Utensils, Building2, Briefcase } from "lucide-react";

const completedEvents = [
    {
        id: 1,
        title: "Ragu Dixit Live Concert",
        place: "Kapu Beach, Udupi",
        time: "Completed: 25 July",
        rating: 5,
        services: ["Sound & Lighting", "Security Staff", "Crowd Management"],
        gradient: "from-fuchsia-500 via-violet-500 to-indigo-600",
        image: "/home/raguDixitMusic.png",
        serviceDetails: {
            vendors: [{ name: "SoundWave Studios", type: "Sound & Lighting" }],
            venue: { name: "Kapu Beach Resort", type: "Outdoor Venue" },
            staff: [{ name: "Security Pro Team", type: "Security Staff" }, { name: "Crowd Masters", type: "Crowd Management" }],
            catering: [{ name: "Coastal Delights", type: "Beverages & Snacks" }],
        },
        feedback: [
            {
                id: 1,
                name: "Priya",
                avatar: "PS",
                rating: 5,
                date: "25 July 2024",
                comment: "Absolutely amazing event! The sound quality was crystal clear and the security team was very professional. The whole experience was unforgettable!",
            },
        ],
    },
    {
        id: 2,
        title: "Global Business Summit",
        place: "Ocean View Hall, Mangalore",
        time: "Completed: 05 July",
        rating: 4.8,
        services: ["Corporate Catering", "VIP Seating", "Audio/Visual Setup"],
        gradient: "from-cyan-500 via-sky-500 to-blue-600",
        image: "/home/businessconference.png",
        serviceDetails: {
            vendors: [{ name: "TechVisuals Pro", type: "Audio/Visual Setup" }],
            venue: { name: "Ocean View Hall", type: "Conference Center" },
            staff: [{ name: "Event Coordinators Plus", type: "Event Management" }],
            catering: [{ name: "Corporate Catering Co.", type: "Gourmet Catering" }, { name: "Premium Beverages", type: "Bar Service" }],
        },
        feedback: [
            {
                id: 1,
                name: "Vikram Patel",
                avatar: "VP",
                rating: 4.8,
                date: "05 July 2024",
                comment: "Professional and well-executed. The AV setup was flawless and catering was excellent. Great attention to detail.",
            },
        ],
    },
    {
        id: 3,
        title: "Royal Wedding Gala",
        place: "Palace Garden, Udupi",
        time: "Completed: 12 July",
        rating: 5,
        services: ["Luxury Catering", "Premium Seating & Decor", "Guest Registry"],
        gradient: "from-amber-400 via-orange-500 to-rose-500",
        image: "/home/weddingshowcase.png",
        serviceDetails: {
            vendors: [{ name: "Royal Decor Artistry", type: "Decoration & Design" }],
            venue: { name: "Palace Garden Estate", type: "Wedding Venue" },
            staff: [{ name: "Wedding Coordinators Elite", type: "Event Management" }, { name: "Hospitality Plus", type: "Guest Services" }],
            catering: [{ name: "Maharaja Kitchens", type: "Luxury Catering" }, { name: "Premium Bar Service", type: "Beverages" }],
        },
        feedback: [
            {
                id: 1,
                name: "Divya & Arjun",
                avatar: "DA",
                rating: 5,
                date: "12 July 2024",
                comment: "Our wedding was absolutely perfect! Every detail was beautifully executed. The catering was exquisite and the decor took our breath away.",
            },
        ],
    },
    {
        id: 4,
        title: "Amani Ramani Cultural Fest",
        place: "Town Hall, Udupi",
        time: "Completed: 20 July",
        rating: 4.7,
        services: ["Stage Management", "Catering", "Seating & House Staff"],
        gradient: "from-emerald-400 via-lime-500 to-green-600",
        image: "/home/Amaniramani-hall.png",
        serviceDetails: {
            vendors: [{ name: "Stage Pro Systems", type: "Stage Management" }],
            venue: { name: "Town Hall Convention Center", type: "Community Venue" },
            staff: [{ name: "Community Event Staff", type: "Event Support" }, { name: "Seating Arrangements Co.", type: "Logistics" }],
            catering: [{ name: "Local Flavors Catering", type: "Traditional Cuisine" }],
        },
        feedback: [
            {
                id: 1,
                name: "Suresh Rao",
                avatar: "SR",
                rating: 4.8,
                date: "20 July 2024",
                comment: "Wonderful cultural event! The stage setup was professional and the catering offered excellent local cuisine options.",
            },
        ],
    },
];

export default function CompletedEventDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const eventId = new URLSearchParams(location.search).get("id");

    const event = completedEvents.find((e) => e.id === Number(eventId)) || completedEvents[0];
    const clientReview = event.feedback[0];

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < Math.floor(rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < rating
                            ? "fill-amber-200 text-amber-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                />
            );
        }
        return stars;
    };

    return (
        <div className="max-h-screen min-h-screen overflow-hidden bg-[#f5f1ec] flex flex-col">
            {/* Header */}
            <div className="border-b border-black/5 bg-white shrink-0">
                <div className="mx-auto max-w-[1440px] px-6 py-4 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="mb-1 flex items-center gap-1.5 text-xs font-bold text-pink-500 transition hover:text-pink-600"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Home
                        </button>
                        <h1 className="text-2xl font-black text-slate-950 tracking-tight">Event Summary Details</h1>
                    </div>
                </div>
            </div>

            {/* Main Container Viewport */}
            <div className="flex-1 mx-auto w-full max-w-[1440px] px-6 py-5 overflow-hidden">
                {/* Changed layout context to items-stretch to enforce identical box sizing layout */}
                <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr_1.1fr] h-full items-stretch">

                    {/* Card 1: Event Summary */}
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] h-full">
                        <div className="relative h-48 overflow-hidden shrink-0">
                            <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-35`} />
                        </div>
                        <div className="p-5 flex flex-col flex-1 justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-950 leading-snug">{event.title}</h2>
                                <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{event.place}</p>
                                <p className="mt-1 text-[11px] text-slate-500">{event.time}</p>
                            </div>

                            <div className="mt-3 flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 shrink-0">
                                <div className="flex gap-0.5">{renderStars(event.rating)}</div>
                                <span className="text-xs font-bold text-slate-700">{event.rating} / 5</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Services Specs */}
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] space-y-3 h-full flex flex-col justify-between overflow-y-auto">
                        <h3 className="text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-2 shrink-0">
                            <Briefcase className="h-4 w-4 text-pink-500" />
                            Services Specifications
                        </h3>

                        <div className="flex-1 space-y-3.5">
                            {/* Venue */}
                            <div>
                                <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <Building2 className="h-3.5 w-3.5 text-blue-500" />
                                    Venue Location
                                </h4>
                                <div className="rounded-xl bg-blue-50/70 p-2 border border-blue-100/40">
                                    <p className="text-xs font-bold text-slate-900">{event.serviceDetails.venue.name}</p>
                                    <p className="text-[10px] text-slate-600">{event.serviceDetails.venue.type}</p>
                                </div>
                            </div>

                            {/* Vendors */}
                            <div>
                                <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <Briefcase className="h-3.5 w-3.5 text-purple-500" />
                                    Assigned Vendors
                                </h4>
                                <div className="space-y-1.5">
                                    {event.serviceDetails.vendors.map((vendor) => (
                                        <div key={vendor.name} className="rounded-xl bg-purple-50/70 p-2 border border-purple-100/40">
                                            <p className="text-xs font-bold text-slate-900">{vendor.name}</p>
                                            <p className="text-[10px] text-slate-600">{vendor.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Staff */}
                            <div>
                                <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <Users className="h-3.5 w-3.5 text-green-500" />
                                    Management Staff
                                </h4>
                                <div className="space-y-1.5">
                                    {event.serviceDetails.staff.map((staff) => (
                                        <div key={staff.name} className="rounded-xl bg-green-50/70 p-2 border border-green-100/40">
                                            <p className="text-xs font-bold text-slate-900">{staff.name}</p>
                                            <p className="text-[10px] text-slate-600">{staff.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Catering */}
                            <div>
                                <h4 className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                    <Utensils className="h-3.5 w-3.5 text-orange-500" />
                                    Catering Logistics
                                </h4>
                                <div className="space-y-1.5">
                                    {event.serviceDetails.catering.map((catering) => (
                                        <div key={catering.name} className="rounded-xl bg-orange-50/70 p-2 border border-orange-100/40">
                                            <p className="text-xs font-bold text-slate-900">{catering.name}</p>
                                            <p className="text-[10px] text-slate-600">{catering.type}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Client Feedback Summary */}
                    <div className="rounded-2xl border border-black/6 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] h-full flex flex-col">
                        <h3 className="mb-4 text-base font-bold text-slate-950 flex items-center gap-2 border-b border-slate-100 pb-2 shrink-0">
                            <MessageCircle className="h-4 w-4 text-pink-500" />
                            Client Review
                        </h3>

                        <div className="flex-1">
                            {clientReview ? (
                                <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 h-fit">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-purple-500 text-xs font-bold text-white shrink-0">
                                            {clientReview.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-950">{clientReview.name}</p>
                                            <p className="text-[10px] text-slate-400">{clientReview.date}</p>
                                        </div>
                                    </div>

                                    <div className="mb-2.5 flex gap-0.5">{renderStars(clientReview.rating)}</div>
                                    <p className="text-xs leading-5 text-slate-600 italic">
                                        "{clientReview.comment}"
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xs text-slate-400">No verification report submitted yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}