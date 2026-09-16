const express = require("express");
const router = express.Router();
const Package = require("../models/Package");

// GET all active packages
router.get("/", async (req, res) => {
  try {
    const packages = await Package.find({ status: { $in: ["Active"] } }).sort({ offerPrice: 1 });
    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

// GET single package by ID
router.get("/:id", async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(pkg);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch package" });
  }
});

// POST create a new package
router.post("/", async (req, res) => {
  try {
    const newPackage = new Package(req.body);
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (err) {
    res.status(400).json({ error: "Failed to create package", details: err.message });
  }
});

// PUT update a package
router.put("/:id", async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json(updatedPackage);
  } catch (err) {
    res.status(400).json({ error: "Failed to update package", details: err.message });
  }
});

// DELETE a package
router.delete("/:id", async (req, res) => {
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) {
      return res.status(404).json({ error: "Package not found" });
    }
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete package" });
  }
});

module.exports = router;
