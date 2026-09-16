const Notification = require("../models/Notification");
const Setting = require("../models/Setting");
const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

/**
 * Internal Helper to create & dispatch notifications to In-App, Email, and/or SMS
 */
const createNotification = async ({
    receiverId = null,
    receiverRole = "Client",
    category = "System",
    title,
    message,
    bookingId = "",
    taskId = "",
    sender = "System",
    channels = ["In-App"],
    contactEmail = "",
    contactPhone = "",
    metadata = {}
}) => {
    try {
        const notification = new Notification({
            receiverId,
            receiverRole,
            category,
            title,
            message,
            bookingId,
            taskId,
            sender,
            channels,
            metadata,
            status: "Sent"
        });

        await notification.save();

        // Email Dispatch if requested and email provided
        if (channels.includes("Email") && contactEmail) {
            sendEmail(contactEmail, `[EMS Alert] ${title}`, message)
                .then(result => {
                    if (!result || !result.success) {
                        console.log(`\n========================================\n[SIMULATED EMAIL DISPATCH] (SMTP Not Configured/Failed)\nTo: ${contactEmail}\nSubject: [EMS Alert] ${title}\nMessage: ${message}\n========================================\n`);
                    } else {
                        console.log(`\n========================================\n[REAL EMAIL SENT SUCCESSFULLY]\nTo: ${contactEmail}\nSubject: [EMS Alert] ${title}\n========================================\n`);
                    }
                })
                .catch(err => {
                    console.error("Async Email dispatch error:", err);
                    console.log(`\n========================================\n[SIMULATED EMAIL DISPATCH] (Failed)\nTo: ${contactEmail}\nSubject: [EMS Alert] ${title}\nMessage: ${message}\n========================================\n`);
                });
        }

        // SMS Dispatch if requested and phone provided
        if (channels.includes("SMS") && contactPhone) {
            sendSMS(contactPhone, `${title}: ${message}`)
                .then(result => {
                    if (!result || !result.success) {
                        console.log(`\n========================================\n[SIMULATED SMS DISPATCH] (Twilio Not Configured/Failed)\nTo: ${contactPhone}\nMessage: ${title}: ${message}\n========================================\n`);
                    } else {
                        console.log(`\n========================================\n[REAL SMS SENT SUCCESSFULLY]\nTo: ${contactPhone}\n========================================\n`);
                    }
                })
                .catch(err => {
                    console.error("Async SMS dispatch error:", err);
                    console.log(`\n========================================\n[SIMULATED SMS DISPATCH] (Failed)\nTo: ${contactPhone}\nMessage: ${title}: ${message}\n========================================\n`);
                });
        }

        return notification;
    } catch (error) {
        console.error("Error creating notification helper:", error);
        throw error;
    }
};

/**
 * Send a notification via API
 */
const sendNotification = async (req, res) => {
    try {
        const { receiverId, receiverRole, category, title, message, bookingId, taskId, sender, channels, contactEmail, contactPhone, metadata } = req.body;

        if (!receiverRole || !title || !message) {
            return res.status(400).json({ success: false, message: "Missing required fields (receiverRole, title, message)" });
        }

        const notification = await createNotification({
            receiverId,
            receiverRole,
            category: category || "System",
            title,
            message,
            bookingId: bookingId || "",
            taskId: taskId || "",
            sender: sender || "System",
            channels: channels || ["In-App"],
            contactEmail: contactEmail || "",
            contactPhone: contactPhone || "",
            metadata: metadata || {}
        });

        res.status(201).json({
            success: true,
            message: "Notification created & processed successfully",
            data: notification
        });
    } catch (error) {
        console.error("Error in sendNotification API:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Admin Manual Message Dispatch API
 */
const sendManualNotification = async (req, res) => {
    try {
        const { recipientType, recipientName, recipientId, recipientEmail, recipientPhone, category, title, message, bookingId, channels } = req.body;

        if (!recipientType || !title || !message) {
            return res.status(400).json({ success: false, message: "Recipient type, title, and message are required" });
        }

        const selectedChannels = Array.isArray(channels) && channels.length > 0 ? channels : ["In-App"];

        let targetId = recipientId;
        let resolvedEmail = recipientEmail;
        let resolvedPhone = recipientPhone;

        if (recipientType === "Client" || recipientType === "Staff" || recipientType === "Vendor") {
            const User = require("../models/User");
            let user = null;
            if (recipientEmail) {
                user = await User.findOne({ email: recipientEmail.toLowerCase().trim() });
            }
            if (!user && recipientPhone) {
                user = await User.findOne({ phone: recipientPhone.trim() });
            }
            if (!user && recipientName) {
                user = await User.findOne({ name: new RegExp(`^${recipientName.trim()}$`, "i") });
            }
            if (user) {
                targetId = user._id;
                resolvedEmail = user.email || resolvedEmail;
                resolvedPhone = user.phone || resolvedPhone;
            }
        }

        const notification = await createNotification({
            receiverId: targetId || null,
            receiverRole: recipientType, // Client, Staff, Vendor, or All
            category: category || "System",
            title,
            message,
            bookingId: bookingId || "",
            sender: "Admin",
            channels: selectedChannels,
            contactEmail: resolvedEmail || "",
            contactPhone: resolvedPhone || "",
            metadata: { manualDispatch: true, sentByAdmin: true, recipientName: recipientName || "" }
        });

        res.status(201).json({
            success: true,
            message: `Manual notification dispatched successfully via ${selectedChannels.join(", ")}`,
            data: notification
        });
    } catch (error) {
        console.error("Error in sendManualNotification:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Get all notifications for a specific user or role
 */
const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.query;

        let query = {};
        if (userId && userId !== "null" && userId !== "undefined") {
            query = {
                $or: [
                    { receiverId: userId },
                    { receiverRole: role || "Client" },
                    { receiverRole: "All" }
                ]
            };
        } else if (role) {
            query = {
                $or: [
                    { receiverRole: role },
                    { receiverRole: "All" }
                ]
            };
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Get all notifications for admin
 */
const getAdminNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { receiverRole: "Admin" },
                { receiverRole: "All" }
            ]
        }).sort({ createdAt: -1 }).limit(100);

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        console.error("Error fetching admin notifications:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Mark a single notification as read
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Mark all notifications as read for a specific user/role
 */
const markAllAsRead = async (req, res) => {
    try {
        const { userId, role } = req.body;

        let query = {};
        if (userId) {
            query = {
                $or: [
                    { receiverId: userId },
                    { receiverRole: role || "Client" }
                ]
            };
        } else if (role) {
            query = { receiverRole: role };
        }

        await Notification.updateMany(query, { isRead: true });

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Get system refund settings (Configurable 30% retention / 70% refund policy)
 */
const getRefundSettings = async (req, res) => {
    try {
        let setting = await Setting.findOne({ key: "refund_policy" });
        if (!setting) {
            setting = new Setting({
                key: "refund_policy",
                value: {
                    retentionRate: 30, // 30% retained
                    refundRate: 70     // 70% refunded
                },
                description: "Cancellation retention and refund percentages"
            });
            await setting.save();
        }

        res.status(200).json({
            success: true,
            data: setting.value
        });
    } catch (error) {
        console.error("Error fetching refund settings:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

/**
 * Update system refund settings
 */
const updateRefundSettings = async (req, res) => {
    try {
        const { retentionRate, refundRate } = req.body;

        if (retentionRate === undefined || refundRate === undefined) {
            return res.status(400).json({ success: false, message: "retentionRate and refundRate are required" });
        }

        const setting = await Setting.findOneAndUpdate(
            { key: "refund_policy" },
            {
                value: {
                    retentionRate: Number(retentionRate),
                    refundRate: Number(refundRate)
                }
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            success: true,
            message: "Refund settings updated successfully",
            data: setting.value
        });
    } catch (error) {
        console.error("Error updating refund settings:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

module.exports = {
    createNotification,
    sendNotification,
    sendManualNotification,
    getUserNotifications,
    getAdminNotifications,
    markAsRead,
    markAllAsRead,
    getRefundSettings,
    updateRefundSettings
};
