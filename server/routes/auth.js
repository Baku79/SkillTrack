const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// ── POST /api/auth/register ───────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, organization, region } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' });
    }

    // Check if user already exists
    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = db.createUser({
      name,
      email,
      password: hashedPassword,
      role,
      phone: phone || '',
      organization: organization || '',
      region: region || '',
    });

    // Log the registration
    db.addLog({
      type: 'REGISTER',
      userId: newUser.id,
      userName: newUser.name,
      userEmail: newUser.email,
      userRole: newUser.role,
      action: 'Account created',
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET || 'skilltrack_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ─────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = db.findUserByEmail(email);
    if (!user) {
      db.addLog({ type: 'LOGIN_FAIL', userEmail: email, action: 'Login failed - user not found' });
      return res.status(400).json({ message: 'No account found with this email. Please register first.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      db.addLog({ type: 'LOGIN_FAIL', userEmail: email, userName: user.name, action: 'Login failed - wrong password' });
      return res.status(400).json({ message: 'Incorrect password. Please try again.' });
    }

    // Update last login
    const updated = db.updateUser(user.id, {
      lastLogin: new Date().toISOString(),
      loginCount: (user.loginCount || 0) + 1,
    });

    // Log successful login
    db.addLog({
      type: 'LOGIN',
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      action: 'Logged in successfully',
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'skilltrack_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = updated || user;
    res.json({ token, user: userSafe });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;
