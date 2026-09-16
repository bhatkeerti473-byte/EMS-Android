const mongoose = require("mongoose");

const eventStaffAssignmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    reportingDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    reportingTime: {
      type: String, // Format: HH:MM AM/PM
      required: true,
    },
    eventDate: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    eventStartTime: {
      type: String,
      required: true,
    },
    eventEndTime: {
      type: String,
      required: true,
    },
    responsibilities: {
      type: String,
    },
    clientPreferences: {
      type: String,
    },
    assignmentStatus: {
      type: String,
      enum: ["Assigned", "Notification Sent", "Read", "Accepted", "In Progress", "Completed"],
      default: "Assigned",
    },
    notificationStatus: {
      type: String,
      enum: ["Unread", "Read"],
      default: "Unread",
    },
    readAt: {
      type: Date,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Finance",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("EventStaffAssignment", eventStaffAssignmentSchema);
