const express = require("express");
const { sendEmailsToCheckedIn } = require("../controllers/email_participants");
const { autoGenerateQrCodes } = require("../controllers/qr_code_generation");

const router = express.Router();

// POST /emails/send
router.post("/send", async (req, res) => {
  try {
    await sendEmailsToCheckedIn(req, res);
  } catch (error) {
    console.error("❌ Error in /emails/send route:", error);
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
