const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const OTP = require("../models/OTP");
const {
  validateRegister,
  validateSendOTP,
  validateVerifyOTP,
} = require("../middleware/validate");
// const { sendOTP } = require("../services/twilioService");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", validateRegister, async (req, res) => {
  const { name, phoneNumber, city, state, pincode, selectedLanguage } =
    req.body;

  try {
    console.log()
    // Check if phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Create new user
    const user = new User({
      name,
      phoneNumber,
      city,
      state,
      pincode,
      selectedLanguage,

      // location is set automatically by schema
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      userId: user._id,
      token,
      message: "Registration successful",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error during registration" });
  }
});


router.get("/verify", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Verify error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});
// POST /api/auth/send-otp
router.post("/send-otp", validateSendOTP, async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpDoc = new OTP({ phoneNumber, otp });
    await otpDoc.save();

    const sent = await sendOTP(phoneNumber, otp);
    if (!sent) {
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/verify-otp
router.post("/verify-otp", validateVerifyOTP, async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const otpDoc = await OTP.findOne({ phoneNumber, otp });
    if (!otpDoc) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await OTP.deleteOne({ _id: otpDoc._id });

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        language: user.selectedLanguage,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
      },
      token,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
