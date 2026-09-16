const mongoose = require("mongoose");
const Guest = require("../models/Guest");
const Invitation = require("../models/Invitation");
const AttendanceLog = require("../models/AttendanceLog");
const Event = require("../models/Event");
const { sendEmail } = require("../services/emailService");
const crypto = require("crypto");

// 1. Add single guest
exports.addGuest = async (req, res) => {
  try {
    const { eventId, name, email, phone, category } = req.body;

    if (!eventId || !name || !email) {
      return res.status(400).json({ success: false, message: "Event ID, Name, and Email are required." });
    }

    // Generate unique token for guest RSVP link
    const invitationToken = crypto.randomBytes(16).toString("hex");

    const newGuest = new Guest({
      eventId,
      name,
      email,
      phone,
      category,
      rsvpStatus: "Pending",
      invitationToken,
    });

    await newGuest.save();

    // Create a corresponding invitation tracker
    const newInvitation = new Invitation({
      guestId: newGuest._id,
      eventId,
      status: "Not Sent",
    });
    await newInvitation.save();

    res.status(201).json({ success: true, guest: newGuest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to add guest", error: error.message });
  }
};

// 2. Bulk add guests
exports.bulkAddGuests = async (req, res) => {
  try {
    const { eventId, guests } = req.body;

    if (!eventId || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, message: "Event ID and list of guests are required." });
    }

    const guestsToInsert = [];
    const invitationsToInsert = [];

    for (const g of guests) {
      if (!g.name || !g.email) continue;
      
      const token = crypto.randomBytes(16).toString("hex");
      const guestId = new mongoose.Types.ObjectId();

      guestsToInsert.push({
        _id: guestId,
        eventId,
        name: g.name,
        email: g.email,
        phone: g.phone || "",
        category: g.category || "General Guests",
        rsvpStatus: "Pending",
        invitationToken: token,
      });

      invitationsToInsert.push({
        guestId,
        eventId,
        status: "Not Sent",
      });
    }

    if (guestsToInsert.length === 0) {
      return res.status(400).json({ success: false, message: "No valid guests to insert." });
    }

    const insertedGuests = await Guest.insertMany(guestsToInsert);
    await Invitation.insertMany(invitationsToInsert);

    res.status(201).json({ success: true, count: insertedGuests.length, guests: insertedGuests });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to bulk add guests", error: error.message });
  }
};

// 3. Get guests & RSVP & Attendance info for an event
exports.getGuestsForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }

    const guests = await Guest.find({ eventId });
    const invitations = await Invitation.find({ eventId });
    const attendanceLogs = await AttendanceLog.find({ eventId });

    res.status(200).json({
      success: true,
      guests,
      invitations,
      attendanceLogs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch event guests", error: error.message });
  }
};

// 4. Update guest details
exports.updateGuest = async (req, res) => {
  try {
    const { guestId } = req.params;
    const updates = req.body;

    const guest = await Guest.findByIdAndUpdate(guestId, updates, { new: true });
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found." });
    }

    res.status(200).json({ success: true, guest });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update guest", error: error.message });
  }
};

// 5. Delete guest
exports.deleteGuest = async (req, res) => {
  try {
    const { guestId } = req.params;

    const guest = await Guest.findByIdAndDelete(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found." });
    }

    // Clean up associated logs
    await Invitation.deleteMany({ guestId });
    await AttendanceLog.deleteMany({ guestId });

    res.status(200).json({ success: true, message: "Guest and related records deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete guest", error: error.message });
  }
};

// 6. Send email invitations (Nodemailer dispatch)
exports.sendInvitations = async (req, res) => {
  try {
    const { eventId, guestIds } = req.body;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "Event ID is required." });
    }

    // Query event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    // Determine target guests
    const query = { eventId };
    if (Array.isArray(guestIds) && guestIds.length > 0) {
      query._id = { $in: guestIds };
    }

    const guests = await Guest.find(query);
    if (guests.length === 0) {
      return res.status(404).json({ success: false, message: "No guests found to invite." });
    }

    let sentCount = 0;
    const clientOrigin = req.headers.origin || "http://localhost:3000";

    for (const guest of guests) {
      // Create invitation token if not exists
      if (!guest.invitationToken) {
        guest.invitationToken = crypto.randomBytes(16).toString("hex");
        await guest.save();
      }

      const rsvpLink = `${clientOrigin}/rsvp/${guest.invitationToken}`;
      
      const subject = `You're Invited: ${event.title}`;
      const text = `Hello ${guest.name},\n\nYou are cordially invited to ${event.title}.\nCategory: ${event.category}\n\nPlease RSVP by visiting: ${rsvpLink}\n\nBest Regards,\n${event.description || "Event Organizer"}`;
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #4f46e5; margin-bottom: 8px;">Exclusive Invitation</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">Hello <strong>${guest.name}</strong>,</p>
          <p style="font-size: 16px; color: #334155; line-height: 1.5;">You are cordially invited to attend the event: <strong>${event.title}</strong>.</p>
          <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 12px; margin: 18px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #475569;"><strong>Category:</strong> ${event.category}</p>
            ${event.description ? `<p style="margin: 4px 0 0; font-size: 14px; color: #475569;"><strong>Details:</strong> ${event.description}</p>` : ""}
          </div>
          <p style="font-size: 16px; color: #334155; line-height: 1.5; margin-bottom: 24px;">Please confirm your attendance status by clicking the RSVP button below:</p>
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${rsvpLink}" style="background-color: #4f46e5; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">RSVP HERE</a>
          </div>
          <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px;">If the button doesn't work, you can copy and paste this link: <br/> ${rsvpLink}</p>
        </div>
      `;

      const mailResult = await sendEmail(guest.email, subject, text, html);

      if (mailResult.success) {
        sentCount++;
        // Update Invitation Tracker
        await Invitation.findOneAndUpdate(
          { guestId: guest._id, eventId },
          { status: "Sent", sentAt: new Date() },
          { upsert: true }
        );
      }
    }

    res.status(200).json({ success: true, message: `Successfully sent ${sentCount} invitations.`, sentCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to dispatch invitations", error: error.message });
  }
};

// 7. PUBLIC API: Get Guest RSVP Details by token
exports.getRSVPDetails = async (req, res) => {
  try {
    const { token } = req.params;

    const guest = await Guest.findOne({ invitationToken: token });
    if (!guest) {
      return res.status(404).json({ success: false, message: "Invalid or expired invitation token." });
    }

    const event = await Event.findById(guest.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Associated event not found." });
    }

    // Retrieve schedule info if any
    const EventSchedule = mongoose.models.EventSchedule;
    let schedule = null;
    if (EventSchedule) {
      schedule = await EventSchedule.findOne({ eventId: guest.eventId }).populate("venue");
    }

    // Mark invitation status as "Viewed"
    await Invitation.updateOne(
      { guestId: guest._id, eventId: guest.eventId },
      { status: "Viewed" }
    );

    res.status(200).json({
      success: true,
      guest: {
        name: guest.name,
        email: guest.email,
        category: guest.category,
        rsvpStatus: guest.rsvpStatus,
      },
      event: {
        title: event.title,
        category: event.category,
        description: event.description,
      },
      schedule,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load RSVP details", error: error.message });
  }
};

// 8. PUBLIC API: Submit Guest RSVP Answer
exports.submitRSVP = async (req, res) => {
  try {
    const { token } = req.params;
    const { rsvpStatus } = req.body; // 'Confirmed' or 'Declined'

    if (!["Confirmed", "Declined"].includes(rsvpStatus)) {
      return res.status(400).json({ success: false, message: "Invalid RSVP Status." });
    }

    const guest = await Guest.findOne({ invitationToken: token });
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest invitation not found." });
    }

    // Update guest RSVP status
    guest.rsvpStatus = rsvpStatus;
    await guest.save();

    // Update Invitation record
    await Invitation.updateOne(
      { guestId: guest._id, eventId: guest.eventId },
      { status: "Responded" }
    );

    res.status(200).json({ success: true, message: `RSVP updated successfully to ${rsvpStatus}.`, rsvpStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit RSVP response", error: error.message });
  }
};

// 9. Mark Attendance Check-In
exports.markAttendance = async (req, res) => {
  try {
    const { guestId, eventId, status } = req.body; // status: 'Attended' or 'Absent'

    if (!guestId || !eventId || !["Attended", "Absent"].includes(status)) {
      return res.status(400).json({ success: false, message: "Guest ID, Event ID, and status are required." });
    }

    const guest = await Guest.findById(guestId);
    if (!guest) {
      return res.status(404).json({ success: false, message: "Guest not found." });
    }

    if (status === "Attended") {
      // Upsert attendance log
      await AttendanceLog.findOneAndUpdate(
        { guestId, eventId },
        { checkInTime: new Date(), status: "Attended" },
        { upsert: true, new: true }
      );
    } else {
      // Remove or set status to absent
      await AttendanceLog.deleteOne({ guestId, eventId });
    }

    // Update currentAttendees count in the Event model
    const actualAttendanceCount = await AttendanceLog.countDocuments({ eventId, status: "Attended" });
    await Event.findByIdAndUpdate(eventId, { currentAttendees: actualAttendanceCount });

    res.status(200).json({ success: true, message: `Attendance updated to ${status}.`, currentAttendees: actualAttendanceCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update attendance log", error: error.message });
  }
};
