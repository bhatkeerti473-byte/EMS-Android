const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Venue = require("./models/Venue");

// Load env vars
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const venues = [
  {
    name: "Garden Palace",
    type: "AC Hall",
    location: "Mumbai, Maharashtra",
    city: "Mumbai",
    capacity: 500,
    price: 120000,
    description: "A beautiful and luxurious AC hall suitable for large gatherings.",
    facilities: ["AC", "Catering", "Parking", "WiFi", "Stage"],
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "Green Wood",
    type: "Outdoor Lawn",
    location: "Pune, Maharashtra",
    city: "Pune",
    capacity: 1000,
    price: 90000,
    description: "Spacious outdoor lawn surrounded by nature, perfect for evening events.",
    facilities: ["Outdoor", "Stage", "Valet Parking", "Catering Setup"],
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "K1 Banquet Hall",
    type: "Banquet Hall",
    location: "Delhi, NCR",
    city: "Delhi",
    capacity: 350,
    price: 75000,
    description: "Premium banquet hall with exquisite interiors for all your special occasions.",
    facilities: ["AC", "Decor", "WiFi", "In-house Catering"],
    images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "Royal Orchid",
    type: "AC Hall",
    location: "Bangalore, Karnataka",
    city: "Bangalore",
    capacity: 250,
    price: 60000,
    description: "Elegant air-conditioned hall with modern amenities.",
    facilities: ["AC", "Parking", "WiFi"],
    images: ["https://images.unsplash.com/photo-1582719478250-c89400652026?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "Crystal Ballroom",
    type: "AC Hall",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    capacity: 800,
    price: 200000,
    description: "Grand ballroom with crystal chandeliers for a royal wedding experience.",
    facilities: ["AC", "Valet Parking", "Bridal Room", "Stage"],
    images: ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "The Emerald Lawn",
    type: "Outdoor Lawn",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    capacity: 1200,
    price: 150000,
    description: "Massive lush green lawn capable of hosting large scale corporate and social events.",
    facilities: ["Outdoor", "Parking", "Security", "Stage"],
    images: ["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  },
  {
    name: "Sapphire Convention Center",
    type: "Banquet Hall",
    location: "Kolkata, West Bengal",
    city: "Kolkata",
    capacity: 600,
    price: 110000,
    description: "Modern convention center equipped with the latest audiovisual technology.",
    facilities: ["AC", "Projector", "WiFi", "Sound System"],
    images: ["https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80"],
    packageEligible: true,
    status: "Available"
  }
];

const seedVenues = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for Seeding Venues");

    // Optional: Clear existing venues to avoid duplicates
    // await Venue.deleteMany();
    // console.log("Existing venues cleared.");

    await Venue.insertMany(venues);
    console.log("7 Venues successfully seeded!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedVenues();
