const path = require("path");
const fs = require("fs");
const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");

exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, categoryRatings, comment, tags, recommend, images } = req.body;
    const clientId = req.user.id;

    // 1. Verify booking exists and belongs to client
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Ensure booking belongs to the authenticated client
    // Booking might store client ID in `client`, `user`, or `userId`
    const bookingClientId = booking.client || booking.user || booking.userId;
    if (bookingClientId.toString() !== clientId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to review this booking" });
    }

    // 2. Verify booking is completed (or in the past)
    const bookingStatus = booking.status || "";
    const eventDate = new Date(booking.date || booking.event_date || booking.eventDate);
    const now = new Date();

    if (bookingStatus !== "Approved" && bookingStatus !== "Confirmed" && bookingStatus !== "Completed") {
       return res.status(400).json({ success: false, message: "Only approved or completed bookings can be reviewed." });
    }

    if (eventDate > now) {
      return res.status(400).json({ success: false, message: "Cannot review an event that hasn't happened yet." });
    }

    // 3. Prevent duplicates
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this booking." });
    }

    // 4. Save Review
    const newReview = new Review({
      client: clientId,
      booking: bookingId,
      rating,
      categoryRatings,
      comment,
      tags,
      recommend,
      images
    });

    await newReview.save();

    // 5. Send Notification
    await Notification.create({
      userId: clientId,
      role: "Client",
      type: "Review Submitted",
      message: `Your review for booking ${bookingId} has been submitted successfully.`,
      isRead: false
    });

    res.status(201).json({ success: true, message: "Review submitted successfully", review: newReview });

  } catch (error) {
    console.error("Submit Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadReviewImages = async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "Images payload is required" });
    }

    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const matches = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
      if (!matches) {
        continue;
      }

      const extension = matches[1].split("/")[1];
      const buffer = Buffer.from(matches[2], "base64");
      const fileName = `review-${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
      const uploadPath = path.join(__dirname, "..", "uploads", fileName);

      await fs.promises.writeFile(uploadPath, buffer);
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
      uploadedUrls.push(imageUrl);
    }

    res.status(201).json({ success: true, imageUrls: uploadedUrls });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getClientReviews = async (req, res) => {
  try {
    const clientId = req.user.id;
    const reviews = await Review.find({ client: clientId })
      .populate("booking", "title eventTitle event_date date venueName")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("client", "name email")
      .populate("booking", "title eventTitle event_date date venueName status")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adminRespondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;

    if (!comment) {
      return res.status(400).json({ success: false, message: "Response comment is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.adminResponse = {
      comment,
      respondedAt: new Date()
    };

    await review.save();

    // Send Notification to Client
    await Notification.create({
      userId: review.client,
      role: "Client",
      type: "Review Response",
      message: `Admin has replied to your review for booking.`,
      isRead: false
    });

    res.status(200).json({ success: true, message: "Response added successfully", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
