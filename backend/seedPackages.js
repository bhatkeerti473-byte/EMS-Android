const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Package = require("./models/Package");

dotenv.config();

const packages = [
  {
    name: "Royal Wedding Package",
    originalPrice: 220000,
    offerPrice: 199999,
    offerStartDate: new Date("2026-08-01T10:00:00Z"),
    offerEndDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 16 Days, 8 Hours from now
    countdownEnabled: true,
    offerBadge: "🔥 Limited Offer",
    maxBookings: 20,
    remainingSlots: 5,
    status: "Active",
    venueIncluded: true,
    decorationIncluded: true,
    cateringIncluded: true,
    photographyIncluded: true,
    additionalServicesIncluded: true,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    description: "Premium wedding package with decoration, catering, and additional services.",
    features: ["🔥 Limited Time Offer", "⭐ Best Seller", "👑 Premium Package", "💰 Save ₹20,001", "❤️ 250+ Bookings", "⭐ 4.9/5 Customer Rating", "🎁 Free Welcome Board", "📸 Free Couple Photoshoot", "🚚 Free Setup & Cleanup"]
  },
  {
    name: "Classic Reception Package",
    originalPrice: 150000,
    offerPrice: 135000,
    offerStartDate: new Date("2026-08-01T10:00:00Z"),
    offerEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 Days from now
    countdownEnabled: true,
    offerBadge: "⏳ Ends Soon",
    maxBookings: 15,
    remainingSlots: 2,
    status: "Active",
    venueIncluded: true,
    decorationIncluded: true,
    cateringIncluded: true,
    photographyIncluded: false,
    additionalServicesIncluded: false,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    description: "Elegant and budget-friendly reception package.",
    features: ["⭐ Best Seller", "💰 Save ₹15,000", "⭐ 4.7/5 Customer Rating", "🚚 Free Setup"]
  },
  {
    name: "Luxury Corporate Gala",
    originalPrice: 300000,
    offerPrice: 280000,
    offerStartDate: new Date("2026-08-01T10:00:00Z"),
    offerEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days from now
    countdownEnabled: false,
    offerBadge: "👑 Premium Package",
    maxBookings: 5,
    remainingSlots: 5,
    status: "Active",
    venueIncluded: true,
    decorationIncluded: true,
    cateringIncluded: true,
    photographyIncluded: true,
    additionalServicesIncluded: true,
    image: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=800&q=80",
    description: "All-inclusive premium corporate event package.",
    features: ["👑 Premium Package", "⭐ 5.0/5 Customer Rating", "🎁 Dedicated Event Manager"]
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");
    await Package.deleteMany(); // Clear existing packages
    await Package.insertMany(packages);
    console.log("Packages seeded successfully!");
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error("Error seeding packages:", error);
    mongoose.connection.close();
  });
