const express = require("express");
const router = express.Router();
const assistantController = require("../controllers/assistantController");
const { isAuthenticated } = require("../middleware/auth");

/**
 * POST /api/assistant/chat
 * Handles chat interactions with the Smart Event Assistant
 */
router.post("/chat", isAuthenticated, assistantController.chat);

module.exports = router;
