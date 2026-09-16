const EventTypeRequest = require("../models/EventTypeRequest");
const Notification = require("../models/Notification");

exports.createRequest = async (req, res) => {
  try {
    const {
      eventTypeName,
      description,
      expectedDate,
      expectedGuests,
      locationType,
      budgetRange,
      specialRequirements,
    } = req.body;

    if (!eventTypeName || !description || !expectedDate) {
      return res.status(400).json({
        success: false,
        message: "eventTypeName, description, and expectedDate are required fields.",
      });
    }

    const newRequest = new EventTypeRequest({
      userId: req.user.id, // Auth middleware must set req.user
      eventTypeName,
      description,
      expectedDate,
      expectedGuests,
      locationType,
      budgetRange,
      specialRequirements,
    });

    await newRequest.save();

    // Create Notification
    await Notification.create({
      receiverId: req.user.id,
      receiverRole: "Client",
      category: "Event",
      title: "Event Type Request Submitted",
      message: "Your custom event type request has been submitted for review.",
      sender: "System"
    });

    res.status(201).json({
      success: true,
      message: "Event type request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating event type request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing your request.",
      error: error.message,
    });
  }
};
