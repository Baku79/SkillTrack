const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/users — all users (admin only)
router.get('/', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  const users = db.getAllUsers().map(({ password, ...u }) => u); // strip passwords
  res.json(users);
});

// GET /api/users/logs — activity logs (admin only)
router.get('/logs', auth, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  res.json(db.getAllLogs());
});

// GET /api/users/me — current user profile
router.get('/me', auth, (req, res) => {
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { password, ...userSafe } = user;
  res.json(userSafe);
});

module.exports = router;
