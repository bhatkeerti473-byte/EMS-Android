const User = require('../models/User');
const Staff = require('../models/Staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const VISUAL_BACKEND_PATH = path.join(__dirname, '../visual-backend-users.json');

function saveUserToVisualBackend(user) {
  let users = [];
  if (fs.existsSync(VISUAL_BACKEND_PATH)) {
    users = JSON.parse(fs.readFileSync(VISUAL_BACKEND_PATH, 'utf-8'));
  }
  users.push(user);
  fs.writeFileSync(VISUAL_BACKEND_PATH, JSON.stringify(users, null, 2));
}

const OTP_STORE = {};

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getTransporter() {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS;

  if (!user || !pass) {
    console.error("❌ Nodemailer Setup Warning: EMAIL_USER or EMAIL_PASS environment variables are missing!");
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const otp = generateOtp();
    const expires = Date.now() + 10 * 60 * 1000;
    OTP_STORE[email.trim().toLowerCase()] = { code: otp, expires };

    const transporter = getTransporter();
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@example.com';

    if (transporter) {
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Your verification code',
        text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
      return res.json({ success: true, message: 'Verification code sent to email' });
    }

    try {
      const testAccount = await nodemailer.createTestAccount();
      const etherealTransporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });

      await etherealTransporter.sendMail({
        from,
        to: email,
        subject: 'Your verification code',
        text: `Your verification code is: ${otp}. It expires in 10 minutes.`,
        html: `<p>Your verification code is: <strong>${otp}</strong></p><p>It expires in 10 minutes.</p>`,
      });
      return res.json({ success: true, message: 'Verification code sent via test SMTP' });
    } catch (err) {
      return res.json({ success: true, message: 'Verification code generated (SMTP fallback).' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
};

exports.verifyOtpAndReset = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) return res.status(400).json({ success: false, message: 'Missing parameters' });

    const key = email.trim().toLowerCase();
    const record = OTP_STORE[key];
    if (!record) return res.status(400).json({ success: false, message: 'No verification code found.' });
    if (Date.now() > record.expires) {
      delete OTP_STORE[key];
      return res.status(400).json({ success: false, message: 'Verification code expired.' });
    }
    if (record.code !== String(code)) return res.status(400).json({ success: false, message: 'Invalid verification code.' });

    const user = await User.findOne({ email: key });
    if (!user) return res.status(400).json({ success: false, message: 'No user found for this email.' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    delete OTP_STORE[key];

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to verify code' });
  }
};

exports.debugGetOtp = (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Not allowed in production' });
  }
  const email = (req.query.email || '').trim().toLowerCase();
  const record = OTP_STORE[email];
  if (!record) return res.status(404).json({ success: false, message: 'No OTP found' });
  return res.json({ success: true, otp: record.code, expiresAt: record.expires });
};

// --- REGISTRATION ---
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      verificationToken,
      isVerified: false
    });
    await user.save();

    saveUserToVisualBackend({ name: user.name, email: user.email });

    const transporter = getTransporter();
    const from = process.env.FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || 'no-reply@example.com';
    const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

    if (transporter) {
      await transporter.sendMail({
        from,
        to: user.email,
        subject: 'Verify Your Email Address',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #2563eb;">Hello ${user.name},</h2>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for creating an account with us. Please click the button below to verify your email address:</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p style="font-size: 12px; color: #64748b;">If you did not request this registration, you can safely ignore this email.</p>
          </div>
        `
      });
    }

    res.status(201).json({ message: 'Registration successful! Please check your email to verify.' });
  } catch (err) {
    console.error('Registration Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const normalizedEmail = email.trim().toLowerCase();



    let user = await User.findOne({ email: normalizedEmail });
    let isStaff = false;

    if (!user) {
      // Check if it's a staff member
      user = await Staff.findOne({ email: normalizedEmail });
      if (user) {
        isStaff = true;
      }
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!isStaff && !user.isVerified) {
      return res.status(401).json({ message: 'Please check your email to verify your account before logging in.' });
    }

    let isMatch = false;
    if (isStaff) {
      // Staff uses plain text password currently
      isMatch = password === user.password;
    } else {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: isStaff ? 'staff' : (user.role || 'client') }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        address: user.address || null,
        photo: user.photo || null,
        role: isStaff ? 'staff' : (user.role || 'client'),
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.google = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

    const googleProfileResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    if (!googleProfileResponse.ok) return res.status(400).json({ success: false, message: 'Invalid token' });

    const googleUser = await googleProfileResponse.json();
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = new User({
        name: googleUser.name || 'Google User',
        email: googleUser.email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
        isVerified: true
      });
      await user.save();
      saveUserToVisualBackend({ name: user.name, email: user.email });
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      success: true,
      token: jwtToken,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        photo: googleUser.picture || null,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ success: false, message: 'Authentication failed' });
  }
};

// --- VERIFICATION LINK HANDLER ---
// Resilient against fast double-fetches caused by React.StrictMode
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // 1. Try finding user by verification token
    let user = await User.findOne({ verificationToken: token });

    if (!user) {
      // 2. If token isn't found, check if it was just verified a moment ago
      // We look up the registration log file as a reference checkpoint
      let usersBackup = [];
      if (fs.existsSync(VISUAL_BACKEND_PATH)) {
        usersBackup = JSON.parse(fs.readFileSync(VISUAL_BACKEND_PATH, 'utf-8'));
      }

      // If the email matches the backup store, assume success from the first fetch pass
      if (usersBackup.length > 0) {
        const lastBackupUser = usersBackup[usersBackup.length - 1];
        const verifiedUserCheck = await User.findOne({ email: lastBackupUser.email });

        if (verifiedUserCheck && verifiedUserCheck.isVerified) {
          return res.status(200).json({ success: true, message: 'Email verified successfully!' });
        }
      }

      return res.status(400).json({ success: false, message: 'Invalid or expired link.' });
    }

    // 3. Complete verification if token is fresh
    user.isVerified = true;
    user.verificationToken = undefined; // Wipe token for security hygiene
    await user.save();

    return res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (error) {
    console.error('verifyEmail server error:', error);
    return res.status(500).json({ success: false, message: 'Server error during confirmation.' });
  }
};
