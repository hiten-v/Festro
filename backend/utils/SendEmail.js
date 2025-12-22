// const nodemailer = require("nodemailer");

// const sendEmail = async ({ to, subject, text, html }) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Festro Help Services" <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     text,
//     html,
//   });
// };

// module.exports = sendEmail;




// utils/sendEmail.js - Updated for Resend API
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("RESEND: Starting email send...");

    const { data, error } = await resend.emails.send({
      // You must verify this email in your Resend dashboard first
      from: `"Festro Help Services" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    if (error) {
      console.error("RESEND FAILED!", error);
      throw error;
    }

    console.log("RESEND SUCCESS! Email ID:", data.id);
    return true;

  } catch (error) {
    console.error("Email sending failed:", error.message);
    throw error;
  }
};

module.exports = sendEmail;


