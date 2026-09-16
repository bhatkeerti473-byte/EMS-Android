const mongoose = require("mongoose");

const attendanceLogSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Attended", "Absent"],
      default: "Attended",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AttendanceLog", attendanceLogSchema);
