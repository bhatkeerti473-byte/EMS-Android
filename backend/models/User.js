const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true // Forces emails to save as lowercase automatically
  },
  phone: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false // Brand new users start out unverified
  },
  verificationToken: {
    type: String
  },
  photo: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'client'
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);