const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Wedding", "Birthday Party", "Corporate Event", "Conference", "Concert", "Exhibition"],
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Planning", "Scheduled", "Ongoing", "Completed", "Cancelled"],
      default: "Planning",
    },
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revenue: {
      type: Number,
      default: 0,
    },
    maxAttendees: {
      type: Number,
      required: false,
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
