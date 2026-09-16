const mongoose = require("mongoose");

const eventResourceSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    resourceType: {
      type: String,
      enum: ["Staff", "Vendor", "Equipment", "Catering", "Venue", "Other"],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    cost: {
      type: Number,
      required: false,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Available", "Allocated", "In Use", "Completed"],
      default: "Available",
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventResource", eventResourceSchema);
