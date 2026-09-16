const express = require("express");
const router = express.Router();
const settingController = require("../controllers/settingController");

// Get all settings
router.get("/", settingController.getSettings);

// Update settings
router.put("/", settingController.updateSettings);

module.exports = router;
