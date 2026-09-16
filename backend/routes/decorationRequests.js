const express = require("express");
const router = express.Router();
const customDecorationRequestController = require("../controllers/customDecorationRequestController");
const authMiddleware = require("../middleware/auth");

// POST /api/decoration-requests
// Protect this route so only logged-in users can create requests
router.post("/", authMiddleware.isAuthenticated, customDecorationRequestController.createRequest);

module.exports = router;
