const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true, enum: ["Equipment", "Furniture", "Electronics", "Other"] },
    quantity: { type: Number, required: true, default: 0 },
    unitCost: { type: Number, required: true, default: 0 },
    status: { type: String, default: "Available", enum: ["Available", "Low Stock", "Maintenance"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resource", resourceSchema);