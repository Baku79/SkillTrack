/**
 * OTP Service — Nodemailer (Email) + Twilio (SMS)
 * Falls back to console log if credentials are not configured.
 * Twilio trial accounts: SMS only works to verified numbers — auto-fallback handled.
 */
const nodemailer = require('nodemailer');

/* ── Email transporter ────────────────────────────────── */
let emailTransporter = null;
function getEmailTransporter() {
  if (emailTransporter) return emailTransporter;
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  return emailTransporter;
}

/* ── SMS (Twilio) ─────────────────────────────────────── */
function getTwilioClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  const twilio = require('twilio');
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/* ── Format Indian phone number to E.164 ─────────────── */
function formatIndianPhone(raw) {
  let phone = String(raw).replace(/[\s\-().]/g, '').trim();
  if (phone.startsWith('+91') && phone.length === 13) return phone;          // +919876543210
  if (phone.startsWith('+'))  return phone;                                   // other country
  if (phone.startsWith('91') && phone.length === 12) return '+' + phone;     // 919876543210
  if (phone.startsWith('0')  && phone.length === 11) return '+91' + phone.slice(1); // 09876543210
  if (phone.length === 10)    return '+91' + phone;                           // 9876543210
  return phone; // unknown — pass as-is
}

/* ── HTML email template ─────────────────────────────── */
function buildEmailHTML({ otp, name, type }) {
  const isForgot = type === 'forgot';
  const isLogin  = type === 'login';

  const title = isForgot ? 'Password Reset OTP'
              : isLogin  ? 'Login Verification'
              :             'Verify Your Account';

  const subtitle = isForgot
    ? 'Use this code to reset your SkillTrack password. If you did not request this, you can safely ignore this email.'
    : isLogin
    ? 'Someone is trying to sign in to your SkillTrack account. Use this code to confirm it was you.'
    : 'Welcome to SkillTrack! Use this code to complete your registration.';

  const accentColor  = isForgot ? '#f59e0b' : '#6366f1';
  const boxBg        = isForgot ? '#fffbeb' : '#f5f3ff';
  const boxBorder    = isForgot ? '#fcd34d' : '#c4b5fd';
  const otpNumColor  = isForgot ? '#d97706' : '#4f46e5';
  const otpBorder    = isForgot ? '#fcd34d' : '#c4b5fd';
  const validColor   = isForgot ? '#b45309' : '#9333ea';

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Inter,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr><td style="background:linear-gradient(135deg,${accentColor},${isForgot ? '#ef4444' : '#8b5cf6'});padding:32px 40px;text-align:center;">
          <div style="font-size:40px;margin-bottom:10px;">${isForgot ? '🔑' : '🎓'}</div>
          <h1 style="color:white;margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px;">SkillTrack</h1>
          <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">India's Skilling Outcomes Platform</p>
        </td></tr>
        <tr><td style="padding:36px 40px;">
          <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">${title}</h2>
          <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0 0 28px;">${subtitle}</p>
          <div style="background:${boxBg};border:2px solid ${boxBorder};border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
            <p style="color:${accentColor};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Your One-Time Password</p>
            <div style="display:inline-flex;gap:10px;">
              ${otp.split('').map(d => `<span style="display:inline-block;width:44px;height:52px;line-height:52px;font-size:28px;font-weight:900;color:${otpNumColor};background:white;border-radius:10px;border:2px solid ${otpBorder};text-align:center;">${d}</span>`).join('')}
            </div>
            <p style="color:${validColor};font-size:12px;margin:16px 0 0;">⏱ Valid for <strong>10 minutes</strong></p>
          </div>
          ${isLogin ? `<div style="background:#fef2f2;border:1px solid #fca5a5;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
            <p style="color:#b91c1c;font-size:13px;margin:0;">🔒 If you did NOT request this, your password may be compromised. <strong>Change it immediately.</strong></p>
          </div>` : ''}
          <p style="color:#6b7280;font-size:13px;margin:0;">Do not share this code with anyone. SkillTrack will never ask for your OTP.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">© 2024 SkillTrack · National Skilling Platform · India</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ── Send Email OTP ────────────────────────────────────── */
async function sendEmailOTP({ to, name, otp, type = 'register' }) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log(`\n📧 [DEV EMAIL OTP] → ${to}  |  OTP: ${otp}  |  Type: ${type}\n`);
    return { devMode: true };
  }
  const subjectMap = { login: `🔐 Login OTP: ${otp}`, forgot: `🔑 Password Reset OTP: ${otp}` };
  await transporter.sendMail({
    from: `"SkillTrack 🎓" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjectMap[type] || `✅ SkillTrack Verification OTP: ${otp}`,
    html: buildEmailHTML({ otp, name, type }),
  });
  console.log(`📧 Email OTP sent → ${to}  [${type}]`);
  return { sent: true };
}

/* ── Send SMS OTP ──────────────────────────────────────── */
async function sendSmsOTP({ to, name, otp, type = 'register' }) {
  const phone  = formatIndianPhone(to);
  const client = getTwilioClient();

  if (!client) {
    console.log(`\n📱 [DEV SMS OTP] → ${phone}  |  OTP: ${otp}  |  Type: ${type}\n`);
    return { devMode: true };
  }

  const body = type === 'login'
    ? `SkillTrack Login OTP: ${otp}\nValid 10 min. Do NOT share. If not you, change password now.`
    : type === 'forgot'
    ? `SkillTrack Password Reset OTP: ${otp}\nValid for 10 minutes. Do not share this code.`
    : `Your SkillTrack verification OTP is: ${otp}\nValid for 10 minutes. -SkillTrack Platform`;

  try {
    await client.messages.create({ body, from: process.env.TWILIO_PHONE, to: phone });
    console.log(`📱 SMS OTP sent → ${phone}  [${type}]`);
    return { sent: true };
  } catch (err) {
    // Twilio trial accounts can only SMS verified numbers — fallback gracefully
    console.warn(`📱 SMS failed → ${phone}  [${err.message}]`);
    console.warn(`   ⚠️  If on Twilio trial, verify number at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified`);
    return { devMode: true, error: err.message };
  }
}

module.exports = { sendEmailOTP, sendSmsOTP };
