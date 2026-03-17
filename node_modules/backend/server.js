const express = require("express");
const dotenv = require("dotenv");
const db = require("./src/config/db");
const cors=require("cors");

const app = express();

// Load .env
dotenv.config();


// Middleware
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const participantRoutes= require("./src/routes/participantRoutes")
const emailRoutes = require("./src/routes/emailRoutes");
const eventRoutes = require("./src/routes/eventRoutes");

// Use routes
app.use("/auth", authRoutes);
app.use("/participants",participantRoutes)
app.use("/emails", emailRoutes);
app.use("/generation",emailRoutes)
app.use("/events", eventRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
