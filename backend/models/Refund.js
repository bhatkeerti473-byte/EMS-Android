const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    userId: {
      type: String,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      required: true,
    },
    cancellationChargePercentage: {
      type: Number,
      required: true,
    },
    cancellationChargeAmount: {
      type: Number,
      required: true,
    },
    refundAmount: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Failed"],
      default: "Pending",
    },
    processedAt: {
      type: Date,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Refund", refundSchema);
