const express = require('express');
const router = express.Router();
const Program = require('../models/Program');
const auth = require('../middleware/auth');

// GET all programs
router.get('/', auth, async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create program
router.post('/', auth, async (req, res) => {
  try {
    const program = new Program({ ...req.body, institute: req.user.id });
    await program.save();
    res.status(201).json(program);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update program
router.put('/:id', auth, async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE program
router.delete('/:id', auth, async (req, res) => {
  try {
    await Program.findByIdAndDelete(req.params.id);
    res.json({ message: 'Program deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
