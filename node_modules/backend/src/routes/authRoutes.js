const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/authController");
const { signin } = require("../controllers/authController");

router.post("/signup", async (req, res) => {
  try {
    await signup(req, res); // safely call controller
  } catch (error) {
    console.error("❌ Route error:", error.message);
    res.status(500).json({ message: "Something went wrong in signup route" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    await signin(req, res); // safely call signin controller
  } catch (error) {
    console.error("❌ Route error:", error.message);
    res.status(500).json({ message: "Something went wrong in signin route" });
  }
});

module.exports = router;
