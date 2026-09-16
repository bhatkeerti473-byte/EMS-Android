const express = require("express");
const router = express.Router();
const eventTypeRequestController = require("../controllers/eventTypeRequestController");
const authMiddleware = require("../middleware/auth");

// POST /api/event-type-requests
// Protect this route so only logged-in users can create requests
router.post("/", authMiddleware.isAuthenticated, eventTypeRequestController.createRequest);

module.exports = router;
