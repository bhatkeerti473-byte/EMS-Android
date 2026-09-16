const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        refPath: "receiverRole" // Dynamically reference based on role
    },
    receiverRole: {
        type: String,
        required: true,
        enum: ["Admin", "Staff", "Vendor", "Client", "All"]
    },
    category: {
        type: String,
        enum: ["Booking", "Payment", "Event", "Venue", "Service", "Staff", "Vendor", "Task", "Reminder", "System"],
        default: "System"
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["In-App", "SMS", "Email"],
        default: "In-App"
    },
    channels: [{
        type: String,
        enum: ["In-App", "Email", "SMS"]
    }],
    bookingId: {
        type: String,
        default: ""
    },
    taskId: {
        type: String,
        default: ""
    },
    sender: {
        type: String,
        default: "System"
    },
    status: {
        type: String,
        enum: ["Pending", "Sent", "Failed"],
        default: "Sent"
    },
    isRead: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

notificationSchema.post('save', function(doc) {
  if (global.io) {
    if (doc.receiverRole === "Admin") {
      global.io.to("Admin").emit("new_notification", doc);
    } else if (doc.receiverId) {
      global.io.to(doc.receiverId.toString()).emit("new_notification", doc);
    } else if (doc.receiverRole === "All") {
      global.io.emit("new_notification", doc);
    }
  }
});

module.exports = mongoose.model("Notification", notificationSchema);
