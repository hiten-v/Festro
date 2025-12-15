const otpEmailTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f5f7fa;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 520px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      }
      .header {
        background-color: #072038;
        padding: 24px;
        text-align: center;
        color: white;
      }
      .header img {
        height: 50px;
        margin-bottom: 10px;
        color: white;
      }
      .content {
        padding: 30px;
        text-align: center;
        color: #333;
        background-color: #506273;
      }
      .otp {
        font-size: 30px;
        letter-spacing: 5px;
        font-weight: bold;
        color: #072038;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #777;
        padding: 20px;
        text-align: center;
        background: #fafafa;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://festro.vercel.app/logo.png" alt="Logo" />
        <h2>Password Reset</h2>
      </div>

      <div class="content">
        <p>Use the OTP below to reset your password.</p>
        <div class="otp">${otp}</div>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>

      <div class="footer">
        © ${new Date().getFullYear()} Festro. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = otpEmailTemplate;
