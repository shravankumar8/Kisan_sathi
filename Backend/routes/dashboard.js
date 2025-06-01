const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {authMiddleware} = require("../middleware/authMiddleware");
const weatherService = require("../services/weatherService");
const priceService = require("../services/priceService");
const Query = require("../models/Query");

// GET /api/weather
router.get("/weather", authMiddleware, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const location = user.location;
     // e.g., "Ludhiana, Punjab"
     console.log(location)
    if (!location) {
      return res.status(400).json({ error: "User location not set" });
    }

    const weather = await weatherService.getWeather(location);
    res.json(weather);
  } catch (error) {
    console.error("Weather endpoint error:", error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// GET /api/prices
router.get("/prices", authMiddleware, async (req, res) => {
  try {
    const { region } = req.query;
    if (!region) {
      return res.status(400).json({ error: "Region required" });
    }
    const prices = await priceService.getPrices(region);
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch prices" });
  }
});

// GET /api/queries/recent
router.get("/queries/recent", authMiddleware, async (req, res) => {
  try {
    const query = await Query.findOne({ userId: req.userId })
      .sort({ timestamp: -1 })
      .select("question answer timestamp");
    if (!query) {
      return res.status(404).json({ error: "No recent queries found" });
    }
    res.json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent query" });
  }
});

module.exports = router;
