const express = require("express");
const {
    sendNotification,
    sendManualNotification,
    getUserNotifications,
    getAdminNotifications,
    markAsRead,
    markAllAsRead,
    getRefundSettings,
    updateRefundSettings
} = require("../controllers/notificationController");

const router = express.Router();

// Route to send a new system notification
router.post("/send", sendNotification);
router.post("/", sendNotification); // Alias for components using base route

// Route for Admin manual message dispatch
router.post("/manual", sendManualNotification);

// Route to get admin notifications
router.get("/admin/all", getAdminNotifications);

// Routes for Configurable Refund Policy Settings
router.get("/settings/refund", getRefundSettings);
router.put("/settings/refund", updateRefundSettings);

// Route to mark all notifications as read
router.put("/mark-all-read", markAllAsRead);

// Route to mark a single notification as read
router.put("/:id/read", markAsRead);

// Route to get notifications for a specific user or role
router.get("/:userId", getUserNotifications);
router.get("/", getUserNotifications); // Alias for queries without userId (like ?role=Staff)

module.exports = router;
