const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    booking_id: {
      type: String,
    },
    client_id: {
      type: String,
    },
    userId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    method: {
      type: String,
      enum: ["Cash", "UPI", "Debit/Credit Card", "Net Banking", "Razorpay"],
      required: true,
    },
    payment_method: {
      type: String,
      enum: ["Cash", "UPI", "Debit/Credit Card", "Net Banking", "Razorpay"],
    },
    status: {
      type: String,
      enum: ["Created", "Pending", "Paid", "Failed", "Success", "Refunded"],
      default: "Created",
    },
    razorpayOrderId: String,
    razorpay_order_id: String,
    razorpayPaymentId: String,
    razorpay_payment_id: String,
    razorpaySignature: String,
    razorpay_signature: String,
    receiptNumber: String,
    refund_id: String,
    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);
