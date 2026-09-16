const Event = require("../models/Event");
const EventSchedule = require("../models/EventSchedule");
const EventResource = require("../models/EventResource");
// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const { title, category, description, maxAttendees } = req.body;
    const organizerId = req.user.id; // Assumes auth middleware sets req.user

    const event = new Event({
      title,
      category,
      description,
      maxAttendees,
      organizerId,
      status: "Planning",
    });

    await event.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all events for a user
exports.getUserEvents = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single event with schedule and resources
exports.getEventDetails = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    const schedule = await EventSchedule.findOne({ eventId });
    const resources = await EventResource.find({ eventId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
      schedule,
      resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    await Event.findByIdAndDelete(eventId);
    await EventSchedule.deleteMany({ eventId });
    await EventResource.deleteMany({ eventId });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create or update event schedule
exports.saveEventSchedule = async (req, res) => {
  try {
    const { eventId, startDate, endDate, startTime, endTime, venue, timezone, milestones } = req.body;

    let schedule = await EventSchedule.findOne({ eventId });

    if (schedule) {
      schedule = await EventSchedule.findByIdAndUpdate(schedule._id, {
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        timezone,
        milestones,
      }, { new: true });
    } else {
      schedule = new EventSchedule({
        eventId,
        startDate,
        endDate,
        startTime,
        endTime,
        venue,
        timezone,
        milestones,
      });
      await schedule.save();
    }

    res.status(200).json({
      success: true,
      message: "Event schedule saved successfully",
      schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add event resource
exports.addEventResource = async (req, res) => {
  try {
    const { eventId, resourceType, name, description, quantity, cost, notes } = req.body;

    const resource = new EventResource({
      eventId,
      resourceType,
      name,
      description,
      quantity,
      cost,
      notes,
      status: "Available",
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: "Resource added successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update event resource
exports.updateEventResource = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const updates = req.body;

    const resource = await EventResource.findByIdAndUpdate(resourceId, updates, { new: true });

    res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete event resource
exports.deleteEventResource = async (req, res) => {
  try {
    const { resourceId } = req.params;

    await EventResource.findByIdAndDelete(resourceId);

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get event statistics
exports.getEventStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const events = await Event.find({ organizerId });
    const upcoming = events.filter((e) => e.status === "Scheduled").length;
    const ongoing = events.filter((e) => e.status === "Ongoing").length;
    const completed = events.filter((e) => e.status === "Completed").length;
    const totalRevenue = events.reduce((sum, e) => sum + e.revenue, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalEvents: events.length,
        upcoming,
        ongoing,
        completed,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
