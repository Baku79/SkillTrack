const express = require('express');
const router = express.Router();

// Mock analytics data (replace with file DB reads when you add real data)
router.get('/overview', (req, res) => {
  res.json({
    totalCandidates: 500,
    totalPlaced: 370,
    placementRate: '74.0',
    totalPrograms: 5,
    totalPlacements: 370,
  });
});

router.get('/employment-trend', (req, res) => {
  res.json([
    { month: 'Jan', placed: 42 }, { month: 'Feb', placed: 58 },
    { month: 'Mar', placed: 75 }, { month: 'Apr', placed: 90 },
    { month: 'May', placed: 110 }, { month: 'Jun', placed: 95 },
  ]);
});

router.get('/skill-gaps', (req, res) => {
  res.json([
    { sector: 'IT/Digital', demand: 85, supply: 60 },
    { sector: 'Manufacturing', demand: 70, supply: 65 },
    { sector: 'Healthcare', demand: 90, supply: 45 },
    { sector: 'Retail', demand: 75, supply: 70 },
    { sector: 'Construction', demand: 60, supply: 50 },
    { sector: 'Logistics', demand: 65, supply: 30 },
  ]);
});

router.get('/program-impact', (req, res) => {
  res.json([
    { name: 'Digital Marketing', enrolled: 120, placed: 88, placementRate: 84, costPerPlacement: 10909 },
    { name: 'Welding', enrolled: 80, placed: 60, placementRate: 75, costPerPlacement: 16000 },
    { name: 'Healthcare', enrolled: 90, placed: 55, placementRate: 61, costPerPlacement: 16363 },
    { name: 'Retail Mgmt', enrolled: 150, placed: 112, placementRate: 75, costPerPlacement: 6696 },
    { name: 'Construction', enrolled: 60, placed: 35, placementRate: 58, costPerPlacement: 15428 },
  ]);
});

module.exports = router;
