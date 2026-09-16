const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Program = require('../models/Program');
const Placement = require('../models/Placement');
const auth = require('../middleware/auth');

// GET /api/analytics/overview — KPI summary
router.get('/overview', auth, async (req, res) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const totalPlaced = await Candidate.countDocuments({ employmentStatus: 'placed' });
    const totalPrograms = await Program.countDocuments();
    const totalPlacements = await Placement.countDocuments();

    res.json({
      totalCandidates,
      totalPlaced,
      placementRate: totalCandidates ? ((totalPlaced / totalCandidates) * 100).toFixed(1) : 0,
      totalPrograms,
      totalPlacements,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/employment-trend — monthly placements
router.get('/employment-trend', auth, async (req, res) => {
  try {
    const placements = await Placement.aggregate([
      {
        $group: {
          _id: { month: { $month: '$placedDate' }, year: { $year: '$placedDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
    res.json(placements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/skill-gaps — sector-wise demand vs supply
router.get('/skill-gaps', auth, async (req, res) => {
  try {
    const sectorData = await Candidate.aggregate([
      { $group: { _id: '$sector', total: { $sum: 1 }, placed: { $sum: { $cond: [{ $eq: ['$employmentStatus', 'placed'] }, 1, 0] } } } },
    ]);
    res.json(sectorData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/program-impact — program ROI
router.get('/program-impact', auth, async (req, res) => {
  try {
    const programs = await Program.find({}, 'name totalEnrolled totalCompleted totalPlaced cost');
    const impact = programs.map((p) => ({
      name: p.name,
      enrolled: p.totalEnrolled,
      completed: p.totalCompleted,
      placed: p.totalPlaced,
      placementRate: p.totalCompleted ? ((p.totalPlaced / p.totalCompleted) * 100).toFixed(1) : 0,
      costPerPlacement: p.totalPlaced ? Math.round((p.cost * p.totalEnrolled) / p.totalPlaced) : 0,
    }));
    res.json(impact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
