const contactEmailTemplate = ({ name, email, subject, message }) => {
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
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      }
      .header {
        background-color: #702c2c;
        padding: 24px;
        text-align: center;
        color: white;
      }
      .header img {
        height: 50px;
        margin-bottom: 10px;
      }
      .content {
        padding: 30px;
        color: #333;
        background-color: #f8f9fa;
      }
      .info-card {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin: 20px 0;
        border-left: 4px solid #702c2c;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      }
      .field {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #eee;
      }
      .field:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
      }
      .label {
        font-weight: bold;
        color: #702c2c;
        display: block;
        margin-bottom: 5px;
        font-size: 14px;
      }
      .value {
        color: #333;
        font-size: 16px;
      }
      .message-box {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-top: 20px;
        border: 1px solid #e0e0e0;
      }
      .footer {
        font-size: 12px;
        color: #777;
        padding: 20px;
        text-align: center;
        background: #fafafa;
        border-top: 1px solid #eee;
      }
      .timestamp {
        text-align: center;
        color: #666;
        font-size: 12px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://festro.vercel.app/logo.png" alt="Festro Logo" />
        <h2>New Contact Form Submission</h2>
      </div>

      <div class="content">
        <div class="info-card">
          <div class="field">
            <span class="label">From:</span>
            <span class="value">${name} (${email})</span>
          </div>
          <div class="field">
            <span class="label">Subject:</span>
            <span class="value">${subject}</span>
          </div>
          <div class="field">
            <span class="label">Received:</span>
            <span class="value">${new Date().toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata',
              dateStyle: 'full',
              timeStyle: 'medium'
            })}</span>
          </div>
        </div>

        <div class="message-box">
          <div class="label">Message:</div>
          <div class="value" style="white-space: pre-wrap; line-height: 1.6; margin-top: 10px;">
            ${message}
          </div>
        </div>

        <div class="timestamp">
          This message was sent via Festro Contact Form
        </div>
      </div>

      <div class="footer">
        <p>© ${new Date().getFullYear()} Festro Event Management System. All rights reserved.</p>
        <p>This is an automated message, please do not reply directly to this email.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

module.exports = contactEmailTemplate;