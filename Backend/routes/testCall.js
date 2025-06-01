const express = require("express");
const twilio = require("twilio");
require("dotenv").config();

const router = express.Router();

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const TWILIO_PHONE_NUMBER = "+8782099161";
// Route to initiate a test call
router.get("/test-call", async (req, res) => {
  try {
    // Create the call
    const call = await client.calls.create({
      from: TWILIO_PHONE_NUMBER, // Your Twilio number (e.g., "+15017122661")
      to:"+917386063607",
      twiml:
        "<Response><Say>Hello! This is your Farm Assistant. How can I help you today?</Say></Response>",
    });

    console.log("Call initiated:", call.sid);
    res
      .status(200)
      .json({ message: "Call initiated successfully", callSid: call.sid });
  } catch (err) {
    console.error("Error initiating call:", err.message);
    res
      .status(500)
      .json({ error: "Failed to initiate call", details: err.message });
  }
});

module.exports = router;
