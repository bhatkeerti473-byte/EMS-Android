const mongoose = require("mongoose");

const customDecorationRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    decorTitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    colorTheme: {
      type: String,
      default: "#e11d48",
    },
    flowerPreference: {
      type: String,
      enum: ["real", "artificial", "mixed", "none", ""],
      default: "mixed",
    },
    budget: {
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

module.exports = mongoose.model("CustomDecorationRequest", customDecorationRequestSchema);
