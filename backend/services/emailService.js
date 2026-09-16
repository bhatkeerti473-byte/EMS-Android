const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body content
 * @param {string} html - Optional HTML body content
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, html = "") => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("Email service is not configured. Add EMAIL_USER and EMAIL_PASS to .env");
            return { success: false, error: "Email not configured" };
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            ...(html ? { html } : {})
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return { success: true, info };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, error };
    }
};

module.exports = {
    sendEmail
};
