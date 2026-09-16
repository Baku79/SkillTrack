const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

// GET all candidates
router.get('/', auth, async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('trainingPrograms', 'name sector');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single candidate
router.get('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id).populate('trainingPrograms');
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update candidate
router.put('/:id', auth, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
