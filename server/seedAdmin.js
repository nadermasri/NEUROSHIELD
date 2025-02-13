// server/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = 'mongodb://localhost:27017/ai-security-toolkit'; // adjust if needed

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB for seeding admin...");
    // Define admin details
    const adminData = {
      name: "Admin User",
      email: "admin@example.com",
      role: "admin"
    };
    const plainPassword = "adminpass"; // Choose a secure password

    // Hash the password
    bcrypt.hash(plainPassword, 8, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
        process.exit(1);
      }
      adminData.password = hash;

      // Create and save the admin user
      try {
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
          console.log("Admin user already exists.");
        } else {
          await new User(adminData).save();
          console.log("Admin user created successfully.");
        }
      } catch (error) {
        console.error("Error creating admin user:", error);
      }
      mongoose.connection.close();
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
