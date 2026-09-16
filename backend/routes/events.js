const express = require("express");
const eventController = require("../controllers/eventController");
const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

// Event endpoints
router.get("/", eventController.getAllEvents);
router.post("/create", isAuthenticated, eventController.createEvent);
router.get("/user-events", isAuthenticated, eventController.getUserEvents);
router.get("/:eventId", isAuthenticated, eventController.getEventDetails);
router.put("/:eventId", isAuthenticated, eventController.updateEvent);
router.delete("/:eventId", isAuthenticated, eventController.deleteEvent);

// Event schedule endpoints
router.post("/schedule/save", isAuthenticated, eventController.saveEventSchedule);

// Event resource endpoints
router.post("/resource/add", isAuthenticated, eventController.addEventResource);
router.put("/resource/:resourceId", isAuthenticated, eventController.updateEventResource);
router.delete("/resource/:resourceId", isAuthenticated, eventController.deleteEventResource);

// Stats endpoint
router.get("/stats/overview", isAuthenticated, eventController.getEventStats);

module.exports = router;
