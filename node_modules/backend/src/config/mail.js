const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // put your Gmail in .env
    pass: process.env.EMAIL_PASS    // use App Password
  }
});

module.exports = transporter;
