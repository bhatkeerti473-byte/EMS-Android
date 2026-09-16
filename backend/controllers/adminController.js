const fs = require("fs");
const path = require("path");
const Venue = require("../models/Venue");
const Booking = require("../models/Booking");
const EventSchedule = require("../models/EventSchedule");

// Get all venues
exports.getVenues = async (req, res) => {
  try {
    const venues = await Venue.find();

    res.status(200).json({
      success: true,
      venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get available venues based on criteria
exports.getAvailableVenues = async (req, res) => {
  try {
    const { date, city, guests, packageId } = req.query;

    let query = { status: "Available" };

    if (city) {
      // Use case-insensitive search for city or location
      query.$or = [
        { city: new RegExp(city, "i") },
        { location: new RegExp(city, "i") }
      ];
    }

    if (guests) {
      query.capacity = { $gte: Number(guests) };
    }

    let venues = await Venue.find(query);

    // If date is provided, filter out booked venues
    if (date && venues.length > 0) {
      const targetDate = new Date(date);
      
      const bookingsOnDate = await Booking.find({
        event_date: targetDate,
        booking_status: { $in: ["Approved - Awaiting Payment", "Confirmed", "Temporarily Held"] }
      });

      const schedulesOnDate = await EventSchedule.find({
        startDate: { $lte: targetDate },
        endDate: { $gte: targetDate }
      });

      const bookedVenueNames = new Set([
        ...bookingsOnDate.map(b => b.venueName),
        ...schedulesOnDate.map(s => s.venue.name)
      ]);
      const bookedVenueIds = new Set(bookingsOnDate.map(b => b.venue_id));

      venues = venues.filter(v => 
        !bookedVenueNames.has(v.name) && 
        !bookedVenueIds.has(v._id.toString())
      );
    }

    res.status(200).json({
      success: true,
      venues,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ success: false, message: "Venue not found" });
    }
    res.status(200).json({ success: true, venue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update venue
exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Venue updated successfully",
      venue,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete venue
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Venue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.uploadVenueImage = async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, message: "Image payload is required" });
    }

    const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, message: "Invalid image format" });
    }

    const extension = matches[1].split("/")[1];
    const buffer = Buffer.from(matches[2], "base64");
    const fileName = `venue-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);

    await fs.promises.writeFile(uploadPath, buffer);
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadVenueVideo = async (req, res) => {
  try {
    const { video } = req.body;
    if (!video) {
      return res.status(400).json({ success: false, message: "Video payload is required" });
    }

    const matches = video.match(/^data:(video\/[a-zA-Z0-9]+);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ success: false, message: "Invalid video format" });
    }

    const extension = matches[1].split("/")[1];
    const buffer = Buffer.from(matches[2], "base64");
    const fileName = `venue-video-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
    const uploadPath = path.join(__dirname, "..", "uploads", fileName);

    await fs.promises.writeFile(uploadPath, buffer);
    const videoUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

    res.status(201).json({ success: true, videoUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create venue
exports.createVenue = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    const venue = new Venue(req.body);

    await venue.save();

    res.status(201).json({
      success: true,
      message: "Venue created successfully",
      venue,
    });
  } catch (error) {
    console.error("Venue Save Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};