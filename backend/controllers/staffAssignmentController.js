const EventStaffAssignment = require("../models/EventStaffAssignment");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Staff = require("../models/Staff");

// 1. Assign Staff to an Event
exports.assignStaff = async (req, res) => {
  try {
    const {
      employeeId,
      eventId,
      role,
      reportingDate,
      reportingTime,
      eventDate,
      eventStartTime,
      eventEndTime,
      responsibilities,
      clientPreferences,
      adminMessage
    } = req.body;

    const staff = await Staff.findById(employeeId);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    const booking = await Booking.findById(eventId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Conflict Check: Is the staff already assigned to another event on the same reportingDate and time overlap?
    // For simplicity, we check if they have ANY assignment on the same reportingDate
    const existingAssignment = await EventStaffAssignment.findOne({
      employeeId,
      reportingDate,
      assignmentStatus: { $nin: ["Completed", "Cancelled"] }
    });

    if (existingAssignment) {
      return res.status(409).json({ 
        success: false, 
        message: "Conflict: Staff member is already assigned to another task on this reporting date." 
      });
    }

    const assignment = new EventStaffAssignment({
      employeeId,
      eventId,
      role,
      reportingDate,
      reportingTime,
      eventDate,
      eventStartTime,
      eventEndTime,
      responsibilities,
      clientPreferences,
      assignmentStatus: "Notification Sent",
    });

    await assignment.save();

    // Create Notification for the staff
    const venuePhoto = booking.venueImage || booking.ownVenueDetails?.photo || "";
    const cateringInfo = booking.cateringPackage ? `Catering: ${booking.cateringPackage}` : "";
    const seatingInfo = booking.seatingArrangement?.seatingType ? `Seating: ${booking.seatingArrangement.seatingType}` : "";
    
    let richMessage = `You have been assigned to ${booking.eventTitle || booking.event_type} at ${booking.venueName || "Venue"}.\n`;
    richMessage += `Address: ${booking.location || "N/A"}\n`;
    if (cateringInfo) richMessage += `${cateringInfo}\n`;
    if (seatingInfo) richMessage += `${seatingInfo}\n`;
    if (adminMessage) richMessage += `Admin Note: ${adminMessage}\n`;
    if (venuePhoto) richMessage += `[PHOTO:${venuePhoto}]\n`;

    const notification = new Notification({
      userId: employeeId,
      userType: "Staff",
      title: "New Event Assignment",
      message: richMessage.trim(),
      type: "Assignment",
      link: `/staff/assignments/${assignment._id}`,
    });
    await notification.save();

    // Create Notification for the Client
    if (booking.client_id) {
      const clientNotification = new Notification({
        userId: booking.client_id, // Assuming client_id matches the User schema ID for the client
        userType: "Client",
        title: "Staff Assigned to Your Event",
        message: `An event staff (${staff.name} - ${role}) has been successfully assigned to your upcoming ${booking.eventTitle || booking.event_type} event.`,
        type: "System",
        link: `/user/dashboard/bookings`, // Link to their bookings
      });
      await clientNotification.save();
    }

    res.status(201).json({ success: true, message: "Staff assigned successfully", assignment });
  } catch (error) {
    console.error("Assign Staff Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 2. Get assignments by event (For Admin)
exports.getAssignmentsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const assignments = await EventStaffAssignment.find({ eventId }).populate("employeeId", "name email phone role photo");
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 3. Get assignments for a specific staff (For Staff Dashboard)
exports.getAssignmentsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;
    const assignments = await EventStaffAssignment.find({ employeeId: staffId })
      .populate("eventId", "event_type event_date venueName location guests");
    res.status(200).json({ success: true, assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 4. Update assignment status (Accept, Complete, Read Notification)
exports.updateAssignmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignmentStatus, notificationStatus } = req.body;

    const assignment = await EventStaffAssignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    if (assignmentStatus) assignment.assignmentStatus = assignmentStatus;
    if (notificationStatus) {
      assignment.notificationStatus = notificationStatus;
      if (notificationStatus === "Read") assignment.readAt = new Date();
    }

    await assignment.save();
    res.status(200).json({ success: true, message: "Assignment updated", assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// 5. Get available staff (Conflict Check for UI)
exports.getAvailableStaff = async (req, res) => {
  try {
    const { date, type } = req.query; // date = reportingDate
    
    // Find all staff of the requested type
    let staffQuery = {};
    if (type) {
      staffQuery.role = type;
    }
    const staffList = await Staff.find(staffQuery);
    
    // If no date provided, return all as available
    if (!date) {
       return res.status(200).json({ success: true, availableStaff: staffList, busyStaffIds: [] });
    }

    // Find assignments on this date
    const assignmentsOnDate = await EventStaffAssignment.find({
      reportingDate: date,
      assignmentStatus: { $nin: ["Completed", "Cancelled"] }
    });

    const busyStaffIds = assignmentsOnDate.map(a => a.employeeId.toString());
    
    const availableStaff = staffList.filter(s => !busyStaffIds.includes(s._id.toString()));

    res.status(200).json({ 
      success: true, 
      availableStaff,
      busyStaffIds
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

