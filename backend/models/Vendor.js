const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    contactPerson: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: "Active" },
    rating: { type: Number, default: 0 },
    contractPrice: { type: Number, default: 0 },
    contractBasis: { type: String, default: "Per Event" },
    bankAccountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    upiId: { type: String, default: "" },
    paidAmounts: [{
      date: { type: Date, default: Date.now },
      amount: { type: Number },
      transactionId: { type: String }
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);