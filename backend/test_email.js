require('dotenv').config();
const { sendEmail } = require('./services/emailService');

async function test() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  const result = await sendEmail(
    "bhatkeerti473@gmail.com", 
    "Test Subject", 
    "This is a test message from EMS backend."
  );
  console.log("Result:", result);
}
test();
