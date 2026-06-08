const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// GET /api/users/profile  — get my profile
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// PUT /api/users/profile  — update my profile
router.put('/profile', protect, async (req, res) => {
  const { name, bio, location, skills } = req.body;
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, skills },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;