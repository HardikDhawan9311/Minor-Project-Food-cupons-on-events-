const db = require("../config/db");
const transporter = require("../config/mail");

const sendEmailsToCheckedIn = async (req, res) => {
  try {
    const [results] = await (await db).execute(
      "SELECT name, email, token_id, qr_code FROM participants WHERE check_in = 'Yes'"
    );

    if (results.length === 0) {
      return res.json({ message: "No participants have checked in yet." });
    }

    for (const row of results) {
      const { name, email, token_id, qr_code } = row;

      if (!qr_code) {
        console.log(`⚠️ No QR code found for ${email} (${token_id})`);
        continue;
      }

      // Extract Base64 data (if stored as data:image/png;base64,...)
      const base64Data = qr_code.split(";base64,").pop();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Event QR Code 🎟️",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>Hello ${name},</h2>
            <p>Thank you for checking in at our event! 🎉</p>
            <p>Here’s your personalized QR code. Please present it at the counter.</p>
            <img src="cid:qrimage" alt="QR Code" style="width:300px;height:300px;margin-top:15px; border:3px solid #444;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,0.2);" />
            <br><br>

            <p>Enjoy the event!</p>
            <p>– Team Food Coupons on Events</p>
          </div>
        `,
        attachments: [
          {
            filename: `qr_${token_id}.png`,
            content: base64Data,
            encoding: "base64",
            cid: "qrimage", // this must match src="cid:qrimage"
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email with QR sent to ${email}`);
      } catch (error) {
        console.log(`❌ Failed to send email to ${email}:`, error.message);
      }
    }

    res.json({
      message: `✅ Emails with QR codes are being sent to ${results.length} checked-in participants.`,
    });
  } catch (error) {
    console.error("❌ Error in sendEmailsToCheckedIn:", error);
    res.status(500).json({
      message: "Internal server error while sending QR emails",
      error: error.message,
    });
  }
};

module.exports = { sendEmailsToCheckedIn };
