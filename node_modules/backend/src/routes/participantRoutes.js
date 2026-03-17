const express = require("express");
const multer = require("multer");
const {
  uploadExcel,
  getParticipants,
  getTeamParticipants,
} = require("../controllers/participantController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Wrapper
const asyncHandler = (fn) => (req, res, next) => {
  if (typeof fn !== "function") {
    console.error("❌ asyncHandler received non-function:", fn);
    return res.status(500).json({ error: "Invalid route handler" });
  }
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
router.post(
  "/upload-excel",
  (req, res, next) => {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error("❌ Multer error:", err);
        return res.status(400).json({ error: "File upload failed" });
      }
      next();
    });
  },
  asyncHandler(uploadExcel)
);

router.get("/logs", asyncHandler(getParticipants));

// ✅ New route for a specific team
router.get("/team/:teamName", asyncHandler(getTeamParticipants));

module.exports = router;
