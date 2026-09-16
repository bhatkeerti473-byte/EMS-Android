const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guestController");
const { isAuthenticated } = require("../middleware/auth");

// --- Public RSVP Routes (No auth token needed for guests) ---
router.get("/public/rsvp/:token", guestController.getRSVPDetails);
router.post("/public/rsvp/:token", guestController.submitRSVP);

// --- Private Client-side Routes (Requires Authentication) ---
router.post("/create", isAuthenticated, guestController.addGuest);
router.post("/bulk", isAuthenticated, guestController.bulkAddGuests);
router.get("/event/:eventId", isAuthenticated, guestController.getGuestsForEvent);
router.put("/:guestId", isAuthenticated, guestController.updateGuest);
router.delete("/:guestId", isAuthenticated, guestController.deleteGuest);
router.post("/send-invitations", isAuthenticated, guestController.sendInvitations);
router.post("/attendance", isAuthenticated, guestController.markAttendance);

module.exports = router;
