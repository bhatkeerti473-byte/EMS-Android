const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();
const contactMessages = [];

function getTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

router.post("/", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const subject = String(req.body?.subject || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, subject, and message are required.",
      });
    }

    const record = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      createdAt: new Date().toISOString(),
    };

    contactMessages.unshift(record);

    const transporter = getTransporter();
    const recipient =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.EMAIL_USER ||
      process.env.SMTP_USER ||
      "no-reply@example.com";

    if (transporter) {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.EMAIL_USER || process.env.SMTP_USER,
        to: recipient,
        replyTo: email,
        subject: `Contact form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
        html: `
          <h2>New contact form submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong><br />${message.replace(/\n/g, "<br />")}</p>
        `,
      });
    } else {
      console.log("[CONTACT FORM]", { name, email, subject, message });
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully. We will contact you soon.",
      contactId: record.id,
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send your message.",
    });
  }
});

router.get("/debug", (req, res) => {
  res.json(contactMessages);
});

module.exports = router;
