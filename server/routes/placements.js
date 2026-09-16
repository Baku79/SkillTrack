const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const Candidate = require('../models/Candidate');
const auth = require('../middleware/auth');

// GET all placements
router.get('/', auth, async (req, res) => {
  try {
    const placements = await Placement.find().populate('candidate', 'name email region').populate('program', 'name sector');
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create placement
router.post('/', auth, async (req, res) => {
  try {
    const placement = new Placement(req.body);
    await placement.save();
    // Update candidate status
    await Candidate.findByIdAndUpdate(req.body.candidate, {
      employmentStatus: 'placed',
      currentEmployer: req.body.employer,
      placedDate: req.body.placedDate,
    });
    res.status(201).json(placement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
