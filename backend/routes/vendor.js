const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");

// GET all vendors
router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find();
    // Map _id to id for frontend compatibility
    const formattedVendors = vendors.map(vendor => {
      const vendorObj = vendor.toObject();
      vendorObj.id = vendorObj._id.toString();
      return vendorObj;
    });
    res.status(200).json(formattedVendors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching vendors", error: error.message });
  }
});

// POST new vendor
router.post("/", async (req, res) => {
  try {
    const newVendor = new Vendor(req.body);
    const savedVendor = await newVendor.save();
    const vendorObj = savedVendor.toObject();
    vendorObj.id = vendorObj._id.toString();
    res.status(201).json({ success: true, vendor: vendorObj });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create vendor", error: error.message });
  }
});

// PUT update vendor
router.put("/:id", async (req, res) => {
  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    const vendorObj = updatedVendor.toObject();
    vendorObj.id = vendorObj._id.toString();
    res.status(200).json({ success: true, vendor: vendorObj });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update vendor", error: error.message });
  }
});

// DELETE vendor
router.delete("/:id", async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!deletedVendor) {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
    res.status(200).json({ success: true, message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting vendor", error: error.message });
  }
});

module.exports = router;