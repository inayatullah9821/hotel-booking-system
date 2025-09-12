const User = require("../models/users");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists. Skipping seeding.");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "Super@123", 10);
    const adminUser = User.create({
      firstName: "Admin",
      lastName: "Super User",
      email: process.env.DEFAULT_ADMIN_EMAIL || "testadmin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });
    if (adminUser) {
      console.log("Admin seeded successfully.");
      return true;
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

module.exports = { seedAdmin };
