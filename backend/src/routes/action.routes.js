const express = require('express');
const router = express.Router();
const Action = require('../models/action.model');

// GET all actions
router.get('/', async (req, res) => {
  try {
    const actions = await Action.find();
    res.json(actions);
  } catch (err) {
    console.error('Error fetching actions:', err);
    res.status(500).json({ message: 'Server error while fetching actions.' });
  }
});

module.exports = router;
