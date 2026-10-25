
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../src/models/Admin");

async function createAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    const mongoUri = process.env.MONGO_URI;

    if (!email || !password || !mongoUri) {
      throw new Error(
        "Set ADMIN_EMAIL, ADMIN_PASSWORD, and MONGO_URI in your local .env file."
      );
    }

    if (password.length < 12) {
      throw new Error("Use an admin password with at least 12 characters.");
    }

    await mongoose.connect(mongoUri);

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log(`An admin account already exists for ${email}.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await Admin.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(`Admin account created successfully for ${email}.`);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
}

createAdmin();
