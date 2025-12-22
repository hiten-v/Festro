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



// const nodemailer = require("nodemailer");

// const sendEmail = async ({ to, subject, text, html }) => {
//   try {
//     console.log("NODEMAILER: Starting email send on Render...");
//     console.log("NODEMAILER: EMAIL_USER =", process.env.EMAIL_USER);
    
//     // Use this EXACT configuration for Render
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465, // ← USE PORT 465 (SSL), NOT 587
//       secure: true, // ← true for port 465
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//       // CRITICAL for Render/Gmail:
//       connectionTimeout: 30000, // 30 seconds
//       socketTimeout: 30000, // 30 seconds
//       greetingTimeout: 30000, // 30 seconds
//       tls: {
//         ciphers: 'SSLv3',
//         rejectUnauthorized: false // Required for some Gmail connections
//       }
//     });

//     console.log("NODEMAILER: Transporter ready, sending...");
    
//     const info = await transporter.sendMail({
//       from: `"Festro" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log("NODEMAILER SUCCESS! Message ID:", info.messageId);
//     console.log("Sent to:", to);
//     return true;
    
//   } catch (error) {
//     console.error("NODEMAILER FAILED!");
//     console.error("Error code:", error.code);
//     console.error("Error message:", error.message);
//     console.error("Full error:", error);
    
//     // Specific fixes based on error
//     if (error.code === 'ETIMEDOUT') {
//       console.error("SOLUTION: Google is blocking Render's IP.");
//     }
//     throw error; 
//   }
// };

// module.exports = sendEmail;









const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    console.log("📧 NODEMAILER: Starting email send...");
    console.log("📧 Using service:", process.env.EMAIL_SERVICE || "Gmail");
    
    // CRITICAL: For Render + Gmail, use these optimized settings
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // ← SWITCH TO PORT 587 (TLS)
      secure: false, // false for port 587, true for 465
      requireTLS: true, // ← ADD THIS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // MUST be App Password
      },
      // Optimized timeouts for Render
      connectionTimeout: 10000, // Reduced from 30s to 10s
      greetingTimeout: 10000, 
      socketTimeout: 10000,
      // Better TLS configuration
      tls: {
        minVersion: 'TLSv1.2', // ← CHANGE from SSLv3
        ciphers: 'HIGH:!aNULL:!MD5:!RC4',
        rejectUnauthorized: true // ← CHANGE from false
      },
      // Debug logging
      debug: true,
      logger: true
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("✅ NODEMAILER: SMTP connection verified");
    
    // Send mail with retry logic
    const info = await transporter.sendMail({
      from: `"Festro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || subject,
      html: html || `<p>${text || subject}</p>`,
      // Add priority headers
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      }
    });

    console.log("✅ NODEMAILER SUCCESS! Message ID:", info.messageId);
    console.log("✅ Preview URL:", nodemailer.getTestMessageUrl(info));
    return true;
    
  } catch (error) {
    console.error("❌ NODEMAILER FAILED!");
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Provide specific solutions
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNREFUSED') {
      console.error("🔧 SOLUTION 1: Google is blocking Render's IP.");
      console.error("🔧 SOLUTION 2: Verify App Password is correct (not regular password).");
      console.error("🔧 SOLUTION 3: Try SMTP relay service below.");
    }
    
    throw error;
  }
};

module.exports = sendEmail;