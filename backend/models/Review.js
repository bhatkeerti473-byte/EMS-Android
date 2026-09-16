const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  categoryRatings: {
    venue: { type: Number, min: 1, max: 5 },
    catering: { type: Number, min: 1, max: 5 },
    decoration: { type: Number, min: 1, max: 5 },
    staff: { type: Number, min: 1, max: 5 }
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  tags: [{
    type: String
  }],
  recommend: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  adminResponse: {
    comment: { type: String },
    respondedAt: { type: Date }
  }
}, { timestamps: true });

// Ensure a client can only leave one review per booking
reviewSchema.index({ client: 1, booking: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
