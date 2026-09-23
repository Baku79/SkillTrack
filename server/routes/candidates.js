const express = require('express');
const router = express.Router();
router.get('/', (req, res) => res.json([]));
router.get('/:id', (req, res) => res.json({}));
router.put('/:id', (req, res) => res.json({ id: req.params.id, ...req.body }));
module.exports = router;
