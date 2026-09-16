const express = require("express");
const router = express.Router();
const staffAssignmentController = require("../controllers/staffAssignmentController");

// Create a new staff assignment
router.post("/assign", staffAssignmentController.assignStaff);

// Get available staff
router.get("/available", staffAssignmentController.getAvailableStaff);

// Get assignments for a specific event booking
router.get("/event/:eventId", staffAssignmentController.getAssignmentsByEvent);

// Get assignments for a specific staff member
router.get("/staff/:staffId", staffAssignmentController.getAssignmentsByStaff);

// Update assignment status (e.g. Accept, Complete)
router.put("/:id/status", staffAssignmentController.updateAssignmentStatus);

module.exports = router;
