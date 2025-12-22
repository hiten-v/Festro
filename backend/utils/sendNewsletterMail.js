const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });/

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


module.exports = async (email) => {
  const logoUrl = "https://festro.vercel.app/logo.png";

  await transporter.sendMail({
    from: `"Festro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Festro",
    html: `
      <div style="
        font-family:Arial;
        background:#0f172a;
        padding:30px;
        color:#fff;
        border-radius:12px;"
        >
        <div style="text-align:center">
          <img src="${logoUrl}" width="80" style="margin-bottom:20px" />
          <h2>Welcome to Festro</h2>
          <p style="color:#94a3b8">
            You're officially subscribed to our newsletter!
          </p>
        </div>

        <div style="margin-top:30px;background:#020617;padding:20px;border-radius:10px">
          <p>
            🎟 Get updates on trending events  
            <br/><br/>
            🔥 Exclusive offers  
            <br/><br/>
            📍 Events near you
          </p>
        </div>

        <p style="margin-top:30px;font-size:12px;color:#64748b;text-align:center">
          You can unsubscribe anytime.
        </p>
      </div>
    `
  });
};
