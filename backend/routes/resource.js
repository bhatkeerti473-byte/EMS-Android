const express = require("express");
const router = express.Router();
const Resource = require("../models/Resource");

// GET all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    const formattedResources = resources.map(resource => {
      const resourceObj = resource.toObject();
      resourceObj.id = resourceObj._id.toString();
      return resourceObj;
    });
    res.status(200).json(formattedResources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources", error: error.message });
  }
});

// POST new resource
router.post("/", async (req, res) => {
  try {
    const newResource = new Resource(req.body);
    const savedResource = await newResource.save();
    const resourceObj = savedResource.toObject();
    resourceObj.id = resourceObj._id.toString();
    res.status(201).json({ success: true, resource: resourceObj });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create resource", error: error.message });
  }
});

// PUT update resource
router.put("/:id", async (req, res) => {
  try {
    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedResource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    const resourceObj = updatedResource.toObject();
    resourceObj.id = resourceObj._id.toString();
    res.status(200).json({ success: true, resource: resourceObj });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update resource", error: error.message });
  }
});

// DELETE resource
router.delete("/:id", async (req, res) => {
  try {
    const deletedResource = await Resource.findByIdAndDelete(req.params.id);
    if (!deletedResource) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    res.status(200).json({ success: true, message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting resource", error: error.message });
  }
});

module.exports = router;