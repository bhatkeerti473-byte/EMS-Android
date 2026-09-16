const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const { register, login, google, sendOtp, verifyOtpAndReset, debugGetOtp, verifyEmail } = require('../controllers/authController');
const User = require('../models/User');

// Global map tracker to keep track of valid active CAPTCHA text solutions
const activeCaptchas = new Map();

// ==========================================
// 1. Endpoint to Generate CAPTCHA (Solid White BG, Pure Black Text)
// URL: GET http://localhost:5000/api/auth/captcha
// ==========================================
router.get('/captcha', (req, res) => {
    const captcha = svgCaptcha.create({
        size: 5,           // 5 characters long like UUCMS
        noise: 2,          // Keeps noise lines subtle
        color: false,      // Turn off random colors
        background: '#ffffff' // Explicitly set background to solid white
    });

    // 🌟 THE FIX: Inject CSS selectors targeting the SVG, background rect, and paths to ensure correct contrast
    const style = `<style>svg { background: #ffffff !important; } rect { fill: #ffffff !important; } path { stroke: #000000 !important; } path:not([fill="none"]) { fill: #000000 !important; }</style>`;
    const cleanSvg = captcha.data.replace(/<svg([^>]*)>/, `<svg$1>${style}`);


    // Generate a unique tracking ID for this CAPTCHA session
    const captchaId = Date.now().toString() + Math.random().toString(36).substring(2, 7);

    // Store the true alphanumeric text answer server-side
    activeCaptchas.set(captchaId, captcha.text.toLowerCase());

    // Auto-delete the key after 2 minutes so your server memory doesn't leak
    setTimeout(() => activeCaptchas.delete(captchaId), 2 * 60 * 1000);

    // Return the SVG code and the tracking ID back to your React app
    res.json({
        captchaId: captchaId,
        data: cleanSvg // Send the modified pure black SVG data
    });
});

// ==========================================
// 2. Middleware to Verify CAPTCHA before Login
// ==========================================
const verifyCaptchaMiddleware = (req, res, next) => {
    const { captchaInput, captchaId } = req.body;

    // 1. Verify if the CAPTCHA session exists and isn't expired
    const correctAnswer = activeCaptchas.get(captchaId);
    if (!correctAnswer) {
        return res.status(400).json({ success: false, message: 'CAPTCHA session expired. Please refresh.' });
    }

    // 2. Validate the user's text input case-insensitively
    if (captchaInput.toLowerCase() !== correctAnswer) {
        return res.status(400).json({ success: false, message: 'Incorrect CAPTCHA code text!' });
    }

    // 3. Clear token immediately upon verification to prevent reuse/replay attacks
    activeCaptchas.delete(captchaId);

    // Everything is correct, pass execution onto your actual login controller
    next();
};

// ==========================================
// Existing Auth Pipeline Routes
// ==========================================
router.post('/register', register);

// Injected the CAPTCHA verification check middleware right before your login controller executes
router.post('/login', verifyCaptchaMiddleware, login);

router.post('/google', google);
router.post('/send-otp', sendOtp);
router.post('/verify-otp-reset', verifyOtpAndReset);
router.get('/debug/otp', debugGetOtp);

// Handle the token parameter cleanly
router.get('/verify-email/:token', verifyEmail);

// --- TEMPORARY GLOBAL CLEANER ROUTE ---
router.get('/clear-all-test-data', async (req, res) => {
    try {
        const targetEmail = "bhatkeerti473@gmail.com";
        const result = await User.deleteMany({
            email: { $regex: new RegExp("^" + targetEmail.trim(), "i") }
        });
        return res.json({ message: `Successfully cleared out ${result.deletedCount} instance(s) from the database.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// --- TEMPORARY MASTER RESET ROUTE ---
router.get('/nuke-all-users-database', async (req, res) => {
    try {
        const result = await User.deleteMany({});
        return res.json({ message: `Success! Wiped out all ${result.deletedCount} users from the database.` });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;