const CustomDecorationRequest = require("../models/CustomDecorationRequest");
const Notification = require("../models/Notification");

exports.createRequest = async (req, res) => {
  try {
    const {
      decorTitle,
      description,
      colorTheme,
      flowerPreference,
      budget,
    } = req.body;

    if (!decorTitle || !description) {
      return res.status(400).json({
        success: false,
        message: "Decoration Name and Description are required fields.",
      });
    }

    const newRequest = new CustomDecorationRequest({
      userId: req.user.id, // Auth middleware ensures this exists
      decorTitle,
      description,
      colorTheme,
      flowerPreference,
      budget,
    });

    await newRequest.save();

    // Create Notification
    await Notification.create({
      receiverId: req.user.id,
      receiverRole: "Client",
      category: "Service",
      title: "Decoration Request Submitted",
      message: "Your custom decoration request has been submitted for review.",
      sender: "System"
    });

    res.status(201).json({
      success: true,
      message: "Custom decoration request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error creating custom decoration request:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing your request.",
      error: error.message,
    });
  }
};
