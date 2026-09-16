const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'EventStaffAssignment' },
  eventType: { type: String },
  venueId: { type: String },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  checkInTime: { type: Date, required: true },
  checkOutTime: { type: Date },
  workingHours: { type: Number, default: 0 },
  overtime: { type: Number, default: 0 },
  faceVerified: { type: Boolean, default: false },
  gpsVerified: { type: Boolean, default: false },
  deviceName: { type: String },
  ipAddress: { type: String },
  latitude: { type: Number },
  longitude: { type: Number },
  locationName: { type: String }, // e.g. Udupi, Mangalore
  status: { type: String, enum: ['Present', 'Absent', 'On Leave', 'Pending'], default: 'Present' },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
