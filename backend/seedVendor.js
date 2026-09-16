require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedVendor = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/event-management';
    await mongoose.connect(uri);

    const email = 'vendor@gmail.com';
    const password = 'vendor@123';
    
    // Check if the vendor user already exists
    let vendor = await User.findOne({ email });

    if (!vendor) {
      const hashedPassword = await bcrypt.hash(password, 10);
      vendor = new User({
        name: 'Main Vendor',
        email,
        password: hashedPassword,
        isVerified: true,
        role: 'vendor'
      });
      await vendor.save();
      console.log('Vendor user created successfully!');
    } else {
      vendor.role = 'vendor';
      vendor.isVerified = true;
      vendor.password = await bcrypt.hash(password, 10);
      await vendor.save();
      console.log('Vendor user updated successfully!');
    }
  } catch (err) {
    console.error('Error seeding vendor:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedVendor();
