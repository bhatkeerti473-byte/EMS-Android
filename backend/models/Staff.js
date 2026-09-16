const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: false },
  role: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: "Active" },
  photo: { type: String },
  assignedEvents: { type: Number, default: 0 },
  salary: { type: Number, default: 0 },
  employmentType: { type: String, default: "Full-time" },
  bankAccountNumber: { type: String, default: "" },
  ifscCode: { type: String, default: "" },
  upiId: { type: String, default: "" },
  paidSalaries: [{
    date: { type: Date, default: Date.now },
    amount: { type: Number },
    transactionId: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);