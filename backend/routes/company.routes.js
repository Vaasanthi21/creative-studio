const express = require("express");
const Company = require("../models/Company");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, plan, status } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const company = await Company.create({
      name,
      email,
      plan,
      status,
      users: 0,
      joined: "Now",
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create company",
      error: error.message,
    });
  }
});

module.exports = router;