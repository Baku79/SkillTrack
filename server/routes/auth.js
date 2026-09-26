const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');
const { sendEmailOTP, sendSmsOTP } = require('../services/otp');

/* ─────────────────────────────────────────────────────────
   In-memory OTP store  { email → { emailOtp, phoneOtp, phone, expiresAt, verified } }
   Also used for login 2FA: { email → { loginOtp, expiresAt, userId } }
──────────────────────────────────────────────────────────── */
const otpStore = new Map();
const generateOTP = () => String(Math.floor(100000 + Math.random() * 900000));
const isExpired   = (entry) => Date.now() > entry.expiresAt;
const EXPIRY_MS   = 10 * 60 * 1000; // 10 minutes

/* ══════════════════════════════════════════════════════════
   REGISTRATION OTP FLOW
══════════════════════════════════════════════════════════ */

/* ── POST /api/auth/send-otp ──
   Generates OTP, sends via email + SMS (if phone provided), stores with expiry */
router.post('/send-otp', async (req, res) => {
  const { email, phone, name } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const existing = db.findUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'An account with this email already exists.' });

  const emailOtp = generateOTP();
  const phoneOtp = generateOTP();

  // Store OTPs
  otpStore.set(`reg:${email}`, {
    emailOtp, phoneOtp,
    phone: phone || '',
    expiresAt: Date.now() + EXPIRY_MS,
    verified: false,
  });

  // Send via email
  let emailResult = null, smsResult = null, devMode = false;
  try {
    emailResult = await sendEmailOTP({ to: email, name: name || 'User', otp: emailOtp, type: 'register' });
    if (emailResult.devMode) devMode = true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    devMode = true;
  }

  // Send via SMS if phone provided
  if (phone) {
    try {
      smsResult = await sendSmsOTP({ to: phone, name: name || 'User', otp: phoneOtp, type: 'register' });
      if (smsResult?.devMode) devMode = true;
    } catch (err) {
      console.error('SMS send failed:', err.message);
      devMode = true;
    }
  }

  const response = { message: 'OTP sent successfully!' };
  // Only include OTPs in response when in dev mode (no real credentials set)
  if (devMode) {
    response.devMode = true;
    response.devEmailOtp = emailOtp;
    response.devPhoneOtp = phoneOtp;
    response.devNote = 'OTPs shown here because email/SMS credentials are not configured. In production, configure .env file.';
  }

  res.json(response);
});

/* ── POST /api/auth/verify-otp ── */
router.post('/verify-otp', (req, res) => {
  const { email, otp, method } = req.body;
  const key = `reg:${email}`;
  const stored = otpStore.get(key);

  if (!stored) return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' });
  if (isExpired(stored)) {
    otpStore.delete(key);
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  const expected = method === 'phone' ? stored.phoneOtp : stored.emailOtp;
  if (otp !== expected) return res.status(400).json({ message: 'Incorrect OTP. Please check and try again.' });

  // Mark as verified
  stored.verified = true;
  otpStore.set(key, stored);
  res.json({ message: 'OTP verified successfully!', verified: true });
});

/* ── POST /api/auth/resend-otp ── */
router.post('/resend-otp', async (req, res) => {
  const { email, name, phone, method } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const emailOtp = generateOTP();
  const phoneOtp = generateOTP();

  otpStore.set(`reg:${email}`, {
    emailOtp, phoneOtp,
    phone: phone || '',
    expiresAt: Date.now() + EXPIRY_MS,
    verified: false,
  });

  let devMode = false;
  try {
    if (method === 'phone' && phone) {
      const r = await sendSmsOTP({ to: phone, name: name || 'User', otp: phoneOtp, type: 'register' });
      if (r?.devMode) devMode = true;
    } else {
      const r = await sendEmailOTP({ to: email, name: name || 'User', otp: emailOtp, type: 'register' });
      if (r?.devMode) devMode = true;
    }
  } catch (err) {
    console.error('Resend failed:', err.message);
    devMode = true;
  }

  const response = { message: 'OTP resent successfully!' };
  if (devMode) { response.devEmailOtp = emailOtp; response.devPhoneOtp = phoneOtp; response.devMode = true; }
  res.json(response);
});

/* ── POST /api/auth/register ── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, organization, region,
            verifiedOtp, verifiedMethod, govtId, govtIdType } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    if (!verifiedOtp)
      return res.status(400).json({ message: 'Please verify your OTP first.' });
    if (role === 'admin' && !govtId)
      return res.status(400).json({ message: 'Government ID is required for Admin accounts.' });

    // Check OTP was actually verified in our store (extra security)
    const stored = otpStore.get(`reg:${email}`);
    if (!stored || !stored.verified)
      return res.status(400).json({ message: 'OTP verification not found. Please verify again.' });

    const existing = db.findUserByEmail(email);
    if (existing) return res.status(400).json({ message: 'An account with this email already exists.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = db.createUser({
      name, email,
      password: hashedPassword,
      plainPassword: password,
      role, phone: phone || '',
      organization: organization || '',
      region: region || '',
      verifiedMethod: verifiedMethod || 'email',
      govtId: role === 'admin' ? (govtId || '') : '',
      govtIdType: role === 'admin' ? (govtIdType || '') : '',
      emailVerified: verifiedMethod !== 'phone',
      phoneVerified: verifiedMethod === 'phone',
    });

    otpStore.delete(`reg:${email}`);

    db.addLog({
      type: 'REGISTER', userId: newUser.id,
      userName: newUser.name, userEmail: newUser.email, userRole: newUser.role,
      action: `Account created · verified via ${verifiedMethod || 'email'} OTP`,
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'skilltrack_secret',
      { expiresIn: '7d' }
    );
    const { password: _, plainPassword: __, ...userSafe } = newUser;
    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

/* ══════════════════════════════════════════════════════════
   LOGIN WITH 2FA OTP
══════════════════════════════════════════════════════════ */

/* ── POST /api/auth/login ──
   Step 1: verify password → send OTP → return { requiresOtp: true } */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.findUserByEmail(email);

    if (!user) {
      db.addLog({ type: 'LOGIN_FAIL', userEmail: email, action: 'Login failed — user not found' });
      return res.status(400).json({ message: 'No account found with this email. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      db.addLog({ type: 'LOGIN_FAIL', userEmail: email, userName: user.name, action: 'Login failed — wrong password' });
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // Password correct → generate login OTP
    const loginOtp = generateOTP();
    otpStore.set(`login:${email}`, {
      loginOtp,
      userId: user.id,
      expiresAt: Date.now() + EXPIRY_MS,
    });

    // Send OTP
    let devMode = false;
    try {
      const r = await sendEmailOTP({ to: email, name: user.name, otp: loginOtp, type: 'login' });
      if (r?.devMode) devMode = true;
    } catch (err) {
      console.error('Login OTP email failed:', err.message);
      devMode = true;
    }
    // Also SMS if phone exists
    if (user.phone) {
      try {
        await sendSmsOTP({ to: user.phone, name: user.name, otp: loginOtp, type: 'login' });
      } catch { /* ignore SMS failure — email is primary */ }
    }

    const response = {
      message: 'Password verified. OTP sent to your email.',
      requiresOtp: true,
      maskedEmail: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
      maskedPhone: user.phone ? user.phone.replace(/(\d{2})\d+(\d{2})/, '$1*****$2') : null,
    };
    if (devMode) {
      response.devMode = true;
      response.devLoginOtp = loginOtp;
      response.devNote = 'OTP shown here because email credentials are not configured.';
    }
    res.json(response);

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

/* ── POST /api/auth/login-verify-otp ──
   Step 2: verify login OTP → return JWT token */
router.post('/login-verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const key = `login:${email}`;
    const stored = otpStore.get(key);

    if (!stored) return res.status(400).json({ message: 'Login OTP expired or not found. Please login again.' });
    if (isExpired(stored)) {
      otpStore.delete(key);
      return res.status(400).json({ message: 'OTP expired. Please login again to get a new OTP.' });
    }
    if (otp !== stored.loginOtp) {
      return res.status(400).json({ message: 'Incorrect OTP. Please check your email/phone and try again.' });
    }

    otpStore.delete(key);

    const user = db.findUserById(stored.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const updated = db.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    });

    db.addLog({
      type: 'LOGIN', userId: user.id,
      userName: user.name, userEmail: user.email, userRole: user.role,
      action: 'Logged in successfully (2FA OTP verified)',
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'skilltrack_secret',
      { expiresIn: '7d' }
    );
    const { password: _, plainPassword: __, ...userSafe } = updated || user;
    res.json({ token, user: userSafe });

  } catch (err) {
    console.error('Login OTP verify error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

/* ── POST /api/auth/login-resend-otp ── */
router.post('/login-resend-otp', async (req, res) => {
  const { email } = req.body;
  const prev = otpStore.get(`login:${email}`);
  if (!prev) return res.status(400).json({ message: 'Session expired. Please login again.' });

  const loginOtp = generateOTP();
  otpStore.set(`login:${email}`, { ...prev, loginOtp, expiresAt: Date.now() + EXPIRY_MS });

  const user = db.findUserById(prev.userId);
  let devMode = false;
  try {
    const r = await sendEmailOTP({ to: email, name: user?.name || 'User', otp: loginOtp, type: 'login' });
    if (r?.devMode) devMode = true;
  } catch { devMode = true; }

  const response = { message: 'OTP resent to your email.' };
  if (devMode) { response.devLoginOtp = loginOtp; response.devMode = true; }
  res.json(response);
});

/* ══════════════════════════════════════════════════════════
   FORGOT PASSWORD FLOW  (3 steps)
══════════════════════════════════════════════════════════ */

/* Step 1 — POST /api/auth/forgot-password */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    const user = db.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'No account found with this email address.' });

    const forgotOtp = generateOTP();
    otpStore.set(`forgot:${email}`, {
      forgotOtp, userId: user.id,
      expiresAt: Date.now() + EXPIRY_MS,
      forgotVerified: false,
    });

    let devMode = false;
    try {
      const r = await sendEmailOTP({ to: email, name: user.name, otp: forgotOtp, type: 'forgot' });
      if (r?.devMode) devMode = true;
    } catch (err) { console.error('Forgot OTP email failed:', err.message); devMode = true; }

    const atIdx = email.indexOf('@');
    const maskedEmail = email.slice(0, 2) + '***' + email[atIdx - 1] + email.slice(atIdx);
    const response = { message: 'Password reset OTP sent to your email.', maskedEmail };
    if (devMode) { response.devMode = true; response.devForgotOtp = forgotOtp; }
    res.json(response);
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

/* Step 2 — POST /api/auth/forgot-verify-otp */
router.post('/forgot-verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const key = `forgot:${email}`;
  const stored = otpStore.get(key);
  if (!stored) return res.status(400).json({ message: 'OTP not found or expired. Please request a new one.' });
  if (isExpired(stored)) { otpStore.delete(key); return res.status(400).json({ message: 'OTP has expired. Please request a new one.' }); }
  if (otp !== stored.forgotOtp) return res.status(400).json({ message: 'Incorrect OTP. Please check and try again.' });
  stored.forgotVerified = true;
  otpStore.set(key, stored);
  res.json({ message: 'OTP verified! You can now set a new password.', verified: true });
});

/* Step 3 — POST /api/auth/reset-password */
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password are required.' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    const key = `forgot:${email}`;
    const stored = otpStore.get(key);
    if (!stored || !stored.forgotVerified) return res.status(400).json({ message: 'Please verify your OTP first.' });
    if (isExpired(stored)) { otpStore.delete(key); return res.status(400).json({ message: 'Session expired. Please start over.' }); }
    const user = db.findUserById(stored.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    db.updateUser(user.id, { password: hashedPassword, plainPassword: newPassword });
    otpStore.delete(key);
    db.addLog({ type: 'PASSWORD_RESET', userId: user.id, userName: user.name, userEmail: user.email, userRole: user.role, action: 'Password reset successfully via OTP' });
    res.json({ message: 'Password updated successfully! You can now login with your new password.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;

