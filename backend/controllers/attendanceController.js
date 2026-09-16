const Attendance = require("../models/Attendance");
const Staff = require("../models/Staff");
const Event = require("../models/Event");

// Check In
exports.checkIn = async (req, res) => {
  try {
    const { staffId, eventId, assignmentId, eventType, venueId, date, checkInTime, faceVerified, gpsVerified, deviceName, ipAddress, latitude, longitude, locationName } = req.body;

    // Verify staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Ensure staff isn't already checked in for this assignment/event today
    let query = { staffId, date };
    if (assignmentId) {
      query.assignmentId = assignmentId;
    } else if (eventId) {
      query.eventId = eventId;
    }
    
    const existingAttendance = await Attendance.findOne(query);
    if (existingAttendance) {
      return res.status(400).json({ message: "Staff has already checked in today", attendance: existingAttendance });
    }

    const newAttendance = new Attendance({
      staffId,
      eventId,
      assignmentId,
      eventType,
      venueId,
      date,
      checkInTime: new Date(checkInTime),
      faceVerified,
      gpsVerified,
      deviceName,
      ipAddress,
      latitude,
      longitude,
      locationName,
      status: 'Present'
    });

    const savedAttendance = await newAttendance.save();
    res.status(201).json({ message: "Check-in successful", data: savedAttendance });

  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Server error during check-in", error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const { staffId, date, checkOutTime, assignmentId } = req.body;

    let query = { staffId, date };
    if (assignmentId) query.assignmentId = assignmentId;

    const attendance = await Attendance.findOne(query);
    if (!attendance) {
      return res.status(404).json({ message: "Check-in record not found for today" });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: "Staff has already checked out today" });
    }

    const outTime = new Date(checkOutTime);
    const inTime = new Date(attendance.checkInTime);

    // Calculate working hours
    const diffMs = outTime - inTime;
    const diffHrs = diffMs / (1000 * 60 * 60);

    let workingHours = parseFloat(diffHrs.toFixed(2));
    let overtime = 0;

    if (workingHours > 8) {
      overtime = parseFloat((workingHours - 8).toFixed(2));
      workingHours = 8;
    }

    attendance.checkOutTime = outTime;
    attendance.workingHours = workingHours;
    attendance.overtime = overtime;

    const savedAttendance = await attendance.save();
    res.status(200).json({ message: "Check-out successful", data: savedAttendance });

  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ message: "Server error during check-out", error: error.message });
  }
};

// Admin: Get all attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    // Populate staff details and event details
    const records = await Attendance.find()
      .populate('staffId', 'name role photo phone')
      .populate('eventId', 'eventTitle event_type date venue')
      .populate('assignmentId')
      .sort({ date: -1, checkInTime: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error("Error fetching all attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getStaffAttendance = async (req, res) => {
  try {
    const { staffId } = req.params;
    const records = await Attendance.find({ staffId })
      .populate('eventId', 'eventTitle event_type date venue')
      .populate('assignmentId')
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.error("Error fetching staff attendance:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
