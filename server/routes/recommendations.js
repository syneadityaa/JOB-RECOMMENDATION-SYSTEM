const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// GET /api/recommendations  — returns jobs that match user's skills
router.get('/', protect, async (req, res) => {
  try {
    const userSkills = req.user.skills; // e.g. ["React", "Node.js"]

    if (!userSkills || userSkills.length === 0) {
      return res.status(400).json({ message: 'Add skills to your profile to get recommendations' });
    }

    // Find all jobs
    const allJobs = await Job.find();

    // Score each job by how many skills match
    const scored = allJobs
      .map(job => {
        const matchCount = job.skills.filter(skill =>
          userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
        ).length;
        return { ...job._doc, matchCount };
      })
      .filter(job => job.matchCount > 0)       // only jobs with at least 1 match
      .sort((a, b) => b.matchCount - a.matchCount); // highest match first

    res.json(scored);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;