const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/auth");

/**
 * POST /api/bookings/check-and-reserve
 * * Check availability and create booking
 * (Public endpoint - no auth required for initial check)
 */
router.post("/check-and-reserve", bookingController.checkAndReserve);

/**
 * GET /api/bookings/availability
 * * Check venue availability for a specific date
 */
router.get("/availability", bookingController.checkAvailability);

/**
 * POST /api/bookings/match-score
 * * Get package match score based on event details
 */
router.post("/match-score", bookingController.getMatchScore);

/**
 * POST /api/bookings/confirm-payment
 * * Confirm payment and update booking status to 'Confirmed'
 */
router.post("/confirm-payment", bookingController.confirmPayment);

/**
 * GET /api/bookings/user/:identifier
 * * Get all bookings for a user (by phone number, client_id, or userId)
 */
router.get("/user/:identifier", bookingController.getUserBookings);

/**
 * GET /api/bookings/:bookingId
 * * Get specific booking details
 */
router.get("/:bookingId", bookingController.getBooking);

/**
 * GET /api/bookings
 * * Get all pending bookings (Admin only)
 */
router.get("/", bookingController.getBookings);

/**
 * PUT /api/bookings/:bookingId/approve
 * * Admin approve booking
 */
router.put("/:bookingId/approve", bookingController.approveBooking);

/**
 * PUT /api/bookings/:bookingId/reject
 * * Admin reject booking
 */
router.put("/:bookingId/reject", bookingController.rejectBooking);

/**
 * PUT /api/bookings/:bookingId/admin-cancel
 * * Admin cancel confirmed booking
 */
router.put("/:bookingId/admin-cancel", bookingController.adminCancelBooking);

/**
 * PUT /api/bookings/:bookingId/request-changes
 * * Admin request changes to booking
 */
router.put("/:bookingId/request-changes", bookingController.requestChanges);

/**
 * POST /api/bookings/:bookingId/cancel
 * * Client cancel booking
 */
router.post("/:bookingId/cancel", authMiddleware.isAuthenticated, bookingController.cancelBooking);

/**
 * PUT /api/bookings/:bookingId
 * * Generic booking update
 */
router.put("/:bookingId", bookingController.updateBooking);

/**
 * DELETE /api/bookings/:bookingId
 * * Permanently delete an event/booking from the database (Admin only)
 */
router.delete("/:bookingId", bookingController.deleteBooking);

module.exports = router;