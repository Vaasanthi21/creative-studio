const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("paste_your")) {
    console.log("MongoDB URI not added yet. Skipping DB connection for now.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;