const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { OAuth2Client } = require("google-auth-library");

const connectDB = require("./config/db");
const adminController = require("./controllers/adminController");

// =========================
// Environment Config
// =========================
dotenv.config();

// =========================
// App Initialization
// =========================
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }
});

// Make io accessible globally
app.set("io", io);
global.io = io;

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Clients can join their own room based on their user ID or role
  socket.on("join", (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// =========================
// Database Connection
// =========================
connectDB();

// =========================
// Middleware
// =========================
app.use(cors({
  origin: true, // Allow mobile app (localhost, capacitor://localhost, LAN IPs) and React web frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "50mb" }));

// Request Logger (Helps see incoming hits in your terminal window)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} request to ${req.url}`);
  next();
});

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// =========================
// Background Images API
// =========================
const images = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
  "https://images.unsplash.com/photo-1505236858219-8359eb29e329",
  "https://images.unsplash.com/photo-1511578314322-379afb476865",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678",
];

app.get("/api/images", (req, res) => {
  res.json(images);
});

// =========================
// Static Data (Fallback Mocks)
// =========================
const events = [
  {
    id: 1,
    title: "Music Concert 2026",
    category: "Music",
    date: "May 25, 2026",
    time: "7:00 PM",
    location: "Auditorium Hall",
    price: 45,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: 2,
    title: "Tech Conference",
    category: "Tech",
    date: "Jun 10, 2026",
    time: "9:00 AM",
    location: "Tech Park, New York",
    price: 99,
    status: "Upcoming",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=700&q=80",
  },
];

const bookings = [
  {
    id: "BK-2026-001",
    title: "Music Concert 2026",
    date: "May 25, 2026",
    time: "7:00 PM",
    location: "Auditorium Hall, New York",
    status: "Confirmed",
    amount: 320,
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=500&q=80",
  },
];

// =========================
// Manual Inline Routes (Mock Endpoints)
// =========================
app.get("/api/mock-events", (req, res) => {
  try {
    const { search = "", category = "", location = "", sort = "earliest" } = req.query;
    const searchText = search.toLowerCase();

    const filteredEvents = events
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(searchText) ||
          event.category.toLowerCase().includes(searchText) ||
          event.location.toLowerCase().includes(searchText);

        const matchesCategory = !category || event.category === category;
        const matchesLocation = !location || event.location === location;

        return matchesSearch && matchesCategory && matchesLocation;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        return new Date(a.date) - new Date(b.date);
      });

    res.status(200).json(filteredEvents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
});

app.get("/api/mock-bookings", (req, res) => {
  try {
    const { status = "All Bookings", search = "" } = req.query;
    const searchText = search.toLowerCase();

    const filteredBookings = bookings.filter((booking) => {
      const matchesStatus = status === "All Bookings" || booking.status === status;
      const matchesSearch =
        booking.title.toLowerCase().includes(searchText) ||
        booking.id.toLowerCase().includes(searchText) ||
        booking.location.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });

    res.status(200).json(filteredBookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

// =========================
// Modular Mounted Router Files
// =========================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/event-type-requests", require("./routes/eventTypeRequests"));
app.use("/api/decoration-requests", require("./routes/decorationRequests"));
app.use("/api/venues", require("./routes/venue"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/staff", require("./routes/staff"));
app.use("/api/vendors", require("./routes/vendor"));
app.use("/api/resources", require("./routes/resource"));
app.use("/api/reviews", require("./routes/reviews"));
app.post("/api/admin/venues/upload", adminController.uploadVenueImage);
app.post("/api/admin/venues/upload-video", adminController.uploadVenueVideo);
app.use("/api/venue-bookings", require("./routes/venueBookings"));
app.use("/api/seating-arrangements", require("./routes/seatingArrangements"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/finance", require("./routes/finance"));
app.use("/api/guests", require("./routes/guests"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/packages", require("./routes/packages"));
app.use("/api/assistant", require("./routes/assistant"));
app.use("/api/staff-assignments", require("./routes/staffAssignmentRoutes"));

// NOTE: Google auth is handled by routes/auth.js → router.post('/google', google)
// mounted at /api/auth — no duplicate needed here.

// =========================
// Global Fallbacks & Routing Handles
// =========================
app.get("/", (req, res) => {
  res.send("Event Management Backend Running...");
});

// Catch-all 404 JSON response for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

// =========================
// Server Start
// =========================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});