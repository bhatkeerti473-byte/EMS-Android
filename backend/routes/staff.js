const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const { sendEmail } = require("../services/emailService");
const { sendSMS } = require("../services/smsService");

// Get all staff
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find();
    // Format to match frontend expectations
    const formattedStaff = staff.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: s.role,
      address: s.address,
      status: s.status,
      photo: s.photo,
      assignedEvents: s.assignedEvents || 0,
      salary: s.salary || (s.role === "Event Manager" ? 30000 : s.role === "Security" ? 18000 : 12000),
      employmentType: s.employmentType || "Full-time",
      bankAccountNumber: s.bankAccountNumber || "",
      ifscCode: s.ifscCode || "",
      upiId: s.upiId || "",
      paidSalaries: s.paidSalaries || [],
      initials: s.name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2)
    }));
    res.json(formattedStaff);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create staff
router.post("/", async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    const savedStaff = await newStaff.save();
    res.status(201).json({
      id: savedStaff._id,
      name: savedStaff.name,
      email: savedStaff.email,
      phone: savedStaff.phone,
      role: savedStaff.role,
      address: savedStaff.address,
      status: savedStaff.status,
      photo: savedStaff.photo,
      assignedEvents: savedStaff.assignedEvents || 0,
      salary: savedStaff.salary || (savedStaff.role === "Event Manager" ? 30000 : savedStaff.role === "Security" ? 18000 : 12000),
      employmentType: savedStaff.employmentType || "Full-time",
      bankAccountNumber: savedStaff.bankAccountNumber || "",
      ifscCode: savedStaff.ifscCode || "",
      upiId: savedStaff.upiId || "",
      paidSalaries: savedStaff.paidSalaries || [],
      initials: savedStaff.name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2)
    });

    // Send Real Email Notification
    if (req.body.password && req.body.personalEmail) {
      const emailSubject = "Welcome to Event Management System";
      const emailText = `Hello ${savedStaff.name.split(" ")[0]},

Your staff account has been created.

Login Email:
${savedStaff.email}

Temporary Password:
${req.body.password}

Please login and change your password.

Thank you.`;

      sendEmail(req.body.personalEmail, emailSubject, emailText)
        .then(result => {
          if (!result.success) {
            console.error("Failed to send staff creation email:", result.error);
          }
        })
        .catch(console.error);
    }

    // Send Real SMS Notification
    if (req.body.password && savedStaff.phone) {
      const smsBody = `EMS

Your Staff Account has been created.

Email:
${savedStaff.email}

Password:
${req.body.password}

Login and change your password.`;

      sendSMS(savedStaff.phone, smsBody)
        .then(result => {
          if (!result.success) {
            console.error("Failed to send staff creation SMS:", result.error);
          }
        })
        .catch(console.error);
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update staff
router.put("/:id", async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStaff) return res.status(404).json({ error: "Staff not found" });
    res.json({
      id: updatedStaff._id,
      name: updatedStaff.name,
      email: updatedStaff.email,
      phone: updatedStaff.phone,
      role: updatedStaff.role,
      address: updatedStaff.address,
      status: updatedStaff.status,
      photo: updatedStaff.photo,
      assignedEvents: updatedStaff.assignedEvents || 0,
      salary: updatedStaff.salary || (updatedStaff.role === "Event Manager" ? 30000 : updatedStaff.role === "Security" ? 18000 : 12000),
      employmentType: updatedStaff.employmentType || "Full-time",
      bankAccountNumber: updatedStaff.bankAccountNumber || "",
      ifscCode: updatedStaff.ifscCode || "",
      upiId: updatedStaff.upiId || "",
      paidSalaries: updatedStaff.paidSalaries || [],
      initials: updatedStaff.name.split(" ").map(w => w[0] || "").join("").toUpperCase().slice(0, 2)
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete staff
router.delete("/:id", async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ error: "Staff not found" });
    res.json({ message: "Staff deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
