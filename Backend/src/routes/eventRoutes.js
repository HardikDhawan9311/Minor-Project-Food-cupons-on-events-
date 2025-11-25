const express = require("express");
const router = express.Router();
const { createEvent, getEvents } = require("../controllers/eventController");

router.post("/create", createEvent); // Correct endpoint: /events/create
router.get("/", getEvents); // Correct endpoint: /events/

module.exports = router;
