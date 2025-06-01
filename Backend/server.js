const express = require("express");
require("dotenv").config();
const cors = require("cors");
const dashboardRoutes= require("./routes/dashboard");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const modelRoutes= require("./routes/modelRoutes");
const app = express();
const whatsBot= require("./routes/whatsbot");
const testCall = require("./routes/testCall");
// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/inference", modelRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/whatsapp", whatsBot);
// app.use("/api/call", voiceAssistant);
app.use("/api/test", testCall);
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", uptime: process.uptime() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
