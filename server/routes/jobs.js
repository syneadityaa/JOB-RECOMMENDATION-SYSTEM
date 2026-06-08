const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// GET /api/jobs  — get all jobs (with optional search)
router.get('/', async (req, res) => {
  const { search, location, type } = req.query;
  const filter = {};
  if (search)   filter.title = { $regex: search, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (type)     filter.type = type;

  try {
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/jobs/:id  — single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/jobs  — create a job (protected)
router.post('/', protect, async (req, res) => {
  const { title, company, location, description, skills, salary, type } = req.body;
  try {
    const job = await Job.create({
      title, company, location, description, skills, salary, type,
      postedBy: req.user._id
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/jobs/:id  — update a job
router.put('/:id', protect, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/jobs/:id  — delete a job
router.delete('/:id', protect, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;