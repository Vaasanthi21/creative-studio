const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    users: {
      type: Number,
      default: 0,
    },
    plan: {
      type: String,
      default: "Starter",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "trial", "suspended"],
      default: "active",
    },
    joined: {
      type: String,
      default: "Now",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);