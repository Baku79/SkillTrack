const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/users — all users (admin only, shows plainPassword)
router.get('/', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  const users = db.getAllUsers().map(({ password, ...u }) => u); // strip bcrypt hash, keep plainPassword
  res.json(users);
});

// GET /api/users/export — full export WITH passwords (admin only)
router.get('/export', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  const users = db.getAllUsers().map((u, idx) => ({
    '#': idx + 1,
    'Name': u.name || '',
    'Email (Login ID)': u.email || '',
    'Password': u.plainPassword || '—',
    'Role': u.role || '',
    'Govt ID Type': u.govtIdType || '—',
    'Govt ID Number': u.govtId || '—',
    'Phone': u.phone || '',
    'Organization': u.organization || '',
    'Region': u.region || '',
    'Verified Via': u.verifiedMethod || '—',
    'Joined Date': u.createdAt ? new Date(u.createdAt).toLocaleString('en-IN') : '',
    'Last Login': u.lastLogin ? new Date(u.lastLogin).toLocaleString('en-IN') : 'Never',
    'Total Logins': u.loginCount || 0,
    'User ID': u.id || '',
  }));
  res.json(users);
});

// GET /api/users/logs — activity logs (admin only)
router.get('/logs', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  res.json(db.getAllLogs());
});

// GET /api/users/me — current user profile
router.get('/me', auth, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { password, plainPassword, ...userSafe } = user;
  res.json(userSafe);
});

module.exports = router;
