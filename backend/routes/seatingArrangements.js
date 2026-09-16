const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');

// Seating Arrangements endpoints
router.get('/', (req, res) => {
  try {
    res.json({ message: 'Get all seating arrangements' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    res.json({ message: 'Get seating arrangement by ID', arrangementId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/create', isAuthenticated, (req, res) => {
  try {
    res.json({ message: 'Seating arrangement created', arrangement: req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', isAuthenticated, (req, res) => {
  try {
    res.json({ message: 'Seating arrangement updated', arrangementId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', isAuthenticated, (req, res) => {
  try {
    res.json({ message: 'Seating arrangement deleted', arrangementId: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/venue/:venueId/layouts', (req, res) => {
  try {
    res.json({ message: 'Get seating layouts for venue', venueId: req.params.venueId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
