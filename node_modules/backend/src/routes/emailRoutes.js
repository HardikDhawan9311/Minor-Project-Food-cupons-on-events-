const express = require("express");
const { sendEmailsToCheckedIn, sendEmailsToAllParticipants } = require("../controllers/emailController");
const { autoGenerateQrCodes } = require("../controllers/qrController");

const router = express.Router();

// POST /emails/send — send to checked-in participants
router.post("/send", async (req, res) => {
  try {
    await sendEmailsToCheckedIn(req, res);
  } catch (error) {
    console.error("❌ Error in /emails/send route:", error);
    res.status(500).json({ message: "Internal server error while sending emails" });
  }
});

// POST /emails/send-all — send to ALL participants of an event
router.post("/send-all", async (req, res) => {
  try {
    await sendEmailsToAllParticipants(req, res);
  } catch (error) {
    console.error("❌ Error in /emails/send-all route:", error);
    res.status(500).json({ message: "Internal server error while sending emails" });
  }
});

router.post("/auto_generated_qr_code", async (req, res) => {
  try {
    await autoGenerateQrCodes(req, res);
  } catch (error) {
    console.error("❌ Error in /emails/auto-generated-qr-code route:", error);
    res.status(500).json({ message: "Internal server error while generating QR codes" });
  }
});

module.exports = router;

