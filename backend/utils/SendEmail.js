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



const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("📧 NODEMAILER: Starting email send on Render...");
    console.log("📧 NODEMAILER: EMAIL_USER =", process.env.EMAIL_USER);
    
    // Use this EXACT configuration for Render
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // ← USE PORT 465 (SSL), NOT 587
      secure: true, // ← true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // CRITICAL for Render/Gmail:
      connectionTimeout: 30000, // 30 seconds
      socketTimeout: 30000, // 30 seconds
      greetingTimeout: 30000, // 30 seconds
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false // Required for some Gmail connections
      }
    });

    console.log("📧 NODEMAILER: Transporter ready, sending...");
    
    const info = await transporter.sendMail({
      from: `"Festro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("✅ NODEMAILER SUCCESS! Message ID:", info.messageId);
    console.log("✅ Sent to:", to);
    return true;
    
  } catch (error) {
    console.error("❌ NODEMAILER FAILED!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    
    // Specific fixes based on error
    if (error.code === 'ETIMEDOUT') {
      console.error("❌ SOLUTION: Google is blocking Render's IP.");
      console.error("❌ Try: 1) Use different port 587 with secure: false");
      console.error("❌ Try: 2) Use a different email provider");
    }
    
    throw error; // This shows error in logs
  }
};

module.exports = sendEmail;
