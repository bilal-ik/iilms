'use strict';

const nodemailer = require('nodemailer');

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

function isEmailConfigured() {
  return (
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_PASS !== 'your_16_char_app_password_here'
  );
}

async function sendVerificationEmail(email, token, full_name) {
  const backendLink = `http://localhost:${process.env.PORT || 3000}/api/auth/verify-email?token=${token}`;

  if (!isEmailConfigured()) {
    console.log('\n📧 EMAIL NOT CONFIGURED — showing verification link in console:');
    console.log(`   To: ${email}`);
    console.log(`   Link: ${backendLink}`);
    console.log('→ To enable real emails, set EMAIL_USER and EMAIL_PASS in server/.env\n');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #F3F4F6; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 32px 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 18px; font-weight: 700; color: #1E1B4B; margin-bottom: 12px; }
        .text { font-size: 14px; color: #6B7280; line-height: 1.8; margin-bottom: 28px; }
        .btn-wrap { text-align: center; margin: 28px 0; }
        .btn { display: inline-block; padding: 15px 36px; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; }
        .note { font-size: 12px; color: #9CA3AF; margin-top: 20px; line-height: 1.6; }
        .link-box { margin-top: 14px; padding: 12px 14px; background: #F3F4F6; border-radius: 8px; font-size: 11px; color: #6B7280; word-break: break-all; border: 1px solid #E5E7EB; }
        .footer { padding: 18px 40px; background: #F9FAFB; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
        .badge { display: inline-block; background: #EEF2FF; color: #4F46E5; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 IILMS</h1>
          <p>Internship &amp; Industry Linkage Management System</p>
        </div>
        <div class="body">
          <div class="badge">Email Verification Required</div>
          <div class="greeting">Hello, ${full_name || 'there'}! 👋</div>
          <div class="text">
            Thank you for registering with <strong>IILMS</strong>. You're almost ready to start your internship journey!<br/><br/>
            Please verify your email address by clicking the button below. This confirms that you own this email and activates your account.
          </div>
          <div class="btn-wrap">
            <a href="${backendLink}" class="btn">✅ Verify My Email Address</a>
          </div>
          <div class="note">
            ⏰ This link expires in <strong>24 hours</strong>.<br/>
            If you did not create an IILMS account, you can safely ignore this email.
          </div>
          <div class="link-box">
            <strong>Button not working?</strong> Copy and paste this link into your browser:<br/>
            ${backendLink}
          </div>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} IILMS · Internship &amp; Industry Linkage Management System<br/>
          This is an automated message, please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `IILMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '✅ Verify your IILMS account',
      html,
    });
    console.log(`📧 Verification email sent to ${email}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
    console.log(`   Fallback verification link: ${backendLink}`);
  }
}

async function sendWelcomeEmail(email, full_name) {
  if (!isEmailConfigured()) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #F3F4F6; margin: 0; padding: 20px; }
        .container { max-width: 560px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #059669, #10B981); padding: 32px 40px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 20px; font-weight: 700; color: #1E1B4B; margin-bottom: 12px; }
        .text { font-size: 14px; color: #6B7280; line-height: 1.8; }
        .footer { padding: 18px 40px; background: #F9FAFB; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>🎉 Welcome to IILMS!</h1></div>
        <div class="body">
          <div class="greeting">Welcome, ${full_name}!</div>
          <div class="text">
            Your email has been verified and your account is now active.<br/><br/>
            You can now log in and start exploring internship opportunities on the IILMS platform.<br/><br/>
            Good luck on your internship journey! 🚀
          </div>
        </div>
        <div class="footer">© ${new Date().getFullYear()} IILMS</div>
      </div>
    </body>
    </html>
  `;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `IILMS <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '🎉 Welcome to IILMS — Account Activated!',
      html,
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
}

module.exports = { sendVerificationEmail, sendWelcomeEmail };
