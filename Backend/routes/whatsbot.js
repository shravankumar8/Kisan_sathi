const express = require("express");
const axios = require("axios");
const { Twilio } = require("twilio");
require("dotenv").config();

const router = express.Router();

const client = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Twilio WhatsApp Number (Sandbox or Live)
const TWILIO_PHONE_NUMBER = "whatsapp:+14155238886";

// POST endpoint to receive messages from Twilio
router.post("/webhook", async (req, res) => {
  const { From, Body } = req.body;
  console.log("FROM", From);
  console.log("BODY", Body);
  if (!From || !Body) {
    return res
      .status(400)
      .json({ error: "Missing required fields: From and Body" });
  }

  try {
    // Build payload for inference logic
    const payload = {
      user_id: "kumashravan5@gmail.com",
      agent_id: "683b58dbcf9fc42b59e136bc",
      session_id: "683b58dbcf9fc42b59e136bc-wezaj0hdgkc",
      message: Body,
    };

    const inferenceRes = await axios.post(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sk-default-kKtXYeA4rpMOdv1mJCpeUGvN9ck8Yg8H",
        },
      }
    );
    console.log("inferenceRes", inferenceRes.data);

    const { response } = inferenceRes.data;
    console.log("Response from inference:", response);

    // Parse the response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseErr) {
      console.error("Error parsing response:", parseErr);
      throw new Error("Failed to parse inference response");
    }

    // Normalize the structure: if parsedResponse is not an array, wrap it in an array
    const responseArray = Array.isArray(parsedResponse)
      ? parsedResponse
      : [parsedResponse];

    // Destructure safely, ensuring queries exists and has at least one item
    const [{ queries = [] } = {}] = responseArray;
    const [{ response: queryResponse } = {}] =
      queries.length > 0 ? queries : [{}];

    // Fallback if queryResponse is not found
    const reply =
      queryResponse ||
      "Sorry, I couldn't find the information you're looking for.";

    // Log the extracted response
    console.log("Reply to send:", reply);

    // Send message via Twilio
    await client.messages.create({
      body: reply,
      from: TWILIO_PHONE_NUMBER,
      to: From, // Use the From number dynamically
    });

    res.status(200).send("Message sent successfully");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
