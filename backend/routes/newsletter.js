const express = require("express");
const router = express.Router();
const Newsletter = require("../models/Newsletter");
const sendNewsletterWelcome = require("../utils/sendNewsletterMail");

// Subscribe
router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate
    const exists = await Newsletter.findOne({ email: normalizedEmail });
    if (exists)
      return res.status(400).json({ message: "Already subscribed" });

    await Newsletter.create({ email: normalizedEmail });

    // Send welcome email
    await sendNewsletterWelcome(normalizedEmail);

    res.json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
