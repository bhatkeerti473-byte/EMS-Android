import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PremiumLogo from "../components/PremiumLogo/PremiumLogo";
import FeaturedOfferPackages from "../components/FeaturedOfferPackages";

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
  },
];

const categories = [
  {
    title: "Wedding Events",
    description: "Make your special day unforgettable with complete planning.",
    count: "120+ Events",
    accent: "bg-pink-500",
    image: "/home/weddingimg01.jpg",
  },
  {
    title: "Birthday Parties",
    description: "Celebrate birthdays with unique themes and memorable moments.",
    count: "95+ Events",
    accent: "bg-blue-500",
    image: "/home/Birthday.png",
  },
  {
    title: "Corporate Events",
    description: "Professional events for meetings, conferences and gatherings.",
    count: "150+ Events",
    accent: "bg-emerald-500",
    image: "/home/coporateevent.png",
  },
  {
    title: "Concerts & Shows",
    description: "Enjoy live concerts, music shows and entertainment events.",
    count: "110+ Events",
    accent: "bg-violet-500",
    image: "/home/concert.png",
  },
  {
    title: "Exhibitions",
    description: "Explore trade shows, exhibitions and product launches.",
    count: "80+ Events",
    accent: "bg-amber-500",
    image: "/home/exibution.png",
  },
];

const platformFeatures = [
  "Easy Event Management",
  "Secure & Reliable",
  "Real-time Analytics",
  "Vendor Management",
  "24/7 Customer Support",
  "Seamless Experience",
];

const heroHighlights = ["Easy Booking", "Secure Payments", "24/7 Support", "Powerful Dashboard"];

const stats = [
  ["500+", "Events Managed"],
  ["100+", "Venues Available"],
  ["200+", "Vendors"],
  ["500+", "Happy Clients"],
];

const contactDetails = [
  ["Phone", "+91 98765 43210"],
  ["Email", "info@eventsystem.com"],
  ["Office", "Udupi Events Building, No. 42, Main Road, Kunjibettu, Udupi, Karnataka 576102"],
];

const socialLinks = ["f", "ig", "x", "in", "yt"];

const footerLinks = [
  ["Home", "home"],
  ["Events", "events"],
  ["Categories", "categories"],
  ["About Us", "about"],
  ["Contact Us", "contact"],
];

const navLinks = [
  ["Home", "home"],
  ["Events", "events"],
  ["Categories", "categories"],
  ["About", "about"],
  ["Contact", "contact"],
];

function Home() {
  const location = useLocation();
  const aboutVideoRef = useRef(null);
  const [aboutVideoPlaying, setAboutVideoPlaying] = useState(false);

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const section = document.getElementById(sectionId);
    if (section) {
      requestAnimationFrame(() => {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash]);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${sectionId}`);
    }
  };

  const handleAboutVideoToggle = async () => {
    const video = aboutVideoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setAboutVideoPlaying(true);
      } catch (error) {
        setAboutVideoPlaying(false);
      }
      return;
    }

    video.pause();
    setAboutVideoPlaying(false);
  };

  return (
    <div id="home" className="min-h-screen bg-[#f5f1ec] text-slate-950">
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img src="/home/home-background.png" alt="Decorated event venue" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.2)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.22),transparent_26%),radial-gradient(circle_at_center,rgba(168,85,247,0.2),transparent_28%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-[1450px] flex-col px-5 pb-10 pt-6 sm:px-8 lg:px-10">
          <header className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/home" className="flex items-center gap-3 text-white">
              <PremiumLogo size="60px" />
              <div>
                <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate">Event</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] golden-text-animate">
                  Management System
                </p>
              </div>
            </Link>

            <nav className="flex flex-wrap items-center gap-3 lg:gap-8">
              {navLinks.map(([label, id]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="group relative py-1 text-sm font-semibold text-white/85 transition hover:text-white"
                >
                  {label}
                  <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-0 rounded-full bg-pink-400 transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
            </nav>

            <Link
              to="/login"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/15 bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5 hover:bg-pink-400"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-[1.9]">
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H4" />
                <path d="M20 4v16" />
              </svg>
              Login
            </Link>
          </header>

          <div className="mt-14 grid flex-1 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/78 backdrop-blur-md">
                Premium event planning platform
              </div>
              <h1 className="max-w-2xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                <span className="block text-white">Plan, Manage and Create</span>
                <span className="block bg-gradient-to-r from-pink-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">
                  Unforgettable Events
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
                A complete event management platform to organize events, manage venues, coordinate teams, and
                deliver memorable experiences.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection("events")}
                  className="rounded-xl bg-pink-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-500/30 transition hover:-translate-y-0.5 hover:bg-pink-400"
                >
                  Explore Events
                </button>
                <Link
                  to="/login"
                  className="rounded-xl border border-white/22 bg-white/6 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/12"
                >
                  Create Event
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/25 px-4 py-2 text-sm text-white/82 backdrop-blur-md"
                  >
                    <span className="h-2 w-2 rounded-full bg-pink-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:justify-self-end">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                <div className="relative min-h-[28rem]">
                  <img src="/home/home-background.png" alt="Event venue preview" className="h-full min-h-[28rem] w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.5)_100%)]" />
                  <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/60 p-5 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {stats.map(([value, label]) => (
                        <div key={label} className="text-center">
                          <div className="text-2xl font-black sm:text-3xl">{value}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/65">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Successfully Completed Events Section */}
      <section id="events" className="scroll-mt-24 border-t border-black/5 bg-[#fbf8f4] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[0.28fr_0.72fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)] flex flex-col justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-500">Portfolio</p>
              <h2 className="mt-3 text-4xl font-black uppercase leading-none text-slate-950">Successfully Completed Events</h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
                Take a look back at some of our finest gatherings. Read genuine client feedback, see custom venue highlights, and explore our specialized setups.
              </p>
            </div>
            <Link
              to="/login"
              className="mt-8 inline-flex rounded-xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400 w-fit"
            >
              Explore Services
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {completedEvents.map((event) => (
              <article
                key={event.title}
                className="group overflow-hidden rounded-[1.7rem] border border-black/6 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient} opacity-35`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.45)_100%)]" />
                </div>
                <div className="p-5 flex flex-col justify-between h-[calc(100%-11rem)]">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950 leading-snug">{event.title}</h3>
                    <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{event.place}</p>

                    {/* Happy Customer Rating */}
                    <div className="mt-3 flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                      <div className="flex text-amber-400">
                        {"★".repeat(Math.floor(event.rating))}
                        {event.rating % 1 !== 0 ? "½" : ""}
                      </div>
                      <span className="text-xs font-bold text-slate-700">({event.rating}) Rating</span>
                    </div>

                    {/* Services Tracked */}
                    <div className="mt-4">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-pink-500">Services Handled:</p>
                      <ul className="mt-1.5 gap-1 flex flex-wrap">
                        {event.services.map((service) => (
                          <li key={service} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                            • {service}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    to={`/completed-events?id=${event.id}`}
                    className="mt-5 block w-full rounded-xl bg-pink-500 px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-pink-400 shadow-md shadow-pink-500/10"
                  >
                    View Details & Feedback
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Offer Packages ⭐ Section */}
      <section className="scroll-mt-24 border-t border-black/5 bg-[#ffffff] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1450px]">
          <FeaturedOfferPackages
            title="👑 Featured Special Event Packages ⭐"
            subtitle="Explore our 6 all-inclusive featured packages with price breakdown, recommended venues, or custom home function booking"
            redirectToLogin={true}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="scroll-mt-24 border-t border-black/5 bg-[#f7f2ed] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[0.28fr_0.72fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-500">Browse</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none text-slate-950">Categories</h2>
            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
              Choose from a variety of event categories and find the perfect event that matches your interest.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex rounded-xl bg-pink-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-400"
            >
              View All Categories
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {categories.map((category) => (
              <article
                key={category.title}
                className="overflow-hidden rounded-[1.5rem] border border-black/6 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
              >
                <div className="relative h-36 overflow-hidden">
                  <img src={category.image} alt={category.title} className="h-full w-full object-cover" />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent ${category.accent} opacity-25 mix-blend-multiply`}
                  />
                  <div className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/92 text-pink-500 shadow-lg">
                    <span className="text-sm font-black">E</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-950">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {category.count}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-24 border-t border-black/5 bg-[#fbf8f4] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1450px] gap-8 lg:grid-cols-[0.34fr_0.66fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-500">About Us</p>
            <h2 className="mt-3 text-4xl font-black uppercase leading-none text-slate-950">About Our Platform</h2>
            <p className="mt-6 text-sm leading-7 text-slate-600">
              Our Event Management System is designed to simplify the way events are planned, managed and executed.
              From small gatherings to grand celebrations, we provide all the tools you need.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {platformFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-500/12 text-pink-500">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
                      <path d="M12 3l2.9 5.9L21 10l-4.5 4.4L17.6 21 12 18l-5.6 3 1.1-6.6L3 10l6.1-1.1L12 3z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-slate-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-black/6 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
            <div className="relative">
              <video
                ref={aboutVideoRef}
                className="h-[24rem] w-full object-cover sm:h-[30rem]"
                src="/home/about-video.mp4.mp4"
                muted
                playsInline
                loop
                controls
                preload="metadata"
                poster="/home/home-background.png"
                aria-label="About our platform video"
                onPlay={() => setAboutVideoPlaying(true)}
                onPause={() => setAboutVideoPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              {!aboutVideoPlaying && (
                <button
                  type="button"
                  onClick={handleAboutVideoToggle}
                  className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white/35 bg-pink-500/95 text-white shadow-[0_0_45px_rgba(236,72,153,0.4)] transition hover:scale-105"
                  aria-label="Play about platform video"
                >
                  <svg viewBox="0 0 24 24" className="ml-1 h-9 w-9 fill-current">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              )}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 grid grid-cols-2 gap-px bg-white/10 text-white sm:grid-cols-4">
                {stats.map(([value, label]) => (
                  <div key={label} className="bg-black/45 p-5 text-center backdrop-blur-md">
                    <div className="text-3xl font-black">{value}</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/68">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section (UPDATED: Horizontal Row Layout with Uniform Balanced Heights) */}
      <section id="contact" className="scroll-mt-24 border-t border-black/5 bg-[#f7f2ed] px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-6 md:grid-cols-3">

            {/* Title Block Card */}
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col justify-between min-h-[280px]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.35em] text-pink-500">Get in Touch</p>
                <h2 className="mt-3 text-3xl font-black uppercase leading-tight text-slate-950">Contact Us</h2>
                <p className="mt-4 text-xs leading-relaxed text-slate-600">
                  Have questions or want to host a completely customized event with specialized staff? Reach out anytime.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Social Handles</span>
                <div className="flex gap-2">
                  {socialLinks.slice(0, 3).map((item) => (
                    <span key={item} className="grid h-8 w-8 place-items-center rounded-full bg-slate-50 text-xs font-bold text-slate-600 transition hover:bg-pink-500 hover:text-white cursor-pointer">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Address Info Block Card */}
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col justify-between min-h-[280px]">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pink-500/12 text-pink-500">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.9]">
                    <path d="M12 21s7-5.8 7-11a7 7 0 10-14 0c0 5.2 7 11 7 11z" />
                    <path d="M12 10.5a2 2 0 100-4 2 2 0 010 4z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-500">{contactDetails[2][0]}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-950">Udupi Events Company</p>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{contactDetails[2][1]}</p>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-[11px] font-medium text-slate-500 text-center border border-slate-100">
                📍 Head Office Location • Open Mon - Sat (9AM - 6PM)
              </div>
            </div>

            {/* Quick Communications Block Card */}
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_18px_50px_rgba(15,23,42,0.06)] flex flex-col justify-between min-h-[280px]">
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-500/12 text-pink-500">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-[1.9]">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500">{contactDetails[0][0]}</p>
                    <p className="text-xs font-semibold text-slate-800">{contactDetails[0][1]}</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pink-500/12 text-pink-500">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 fill-none stroke-current stroke-[1.9]">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <path d="M22 6l-10 7L2 6" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-pink-500">{contactDetails[1][0]}</p>
                    <p className="text-xs font-semibold text-slate-800">{contactDetails[1][1]}</p>
                  </div>
                </div>
              </div>
              <a href={`mailto:${contactDetails[1][1]}`} className="block w-full rounded-xl bg-pink-500 py-3 text-center text-xs font-bold text-white transition hover:bg-pink-400 shadow-md shadow-pink-500/10">
                Send Instant Email
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#07101d] px-5 py-12 text-white sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[1fr_0.9fr_0.9fr_0.9fr]">
          <div>
            <Link to="/home" className="flex items-center gap-3 text-white">
              <PremiumLogo size="60px" />
              <div>
                <p className="text-lg font-black uppercase tracking-[0.18em] golden-text-animate">Event</p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.38em] golden-text-animate">
                  Management System
                </p>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Plan, organize, manage, and celebrate events with our complete event management platform.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-white/80">Quick Links</h4>
            <div className="mt-5 space-y-3 text-sm text-white/65">
              {footerLinks.map(([label, id]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="block text-left transition hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-white/80">Services</h4>
            <div className="mt-5 space-y-3 text-sm text-white/65">
              {[
                "Event Planning",
                "Venue Management",
                "Vendor Management",
                "Payment Management",
                "Staff Management",
              ].map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.28em] text-white/80">Contact Us</h4>
            <div className="mt-5 space-y-3 text-sm text-white/65">
              {contactDetails.map(([_, value]) => (
                <div key={value}>{value}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-[1450px] flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Event Management System. All rights reserved.</p>
          <button type="button" onClick={() => scrollToSection("home")} className="inline-flex w-fit rounded-full border border-white/10 px-4 py-2">
            Back to top
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Home;