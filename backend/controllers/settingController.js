const Setting = require("../models/Setting");

/**
 * Get all settings
 */
exports.getSettings = async (req, res) => {
  try {
     settings = await Setting.find({});
    
    // Convert array of objects to key-value map for frontend convenience
    const settingsMap = {};
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });

    res.status(200).json({ success: true, data: settingsMap, list: settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ success: false, message: "Error fetching settings" });
  }
};

/**
 * Update multiple settings at once
 */
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body; // Expecting { "gstRate": 18, "serviceCharge": 5, ... }
    
    for (const [key, value] of Object.entries(updates)) {
      await Setting.findOneAndUpdate(
        { key },
        { value },
        { upsert: true, new: true }
      );
    }

    res.status(200).json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ success: false, message: "Error updating settings" });
  }
};
