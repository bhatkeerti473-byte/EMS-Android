const twilio = require("twilio");
require("dotenv").config();

let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Send an SMS
 * @param {string} to - Recipient phone number (e.g. +919876543210)
 * @param {string} body - SMS body content
 * @returns {Promise}
 */
const sendSMS = async (to, body) => {
    try {
        if (!client) {
            console.warn("Twilio SMS service is not configured. Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to .env");
            return { success: false, error: "SMS not configured" };
        }

        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: to
        });

        console.log("SMS sent: " + message.sid);
        return { success: true, message };
    } catch (error) {
        console.error("Error sending SMS: ", error);
        return { success: false, error };
    }
};

module.exports = {
    sendSMS
};
