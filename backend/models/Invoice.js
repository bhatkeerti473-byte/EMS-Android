const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    clientName: String,
    clientEmail: String,
    eventTitle: String,
    venueName: String,
    eventDate: String,
    currency: {
      type: String,
      default: "INR",
    },
    baseAmount: {
      type: Number,
      required: true,
    },
    taxRate: {
      type: Number,
      default: 18,
    },
    taxAmount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Partially Paid", "Paid", "Cancelled"],
      default: "Pending",
    },
    dueDate: Date,
    receiptNumber: String,
    receiptGeneratedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
