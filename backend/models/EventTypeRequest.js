const mongoose = require("mongoose");

const eventTypeRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventTypeName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    expectedDate: {
      type: Date,
      required: true,
    },
    expectedGuests: {
      type: Number,
    },
    locationType: {
      type: String,
      enum: ["indoor", "outdoor", "both", ""],
      default: "",
    },
    budgetRange: {
      type: String,
      default: "",
    },
    specialRequirements: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventTypeRequest", eventTypeRequestSchema);
