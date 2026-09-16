const mongoose = require("mongoose");

const eventScheduleSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    venue: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      capacity: Number,
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    milestones: [
      {
        title: String,
        dueDate: Date,
        status: {
          type: String,
          enum: ["Pending", "In Progress", "Completed"],
          default: "Pending",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EventSchedule", eventScheduleSchema);
