const express = require('express');
const router = express.Router();

const mockPrograms = [
  { id: '1', name: 'Digital Marketing Fundamentals', sector: 'IT/Digital', duration: '3 months', totalEnrolled: 120, totalCompleted: 105, totalPlaced: 88, status: 'completed' },
  { id: '2', name: 'Welding & Fabrication', sector: 'Manufacturing', duration: '6 months', totalEnrolled: 80, totalCompleted: 72, totalPlaced: 60, status: 'completed' },
  { id: '3', name: 'Healthcare Assistant', sector: 'Healthcare', duration: '4 months', totalEnrolled: 90, totalCompleted: 78, totalPlaced: 55, status: 'active' },
  { id: '4', name: 'Retail Sales Management', sector: 'Retail', duration: '2 months', totalEnrolled: 150, totalCompleted: 130, totalPlaced: 112, status: 'completed' },
  { id: '5', name: 'Construction & Civil Works', sector: 'Construction', duration: '5 months', totalEnrolled: 60, totalCompleted: 50, totalPlaced: 35, status: 'active' },
];

router.get('/', (req, res) => res.json(mockPrograms));
router.post('/', (req, res) => res.status(201).json({ ...req.body, id: Date.now().toString() }));
router.put('/:id', (req, res) => res.json({ id: req.params.id, ...req.body }));
router.delete('/:id', (req, res) => res.json({ message: 'Deleted' }));

module.exports = router;
