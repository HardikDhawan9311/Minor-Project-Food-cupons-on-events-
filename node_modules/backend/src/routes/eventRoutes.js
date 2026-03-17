const express = require("express");
const router = express.Router();
const { 
  createEvent, 
  getEvents, 
  getEventDetails, 
  toggleEvent, 
  saveAllMeals,
  getEventMeals      // ⭐ Add this import
} = require("../controllers/eventController");

// Create Event
router.post("/create", createEvent);

// Get all events
router.get("/", getEvents);

// Get event details (includes meals)
router.get("/:id", getEventDetails);

// Get only meals for event (optional API)
router.get("/:id/meals", getEventMeals);   // ⭐ Add this

// Toggle event status
router.put("/:id/toggle", toggleEvent);

// Save all meals for one date
router.post("/:id/meals/saveAll", saveAllMeals);

module.exports = router;
