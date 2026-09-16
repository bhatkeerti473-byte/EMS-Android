import weddingimg01 from "../../assets/weddingImg/weddingimg01.jpg";
import weddingimg02 from "../../assets/weddingImg/weddingimg02.jpg";
import weddingimg03 from "../../assets/weddingImg/weddingimg03.webp";
import wedding04 from "../../assets/weddingImg/wedding04.jpg";
import weddingimg05 from "../../assets/weddingImg/weddingimg05.jpg";
import weddingimg06 from "../../assets/weddingImg/weddingimg06.jpg";
import weddingimg07 from "../../assets/weddingImg/weddingimg07.png";
import weddingimg08 from "../../assets/weddingImg/weddingimg08.png";

import birthday01 from "../../assets/birthdayimg/birthday01.png";
import birthday02 from "../../assets/birthdayimg/birthday02.png";
import birthday03 from "../../assets/birthdayimg/birthday03.png";
import birthday04 from "../../assets/birthdayimg/birthday04.png";
import birthday05 from "../../assets/birthdayimg/birthday05.png";
import birthday06 from "../../assets/birthdayimg/birthday06.png";
import birthday07 from "../../assets/birthdayimg/birthday07.png";

import consert01 from "../../assets/concertsimg/consert01.png";
import consert02 from "../../assets/concertsimg/consert02.png";
import consert03 from "../../assets/concertsimg/consert03.png";
import consert04 from "../../assets/concertsimg/consert04.png";
import consert05 from "../../assets/concertsimg/consert05.png";
import consert06 from "../../assets/concertsimg/consert06.png";
import concert07 from "../../assets/concertsimg/concert07.png";
import concert08 from "../../assets/concertsimg/concert08.png";

export const eventCatalog = [
  {
    id: 1,
    title: "Wedding Celebration",
    description: "Complete wedding planning package",
    about:
      "Our Wedding Celebration package offers a complete end-to-end wedding planning solution. From venue selection and decoration to catering, photography, and guest management — we handle every detail so you can enjoy your special day stress-free. Perfect for couples looking for a premium, hassle-free wedding experience in Udupi.",
    location: "Udupi",
    guests: 500,
    price: "₹2,00,000",
    rating: "4.8/5",
    reviews: 124,
    duration: "Full Day",
    bestSeason: "Oct – Mar",
    noticePeriod: "15 Days",
    paymentTerms: "50% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: weddingimg01,
    gallery: [
      weddingimg01,
      weddingimg02,
      weddingimg03,
      wedding04,
      weddingimg05,
      weddingimg06,
      weddingimg07,
      weddingimg08,
    ],
    extraGalleryCount: 3,
    services: [
      "Catering",
      "Stage Decoration",
      "Photography",
      "DJ & Lighting",
      "Seating Arrangement",
      "Guest Management",
    ],
  },
  {
    id: 2,
    title: "Birthday Party",
    description: "Fun and memorable birthday celebrations",
    about:
      "Make every birthday unforgettable with our themed decorations, entertainment, catering, and photography packages. Ideal for kids, teens, and adults — we customize the experience to match your vision and budget.",
    location: "Udupi",
    guests: 100,
    price: "₹50,000",
    rating: "4.6/5",
    reviews: 89,
    duration: "4–6 Hours",
    bestSeason: "Year Round",
    noticePeriod: "7 Days",
    paymentTerms: "40% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: birthday01,
    gallery: [
      birthday01,
      birthday02,
      birthday03,
      birthday04,
      birthday05,
      birthday06,
      birthday07,
    ],
    extraGalleryCount: 2,
    services: [
      "Theme Decoration",
      "Catering",
      "Photography",
      "DJ & Music",
      "Cake Arrangement",
      "Party Games",
    ],
  },
  {
    id: 3,
    title: "Corporate Event",
    description: "Professional events for your business",
    about:
      "Host impactful corporate gatherings with professional AV setup, branded staging, catering, and on-site coordination. Perfect for product launches, annual meets, and team celebrations.",
    location: "Udupi",
    guests: 300,
    price: "₹1,50,000",
    rating: "4.7/5",
    reviews: 56,
    duration: "Full Day",
    bestSeason: "Year Round",
    noticePeriod: "10 Days",
    paymentTerms: "50% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900",
    ],
    extraGalleryCount: 6,
    services: [
      "AV Setup",
      "Stage & Branding",
      "Catering",
      "Registration Desk",
      "Photography",
      "Event Coordination",
    ],
  },
  {
    id: 4,
    title: "Conference",
    description: "Conferences and seminars",
    about:
      "Organize professional conferences and seminars with seating for large audiences, speaker management, breakout sessions, and full technical support throughout the event.",
    location: "Udupi",
    guests: 1000,
    price: "₹1,00,000",
    rating: "4.5/5",
    reviews: 42,
    duration: "2–3 Days",
    bestSeason: "Sep – Feb",
    noticePeriod: "20 Days",
    paymentTerms: "60% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=900",
    ],
    extraGalleryCount: 5,
    services: [
      "Hall Booking",
      "Speaker Setup",
      "Registration",
      "Catering",
      "Live Streaming",
      "Technical Support",
    ],
  },
  {
    id: 5,
    title: "Concert",
    description: "Live concerts and music events",
    about:
      "Bring live music to life with professional sound systems, stage lighting, crowd management, and artist coordination. Suitable for indoor and outdoor venues across Udupi.",
    location: "Udupi",
    guests: 2000,
    price: "₹3,00,000",
    rating: "4.9/5",
    reviews: 210,
    duration: "Evening / Night",
    bestSeason: "Nov – Feb",
    noticePeriod: "30 Days",
    paymentTerms: "70% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: consert01,
    gallery: [
      consert01,
      consert02,
      consert03,
      consert04,
      consert05,
      consert06,
      concert07,
      concert08,
    ],
    extraGalleryCount: 3,
    services: [
      "Sound System",
      "Stage Lighting",
      "Artist Management",
      "Security",
      "Ticketing Support",
      "Backstage Setup",
    ],
  },
  {
    id: 6,
    title: "Exhibition",
    description: "Exhibitions and trade shows",
    about:
      "Showcase products and services with custom stall design, visitor management, promotional materials, and end-to-end exhibition logistics for trade shows and public displays.",
    location: "Udupi",
    guests: 500,
    price: "₹75,000",
    rating: "4.4/5",
    reviews: 37,
    duration: "3–5 Days",
    bestSeason: "Year Round",
    noticePeriod: "14 Days",
    paymentTerms: "50% Advance",
    cancellationPolicy: "As per terms & conditions",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
    gallery: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=900",
    ],
    extraGalleryCount: 4,
    services: [
      "Stall Design",
      "Branding",
      "Visitor Management",
      "Security",
      "Catering",
      "Logistics Support",
    ],
  },
];

export const getEventById = (eventId) =>
  eventCatalog.find((item) => String(item.id) === String(eventId)) || null;

export const enrichEvent = (event) => {
  if (!event) return null;

  const catalogMatch = getEventById(event.id);
  if (catalogMatch) {
    return { ...catalogMatch, ...event };
  }

  return {
    about: event.description || "Event details will be updated soon.",
    reviews: 0,
    duration: "Full Day",
    bestSeason: "Year Round",
    noticePeriod: "7 Days",
    paymentTerms: "50% Advance",
    cancellationPolicy: "As per terms & conditions",
    gallery: event.image ? [event.image] : [],
    extraGalleryCount: 0,
    services: ["Catering", "Decoration", "Photography", "Event Coordination"],
    ...event,
  };
};
