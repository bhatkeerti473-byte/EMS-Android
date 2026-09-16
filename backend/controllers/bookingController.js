const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const EventSchedule = require("../models/EventSchedule");
const Notification = require("../models/Notification");
const Package = require("../models/Package");
const { sendEmail } = require("../services/emailService");
const { generateBookingConfirmationEmail } = require("../utils/emailTemplates");

/**
 * POST /api/bookings/check-and-reserve
 * * STEP 1: Check for duplicate bookings (same phone/client_id, event_type, event_date)
 * STEP 2: Check venue availability
 * - PATH A: If available → return instantBooking: true, tentatively block date
 * - PATH B: If constraints exist → save with 'Pending Approval' status, return instantBooking: false
 */
exports.checkAndReserve = async (req, res) => {
  try {
    const {
      client_id,
      phone_number,
      userId,
      clientName,
      clientEmail,
      event_type,
      eventTitle,
      event_date,
      time_slot,
      venue_id,
      venueName,
      catering_details,
      staff_requirements,
      total_cost,
      address,
      venue_name,
      image,
      hallType,
      decorationPackage,
      cateringPackage,
      cakeName,
      cakePrice,
      cakeText,
      cakeEggless,
      cakeWeight,
      additionalServices,
      seatingArrangement,
    } = req.body;

    // Validate required fields
    if (!phone_number || !event_date || !venue_id || !total_cost) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // STEP 1: Duplicate Safeguard
    // The user requested to allow multiple bookings on the same date, so we bypass this check.



    // STEP 2: Availability Routing Check
    // Check if the requested event_date and venue_id are completely free
    const venueBookingsOnDate = await Booking.find({
      venue_id: venue_id,
      event_date: new Date(event_date),
      $or: [
        { booking_status: { $in: ["Approved - Awaiting Payment", "Confirmed"] } },
        { 
          booking_status: "Temporarily Held", 
          holdExpiresAt: { $gt: new Date() } 
        }
      ]
    });

    const eventSchedulesOnDate = await EventSchedule.find({
      "venue.name": venueName || venue_name,
      startDate: {
        $lte: new Date(event_date)
      },
      endDate: {
        $gte: new Date(event_date)
      }
    });

    // Check for time slot conflicts
    const timeSlotConflict = venueBookingsOnDate.some(booking => {
      return booking.time_slot === time_slot;
    });

    // PATH A: Instant Booking (Date is 100% free)
    if (venueBookingsOnDate.length === 0 && eventSchedulesOnDate.length === 0 && !timeSlotConflict) {
      // Create booking with instantBooking: true
      const bookingReference = `BK-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking = new Booking({
        bookingReference,
        client_id,
        phone_number,
        userId,
        clientName,
        clientEmail,
        address,
        event_type,
        eventTitle,
        event_date: new Date(event_date),
        time_slot,
        venue_id,
        venueName: venueName || venue_name,
        catering_details,
        staff_requirements,
        total_cost,
        amount: total_cost,
        guests: catering_details?.guest_count,
        location: address,
        image,
        booking_status: "Temporarily Held",
        holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes hold
        status: "Approved",
        instantBooking: true,
        hallType,
        decorationPackage,
        cateringPackage,
        cakeName,
        cakePrice,
        cakeText,
        cakeEggless,
        cakeWeight,
        additionalServices,
        seatingArrangement,
      });

      await newBooking.save();

      // Create Admin Notification
      await Notification.create({
        receiverRole: "Admin",
        category: "Booking",
        title: "New Booking Reserved",
        message: `A new instant booking was made for ${eventTitle} by ${clientName || "Client"}.`,
        type: "In-App",
        bookingId: newBooking._id,
        sender: "Client",
        metadata: {
          bookingId: newBooking._id,
          clientId: client_id,
          clientName,
          phone: phone_number,
          eventSelected: eventTitle,
          venueSelected: venueName || venue_name,
          messageType: "Booking Complete"
        }
      });

      // Create Client Notification
      await Notification.create({
        receiverId: userId || client_id,
        receiverRole: "Client",
        category: "Booking",
        title: "Booking Submitted",
        message: "Your booking request has been submitted successfully.",
        bookingId: newBooking._id,
        sender: "System"
      });

      // Tentatively block the date
      // In a production system, you might mark the venue as unavailable for this time slot

      return res.status(201).json({
        success: true,
        instantBooking: true,
        booking_id: newBooking._id,
        advanceDue: (total_cost * 0.3).toFixed(2),
        message: "Venue is available! Proceed to payment.",
        data: newBooking
      });
    }

    // PATH B: Unavailable (Date/Time Slot has conflicts)
    else {
      return res.status(409).json({
        success: false,
        message: "This venue is no longer available for the selected date and time slot. Please choose another date or venue."
      });
    }

  } catch (error) {
    console.error("----- BOOKING CHECK ERROR -----");
    console.error("Message:", error.message);
    if (error.name === "ValidationError") {
      console.error("Validation Errors:", error.errors);
    }
    console.error("Stack:", error.stack);
    console.error("-------------------------------");
    res.status(500).json({
      message: "Server error during booking check",
      error: error.message,
      details: error.errors
    });
  }
};

/**
 * POST /api/bookings/confirm-payment
 * * Update booking status to 'Confirmed' after successful payment
 */
exports.confirmPayment = async (req, res) => {
  try {
    const { client_id, booking_id, amount_paid } = req.body;

    if (!booking_id || !amount_paid) {
      return res.status(400).json({
        message: "Missing booking_id or amount_paid"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        booking_status: "Confirmed",
        advance_paid: amount_paid,
        paymentConfirmedAt: new Date()
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    let bookingData = booking.toObject ? booking.toObject() : booking;
    
    // Fetch venue image if not present in booking
    if (!bookingData.image && (bookingData.venue_id || bookingData.venueId || bookingData.venueName)) {
      try {
        const vId = bookingData.venue_id || bookingData.venueId;
        let venue = null;
        if (vId && mongoose.Types.ObjectId.isValid(vId)) {
          venue = await Venue.findById(vId).lean();
        }
        if (!venue && bookingData.venueName) {
          venue = await Venue.findOne({ name: bookingData.venueName }).lean();
        }
        if (venue && venue.images && venue.images.length > 0) {
          bookingData.image = venue.images[0];
        }
      } catch (err) {
        console.error("Error fetching venue for email image:", err.message);
      }
    }

    // Send confirmation email
    if (bookingData.clientEmail) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const emailHtml = generateBookingConfirmationEmail(bookingData, frontendUrl);
      
      sendEmail(
        bookingData.clientEmail,
        "Booking Confirmed! - Event Management System",
        "Your event booking has been confirmed.",
        emailHtml
      ).catch(err => console.error("Failed to send booking confirmation email:", err));
    }

    return res.status(200).json({
      success: true,
      message: "Payment confirmed. Booking is now active.",
      data: booking
    });
  } catch (error) {
    console.error("Error in confirmPayment:", error);
    res.status(500).json({
      message: "Server error during payment confirmation",
      error: error.message
    });
  }
};

/**
 * GET /api/bookings/:bookingId
 * * Retrieve booking details
 */
exports.getBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    let booking = await Booking.findById(bookingId).lean();

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // Link the correct venue image dynamically
    if (booking.venue_id || booking.venueId || booking.venueName) {
      try {
        const vId = booking.venue_id || booking.venueId;
        let venue = null;
        
        if (vId && mongoose.Types.ObjectId.isValid(vId)) {
          venue = await Venue.findById(vId).lean();
        }
        
        if (!venue && booking.venueName) {
          venue = await Venue.findOne({ name: booking.venueName }).lean();
        }

        if (venue && venue.images && venue.images.length > 0) {
          booking.image = venue.images[0];
        }
      } catch (err) {
        console.error("Error fetching venue for image:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error("Error in getBooking:", error);
    res.status(500).json({
      message: "Server error retrieving booking",
      error: error.message
    });
  }
};

/**
 * GET /api/bookings/user/:phoneNumber
 * * Get all bookings for a specific user (by phone number)
 */
exports.getUserBookings = async (req, res) => {
  try {
    // The route is defined as /user/:identifier
    const { identifier } = req.params;

    const query = {
      $or: [
        { phone_number: identifier },
        { client_id: identifier },
        { clientEmail: identifier },
        { userId: identifier },
      ],
    };

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      query.$or.push({ userId: identifier });
    }

    let bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

    // Link the correct venue images dynamically for all user bookings
    const validVenueIds = [];
    const venueNames = [];
    
    bookings.forEach(b => {
      const vId = b.venue_id || b.venueId;
      if (vId && mongoose.Types.ObjectId.isValid(vId)) {
        validVenueIds.push(vId);
      } else if (b.venueName) {
        venueNames.push(b.venueName);
      }
    });

    if (validVenueIds.length > 0 || venueNames.length > 0) {
      try {
        const queryOr = [];
        if (validVenueIds.length > 0) queryOr.push({ _id: { $in: validVenueIds } });
        if (venueNames.length > 0) queryOr.push({ name: { $in: venueNames } });

        const venues = await Venue.find({ $or: queryOr }).lean();
        const venueIdMap = {};
        const venueNameMap = {};
        
        venues.forEach(v => {
          if (v.images && v.images.length > 0) {
            venueIdMap[v._id.toString()] = v.images[0];
            if (v.name) venueNameMap[v.name] = v.images[0];
          }
        });
        
        bookings = bookings.map(b => {
          const vId = (b.venue_id || b.venueId)?.toString();
          if (vId && venueIdMap[vId]) {
            b.image = venueIdMap[vId];
          } else if (b.venueName && venueNameMap[b.venueName]) {
            b.image = venueNameMap[b.venueName];
          }
          return b;
        });
      } catch (err) {
        console.error("Error fetching venues for images:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Error in getUserBookings:", error);
    res.status(500).json({
      message: "Server error retrieving user bookings",
      error: error.message
    });
  }
};

/**
 * GET /api/bookings
 * * Get all pending bookings (for admin)
 */
exports.getBookings = async (req, res) => {
  try {
    const statusFilter = req.query.status;
    const query = statusFilter === "all" ? {} : { booking_status: "Pending Approval" };

    let bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

    // Link the correct venue images dynamically for all pending bookings
    const validVenueIds = [];
    const venueNames = [];
    
    bookings.forEach(b => {
      const vId = b.venue_id || b.venueId;
      if (vId && mongoose.Types.ObjectId.isValid(vId)) {
        validVenueIds.push(vId);
      } else if (b.venueName) {
        venueNames.push(b.venueName);
      }
    });

    if (validVenueIds.length > 0 || venueNames.length > 0) {
      try {
        const queryOr = [];
        if (validVenueIds.length > 0) queryOr.push({ _id: { $in: validVenueIds } });
        if (venueNames.length > 0) queryOr.push({ name: { $in: venueNames } });

        const venues = await Venue.find({ $or: queryOr }).lean();
        const venueIdMap = {};
        const venueNameMap = {};
        
        venues.forEach(v => {
          if (v.images && v.images.length > 0) {
            venueIdMap[v._id.toString()] = v.images[0];
            if (v.name) venueNameMap[v.name] = v.images[0];
          }
        });
        
        bookings = bookings.map(b => {
          const vId = (b.venue_id || b.venueId)?.toString();
          if (vId && venueIdMap[vId]) {
            b.image = venueIdMap[vId];
          } else if (b.venueName && venueNameMap[b.venueName]) {
            b.image = venueNameMap[b.venueName];
          }
          return b;
        });
      } catch (err) {
        console.error("Error fetching venues for images:", err.message);
      }
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error("Error in getAllPendingBookings:", error);
    res.status(500).json({
      message: "Server error retrieving bookings",
      error: error.message
    });
  }
};

/**
 * PUT /api/bookings/:bookingId/approve
 * * Admin approval endpoint
 */
exports.approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.booking_status === "Approved - Awaiting Payment") {
      return res.status(200).json({
        success: true,
        message: "Booking already approved.",
        data: booking
      });
    }

    booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        booking_status: "Confirmed",
        status: "Approved",
        approvedAt: new Date(),
        approvedBy: "Admin"
      },
      { new: true }
    );



    // Create Notification
    await Notification.create({
      receiverId: booking.userId || booking.client_id,
      receiverRole: "Client",
      category: "Booking",
      title: "Booking Confirmed",
      message: `Your booking ${booking.bookingReference || "BOOK-" + booking._id.toString().slice(-4).toUpperCase()} has been confirmed by the admin.`,
      bookingId: booking._id,
      sender: "Admin"
    });

    return res.status(200).json({
      success: true,
      message: "Booking approved. User can now proceed to payment.",
      data: booking
    });
  } catch (error) {
    console.error("Error in approveBooking:", error);
    res.status(500).json({
      message: "Server error approving booking",
      error: error.message
    });
  }
};

/**
 * PUT /api/bookings/:bookingId/reject
 * * Admin rejection endpoint
 */
exports.rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rejectionReason } = req.body;

    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.booking_status === "Cancelled" || booking.booking_status === "Rejected") {
      return res.status(200).json({
        success: true,
        message: "Booking already rejected/cancelled.",
        data: booking
      });
    }

    const amountPaid = Number(booking.advance_paid || booking.amount_paid || 0);
    const refundStatus = amountPaid > 0 ? "Pending" : "Not Applicable";
    const refundableAmount = amountPaid; // Admin rejection means full refund usually

    booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        booking_status: "Rejected",
        status: "Rejected",
        rejectionReason: rejectionReason || "Rejected by admin",
        rejectedAt: new Date(),
        rejectedBy: "Admin",
        refund_status: refundStatus,
        refundable_amount: refundableAmount
      },
      { new: true }
    );

    // Create Notification
    await Notification.create({
      receiverId: booking.userId || booking.client_id,
      receiverRole: "Client",
      category: "Booking",
      title: "Booking Rejected",
      message: `Your booking for ${booking.eventTitle || booking.event_type} has been rejected by admin. Reason: ${rejectionReason || "Rejected by admin"}. ${amountPaid > 0 ? "A full refund of ₹" + refundableAmount + " is pending." : ""}`,
      bookingId: booking._id,
      sender: "Admin"
    });

    return res.status(200).json({
      success: true,
      message: "Booking rejected.",
      data: booking
    });
  } catch (error) {
    console.error("Error in rejectBooking:", error);
    res.status(500).json({
      message: "Server error rejecting booking",
      error: error.message
    });
  }
};

/**
 * PUT /api/bookings/:bookingId/admin-cancel
 * * Admin cancellation endpoint
 */
exports.adminCancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;

    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.booking_status === "Cancelled" || booking.booking_status === "Rejected") {
      return res.status(200).json({
        success: true,
        message: "Booking already rejected/cancelled.",
        data: booking
      });
    }

    // Reuse cancellation logic
    const eventDate = new Date(booking.event_date || booking.eventDate || booking.date);
    const currentDate = new Date();
    const timeDiff = eventDate.getTime() - currentDate.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    let feePercentage = 0;
    if (daysRemaining > 30) {
      feePercentage = 10;
    } else if (daysRemaining > 0 && daysRemaining <= 30) {
      feePercentage = 50;
    } else {
      feePercentage = 100;
    }

    const amountPaid = Number(booking.advance_paid || booking.amount_paid || 0);
    const cancellationFee = (amountPaid * feePercentage) / 100;
    const refundableAmount = Math.max(0, amountPaid - cancellationFee);
    const refundStatus = refundableAmount > 0 ? "Pending" : "Not Applicable";

    booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        booking_status: "Cancelled",
        status: "Rejected",
        cancellation_reason: cancellationReason || "Cancelled by admin",
        cancelled_at: new Date(),
        cancelled_by: "Admin",
        cancellation_fee: cancellationFee,
        fee_percentage: feePercentage,
        days_remaining: daysRemaining,
        refundable_amount: refundableAmount,
        refund_status: refundStatus
      },
      { new: true }
    );

    // Create Notification
    await Notification.create({
      receiverId: booking.userId || booking.client_id,
      receiverRole: "Client",
      category: "Booking",
      title: "Booking Cancelled",
      message: `Your booking for ${booking.eventTitle || booking.event_type} has been cancelled by admin. Reason: ${cancellationReason || "Cancelled by admin"}. ${refundableAmount > 0 ? "A refund of ₹" + refundableAmount + " is pending." : ""}`,
      bookingId: booking._id,
      sender: "Admin"
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking
    });
  } catch (error) {
    console.error("Error in adminCancelBooking:", error);
    res.status(500).json({
      message: "Server error cancelling booking",
      error: error.message
    });
  }
};

/**
 * PUT /api/bookings/:bookingId
 * * Generic booking update
 */
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updateData = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      updateData,
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully.",
      data: booking
    });
  } catch (error) {
    console.error("Error in updateBooking:", error);
    res.status(500).json({
      message: "Server error updating booking",
      error: error.message
    });
  }
};

/**
 * DELETE /api/bookings/:bookingId
 * * Permanently delete a booking entry (Admin action)
 */
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findByIdAndDelete(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event successfully deleted from MongoDB."
    });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting entry from database.",
      error: error.message
    });
  }
};

/**
 * POST /api/bookings/match-score
 * * Calculate match score for a package based on event requirements
 */
exports.getMatchScore = async (req, res) => {
  try {
    const { packageId, eventType, guests, city } = req.body;
    
    if (!packageId) return res.status(400).json({ message: "Package ID required" });

    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).json({ message: "Package not found" });

    let score = 100;
    const matchDetails = [];

    // Guest matching
    if (guests && pkg.minGuests && guests < pkg.minGuests) {
      score -= 20;
      matchDetails.push({ check: "Guest capacity", passed: false, detail: `Package min is ${pkg.minGuests}` });
    } else if (guests && pkg.maxGuests && guests > pkg.maxGuests) {
      score -= 30;
      matchDetails.push({ check: "Guest capacity", passed: false, detail: `Package max is ${pkg.maxGuests}` });
    } else if (guests) {
      matchDetails.push({ check: "Guest capacity", passed: true, detail: "Matches your guest count" });
    }

    // City matching
    if (city && pkg.eligibleCities && pkg.eligibleCities.length > 0) {
      if (pkg.eligibleCities.includes(city)) {
        matchDetails.push({ check: "Location", passed: true, detail: `Available in ${city}` });
      } else {
        score -= 40;
        matchDetails.push({ check: "Location", passed: false, detail: `Not natively available in ${city}` });
      }
    }

    // Event type matching
    if (eventType && pkg.eventType) {
      if (pkg.eventType.toLowerCase() === eventType.toLowerCase() || pkg.eventType === "All") {
        matchDetails.push({ check: "Event Type", passed: true, detail: `Perfect for ${eventType}` });
      } else {
        score -= 15;
        matchDetails.push({ check: "Event Type", passed: false, detail: `Designed for ${pkg.eventType}` });
      }
    }

    // Ensure score doesn't go below 10
    score = Math.max(10, score);

    return res.status(200).json({
      success: true,
      score,
      matchDetails
    });

  } catch (error) {
    console.error("Error calculating match score:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * PUT /api/bookings/:bookingId/request-changes
 * * Admin suggests changes to booking
 */
exports.requestChanges = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason, suggestedAlternative } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        booking_status: "Changes Requested",
        rejectionReason: reason || "Admin suggested changes", // Reusing field for simplicity
        notes: suggestedAlternative ? `Suggested alternative: ${suggestedAlternative}` : ""
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Create Notification
    await Notification.create({
      receiverId: booking.userId || booking.client_id,
      receiverRole: "Client",
      category: "Booking",
      title: "Action Required: Booking Changes Suggested",
      message: `Admin suggested changes to your booking for ${booking.eventTitle || booking.event_type}. Reason: ${reason}`,
      bookingId: booking._id,
      sender: "System",
      metadata: {
        status: "Changes Requested",
        reason
      }
    });

    return res.status(200).json({
      success: true,
      message: "Change request sent to client.",
      data: booking
    });
  } catch (error) {
    console.error("Error in requestChanges:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * GET /api/bookings/availability
 * * Check venue availability for a specific date
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { venueId, date } = req.query;

    if (!venueId || !date) {
      return res.status(400).json({
        success: false,
        message: "venueId and date are required"
      });
    }

    const event_date = new Date(date);
    
    // Validate date parsing
    if (isNaN(event_date.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    // Check if the requested event_date and venue_id are completely free
    const venueBookingsOnDate = await Booking.find({
      venue_id: venueId,
      event_date: event_date,
      $or: [
        { booking_status: { $in: ["Approved - Awaiting Payment", "Confirmed"] } },
        { 
          booking_status: "Temporarily Held", 
          holdExpiresAt: { $gt: new Date() } 
        }
      ]
    });

    // Also check event schedules
    const venue = await Venue.findById(venueId);
    let eventSchedulesOnDate = [];
    if (venue) {
      eventSchedulesOnDate = await EventSchedule.find({
        "venue.name": venue.name,
        startDate: {
          $lte: event_date
        },
        endDate: {
          $gte: event_date
        }
      });
    }

    const isAvailable = venueBookingsOnDate.length === 0 && eventSchedulesOnDate.length === 0;

    if (isAvailable) {
      return res.status(200).json({
        success: true,
        available: true,
        date: date,
        venueId: venueId,
        message: "Venue is available for this date"
      });
    } else {
      return res.status(200).json({
        success: true,
        available: false,
        date: date,
        venueId: venueId,
        message: "Venue is already booked for this date"
      });
    }

  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * POST /api/bookings/:bookingId/cancel
 * * Client cancellation endpoint
 */
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { cancellation_reason } = req.body;
    
    let booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Backend ownership verification
    const bookingOwnerId = booking.userId || booking.client_id;
    if (req.user && req.user.id && bookingOwnerId && String(req.user.id) !== String(bookingOwnerId)) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.booking_status === "Cancelled" || booking.booking_status === "Rejected") {
      return res.status(400).json({ message: "Booking is already cancelled or rejected" });
    }

    const amountPaid = Number(booking.advance_paid || booking.amount_paid || 0);
    
    // Calculate days remaining
    const now = new Date();
    const eventDate = new Date(booking.event_date || booking.eventDate || now);
    const timeDiff = eventDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    let feePercentage = 100;
    if (daysRemaining > 30) {
      feePercentage = 10;
    } else if (daysRemaining >= 1) {
      feePercentage = 50;
    }
    
    let cancellationFee = 0;
    let refundableAmount = 0;
    let refundStatus = "Not Applicable";
    
    if (amountPaid > 0) {
      cancellationFee = amountPaid * (feePercentage / 100);
      refundableAmount = Math.max(0, amountPaid - cancellationFee);
      refundStatus = "Pending";
    }

    booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        booking_status: "Cancelled",
        cancellation_reason: cancellation_reason || "Client request",
        cancelled_at: new Date(),
        cancelled_by: "Client",
        cancellation_fee: cancellationFee,
        fee_percentage: feePercentage,
        days_remaining: daysRemaining,
        refundable_amount: refundableAmount,
        refund_status: refundStatus
      },
      { new: true }
    );

    // Create Notification for Client
    await Notification.create({
      receiverId: booking.userId || booking.client_id,
      receiverRole: "Client",
      category: "Booking",
      title: "Booking Cancelled",
      message: `Your booking for ${booking.eventTitle || booking.event_type} has been cancelled successfully.`,
      bookingId: booking._id,
      sender: "System"
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking
    });
  } catch (error) {
    console.error("Error in cancelBooking:", error);
    res.status(500).json({ message: "Server error cancelling booking", error: error.message });
  }
};