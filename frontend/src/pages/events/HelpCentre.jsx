import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    BookOpen,
    Calendar,
    Users,
    CreditCard,
    LifeBuoy,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Mail,
    MessageSquare,
    ExternalLink
} from "lucide-react";

function HelpCentre() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaq, setOpenFaq] = useState(null);

    const categories = [
        {
            id: "getting-started",
            title: "Getting Started",
            icon: BookOpen,
            description: "Learn the basics of creating events, managing schedules, and navigating your workspace.",
            count: 5
        },
        {
            id: "event-planning",
            title: "Event & Scheduling",
            icon: Calendar,
            description: "How to set up milestones, update venue layouts, and customize event configuration timers.",
            count: 8
        },
        {
            id: "team-attendees",
            title: "Teams & Attendees",
            icon: Users,
            description: "Manage permissions, assign roles, and handle attendee registration lists seamlessly.",
            count: 6
        },
        {
            id: "billing-resources",
            title: "Billing & Resources",
            icon: CreditCard,
            description: "Track external vendor payments, configure equipment inventories, and download invoices.",
            count: 4
        }
    ];

    const faqs = [
        {
            question: "How do I change the date and venue of an already created event?",
            answer: "Navigate to your main Event Dashboard, select the specific event card, and click on 'Edit Details'. From there, you can adjust the start/end dates, modify times, or swap venues. Please note that changing a venue will re-verify capacity constraints against your current attendee checklist."
        },
        {
            question: "Can I invite external team members or vendors to co-manage an event?",
            answer: "Yes! Inside your event dashboard workspace, look for the 'Collaborators' or 'Team' tab. Click 'Invite Member', input their email, and assign them a specific role (e.g., Resource Manager, Viewer, or Admin) to control their access tier."
        },
        {
            question: "What happens if my event guest list exceeds the selected venue capacity?",
            answer: "The dashboard will flag a warning indicator on your 'Key Milestones' and 'Resources' steps. You will still be able to save your configurations, but a notice will remind you to upgrade your venue parameters or prune your attendee invitation lists."
        },
        {
            question: "How secure is my Google Calendar integration data?",
            answer: "We use official Google OAuth tokens restricted solely to calendar read/write scopes. Your credentials and login metadata are protected under local client-session controls and are never shared with or exposed to external vendor profiles."
        }
    ];

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Banner Section */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center shadow-sm mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-100 rounded-full blur-2xl opacity-50 -ml-10 -mb-10"></div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-orange-50 text-[#ea580c] mb-4">
                        <LifeBuoy className="w-3.5 h-3.5" /> Support Hub
                    </span>

                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
                        How can we help you today?
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
                        Search our knowledge base for instant answers or explore guided modules across standard event configurations.
                    </p>

                    {/* Search Box */}
                    <div className="max-w-xl mx-auto relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search guides, setup answers, terms..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c] transition shadow-inner text-base"
                        />
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Browse by Topic
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <div
                                    key={category.id}
                                    className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition group cursor-pointer"
                                >
                                    <div className="w-12 h-12 bg-orange-50 text-[#ea580c] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#ea580c] group-hover:text-white transition">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-lg mb-2 group-hover:text-[#ea580c] transition">
                                        {category.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {category.description}
                                    </p>
                                    <div className="text-xs font-semibold text-[#ea580c] flex items-center gap-1">
                                        {category.count} Articles <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
                    <p className="text-gray-500 mb-6 text-sm">Quick answers to common platform functionalities.</p>

                    <div className="divide-y divide-gray-200">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="py-4 first:pt-0 last:pb-0">
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full flex items-center justify-between text-left font-semibold text-gray-800 hover:text-[#ea580c] py-2 transition"
                                    >
                                        <span>{faq.question}</span>
                                        {openFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>
                                    {openFaq === index && (
                                        <p className="mt-2 text-gray-600 text-sm leading-relaxed pl-1">
                                            {faq.answer}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm py-4">No matching guides found for "{searchQuery}". Try alternate keywords.</p>
                        )}
                    </div>
                </div>

                {/* Contact/Support Footer Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-orange-50/60 border border-orange-100 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-3 bg-[#ea580c] text-white rounded-lg">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-1">Email Ticketing</h4>
                            <p className="text-gray-600 text-sm mb-3">
                                Can't find an answer here? Open an urgent technical ticket with our tracking desk.
                            </p>
                            <a
                                href="mailto:support@eventsyncpro.com"
                                className="text-sm font-semibold text-[#ea580c] hover:underline inline-flex items-center gap-1"
                            >
                                Submit Ticket <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-100/80 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-3 bg-gray-800 text-white rounded-lg">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 text-lg mb-1">Developer Docs</h4>
                            <p className="text-gray-600 text-sm mb-3">
                                Need details on Webhook configurations or advanced API structures for custom sites?
                            </p>
                            <button
                                onClick={() => navigate("/docs")}
                                className="text-sm font-semibold text-gray-800 hover:text-[#ea580c] hover:underline inline-flex items-center gap-1"
                            >
                                Open API Docs <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Back Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition font-semibold text-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
}

export default HelpCentre;